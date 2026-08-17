import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  Lock,
  Printer,
  Sparkles,
  Star,
  ThumbsUp,
  MessageSquare,
  Scale,
} from 'lucide-react';
import { Order } from '../../types';

interface BuyerOrdersTabProps {
  orders: Order[];
  currentUserId: string;
  onConfirmReceiptAndReleaseEscrow: (orderId: string) => void;
  onPrintInvoice: (order: Order) => void;
  onOpenContactSupport?: (category: string, subject: string) => void;
  onOpenDisputeCenter?: (orderId?: string) => void;
}

export const BuyerOrdersTab: React.FC<BuyerOrdersTabProps> = ({
  orders = [],
  currentUserId,
  onConfirmReceiptAndReleaseEscrow,
  onPrintInvoice,
  onOpenContactSupport,
  onOpenDisputeCenter,
}) => {
  const buyerOrders = (orders || []).filter((o) => o?.buyerId === currentUserId);
  const [confirmModalOrder, setConfirmModalOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('Arrived in excellent classroom condition! Thank you so much.');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmModalOrder) return;

    onConfirmReceiptAndReleaseEscrow(confirmModalOrder.id);
    setSuccessBanner(
      `Receipt confirmed! Order marked Completed and seller payout ($${confirmModalOrder.sellerEarnings.toFixed(2)}) released.`
    );
    setTimeout(() => setSuccessBanner(null), 4000);
    setConfirmModalOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: Buyers Don't Need Verification & Escrow Protection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-950">100% Escrow Protection Guarantee</h4>
            <p className="text-emerald-800 mt-0.5">
              Your payment is held safely in escrow. Funds are never given to the seller until you receive your package and confirm everything matches the listing.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-950">Buyers Do NOT Need Verification</h4>
            <p className="text-blue-800 mt-0.5">
              Anyone (parents, PTA members, schools, teachers) can buy immediately without needing a school email verification.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Educator Privacy Shield Active</h4>
            <p className="text-slate-300 mt-0.5">
              To protect educators, seller personal phone numbers & home addresses are confidential and hidden.
            </p>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successBanner && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{successBanner}</span>
          </div>
          <span className="text-[11px] text-emerald-200">Transaction Complete</span>
        </div>
      )}

      {/* Buyer Orders List */}
      <div className="space-y-4">
        {buyerOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3 shadow-xs">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No purchases found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse classroom essentials, STEM discovery lab kits, and teacher supplies across all 50 states.
            </p>
          </div>
        ) : (
          buyerOrders.map((order) => {
            const isEscrowReleased = order.sellerPayoutStatus === 'Released' || order.buyerConfirmedReceipt;
            const isDisputed = order.status === 'Under Review' || order.disputeId;
            const isCompleted = order.status === 'Completed';

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-xs"
              >
                {/* Header Bar */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{order.date}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-700 font-medium">
                      Total: <strong className="text-blue-900">${order.total.toFixed(2)}</strong>
                    </span>
                  </div>

                  {/* Status & Escrow Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black px-2.5 py-1 rounded-full text-[10px] ${
                        isDisputed
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Delivered'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Status: {order.status}
                    </span>

                    <span
                      className={`font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 ${
                        isEscrowReleased
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isDisputed
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      {isEscrowReleased
                        ? 'Payout Released (Complete)'
                        : isDisputed
                        ? 'Escrow Frozen (Under Review)'
                        : `Funds Held in Escrow ($${order.total.toFixed(2)})`}
                    </span>
                  </div>
                </div>

                {/* Dispute Alert Banner if Disputed */}
                {isDisputed && (
                  <div className="bg-amber-50 border-b border-amber-200 p-3 px-5 flex items-center justify-between text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Dispute Open:</strong> Payout is paused. Reviewing photos and seller counter-statement.
                      </span>
                    </div>
                    {onOpenDisputeCenter && (
                      <button
                        onClick={() => onOpenDisputeCenter(order.id)}
                        className="text-amber-800 font-extrabold underline hover:text-amber-950 cursor-pointer"
                      >
                        View Dispute in Center →
                      </button>
                    )}
                  </div>
                )}

                {/* Body Details */}
                <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Items */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                        Classroom Items Purchased
                      </h5>
                      <span className="text-slate-500 text-[11px]">
                        Payment: <strong className="uppercase">{order.paymentMethod}</strong>
                      </span>
                    </div>

                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                            <span>Seller: <strong className="text-slate-800">{item.sellerName}</strong></span>
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                              Verified Educator
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            🔒 Seller Phone & Address: <span className="text-slate-600 font-mono">(•••) •••-•••• [Privacy Protected]</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-slate-900 text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Live Shipping & Tracking Timeline */}
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <h6 className="font-bold text-blue-950">Shipment & Tracking Status</h6>
                        </div>
                        <span className="bg-blue-200/70 text-blue-900 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {order.carrier || 'USPS Priority Mail'}
                        </span>
                      </div>

                      {order.trackingNumber ? (
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2 text-slate-800">
                            <span>Tracking Number:</span>
                            <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                              {order.trackingNumber}
                            </span>
                            <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> In Transit
                            </span>
                          </div>
                          {order.shippingNotes && (
                            <p className="text-[11px] text-slate-600">
                              <strong>Teacher Seller Note:</strong> {order.shippingNotes}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-600">
                          Teacher seller is preparing your package. Tracking details will appear as soon as the package is dispatched.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Escrow Release Action Card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                        Escrow Actions & Receipt
                      </h5>

                      {isEscrowReleased ? (
                        <div className="bg-emerald-100/70 border border-emerald-300 rounded-xl p-3.5 text-center space-y-2 text-emerald-950">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h6 className="font-bold text-xs">Receipt Confirmed!</h6>
                            <p className="text-[11px] text-emerald-800">
                              Funds released to the teacher. Thank you for supporting classroom education!
                            </p>
                          </div>
                        </div>
                      ) : isDisputed ? (
                        <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-3.5 text-center space-y-2 text-amber-950">
                          <Scale className="w-8 h-8 text-amber-700 mx-auto" />
                          <div>
                            <h6 className="font-bold text-xs">Under Administrative Review</h6>
                            <p className="text-[11px] text-amber-800">
                              Payout is on hold while dispute evidence is evaluated.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-3.5 rounded-xl border border-blue-200 space-y-3">
                          <div className="flex items-center gap-2 text-blue-950 font-bold">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span>Escrow Funds Protection</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Once your classroom items arrive, inspect the package and click below to release funds to the teacher seller.
                          </p>

                          <button
                            onClick={() => setConfirmModalOrder(order)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Receipt & Release Escrow</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <button
                        onClick={() => onPrintInvoice(order)}
                        className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Official Letterhead Invoice</span>
                      </button>

                      {!isDisputed && !isCompleted && onOpenDisputeCenter && (
                        <button
                          onClick={() => onOpenDisputeCenter(order.id)}
                          className="w-full bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-600 font-bold py-2 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                        >
                          <Scale className="w-3.5 h-3.5 text-amber-600" />
                          <span>Report Issue / Open Dispute</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirm Receipt & Release Escrow Modal */}
      {confirmModalOrder && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative">
            <div className="p-4 sm:p-5 bg-linear-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Confirm Receipt of Items</h3>
                  <p className="text-[11px] text-emerald-100">
                    Order #{confirmModalOrder.orderNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmModalOrder(null)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="p-5 space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-950 space-y-1">
                <p className="font-bold">
                  Releasing Escrow Funds (${confirmModalOrder.sellerEarnings.toFixed(2)})
                </p>
                <p className="text-[11px] text-emerald-800">
                  By confirming, you verify that your package has arrived safely and contents match the listing description. Order status will be marked as Completed and seller payout released.
                </p>
              </div>

              {/* Rating stars */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Rate your experience with the teacher seller:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-slate-800 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Optional Teacher Review / Feedback:
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setConfirmModalOrder(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Receipt & Release Payout</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
