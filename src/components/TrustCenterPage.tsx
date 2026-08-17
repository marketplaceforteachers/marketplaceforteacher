import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  MessageSquare,
  Scale,
  Star,
  ShieldAlert,
  HelpCircle,
  EyeOff,
  Building2,
  Award,
  CreditCard,
  PhoneCall,
  Sparkles,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

interface TrustCenterPageProps {
  onNavigateView?: (view: string) => void;
  onOpenDisputeCenter?: () => void;
  onOpenContact?: () => void;
}

export const TrustCenterPage: React.FC<TrustCenterPageProps> = ({
  onNavigateView,
  onOpenDisputeCenter,
  onOpenContact,
}) => {
  const TRUST_PILLARS = [
    {
      id: 'buyer-protection',
      icon: ShieldCheck,
      iconColor: 'bg-emerald-50 text-emerald-600',
      title: '1. 100% Escrow Buyer Protection',
      description:
        'Your payment is held safely in escrow until you receive your items in person or via carrier and confirm they match the listing. Sellers are never paid upfront.',
      highlight: 'Funds guaranteed until confirmed',
    },
    {
      id: 'verified-badges',
      icon: Award,
      iconColor: 'bg-blue-50 text-blue-600',
      title: '2. Authenticated Educator Badges',
      description:
        'Every seller account is manually reviewed. We authenticate official .edu / .org school district email addresses and state educator credentials before granting seller privileges.',
      highlight: 'Zero unverified sellers allowed',
    },
    {
      id: 'secure-payments',
      icon: Lock,
      iconColor: 'bg-purple-50 text-purple-600',
      title: '3. Bank-Level 256-Bit Encrypted Payments',
      description:
        'Processed through PCI-DSS Level 1 certified partners (Stripe & PayPal). We never store raw card numbers, ensuring total financial protection.',
      highlight: 'Zero card data stored on platform',
    },
    {
      id: 'live-tracking',
      icon: Truck,
      iconColor: 'bg-amber-50 text-amber-600',
      title: '4. Real-Time Carrier Tracking & Proof',
      description:
        'Direct tracking integration with USPS, UPS, and FedEx. Sellers upload drop-off receipts and delivery confirmation pictures to establish verifiable chain-of-custody.',
      highlight: 'Live updates from dispatch to doorstep',
    },
    {
      id: 'private-messaging',
      icon: MessageSquare,
      iconColor: 'bg-teal-50 text-teal-600',
      title: '5. Private In-App Teacher Messaging',
      description:
        'Communicate with sellers without exposing personal phone numbers or home addresses. Automatic anti-phishing filters keep conversations professional and safe.',
      highlight: 'Educator contact privacy shield',
    },
    {
      id: 'fair-disputes',
      icon: Scale,
      iconColor: 'bg-indigo-50 text-indigo-600',
      title: '6. Transparent Dispute Resolution',
      description:
        'If an item arrives damaged or missing pieces, our Dispute Center allows you to upload photos and request partial or full refunds with impartial educator arbitration.',
      highlight: 'Logged activity & full audit trails',
    },
    {
      id: 'verified-reviews',
      icon: Star,
      iconColor: 'bg-amber-50 text-amber-600',
      title: '7. 100% Authentic Verified Reviews',
      description:
        'Only users who have completed a verified purchase can leave feedback and ratings. No fake reviews, bot ratings, or promotional manipulation.',
      highlight: 'Real educator feedback only',
    },
    {
      id: 'fraud-detection',
      icon: ShieldAlert,
      iconColor: 'bg-red-50 text-red-600',
      title: '8. AI Fraud & Duplicate Detection',
      description:
        'Automated risk scanning flags suspicious velocity spikes, duplicate photos, chargeback anomalies, and disposable email accounts to block fraudulent behavior.',
      highlight: 'Proactive account risk monitoring',
    },
    {
      id: 'okc-support',
      icon: PhoneCall,
      iconColor: 'bg-blue-50 text-blue-600',
      title: '9. Dedicated US Support at OKC HQ',
      description:
        'Our customer support team is based in Oklahoma City, OK and answers inquiries promptly. We understand district purchase order workflows and educator needs.',
      highlight: 'Mon-Fri 8am-6pm CST support',
    },
    {
      id: 'privacy-security',
      icon: EyeOff,
      iconColor: 'bg-slate-100 text-slate-700',
      title: '10. FERPA & COPPA Privacy Standards',
      description:
        'We adhere to rigorous educational data privacy practices. We never sell user data, harvest student information, or share district rosters.',
      highlight: 'Strict student & teacher privacy',
    },
  ];

  return (
    <div id="trust-center-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-4 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>MFT TRUST & SAFETY GUARANTEE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          How MarketplaceForTeachers Keeps Every Classroom Safe
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From verified educator credentials to automated payment escrow and carrier tracking, discover the ten safety pillars protecting millions of dollars in classroom materials nationwide.
        </p>
      </div>

      {/* 10 Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TRUST_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pillar.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  {pillar.highlight}
                </span>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-slate-900">{pillar.title}</h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          );
        })}
      </div>

      {/* Safety Comparison Table (MFT vs Unregulated Marketplaces) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Why Teachers Trust MFT Over General Classifieds
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            See how our dedicated educator security compares to general social media classifieds.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-3.5 font-extrabold text-slate-900 rounded-l-xl">Security Feature</th>
                <th className="p-3.5 font-extrabold text-emerald-900 bg-emerald-50/70 border-x border-emerald-200">
                  MarketplaceForTeachers.com
                </th>
                <th className="p-3.5 font-extrabold text-slate-600 rounded-r-xl">
                  General Social Media & Classifieds
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3.5 font-bold text-slate-800">Seller Verification</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/40 border-x border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>State Educator & District Verified</span>
                </td>
                <td className="p-3.5 text-slate-500">Anonymous / Unverified Accounts</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-800">Payment Protection</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/40 border-x border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Escrow Held Until Delivery</span>
                </td>
                <td className="p-3.5 text-slate-500">Irreversible Cash / P2P Apps with No Refunds</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-800">Dispute Resolution</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/40 border-x border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Dispute Center & Full Refunds</span>
                </td>
                <td className="p-3.5 text-slate-500">No support / Ghosting risk</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-800">Tax Invoicing</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/40 border-x border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official Letterhead PDF Receipts & PO Support</span>
                </td>
                <td className="p-3.5 text-slate-500">No verifiable invoices for district reimbursement</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-800">Teacher Privacy</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-emerald-50/40 border-x border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Phone & Home Address Hidden from Public</span>
                </td>
                <td className="p-3.5 text-slate-500">Public profile & direct meetups required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black">Ready to explore trusted classroom supplies?</h3>
          <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
            Browse teacher listings across all 50 states with confidence, knowing every order is backed by 100% escrow protection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onNavigateView && (
            <button
              onClick={() => onNavigateView('marketplace')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Shop Marketplace
            </button>
          )}

          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Contact Safety Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
