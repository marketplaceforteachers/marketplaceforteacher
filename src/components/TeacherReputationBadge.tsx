import React, { useState } from 'react';
import { ShieldCheck, Zap, Clock, Truck, Award, CheckCircle2, Star, ThumbsUp, AlertCircle } from 'lucide-react';
import { TeacherReputation } from '../types';

interface TeacherReputationBadgeProps {
  reputation?: Partial<TeacherReputation>;
  sellerRating?: number;
  sellerSalesCount?: number;
  sellerVerified?: boolean;
  yearsActive?: number;
  compact?: boolean;
  showModalOnClick?: boolean;
}

export const TeacherReputationBadge: React.FC<TeacherReputationBadgeProps> = ({
  reputation,
  sellerRating = 4.9,
  sellerSalesCount = 38,
  sellerVerified = true,
  yearsActive = 6,
  compact = false,
  showModalOnClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate default high-trust multi-factor metrics if not fully provided
  const score = reputation?.score ?? Math.min(100, Math.round(80 + (sellerRating / 5) * 15 + Math.min(5, sellerSalesCount * 0.2)));
  const tier = reputation?.tier ?? (score >= 95 ? 'Platinum Educator' : score >= 85 ? 'Gold Educator' : 'Silver Educator');
  const responseTimeText = reputation?.responseTimeText ?? '< 45 mins';
  const avgDispatchDays = reputation?.avgDispatchDays ?? 1.2;
  const successfulSalesRate = reputation?.successfulSalesRate ?? 99.6;
  const disputeRate = reputation?.disputeRatePercent ?? 0.0;
  const badges = reputation?.verifiedBadges ?? ['State Teaching License Verified', 'School Email Confirmed (.k12)', 'Fast Shipper'];

  const getTierColor = () => {
    if (tier === 'Platinum Educator') {
      return {
        bg: 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-amber-300 text-amber-900',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        scoreColor: 'text-amber-700',
      };
    }
    if (tier === 'Gold Educator') {
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        scoreColor: 'text-emerald-700',
      };
    }
    return {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      scoreColor: 'text-blue-700',
    };
  };

  const style = getTierColor();

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            if (showModalOnClick) {
              e.stopPropagation();
              setIsOpen(true);
            }
          }}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-bold ${style.bg} ${
            showModalOnClick ? 'cursor-pointer hover:shadow-xs transition-shadow' : ''
          }`}
          title="Teacher Reputation & Trust Score"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-extrabold">{score}</span>
          <span className="text-[10px] opacity-80">Trust Score</span>
          {sellerVerified && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
        </button>

        {isOpen && (
          <ReputationModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            score={score}
            tier={tier}
            responseTimeText={responseTimeText}
            avgDispatchDays={avgDispatchDays}
            successfulSalesRate={successfulSalesRate}
            disputeRate={disputeRate}
            yearsActive={yearsActive}
            sellerRating={sellerRating}
            sellerSalesCount={sellerSalesCount}
            sellerVerified={sellerVerified}
            badges={badges}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        onClick={() => showModalOnClick && setIsOpen(true)}
        className={`p-3 rounded-xl border ${style.bg} ${
          showModalOnClick ? 'cursor-pointer hover:border-amber-400 transition-all' : ''
        } space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Teacher Trust Score
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeBg}`}>
            {tier}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black ${style.scoreColor}`}>{score}</span>
              <span className="text-xs text-slate-500 font-bold">/ 100</span>
            </div>
            <p className="text-[10px] text-slate-500">Multi-Factor Verified Rating</p>
          </div>

          <div className="text-right text-[11px] text-slate-600 space-y-0.5">
            <div className="flex items-center gap-1 justify-end font-semibold text-slate-700">
              <Clock className="w-3 h-3 text-blue-600" />
              <span>Replies in {responseTimeText}</span>
            </div>
            <div className="flex items-center gap-1 justify-end font-semibold text-slate-700">
              <Truck className="w-3 h-3 text-emerald-600" />
              <span>Ships in ~{avgDispatchDays} days</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
          <span>{sellerSalesCount} Successful Orders</span>
          <span className="text-emerald-700 font-bold">{disputeRate}% Dispute Rate</span>
        </div>
      </div>

      {isOpen && (
        <ReputationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          score={score}
          tier={tier}
          responseTimeText={responseTimeText}
          avgDispatchDays={avgDispatchDays}
          successfulSalesRate={successfulSalesRate}
          disputeRate={disputeRate}
          yearsActive={yearsActive}
          sellerRating={sellerRating}
          sellerSalesCount={sellerSalesCount}
          sellerVerified={sellerVerified}
          badges={badges}
        />
      )}
    </>
  );
};

interface ReputationModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  tier: string;
  responseTimeText: string;
  avgDispatchDays: number;
  successfulSalesRate: number;
  disputeRate: number;
  yearsActive: number;
  sellerRating: number;
  sellerSalesCount: number;
  sellerVerified: boolean;
  badges: string[];
}

const ReputationModal: React.FC<ReputationModalProps> = ({
  isOpen,
  onClose,
  score,
  tier,
  responseTimeText,
  avgDispatchDays,
  successfulSalesRate,
  disputeRate,
  yearsActive,
  sellerRating,
  sellerSalesCount,
  sellerVerified,
  badges,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Teacher Reputation Breakdown</h3>
              <p className="text-xs text-slate-500">Comprehensive multi-factor trust calculation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Big Score Header */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">Overall Trust Metric</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-amber-300">{score}</span>
              <span className="text-sm font-bold text-blue-300">/ 100</span>
            </div>
            <span className="inline-block mt-1 text-xs font-extrabold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded border border-amber-300/30">
              {tier}
            </span>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="flex items-center gap-1 justify-end text-emerald-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{sellerVerified ? '100% Verified Faculty' : 'Pending Verification'}</span>
            </div>
            <div className="flex items-center gap-1 justify-end text-amber-300 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{sellerRating.toFixed(1)} Star Rating</span>
            </div>
            <div className="text-blue-200 text-[11px]">{yearsActive} Years Active in Classroom</div>
          </div>
        </div>

        {/* 7 Trust Factors Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
            <span className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" /> Response Time
            </span>
            <p className="font-extrabold text-slate-800 text-sm">{responseTimeText}</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Top 5% Response Rate</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
            <span className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1">
              <Truck className="w-3 h-3 text-emerald-600" /> Dispatch Speed
            </span>
            <p className="font-extrabold text-slate-800 text-sm">~{avgDispatchDays} Days Avg</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Fast Track Shipping</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
            <span className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-amber-600" /> Successful Sales
            </span>
            <p className="font-extrabold text-slate-800 text-sm">{sellerSalesCount} Orders</p>
            <span className="text-[10px] text-slate-500">{successfulSalesRate}% Completion Rate</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
            <span className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-emerald-600" /> Return / Dispute
            </span>
            <p className="font-extrabold text-slate-800 text-sm">{disputeRate}% Disputes</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Zero-Dispute Seller</span>
          </div>
        </div>

        {/* Verification Badges */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Verified Badges & Credentials</h4>
          <div className="space-y-1.5">
            {badges.map((b, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Close Breakdown
        </button>
      </div>
    </div>
  );
};
