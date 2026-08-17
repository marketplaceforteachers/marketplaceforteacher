import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    });
  }
  return stripeClient;
}

export interface CreatePaymentIntentParams {
  amountInCents: number;
  orderNumber: string;
  buyerEmail: string;
  sellerId: string;
  sellerStripeAccountId?: string;
  applicationFeeInCents?: number;
  metadata?: Record<string, string>;
}

export async function createMarketplacePaymentIntent(params: CreatePaymentIntentParams) {
  const stripe = getStripeClient();
  if (!stripe) {
    // If Stripe secret key is not provided in env, return fallback client secret
    return {
      success: true,
      clientSecret: `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      paymentIntentId: `pi_test_${Date.now()}`,
      isLive: false,
      message: 'Stripe running in simulated test mode (Add STRIPE_SECRET_KEY in cPanel for live transactions).',
    };
  }

  const intentOptions: Stripe.PaymentIntentCreateParams = {
    amount: params.amountInCents,
    currency: 'usd',
    receipt_email: params.buyerEmail,
    description: `Marketplace For Teachers - Order #${params.orderNumber}`,
    metadata: {
      orderNumber: params.orderNumber,
      buyerEmail: params.buyerEmail,
      sellerId: params.sellerId,
      ...params.metadata,
    },
    payment_method_types: ['card'],
  };

  // If seller has a connected Stripe account, route funds via Stripe Connect destination charge
  if (params.sellerStripeAccountId && params.sellerStripeAccountId.startsWith('acct_')) {
    intentOptions.transfer_data = {
      destination: params.sellerStripeAccountId,
    };
    if (params.applicationFeeInCents && params.applicationFeeInCents > 0) {
      intentOptions.application_fee_amount = params.applicationFeeInCents;
    }
  }

  const paymentIntent = await stripe.paymentIntents.create(intentOptions);
  return {
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    isLive: true,
  };
}

export async function processStripeRefund(paymentIntentId: string, amountInCents?: number, reason?: string) {
  const stripe = getStripeClient();
  if (!stripe) {
    return {
      success: true,
      refundId: `re_mock_${Date.now()}`,
      isLive: false,
      message: 'Refund recorded (Simulation Mode)',
    };
  }

  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };
  if (amountInCents) {
    refundParams.amount = amountInCents;
  }
  if (reason) {
    refundParams.metadata = { reason };
  }

  const refund = await stripe.refunds.create(refundParams);
  return {
    success: true,
    refundId: refund.id,
    status: refund.status,
    isLive: true,
  };
}
