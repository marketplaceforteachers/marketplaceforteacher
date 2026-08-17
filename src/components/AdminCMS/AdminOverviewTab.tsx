import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  PackageCheck,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
  Percent,
  Globe,
  Sliders,
  Bell,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3,
  Sparkles,
  ShoppingBag,
  Package,
  Scale,
  CreditCard,
  Mail,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Order, Product, User, AdminFeeSettings, AdminNotification } from '../../types';

interface AdminOverviewTabProps {
  orders: Order[];
  products: Product[];
  users: User[];
  onSelectTab: (tab: any) => void;
  onOpenSalesReport?: (timeframe: 'today' | 'month' | 'year' | 'anytime') => void;
  feeSettings?: AdminFeeSettings;
  adminNotifications?: AdminNotification[];
  onTriggerTestOperation?: () => void;
  onClearNotifications?: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  orders,
  products,
  users,
  onSelectTab,
  onOpenSalesReport,
  feeSettings,
  adminNotifications = [],
  onTriggerTestOperation,
  onClearNotifications,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [metricsTimeframe, setMetricsTimeframe] = useState<'today' | 'month' | 'year' | 'all'>('all');
  const commissionRate = feeSettings?.nationwideCommissionRate ?? 5.0;
  
  const rawOrdersList = orders || [];
  const usersList = users || [];
  const productsList = products || [];

  // Filter orders by selected metrics timeframe
  const ordersList = React.useMemo(() => {
    const todayStr = '2026-08-08';
    if (metricsTimeframe === 'today') {
      return rawOrdersList.filter((o) => (o.date || '').startsWith(todayStr));
    }
    if (metricsTimeframe === 'month') {
      return rawOrdersList.filter((o) => (o.date || '').startsWith('2026-08'));
    }
    if (metricsTimeframe === 'year') {
      return rawOrdersList.filter((o) => (o.date || '').startsWith('2026'));
    }
    return rawOrdersList;
  }, [rawOrdersList, metricsTimeframe]);

  const totalGMV = ordersList.reduce((acc, o) => acc + (o?.total || 0), 0);
  const platformRevenue = ordersList.reduce(
    (acc, o) => acc + (o?.commissionFee || (o?.subtotal || 0) * (commissionRate / 100)),
    0
  );
  const teacherDisbursed = ordersList.reduce(
    (acc, o) => acc + (o?.sellerEarnings || (o?.subtotal || 0) * 0.95),
    0
  );
  const verifiedCount = usersList.filter((u) => u?.verified).length;
  const pendingVerifications = usersList.filter((u) => !u?.verified);

  const handleGoToSalesReport = (tf: 'today' | 'month' | 'year' | 'anytime') => {
    if (onOpenSalesReport) {
      onOpenSalesReport(tf);
    } else {
      onSelectTab('sales-reports');
    }
  };

  const safeNotifications = Array.isArray(adminNotifications) ? adminNotifications : [];
  const filteredNotifications = safeNotifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'listing':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'dispute':
        return <Scale className="w-4 h-4 text-amber-600" />;
      case 'escrow':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'contact':
        return <Mail className="w-4 h-4 text-cyan-600" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'listing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'dispute':
        return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
      case 'escrow':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'verification':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'contact':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'security':
        return 'bg-red-50 text-red-800 border-red-200 font-bold';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Nationwide Sales Fee Highlight Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center font-black text-lg border border-white/20">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-white">
                Active Nationwide Sales Percentage: <span className="text-emerald-400 font-mono">{commissionRate.toFixed(1)}%</span>
              </h4>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ALL 50 STATES & CITIES
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Configured globally across Oklahoma City, Dallas, Los Angeles, Chicago, New York, and all US school districts.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('sales-fees')}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Adjust Sales % & Tax Rates</span>
        </button>
      </div>

      {/* Production cPanel Configuration Sync Status Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                cPanel Production Configuration Sync
              </h4>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                100% IN SYNC
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Verify essential cPanel environment variables (`config.php`), Apache rewrite rules (`.htaccess`), and standalone React bundle (`index.html`).
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('config-sync')}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Open Configuration Sync Check</span>
        </button>
      </div>

      {/* Timeframe Filter Bar & Sales Report Quick Launch */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="font-extrabold text-sm text-slate-900">
              Live Sales Performance: <span className="text-blue-900 uppercase">{metricsTimeframe === 'all' ? 'All-Time Total' : metricsTimeframe === 'today' ? 'Today (Aug 8)' : metricsTimeframe === 'month' ? 'August 2026 MTD' : '2026 Full Year'}</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter dashboard overview metrics by time range or launch full financial reports.
          </p>
        </div>

        {/* Timeframe Toggle Pills */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All-Time' },
            { id: 'today', label: '⚡ Today' },
            { id: 'month', label: '📅 This Month' },
            { id: 'year', label: '📊 This Year' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setMetricsTimeframe(tf.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metricsTimeframe === tf.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metrics Grid (Dynamic by Timeframe) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Gross Merchandise Volume (GMV)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-blue-950 font-mono">${totalGMV.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> {ordersList.length} orders in {metricsTimeframe}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">{commissionRate.toFixed(1)}% Platform Revenue</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">${platformRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-slate-400">Zero upfront listing fees</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Teacher Net Payouts (Escrow)</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900 font-mono">${teacherDisbursed.toFixed(2)}</p>
          <span className="text-[11px] text-purple-700 font-medium">100% Escrow Protected</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Verified Educators</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{verifiedCount} / {usersList.length}</p>
          <span className="text-[11px] text-blue-700 font-medium">100% credentialed school staff</span>
        </div>
      </div>

      {/* QUICK SALES & REVENUE REPORT GENERATOR LAUNCHER */}
      <div className="bg-linear-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl border border-blue-900 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                ADMIN FINANCIAL TOOL
              </span>
              <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Sales Reports Generator</span>
              </h3>
            </div>
            <p className="text-xs text-blue-200/90 mt-0.5">
              Generate accountant-ready sales ledgers, printable payment audit statements, and CSV exports.
            </p>
          </div>

          <button
            onClick={() => handleGoToSalesReport('anytime')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <span>Open Generator</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Quick Launch Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div
            onClick={() => handleGoToSalesReport('today')}
            className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/15 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Hourly & Orders</span>
              <Clock className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <h5 className="font-extrabold text-sm text-white">⚡ Today's Sales</h5>
            <p className="text-[11px] text-blue-200/80 leading-tight">
              Real-time transactions, hourly pacing & same-day transaction ledger.
            </p>
          </div>

          <div
            onClick={() => handleGoToSalesReport('month')}
            className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/15 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">August 2026</span>
              <Calendar className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <h5 className="font-extrabold text-sm text-white">📅 Month's Sales</h5>
            <p className="text-[11px] text-blue-200/80 leading-tight">
              Month-to-date GMV, daily trends, category and state breakdowns.
            </p>
          </div>

          <div
            onClick={() => handleGoToSalesReport('year')}
            className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/15 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Fiscal 2026</span>
              <BarChart3 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <h5 className="font-extrabold text-sm text-white">📊 Year 2026 Sales</h5>
            <p className="text-[11px] text-blue-200/80 leading-tight">
              12-month fiscal overview, quarterly pacing, and tax audit tables.
            </p>
          </div>

          <div
            onClick={() => handleGoToSalesReport('anytime')}
            className="bg-white/10 hover:bg-white/15 p-3.5 rounded-xl border border-white/15 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Custom Range</span>
              <Sliders className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <h5 className="font-extrabold text-sm text-white">🗓️ Anytime / Custom</h5>
            <p className="text-[11px] text-blue-200/80 leading-tight">
              Filter by exact dates, 50 states, categories, or payment methods.
            </p>
          </div>
        </div>
      </div>

      {/* REAL-TIME OPERATIONS & ADMIN NOTIFICATION FEED */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4 text-blue-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Real-Time Admin Operations Stream
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Instant alerts for placed orders, payment releases, seller verifications, disputes & district POs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onTriggerTestOperation && (
              <button
                onClick={onTriggerTestOperation}
                className="bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Fire an instant test operation to verify live notification alert"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Simulate Test Operation</span>
              </button>
            )}

            {onClearNotifications && (
              <button
                onClick={onClearNotifications}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                title="Clear notification stream"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          {[
            { id: 'all', label: `All (${safeNotifications.length})` },
            { id: 'order', label: '💰 Orders' },
            { id: 'listing', label: '📦 Listings' },
            { id: 'dispute', label: '⚖️ Disputes' },
            { id: 'escrow', label: '🛡️ Protection' },
            { id: 'verification', label: '🎓 Verifications' },
            { id: 'contact', label: '📝 District POs' },
            { id: 'system', label: '⚙️ Settings' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filterType === cat.id
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stream List */}
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No recent operations in this filter</p>
            <p className="text-[11px] text-slate-400">
              When buyers purchase, teachers list, or disputes open, live notifications will pop up automatically.
            </p>
            {onTriggerTestOperation && (
              <button
                onClick={onTriggerTestOperation}
                className="mt-2 text-xs font-extrabold text-blue-700 underline cursor-pointer"
              >
                Click here to test a live notification event
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${getBadgeColor(
                  notif.type
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-2xs shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/80 border border-slate-200 text-slate-700">
                        {notif.type}
                      </span>
                      {notif.priority === 'urgent' && (
                        <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.details && (
                      <p className="text-[11px] text-slate-500 mt-1 italic bg-white/60 px-2 py-1 rounded border border-slate-200/60">
                        Note: {notif.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-right">
                  {notif.amount !== undefined && notif.amount > 0 && (
                    <div className="text-right">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 block font-mono">
                        ${notif.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Transaction</span>
                    </div>
                  )}
                  <div className="text-right text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 justify-end font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {notif.timestamp}
                    </span>
                    {notif.actorName && (
                      <span className="block text-[10px] text-slate-600 font-bold truncate max-w-[120px]">
                        {notif.actorName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Alerts & Verifications Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Queue Preview */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Pending Teacher Verifications</span>
            </h4>
            <button
              onClick={() => onSelectTab('users')}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              View all ({pendingVerifications.length}) →
            </button>
          </div>

          {pendingVerifications.length === 0 ? (
            <p className="text-xs text-slate-400 italic">All teacher accounts verified!</p>
          ) : (
            <div className="space-y-2">
              {pendingVerifications.slice(0, 3).map((u) => (
                <div
                  key={u.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-500">{u.schoolName || u.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectTab('users')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-md text-[11px] cursor-pointer"
                  >
                    Review Credential
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-blue-600" />
              <span>Recent Escrow Transactions</span>
            </h4>
            <span className="text-xs text-slate-500">{ordersList.length} total orders</span>
          </div>

          <div className="space-y-2">
            {ordersList.slice(0, 3).map((o) => (
              <div
                key={o.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">Order #{o.orderNumber}</p>
                  <p className="text-[11px] text-slate-500">
                    Buyer: {o.buyerName} • {o.items.length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-blue-900 text-sm">${o.total.toFixed(2)}</span>
                  <span className="block text-[10px] text-emerald-700 font-bold">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
