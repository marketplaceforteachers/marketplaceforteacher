import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Percent,
  Gift,
  CheckCircle2,
  TrendingUp,
  History,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { RewardItem, RewardActivity, User } from '../types';
import { REWARD_ITEMS, INITIAL_REWARD_ACTIVITIES } from '../data/teacherRewardsData';

interface TeacherRewardsShopProps {
  currentUser: User;
  userPoints?: number;
  onRedeemReward?: (reward: RewardItem) => void;
}

export const TeacherRewardsShop: React.FC<TeacherRewardsShopProps> = ({
  currentUser,
  userPoints = 850,
  onRedeemReward,
}) => {
  const [points, setPoints] = useState(userPoints);
  const [activities, setActivities] = useState<RewardActivity[]>(INITIAL_REWARD_ACTIVITIES);
  const [redeemedVouchers, setRedeemedVouchers] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRedeem = (reward: RewardItem) => {
    if (points < reward.costPoints) {
      setErrorMsg(`You need ${reward.costPoints - points} more points to redeem this voucher.`);
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    setPoints((prev) => prev - reward.costPoints);
    setRedeemedVouchers((prev) => [...prev, reward.id]);
    setErrorMsg(null);

    const newAct: RewardActivity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Redeemed ${reward.title}`,
      points: -reward.costPoints,
      type: 'redeemed',
    };
    setActivities((prev) => [newAct, ...prev]);

    setSuccessMsg(`Successfully redeemed "${reward.title}"! Voucher code applied to your educator account.`);
    setTimeout(() => setSuccessMsg(null), 4000);

    onRedeemReward?.(reward);
  };

  const getIcon = (iconName: string) => {
    if (iconName === 'Sparkles') return <Sparkles className="w-5 h-5 text-amber-500" />;
    if (iconName === 'Percent') return <Percent className="w-5 h-5 text-emerald-500" />;
    if (iconName === 'Gift') return <Gift className="w-5 h-5 text-purple-500" />;
    return <Award className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Hero Points Overview */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/80 text-amber-100 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            Teacher Rewards & Loyalty Club
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Earn Points for Helping Classrooms
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed max-w-xl">
            Get rewarded every time you list surplus supplies, fulfill wishlists, leave verified colleague reviews, and refer new school teachers.
          </p>
        </div>

        {/* Big Balance Box */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-auto min-w-[200px]">
          <span className="text-xs uppercase tracking-wider text-amber-200 font-bold block">
            Your Active Reward Balance
          </span>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
            <span className="text-4xl font-black text-white">{points}</span>
            <span className="text-sm text-amber-200 font-bold">PTS</span>
          </div>
          <span className="text-[11px] text-amber-100 block mt-1">Equal to ~$10.50 in fee credits</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2 shadow-xs">
          <Award className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Rewards Catalog */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span>Available Educator Perks & Vouchers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REWARD_ITEMS.map((reward) => {
            const canAfford = points >= reward.costPoints;
            const isRedeemed = redeemedVouchers.includes(reward.id);

            return (
              <div
                key={reward.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                    {getIcon(reward.icon)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {reward.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{reward.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-amber-600">{reward.costPoints}</span>
                    <span className="text-xs font-bold text-slate-400">Points</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford && !isRedeemed}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isRedeemed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : canAfford
                        ? 'bg-blue-900 hover:bg-blue-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isRedeemed ? 'Redeemed & Active' : canAfford ? 'Redeem Voucher' : 'Need More Points'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points Ledger Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-4 h-4 text-slate-500" />
          Recent Loyalty Points Activity
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {activities.map((act) => (
            <div key={act.id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{act.description}</p>
                <span className="text-[10px] text-slate-400">{act.date}</span>
              </div>

              <span
                className={`font-black text-xs ${
                  act.points > 0 ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {act.points > 0 ? `+${act.points}` : act.points} PTS
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
