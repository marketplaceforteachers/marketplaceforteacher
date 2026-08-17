import React from 'react';
import {
  ShieldCheck,
  Package,
  AlertTriangle,
  RotateCcw,
  Clock,
  CheckCircle2,
  Lock,
  DollarSign,
  Truck,
  HelpCircle,
  ArrowRight,
  Sparkles,
  FileCheck,
  Scale,
  CreditCard,
  MessageSquare,
} from 'lucide-react';

interface BuyerProtectionPageProps {
  onOpenDisputeCenter?: () => void;
  onNavigateView?: (view: string) => void;
  onOpenContact?: () => void;
}

export const BuyerProtectionPage: React.FC<BuyerProtectionPageProps> = ({
  onOpenDisputeCenter,
  onNavigateView,
  onOpenContact,
}) => {
  return (
    <div id="buyer-protection-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="bg-linear-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>100% BUYER PROTECTION GUARANTEE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Marketplace Buyer Protection Policy
          </h1>

          <p className="text-sm sm:text-base text-blue-200 leading-relaxed max-w-2xl">
            When you purchase instructional supplies, books, or STEM materials on MarketplaceForTeachers, your money is held safely in protected custody. The seller is only paid after you receive your package and confirm it matches the listing.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            {onOpenDisputeCenter && (
              <button
                id="bp-open-dispute-btn"
                onClick={onOpenDisputeCenter}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Open Dispute Center</span>
              </button>
            )}

            {onNavigateView && (
              <button
                id="bp-view-orders-btn"
                onClick={() => onNavigateView('teacher-dashboard')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>View My Purchases</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coverage Highlights Grid */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-slate-900">What is Covered by Buyer Protection?</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Every transaction on MarketplaceForTeachers is backed by automated payment protection holds and verified educator arbitration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {/* Card 1: Item Not Received */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Item Not Received</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If your order tracking does not show delivery, or if the package is lost in transit by the carrier, you receive a <strong>100% full refund</strong> of item price, shipping fees, and sales tax.
            </p>
            <div className="pt-2 text-[11px] font-bold text-blue-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Full Refund Guarantee
            </div>
          </div>

          {/* Card 2: Wrong Item Received */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Wrong Item Received</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If the seller ships an incorrect title, wrong grade level, or completely different item, you can open a dispute. We will provide a prepaid return label and issue a full refund upon drop-off.
            </p>
            <div className="pt-2 text-[11px] font-bold text-purple-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Free Prepaid Returns
            </div>
          </div>

          {/* Card 3: Significantly Different */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Significantly Different</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If items are missing major parts (e.g., manipulatives missing pieces, book bundles missing volumes) or condition is worse than listed, you can request a partial discount or full return.
            </p>
            <div className="pt-2 text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Partial / Full Resolution
            </div>
          </div>

          {/* Card 4: Damaged in Transit */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Damaged Shipment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If carrier mishandling cracks plastic storage tubs, tears hardcover books, or breaks electronics, upload photo evidence within 72 hours of delivery for refund processing.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Photo Proof Claim
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Payment Protection & Escrow Flow */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">The 7-Step Payment Protection Workflow</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              How funds move securely from checkout to verified teacher payout.
            </p>
          </div>
          <span className="bg-blue-100 text-blue-900 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200">
            Escrow Timeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
          {[
            {
              step: '1',
              title: 'Pending Payment',
              desc: 'Buyer places order via Stripe, PayPal, or Apple Pay.',
              badge: 'Initiated',
              badgeColor: 'bg-slate-200 text-slate-800',
            },
            {
              step: '2',
              title: 'Order Paid',
              desc: 'Payment captured. Payout recorded as PENDING. Escrow held.',
              badge: 'Escrow Held',
              badgeColor: 'bg-indigo-100 text-indigo-900 font-bold',
            },
            {
              step: '3',
              title: 'Awaiting Shipment',
              desc: 'Seller prepares classroom package and generates label.',
              badge: 'Packaging',
              badgeColor: 'bg-amber-100 text-amber-900',
            },
            {
              step: '4',
              title: 'Shipped',
              desc: 'Seller provides carrier & live tracking code in app.',
              badge: 'In Transit',
              badgeColor: 'bg-blue-100 text-blue-900',
            },
            {
              step: '5',
              title: 'Delivered',
              desc: 'Tracking confirms delivery to school campus or address.',
              badge: '72hr Window',
              badgeColor: 'bg-purple-100 text-purple-900',
            },
            {
              step: '6',
              title: 'Confirm Delivery',
              desc: 'Buyer inspects items and confirms receipt in 1 click.',
              badge: 'Confirmed',
              badgeColor: 'bg-emerald-100 text-emerald-900',
            },
            {
              step: '7',
              title: 'Payout Released',
              desc: 'Order complete. Earnings released to teacher balance.',
              badge: 'Released',
              badgeColor: 'bg-emerald-600 text-white font-bold',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-black text-[11px] flex items-center justify-center">
                    {item.step}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Automatic Release Notice */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3 text-xs text-blue-950">
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Automatic Review Period & Payout Protection</h4>
            <p className="text-blue-800 mt-0.5 leading-relaxed">
              If carrier tracking confirms delivery and no dispute is opened within <strong>72 hours (3 calendar days)</strong>, the system automatically marks the order complete and releases payout to the educator. If a dispute is opened at any time before payout, funds are immediately frozen.
            </p>
          </div>
        </div>
      </div>

      {/* Dispute Resolution Process Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
            <Scale className="w-3.5 h-3.5" />
            <span>Fair Dispute Arbitration</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900">What Happens If You Open a Dispute?</h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We understand school schedules are busy and sometimes items get damaged or misplaced in transit. Here is our exact, transparent dispute resolution process:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3 text-xs shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-black text-sm flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Instant Escrow Payout Pause</h4>
                <p className="text-slate-600 mt-0.5">
                  The moment a buyer clicks "Report an Issue" in Dispute Center, the order status changes to <strong>Under Review</strong> and seller payout is locked on hold. Administrators and sellers are notified immediately.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3 text-xs shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-black text-sm flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Evidence Submission & Direct Dialogue</h4>
                <p className="text-slate-600 mt-0.5">
                  The buyer uploads photos of damage/missing pieces. The teacher seller has 48 hours to reply, provide tracking/drop-off receipts, offer a replacement, or agree to a partial/full refund.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3 text-xs shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-black text-sm flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Educator Panel Decision & Fund Release</h4>
                <p className="text-slate-600 mt-0.5">
                  If buyer and seller reach agreement or if MFT admins arbitrate, the administrator can issue an instant full refund, process a partial discount refund, or release the seller funds. Every step is logged in the permanent audit trail.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Card Sidebar */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3 text-xs divide-y divide-slate-100">
            <div className="pt-2">
              <h5 className="font-bold text-slate-900">How long do refunds take to appear?</h5>
              <p className="text-slate-600 mt-1">
                Approved refunds are processed back to your original payment method (Visa, Mastercard, Discover, Amex, PayPal, Apple Pay) within <strong>2 to 5 business days</strong>.
              </p>
            </div>

            <div className="pt-3">
              <h5 className="font-bold text-slate-900">Do buyers need a verified teacher email?</h5>
              <p className="text-slate-600 mt-1">
                No! Parents, PTA members, homeschoolers, and school staff can buy freely. Only sellers must pass credential verification.
              </p>
            </div>

            <div className="pt-3">
              <h5 className="font-bold text-slate-900">Can an Admin manually hold or release payouts?</h5>
              <p className="text-slate-600 mt-1">
                Yes. Platform administrators have administrative controls to hold payouts on suspicious orders or release payouts early upon verified delivery.
              </p>
            </div>

            <div className="pt-3">
              <h5 className="font-bold text-slate-900">What if I picked up the item locally?</h5>
              <p className="text-slate-600 mt-1">
                For local school office pickups, you inspect the item upon receipt and click "Confirm Receipt" on your phone to release payment to the teacher immediately.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span>Contact MFT Dispute Support</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
