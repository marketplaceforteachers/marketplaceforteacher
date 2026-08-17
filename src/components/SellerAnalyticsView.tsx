import React, { useState } from 'react';
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  Heart,
  DollarSign,
  Package,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { User, Product } from '../types';

interface SellerAnalyticsViewProps {
  currentUser: User;
  products: Product[];
}

export const SellerAnalyticsView: React.FC<SellerAnalyticsViewProps> = ({
  currentUser,
  products,
}) => {
  const [timeRange, setTimeRange] = useState<'30days' | '90days' | 'all'>('30days');

  const totalRevenue = 1420.5;
  const totalViews = 3840;
  const totalClicks = 980;
  const totalFavorites = 215;
  const conversionRate = 4.8;

  const topPerformingListings = [
    {
      title: 'Complete Guided Reading Library (Levels A-J, 80 Volumes)',
      views: 1240,
      favorites: 84,
      revenue: 165.0,
      sales: 1,
    },
    {
      title: 'FOSS Physics & Motion Complete Classroom Lab Kit',
      views: 890,
      favorites: 62,
      revenue: 85.0,
      sales: 1,
    },
    {
      title: 'Classroom Sensory Floor Wobble Cushions (Set of 6)',
      views: 640,
      favorites: 41,
      revenue: 55.0,
      sales: 2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Educator Seller Analytics & Insights</h2>
          <p className="text-xs text-slate-500">Track demand, search impressions, conversion metrics, and payout summaries</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {(['30days', '90days', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range === '30days' ? 'Last 30 Days' : range === '90days' ? 'Last 90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Classroom Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18.4% vs last period
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Listing Impressions</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalViews.toLocaleString()}</p>
          <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +24% teacher traffic
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Colleague Favorites</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalFavorites}</p>
          <span className="text-[10px] text-rose-600 font-bold">In 215 Wishlists</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{conversionRate}%</p>
          <span className="text-[10px] text-purple-600 font-bold">Above 3.2% avg</span>
        </div>
      </div>

      {/* Sales Trajectory Visual Simulation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Monthly Surplus Recycling & Sales Performance
          </h3>
          <span className="text-xs font-bold text-slate-500">2026 Academic Calendar</span>
        </div>

        <div className="h-44 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
          {[
            { month: 'Jan', val: 40, amt: '$280' },
            { month: 'Feb', val: 65, amt: '$440' },
            { month: 'Mar', val: 50, amt: '$350' },
            { month: 'Apr', val: 75, amt: '$590' },
            { month: 'May', val: 95, amt: '$820' },
            { month: 'Jun', val: 80, amt: '$680' },
            { month: 'Jul', val: 100, amt: '$940' },
            { month: 'Aug', val: 90, amt: '$850' },
          ].map((bar) => (
            <div key={bar.month} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md transition-opacity">
                {bar.amt}
              </div>
              <div
                style={{ height: `${bar.val}%` }}
                className="w-full bg-blue-900 hover:bg-blue-800 rounded-t-lg transition-all duration-300 group-hover:bg-amber-500"
              />
              <span className="text-[10px] text-slate-500 font-bold">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Top Performing Classroom Listings
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {topPerformingListings.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-extrabold text-slate-900">{item.title}</span>
              </div>

              <div className="flex items-center gap-6 text-slate-600 font-medium">
                <span>{item.views} Views</span>
                <span>{item.favorites} Saves</span>
                <span className="font-black text-blue-950">${item.revenue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
