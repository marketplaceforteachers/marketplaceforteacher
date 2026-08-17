import { Request, Response } from 'express';
import { AuthRequest } from './authMiddleware';
import { getDbPool } from './db';
import { createMarketplacePaymentIntent, processStripeRefund } from './stripeService';

// Fallback in-memory order & dispute store
const inMemoryOrders: Array<any> = [];
const inMemoryDisputes: Array<any> = [];

export async function handleCreateOrder(req: AuthRequest, res: Response) {
  try {
    const {
      buyerName,
      buyerEmail,
      items,
      subtotal,
      shippingTotal,
      taxTotal,
      discountTotal,
      total,
      paymentMethod,
      shippingAddress,
      stateName,
      stateTaxRate,
    } = req.body;

    if (!items || !items.length || !buyerEmail) {
      return res.status(400).json({ success: false, error: 'Invalid order data or empty cart.' });
    }

    const orderNumber = `MFT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const commissionFee = Number((total * 0.05).toFixed(2)); // Standard 5% platform fee

    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      buyerId: req.user?.id || 'guest-buyer',
      buyerName: buyerName || req.user?.name || 'Educator Buyer',
      buyerEmail,
      subtotal: Number(subtotal),
      shippingTotal: Number(shippingTotal || 0),
      taxTotal: Number(taxTotal || 0),
      discountTotal: Number(discountTotal || 0),
      commissionFee,
      total: Number(total),
      paymentMethod: paymentMethod || 'stripe',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      payoutStatus: 'Held_In_Escrow',
      stateName: stateName || 'Oklahoma',
      stateTaxRate: Number(stateTaxRate || 0),
      shippingAddress: shippingAddress || {},
      items: items || [],
      createdAt: new Date().toISOString(),
    };

    // Attempt MySQL persistence
    try {
      if (process.env.DB_HOST && process.env.DB_NAME) {
        const pool = getDbPool();
        await pool.query(
          `INSERT INTO orders (
            order_number, buyer_name, buyer_email, subtotal, shipping_total, tax_total, 
            discount_total, commission_fee, total, payment_method, payment_status, order_status,
            state_name, state_tax_rate, shipping_full_name, shipping_address_line1, shipping_city,
            shipping_state, shipping_zip, shipping_phone
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderNumber,
            buyerName,
            buyerEmail,
            subtotal,
            shippingTotal || 0,
            taxTotal || 0,
            discountTotal || 0,
            commissionFee,
            total,
            paymentMethod || 'stripe',
            'Paid',
            'Processing',
            stateName || 'OK',
            stateTaxRate || 0,
            shippingAddress?.fullName || buyerName,
            shippingAddress?.addressLine1 || 'School Delivery',
            shippingAddress?.city || 'Oklahoma City',
            shippingAddress?.state || 'OK',
            shippingAddress?.zip || '73159',
            shippingAddress?.phone || '555-0199',
          ]
        );
      }
    } catch (dbErr: any) {
      console.warn('[Order DB] MySQL write note:', dbErr.message);
    }

    inMemoryOrders.unshift(newOrder);

    return res.json({
      success: true,
      order: newOrder,
      message: 'Order created and payment protection initiated successfully.',
    });
  } catch (err: any) {
    console.error('[Create Order Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to process order creation.' });
  }
}

export async function handleCreatePaymentIntent(req: Request, res: Response) {
  try {
    const { amount, orderNumber, buyerEmail, sellerId } = req.body;
    const amountInCents = Math.round((parseFloat(amount) || 10) * 100);

    const result = await createMarketplacePaymentIntent({
      amountInCents,
      orderNumber: orderNumber || `TEMP-${Date.now()}`,
      buyerEmail: buyerEmail || 'buyer@school.edu',
      sellerId: sellerId || 'usr-seller-01',
      applicationFeeInCents: Math.round(amountInCents * 0.05),
    });

    return res.json(result);
  } catch (err: any) {
    console.error('[Payment Intent Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to create payment intent.' });
  }
}

export async function handleGetOrders(req: AuthRequest, res: Response) {
  return res.json({
    success: true,
    orders: inMemoryOrders,
  });
}

export async function handleDisputeAction(req: AuthRequest, res: Response) {
  try {
    const { disputeId, orderNumber, action, decision, notes, refundAmount } = req.body;

    const dispute = {
      id: disputeId || `disp_${Date.now()}`,
      orderNumber,
      action,
      decision,
      notes,
      resolvedBy: req.user?.email || 'admin@marketplaceforteachers.com',
      timestamp: new Date().toISOString(),
    };

    inMemoryDisputes.unshift(dispute);

    return res.json({
      success: true,
      dispute,
      message: `Dispute ${decision ? 'resolved with ' + decision : 'updated successfully'}.`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to process dispute action.' });
  }
}
