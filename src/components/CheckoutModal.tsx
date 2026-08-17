import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  Sparkles,
  Printer,
  FileText,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, User, Address, AdminFeeSettings } from '../types';
import { US_STATE_TAX_RATES, COMPANY_INFO } from '../data/mockData';
import { PrintableLetterhead } from './PrintableLetterhead';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser: User;
  onCompleteOrder: (order: Order) => void;
  feeSettings?: AdminFeeSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onCompleteOrder,
  feeSettings,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address & Tax, 2: Payment & Coupon, 3: Success Confirmation
  const [address, setAddress] = useState<Address>({
    fullName: currentUser.name || 'Sarah Jenkins',
    schoolName: currentUser.schoolName || 'Prairie View Elementary',
    addressLine1: currentUser.savedAddresses?.[0]?.addressLine1 || '9905 S Pennsylvania Ave Ste A',
    addressLine2: 'Attn: Classroom 204',
    city: currentUser.city || 'Oklahoma City',
    state: currentUser.state || 'OK',
    zip: currentUser.zip || '73159',
    phone: currentUser.phone || '(405) 555-8322',
  });
  const [buyerEmail, setBuyerEmail] = useState(currentUser.email || 'sjenkins@okcps.org');
  const [orderNotes, setOrderNotes] = useState('Please label package Room 204. Thank you!');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'square' | 'applepay' | 'googlepay'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);

  // Financial calculations with dynamic Admin sales percentage
  const commissionRatePercent = feeSettings?.nationwideCommissionRate ?? COMPANY_INFO.commissionRatePercent ?? 5.0;
  const itemsList = items || [];
  const subtotal = itemsList.reduce((acc, it) => acc + (it?.product?.price || 0) * (it?.quantity || 1), 0);
  const shippingTotal = itemsList.reduce((acc, it) => acc + (it?.shippingCost || 0) * (it?.quantity || 1), 0);
  
  // Tax rate from admin settings or US_STATE_TAX_RATES
  const stateRateDecimal =
    feeSettings?.stateTaxRates?.[address.state] !== undefined
      ? feeSettings.stateTaxRates[address.state]
      : (US_STATE_TAX_RATES[address.state] ?? 0.0895);
      
  const stateRatePercent = +(stateRateDecimal * 100).toFixed(2);
  const taxTotal = +((subtotal - discountAmount) * stateRateDecimal).toFixed(2);
  const grandTotal = +(subtotal + shippingTotal + taxTotal - discountAmount).toFixed(2);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    setCouponError(null);
    setCouponSuccess(null);

    if (code === 'TEACHER10') {
      const disc = +(subtotal * 0.1).toFixed(2);
      setDiscountAmount(disc);
      setCouponSuccess('Applied 10% Educator Discount!');
    } else if (code === 'APPRECIATION') {
      const disc = Math.min(15.0, subtotal);
      setDiscountAmount(disc);
      setCouponSuccess('Applied $15.00 Teacher Appreciation Credit!');
    } else if (code === 'FREESHIP') {
      setDiscountAmount(shippingTotal);
      setCouponSuccess('Applied Free Shipping Coupon!');
    } else {
      setCouponError('Invalid coupon code. Try TEACHER10, APPRECIATION, or FREESHIP');
    }
  };

  const handleProceedToPayment = () => {
    if (!address.fullName.trim() || !address.addressLine1.trim() || !address.city.trim() || !address.zip.trim() || !buyerEmail.trim()) {
      setAddressError('Please fill in your Full Name, Email, Street Address, City, and ZIP code to proceed.');
      return;
    }
    setAddressError(null);
    setStep(2);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const commissionFee = +(subtotal * (commissionRatePercent / 100)).toFixed(2);
      const sellerEarnings = +(subtotal - commissionFee).toFixed(2);

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `MFT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        buyerId: currentUser.id,
        buyerName: address.fullName,
        buyerEmail,
        items: items.map((it) => ({
          productId: it.product.id,
          title: it.product.title,
          price: it.product.price,
          quantity: it.quantity,
          shippingCost: it.shippingCost,
          shippingMethod: it.selectedShipping,
          image: it.product.images[0],
          sellerId: it.product.sellerId,
          sellerName: it.product.sellerName,
        })),
        subtotal,
        shippingTotal,
        taxTotal,
        discountTotal: discountAmount,
        commissionFee,
        sellerEarnings,
        total: grandTotal,
        paymentMethod,
        paymentStatus: 'Paid',
        status: 'Awaiting Shipment',
        escrowStatus: 'Held',
        sellerPayoutStatus: 'Pending',
        riskScore: Math.floor(8 + Math.random() * 15),
        carrier: 'USPS Priority Mail',
        trackingNumber: `940011189956${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        shippingAddress: address,
        orderNotes,
        couponCode: couponSuccess ? couponCode : undefined,
        stateTaxRate: stateRatePercent,
        stateName: address.state === 'OK' ? 'Oklahoma' : address.state === 'TX' ? 'Texas' : 'State Tax',
      };

      setCompletedOrder(newOrder);
      onCompleteOrder(newOrder);
      setStep(3);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback
      }
    }, 1200);
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="checkout-modal-container"
        className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
              MFT
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Secure Educator Checkout</h3>
              <p className="text-[11px] text-slate-500">MarketplaceForTeachers.com 100% Buyer Protection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Content Area */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-6">
          {step !== 3 && (
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                1. School & Shipping Address
              </span>
              <span className="text-slate-300">→</span>
              <span className={`px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                2. Payment & Confirmation
              </span>
            </div>
          )}

          {/* STEP 1: Address & Tax Calculation */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">School / District Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Prairie View Elementary (OKCPS)"
                    value={address.schoolName || ''}
                    onChange={(e) => setAddress({ ...address, schoolName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email for Receipt & Invoices</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Helpline Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Street Address (or Campus Delivery Office)
                  </label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="e.g. 9905 S Pennsylvania Ave Ste A"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Suite / Attn</label>
                  <input
                    type="text"
                    value={address.addressLine2 || ''}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    placeholder="e.g. Room 204 STEM Lab"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">State (Auto-Taxes)</label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-semibold bg-slate-50"
                  >
                    {Object.keys(US_STATE_TAX_RATES).map((st) => (
                      <option key={st} value={st}>
                        {st} (Sales Tax: {(US_STATE_TAX_RATES[st] * 100).toFixed(2)}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    maxLength={5}
                    required
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery / Classroom Office Notes
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Special instructions for school front office drop-off..."
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                />
              </div>

              {addressError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{addressError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Gateways & Coupon Codes */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Payment Gateway Tabs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Secure Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center font-bold transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Card / Stripe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center font-bold transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-extrabold text-blue-800 text-base">P</span>
                    <span>PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('square')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center font-bold transition-all ${
                      paymentMethod === 'square'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-mono font-bold text-sm">■</span>
                    <span>Square</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center font-bold transition-all ${
                      paymentMethod === 'applepay'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span> Pay</span>
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('googlepay')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center font-bold transition-all ${
                      paymentMethod === 'googlepay'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-bold text-red-500">G Pay</span>
                    <span>Google Pay</span>
                  </button>
                </div>
              </div>

              {/* Simulated Card Form if Stripe is selected */}
              {paymentMethod === 'stripe' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Cardholder Information</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" /> 256-bit Encrypted
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Card Number (4242 •••• •••• 4242)"
                      defaultValue="4242 4242 4242 4242"
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08/28"
                      className="p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      defaultValue="842"
                      className="p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Coupon Code Entry */}
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200 space-y-2 text-xs">
                <label className="block font-bold text-blue-950">
                  Have an Educator Coupon Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. APPRECIATION or TEACHER10"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      if (couponError) setCouponError(null);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 uppercase font-mono font-bold bg-white"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponSuccess && (
                  <p className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {couponSuccess}
                  </p>
                )}
                {couponError && (
                  <p className="text-red-600 font-semibold text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                  </p>
                )}
              </div>

              {/* Summary Breakdown */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Materials Subtotal:</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling:</span>
                  <span className="font-semibold text-slate-900">${shippingTotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>
                    State Sales Tax ({address.state} {stateRatePercent}%):
                  </span>
                  <span className="font-semibold text-slate-900">${taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-blue-950 pt-2 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleCompletePayment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Protected Payment...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ${grandTotal.toFixed(2)} & Place Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation & Invoice */}
          {step === 3 && completedOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Order Successfully Placed! 🍎
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Confirmation #<strong>{completedOrder.orderNumber}</strong> sent to <strong>{completedOrder.buyerEmail}</strong>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Carrier Fulfillment:</span>
                  <span className="font-bold text-slate-900">{completedOrder.carrier}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Tracking Number:</span>
                  <span className="font-mono font-bold text-blue-700">{completedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-medium text-slate-800">
                    {completedOrder.shippingAddress.schoolName || completedOrder.shippingAddress.addressLine1} ({completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state})
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-slate-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-blue-900">${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrintInvoice(true)}
                  className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download / Print Official School Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Return to Marketplace
                </button>
              </div>

              {/* Printable Invoice Modal popup */}
              {showPrintInvoice && (
                <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="max-w-4xl w-full my-auto">
                    <PrintableLetterhead
                      order={completedOrder}
                      onClose={() => setShowPrintInvoice(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
