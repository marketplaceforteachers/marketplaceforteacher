import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Lock,
  ArrowRight,
  Send,
  Calendar,
  Scale,
  Upload,
} from 'lucide-react';
import { Order } from '../../types';

interface SellerOrdersTabProps {
  orders: Order[];
  currentUserId: string;
  onUpdateShipping: (
    orderId: string,
    carrier: string,
    trackingNumber: string,
    estimatedDelivery?: string,
    shippingNotes?: string,
    shippingProof?: string
  ) => void;
  onPrintSlip: (order: Order) => void;
  onOpenDisputeCenter?: (orderId?: string) => void;
}

export const SellerOrdersTab: React.FC<SellerOrdersTabProps> = ({
  orders = [],
  currentUserId,
  onUpdateShipping,
  onPrintSlip,
  onOpenDisputeCenter,
}) => {
  const sellerOrders = (orders || []).filter((o) =>
    (o?.items || []).some((item) => item?.sellerId === currentUserId)
  );

  const [selectedOrderForShip, setSelectedOrderForShip] = useState<Order | null>(null);
  const [carrier, setCarrier] = useState('USPS Priority Mail');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]
  );
  const [shippingNotes, setShippingNotes] = useState('Shipped in reinforced classroom packaging with bubble wrap.');
  const [shippingProof, setShippingProof] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const openShipModal = (order: Order) => {
    setSelectedOrderForShip(order);
    setCarrier(order.carrier || 'USPS Priority Mail');
    setTrackingNumber(
      order.trackingNumber ||
        `9400${Math.floor(100000000000000000 + Math.random() * 900000000000000000)}`
    );
    setEstimatedDelivery(
      order.estimatedDelivery ||
        new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]
    );
    setShippingNotes(order.shippingNotes || 'Package dispatched via district/postal carrier.');
    setShippingProof(order.shippingProof || '');
  };

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForShip || !trackingNumber.trim()) return;

    onUpdateShipping(
      selectedOrderForShip.id,
      carrier,
      trackingNumber.trim(),
      estimatedDelivery,
      shippingNotes,
      shippingProof.trim() || undefined
    );

    setSuccessToast(`Tracking updated for Order #${selectedOrderForShip.orderNumber}! Status moved to Shipped.`);
    setTimeout(() => setSuccessToast(null), 3500);
    setSelectedOrderForShip(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-200" />
            <span className="font-bold">{successToast}</span>
          </div>
          <span className="text-[11px] text-emerald-200">Buyer notified with tracking details</span>
        </div>
      )}

      {/* Escrow & Shipping Policy Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-950">100% Escrow Fund Protection</h4>
            <p className="text-blue-800 mt-0.5">
              Buyer payments are held securely in platform escrow. Payouts are initially <strong>Pending</strong>. Once the buyer confirms delivery (or 5 days after carrier delivery), payout is automatically released.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
          <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-950">Fulfillment & Tracking</h4>
            <p className="text-emerald-800 mt-0.5">
              Enter the carrier and tracking code when you dispatch your package so the buyer can track delivery in real time.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Privacy Shield Active</h4>
            <p className="text-slate-300 mt-0.5">
              Your personal phone number and home address are prohibited from being shown to buyers. Only your school name appears.
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sellerOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3 shadow-xs">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No incoming orders yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When fellow teachers or parents purchase your classroom supplies, their orders and shipping slips will appear here.
            </p>
          </div>
        ) : (
          sellerOrders.map((order) => {
            const isDelivered = order.status === 'Delivered';
            const isShipped = order.status === 'Shipped';
            const isCompleted = order.status === 'Completed';
            const isUnderReview = order.status === 'Under Review' || order.disputeId;
            const payoutStatus = order.sellerPayoutStatus || (order.escrowStatus === 'Released' ? 'Released' : 'Pending');

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-xs"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{order.date}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium">
                      Buyer: <strong className="text-slate-900">{order.buyerName}</strong>
                    </span>
                  </div>

                  {/* Badges: Status & Payout */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
                        isUnderReview
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDelivered
                          ? 'bg-purple-100 text-purple-800'
                          : isShipped
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      Status: {order.status}
                    </span>

                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1 ${
                        payoutStatus === 'Released'
                          ? 'bg-emerald-500 text-white'
                          : payoutStatus === 'On Hold' || isUnderReview
                          ? 'bg-amber-500 text-white'
                          : payoutStatus === 'Eligible'
                          ? 'bg-blue-600 text-white'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      <DollarSign className="w-3 h-3" />
                      {payoutStatus === 'Released'
                        ? 'Payout Released'
                        : payoutStatus === 'On Hold' || isUnderReview
                        ? 'Payout Paused (Dispute)'
                        : payoutStatus === 'Eligible'
                        ? 'Payout Eligible (Processing)'
                        : `Payout Pending: $${order.sellerEarnings.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Dispute Alert Banner if Disputed */}
                {isUnderReview && (
                  <div className="bg-amber-50 border-b border-amber-200 p-3 px-5 flex items-center justify-between text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Dispute Open:</strong> Buyer opened an inquiry. Payout is currently paused. Please submit tracking proofs or message the buyer.
                      </span>
                    </div>
                    {onOpenDisputeCenter && (
                      <button
                        onClick={() => onOpenDisputeCenter(order.id)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded-lg text-[11px] cursor-pointer"
                      >
                        Respond in Dispute Center →
                      </button>
                    )}
                  </div>
                )}

                {/* Items & Shipping Details */}
                <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Purchased Items */}
                  <div className="lg:col-span-2 space-y-3">
                    <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                      Ordered Items
                    </h5>

                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-0.5">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span>Item Price: ${item.price.toFixed(2)}</span>
                            <span>•</span>
                            <span>Shipping: ${item.shippingCost.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-blue-900 text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Tracking Status Banner */}
                    {order.trackingNumber ? (
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950">
                        <div className="flex items-start gap-2.5">
                          <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{order.carrier}</span>
                              <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 text-[11px]">
                                {order.trackingNumber}
                              </span>
                            </div>
                            {order.estimatedDelivery && (
                              <p className="text-[11px] text-emerald-800 mt-0.5">
                                Est. Delivery: <strong>{order.estimatedDelivery}</strong> • {order.shippingNotes || 'Package on the way.'}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => openShipModal(order)}
                          className="text-emerald-700 hover:text-emerald-900 font-bold underline text-[11px] shrink-0 cursor-pointer"
                        >
                          Edit Tracking
                        </button>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-amber-950">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            <strong>Action Needed:</strong> Buyer paid! Package is <em>Awaiting Shipment</em>. Provide carrier & tracking number to advance order.
                          </span>
                        </div>
                        <button
                          onClick={() => openShipModal(order)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                        >
                          Ship Order
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Destination & Action Column */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                        Shipping Destination
                      </h5>
                      <div className="text-slate-700 space-y-1">
                        <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                        {order.shippingAddress.schoolName && (
                          <p className="text-slate-600 font-medium">{order.shippingAddress.schoolName}</p>
                        )}
                        <p>{order.shippingAddress.addressLine1}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.zip}
                        </p>
                      </div>

                      {order.orderNotes && (
                        <div className="mt-2.5 p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-600">
                          <strong>Buyer Note:</strong> {order.orderNotes}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
                      <button
                        onClick={() => openShipModal(order)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{order.trackingNumber ? 'Update Tracking Info' : 'Ship & Enter Tracking'}</span>
                      </button>

                      <button
                        onClick={() => onPrintSlip(order)}
                        className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Official Packing Slip</span>
                      </button>

                      {isUnderReview && onOpenDisputeCenter && (
                        <button
                          onClick={() => onOpenDisputeCenter(order.id)}
                          className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold py-2 rounded-lg border border-amber-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>View Open Dispute Case</span>
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

      {/* Ship & Enter Tracking Modal */}
      {selectedOrderForShip && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Ship Order #{selectedOrderForShip.orderNumber}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Buyer: {selectedOrderForShip.buyerName} • Earnings Held: ${selectedOrderForShip.sellerEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForShip(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleShipSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Carrier *</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900"
                >
                  <option value="USPS Priority Mail">USPS Priority Mail (2-3 Business Days)</option>
                  <option value="USPS Media Mail">USPS Media Mail (Books / Educational Supplies)</option>
                  <option value="USPS Ground Advantage">USPS Ground Advantage</option>
                  <option value="UPS Ground">UPS Ground</option>
                  <option value="FedEx Home Delivery">FedEx Home Delivery</option>
                  <option value="School District Inter-Campus Courier">School District Inter-Campus Courier</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Tracking Number *</label>
                  <button
                    type="button"
                    onClick={() =>
                      setTrackingNumber(
                        `9400${Math.floor(100000000000000000 + Math.random() * 900000000000000000)}`
                      )
                    }
                    className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Generate Test Tracking #
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9400111899562948210341"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shipping Service Tier</label>
                  <input
                    type="text"
                    readOnly
                    value="Tracked & Insured"
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Packing / Delivery Notes for Buyer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Box sealed with fragile labels. Teacher extras included inside."
                  value={shippingNotes}
                  onChange={(e) => setShippingNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Optional Postal Drop-off Receipt / Photo Proof URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or receipt scan"
                  value={shippingProof}
                  onChange={(e) => setShippingProof(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Uploading drop-off proof protects you against claim disputes and validates postal custody.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-blue-900 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Escrow Timeline:</strong> Once marked shipped, the buyer receives immediate notification with live tracking. When buyer confirms delivery, payout is released immediately. If buyer does not confirm, system releases funds automatically 5 days after carrier delivery.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForShip(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Update Tracking & Notify Buyer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
