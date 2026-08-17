import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  DollarSign,
  AlertTriangle,
  FileCheck,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  TrendingDown,
  Lock,
  RotateCcw,
  Zap,
  Award,
  ExternalLink,
  Ban,
  PauseCircle,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import {
  Order,
  DisputeCase,
  FraudAlert,
  SellerVerificationRequest,
  SellerPerformanceProfile,
  BuyerPerformanceProfile,
  AdminFeeSettings,
} from '../../types';
import { MOCK_SELLER_PERFORMANCE, MOCK_BUYER_PERFORMANCE } from '../../data/mockData';

interface AdminSafetyDashboardProps {
  orders?: Order[];
  disputes?: DisputeCase[];
  fraudAlerts?: FraudAlert[];
  verificationRequests?: SellerVerificationRequest[];
  sellerVerifications?: SellerVerificationRequest[];
  sellerProfiles?: SellerPerformanceProfile[];
  buyerProfiles?: BuyerPerformanceProfile[];
  feeSettings?: AdminFeeSettings;
  onHoldPayout?: (orderId: string, reason?: string) => void;
  onReleasePayout?: (orderId: string, reason?: string) => void;
  onIssueRefund?: (orderId: string, amount: number) => void;
  onApproveVerification?: (requestId: string) => void;
  onRejectVerification?: (requestId: string, reason: string) => void;
  onDismissFraudAlert?: (alertId: string) => void;
  onToggleUserStatus?: (userId: string, currentStatus: string) => void;
  onOpenDisputeDetail?: (disputeId: string) => void;
  onResolveDispute?: (disputeId: string, decision: any, notes: string, refundAmount?: number) => void;
  onUpdateVerification?: (id: string, status: 'approved' | 'rejected' | 'pending' | 'under_review') => void;
}

export const AdminSafetyDashboard: React.FC<AdminSafetyDashboardProps> = ({
  orders = [],
  disputes = [],
  fraudAlerts = [],
  verificationRequests,
  sellerVerifications = [],
  sellerProfiles = MOCK_SELLER_PERFORMANCE,
  buyerProfiles = MOCK_BUYER_PERFORMANCE,
  feeSettings,
  onHoldPayout = (_orderId?: string, _reason?: string) => {},
  onReleasePayout = (_orderId?: string, _reason?: string) => {},
  onIssueRefund = (_orderId?: string, _amount?: number) => {},
  onApproveVerification = (_requestId?: string) => {},
  onRejectVerification = (_requestId?: string, _reason?: string) => {},
  onDismissFraudAlert = (_alertId?: string) => {},
  onToggleUserStatus = (_userId?: string, _currentStatus?: string) => {},
  onOpenDisputeDetail,
  onResolveDispute,
  onUpdateVerification,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'high_risk_orders' | 'fraud_alerts' | 'verifications' | 'sellers' | 'buyers'
  >('overview');

  const [selectedOrderForAction, setSelectedOrderForAction] = useState<Order | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [refundAmountInput, setRefundAmountInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search queries
  const [orderSearch, setOrderSearch] = useState('');
  const [fraudSearch, setFraudSearch] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeDisputes = Array.isArray(disputes) ? disputes : [];
  const safeFraudAlerts = Array.isArray(fraudAlerts) ? fraudAlerts : [];
  const safeVerifications = Array.isArray(verificationRequests)
    ? verificationRequests
    : Array.isArray(sellerVerifications)
    ? sellerVerifications
    : [];
  const safeSellerProfiles = Array.isArray(sellerProfiles) ? sellerProfiles : [];
  const safeBuyerProfiles = Array.isArray(buyerProfiles) ? buyerProfiles : [];

  // 9 Metric Card Calculations
  const highRiskOrders = safeOrders.filter((o) => (o?.riskScore || 0) >= 50 || o?.sellerPayoutStatus === 'On Hold');
  const pendingDisputes = safeDisputes.filter(
    (d) => d?.status === 'Under Review' || d?.status === 'Open' || d?.status === 'Awaiting Seller'
  );
  const pendingRefunds = safeDisputes.filter((d) => d?.requestedResolution === 'full_refund' || d?.requestedResolution === 'partial_refund');
  const chargebacksCount = 0; // 0 Active Chargebacks
  const pendingVerifications = safeVerifications.filter((v) => v?.status === 'pending');
  const reportedListingsCount = safeFraudAlerts.filter((f) => f?.type === 'duplicate_listings').length;
  const suspendedUsersCount = safeSellerProfiles.filter((s) => s?.status === 'suspended').length + safeBuyerProfiles.filter((b) => b?.status === 'restricted').length;
  const pendingSellerPayouts = safeOrders.filter((o) => o?.sellerPayoutStatus === 'Pending' || o?.sellerPayoutStatus === 'On Hold');
  const pendingPayoutTotal = pendingSellerPayouts.reduce((acc, o) => acc + (o?.escrowAmount || (o?.total || 0) * 0.95), 0);
  const activeFraudAlerts = safeFraudAlerts.filter((f) => f?.status === 'active' || f?.status === 'investigating');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div id="admin-safety-dashboard" className="space-y-8 text-slate-800">
      {/* Toast */}
      {toastMessage && (
        <div className="bg-emerald-700 text-white p-3.5 rounded-xl shadow-lg flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="font-black text-white hover:opacity-80">
            ✕
          </button>
        </div>
      )}

      {/* Safety Center Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-linear-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-md border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-black px-3 py-1 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>TRUST & RISK INTELLIGENCE ENGINE</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">MFT Safety & Escrow Command Center</h2>
          <p className="text-xs text-slate-300">
            Real-time fraud screening, automated escrow controls, educator credentialing, and dispute arbitration.
          </p>
        </div>

        <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/15 text-right">
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
            Total Escrow Held
          </span>
          <span className="text-xl font-black text-emerald-400">
            ${pendingPayoutTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* 9 Safety Center Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* 1. High-Risk Orders */}
        <div
          onClick={() => setActiveTab('high_risk_orders')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            activeTab === 'high_risk_orders'
              ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">High-Risk Orders</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{highRiskOrders.length}</span>
            <span className="text-[11px] font-bold text-amber-700">Flagged Risk &gt;50</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Orders requiring manual escrow review</p>
        </div>

        {/* 2. Pending Disputes */}
        <div
          onClick={() => setActiveTab('overview')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            activeTab === 'overview'
              ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Pending Disputes</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingDisputes.length}</span>
            <span className="text-[11px] font-bold text-blue-700">Payout Paused</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Under review by arbitration panel</p>
        </div>

        {/* 3. Pending Refunds */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Pending Refund Claims</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingRefunds.length}</span>
            <span className="text-[11px] font-bold text-purple-700">Requested</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Full/partial refund requests</p>
        </div>

        {/* 4. Chargebacks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Bank Chargebacks</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">0</span>
            <span className="text-[11px] font-bold text-emerald-700">0.0% Rate</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% Escrow Protection active</p>
        </div>

        {/* 5. Verification Requests */}
        <div
          onClick={() => setActiveTab('verifications')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            activeTab === 'verifications'
              ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Teacher Verification Queue</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingVerifications.length}</span>
            <span className="text-[11px] font-bold text-indigo-700">Awaiting Admin</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">State licenses & district ID badges</p>
        </div>

        {/* 6. Reported Listings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Reported / Duplicate Listings</span>
            <div className="p-2 rounded-xl bg-orange-100 text-orange-800">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{reportedListingsCount}</span>
            <span className="text-[11px] font-bold text-orange-700">Photo Scanned</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Duplicate text/image anomalies</p>
        </div>

        {/* 7. Suspended Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Suspended / Restricted Users</span>
            <div className="p-2 rounded-xl bg-red-100 text-red-800">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{suspendedUsersCount}</span>
            <span className="text-[11px] font-bold text-red-700">Locked</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Accounts locked for security flags</p>
        </div>

        {/* 8. Pending Seller Payouts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Pending Seller Payouts</span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingSellerPayouts.length}</span>
            <span className="text-[11px] font-bold text-teal-700">
              ${pendingPayoutTotal.toFixed(2)} in Escrow
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Held until delivery is confirmed</p>
        </div>

        {/* 9. Fraud Alerts */}
        <div
          onClick={() => setActiveTab('fraud_alerts')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            activeTab === 'fraud_alerts'
              ? 'bg-rose-50/80 border-rose-600 ring-2 ring-rose-500'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Active Fraud Alerts</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700">{activeFraudAlerts.length}</span>
            <span className="text-[11px] font-bold text-rose-700">Radar Alerts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Velocity, IP, and decline spikes</p>
        </div>
      </div>

      {/* Safety Center Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-extrabold">
        {[
          { id: 'overview', label: 'Disputes & Escrow Holds' },
          { id: 'high_risk_orders', label: `High-Risk Orders (${highRiskOrders.length})` },
          { id: 'fraud_alerts', label: `Fraud Alerts (${activeFraudAlerts.length})` },
          { id: 'verifications', label: `Verification Queue (${pendingVerifications.length})` },
          { id: 'sellers', label: 'Seller Performance Profiles' },
          { id: 'buyers', label: 'Buyer Performance Profiles' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Active Disputes */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Active Dispute Resolution Queue</h3>
                <p className="text-xs text-slate-500">
                  Cases currently freezing seller payout. Review evidence and arbitrate final decisions.
                </p>
              </div>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
                {pendingDisputes.length} Cases Requiring Decision
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-extrabold">
                    <th className="p-3.5 rounded-l-xl">Dispute #</th>
                    <th className="p-3.5">Order</th>
                    <th className="p-3.5">Buyer</th>
                    <th className="p-3.5">Seller</th>
                    <th className="p-3.5">Reason</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 rounded-r-xl text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disputes.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{d.disputeNumber}</td>
                      <td className="p-3.5 font-bold text-blue-900">#{d.orderNumber}</td>
                      <td className="p-3.5">{d.buyerName}</td>
                      <td className="p-3.5">{d.sellerName}</td>
                      <td className="p-3.5 max-w-xs truncate" title={d.reasonTitle}>
                        {d.reasonTitle}
                      </td>
                      <td className="p-3.5 font-black text-slate-900">${d.disputeAmount.toFixed(2)}</td>
                      <td className="p-3.5">
                        <span
                          className={`font-black px-2.5 py-0.5 rounded-full text-[10px] ${
                            d.status.startsWith('Resolved')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {onOpenDisputeDetail && (
                          <button
                            onClick={() => onOpenDisputeDetail(d.id)}
                            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer"
                          >
                            Arbitrate Case →
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: High Risk Orders Table */}
      {activeTab === 'high_risk_orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">High-Risk Orders Management</h3>
              <p className="text-xs text-slate-500">
                Orders flagged by automated risk rules. Admins can hold payout, release payout, or issue refunds.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-extrabold">
                  <th className="p-3.5 rounded-l-xl">Order #</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Risk Flags / Reason</th>
                  <th className="p-3.5">Buyer</th>
                  <th className="p-3.5">Seller</th>
                  <th className="p-3.5">Total / Escrow</th>
                  <th className="p-3.5">Payout Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Escrow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeOrders
                  .filter((o) => {
                    if (!orderSearch.trim()) return true;
                    return (
                      (o.orderNumber || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
                      (o.buyerName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
                      (o.sellerName || '').toLowerCase().includes(orderSearch.toLowerCase())
                    );
                  })
                  .map((order) => {
                    const score = order.riskScore || 10;
                    const isHigh = score >= 50;

                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-blue-900">#{order.orderNumber}</td>
                        <td className="p-3.5">
                          <span
                            className={`font-black px-2.5 py-1 rounded-full text-[11px] ${
                              score >= 70
                                ? 'bg-red-100 text-red-900 border border-red-300'
                                : score >= 40
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {score} / 100
                          </span>
                        </td>
                        <td className="p-3.5 max-w-xs text-[11px] text-slate-600">
                          {order.riskReasons && order.riskReasons.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {order.riskReasons.map((r, i) => (
                                <span
                                  key={i}
                                  className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400">Normal profile</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900 block">{order.buyerName}</span>
                          <span className="text-[10px] text-slate-400">{order.buyerEmail}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900 block">{order.sellerName}</span>
                          <span className="text-[10px] text-slate-400">{order.sellerEmail}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-extrabold text-slate-900 block">
                            ${order.total.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            Escrow: ${(order.escrowAmount || order.total * 0.95).toFixed(2)}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-black px-2 py-0.5 rounded text-[10px] ${
                              order.sellerPayoutStatus === 'Released'
                                ? 'bg-emerald-100 text-emerald-900'
                                : order.sellerPayoutStatus === 'On Hold'
                                ? 'bg-red-100 text-red-900 border border-red-300'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {order.sellerPayoutStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                          {order.sellerPayoutStatus === 'On Hold' ? (
                            <button
                              onClick={() => {
                                onReleasePayout(order.id);
                                showToast(`Payout released manually for Order #${order.orderNumber}.`);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer"
                            >
                              Release Payout
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onHoldPayout(order.id, 'Admin safety review');
                                showToast(`Payout placed on hold for Order #${order.orderNumber}.`);
                              }}
                              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer"
                            >
                              Hold Payout
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onIssueRefund(order.id, order.total);
                              showToast(`Full refund of $${order.total.toFixed(2)} issued to buyer.`);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            Refund
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Automated Fraud Alerts */}
      {activeTab === 'fraud_alerts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Automated Fraud Alerts Engine</h3>
              <p className="text-xs text-slate-500">
                Rule triggers: Large purchases, refund velocity spikes, card decline frequency, duplicate listings.
              </p>
            </div>
            <span className="bg-rose-100 text-rose-900 text-xs font-black px-3 py-1 rounded-full">
              {activeFraudAlerts.length} Active System Alerts
            </span>
          </div>

          <div className="space-y-3">
            {safeFraudAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black px-2 py-0.5 rounded text-[10px] uppercase ${
                        alert.severity === 'critical'
                          ? 'bg-red-600 text-white'
                          : alert.severity === 'high'
                          ? 'bg-orange-500 text-white'
                          : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {alert.severity} Risk
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{alert.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                    <span>Target: {alert.targetUserName || alert.targetOrderNumber || alert.targetListingId}</span>
                    <span>•</span>
                    <span>Risk Score: {alert.riskScore}</span>
                    <span>•</span>
                    <span>Detected: {alert.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alert.status !== 'resolved' ? (
                    <>
                      <button
                        onClick={() => {
                          onDismissFraudAlert(alert.id);
                          showToast(`Alert #${alert.id} marked investigated and resolved.`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Resolve Alert
                      </button>

                      {alert.targetUserId && (
                        <button
                          onClick={() => {
                            onToggleUserStatus(alert.targetUserId!, 'active');
                            showToast(`Account restricted for ${alert.targetUserName}.`);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Restrict Account
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-[11px]">
                      Resolved & Logged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Seller Educator Verification Queue</h3>
              <p className="text-xs text-slate-500">
                Confirm state teaching certificates, district staff badges, and school directory credentials.
              </p>
            </div>
            <span className="bg-indigo-100 text-indigo-900 text-xs font-black px-3 py-1 rounded-full">
              {pendingVerifications.length} Pending Approval
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeVerifications.map((req) => (
              <div
                key={req.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[10px]">
                      {req.badgeType}
                    </span>
                    <span className="text-[10px] text-slate-400">{req.submittedAt.split(' ')[0]}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{req.userName}</h4>
                  <p className="text-[11px] text-slate-600 font-semibold">{req.roleTitle}</p>
                  <p className="text-[11px] text-slate-500">
                    {req.schoolName} • {req.district} ({req.state})
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{req.userEmail}</p>

                  <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-700 truncate">{req.documentName}</span>
                    <a
                      href={req.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-blue-600 font-bold hover:underline shrink-0 flex items-center gap-0.5 ml-2"
                    >
                      View Cert <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => {
                          onApproveVerification(req.id);
                          showToast(`Verified badge granted to ${req.userName}.`);
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Approve Badge
                      </button>
                      <button
                        onClick={() => {
                          onRejectVerification(req.id, 'Unverifiable document');
                          showToast(`Verification rejected for ${req.userName}.`);
                        }}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="w-full text-center font-bold text-emerald-700 bg-emerald-100 py-1.5 rounded-xl text-xs">
                      Credential Approved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Seller Performance Profiles */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Seller Performance & Trust Metrics</h3>
              <p className="text-xs text-slate-500">
                Track educator dispute rates, refund frequencies, late shipments, and trust scores.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-extrabold">
                  <th className="p-3.5 rounded-l-xl">Seller</th>
                  <th className="p-3.5">Trust Score</th>
                  <th className="p-3.5">Sales / Completed</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Dispute %</th>
                  <th className="p-3.5">Refund %</th>
                  <th className="p-3.5">Late Ship %</th>
                  <th className="p-3.5">Revenue</th>
                  <th className="p-3.5 rounded-r-xl text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeSellerProfiles.map((s) => (
                  <tr key={s.userId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.avatar}
                          alt={s.userName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{s.userName}</span>
                          <span className="text-[10px] text-slate-500">{s.userSchool}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        {s.trustScore} / 100
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">
                      {s.successfulSales} sales ({s.completedOrders} delivered)
                    </td>
                    <td className="p-3.5 font-bold text-amber-600">★ {s.averageRating.toFixed(2)}</td>
                    <td className="p-3.5 font-semibold text-slate-700">{s.disputePercent.toFixed(1)}%</td>
                    <td className="p-3.5 font-semibold text-slate-700">{s.refundPercent.toFixed(1)}%</td>
                    <td className="p-3.5 font-semibold text-slate-700">{s.lateShipmentPercent.toFixed(1)}%</td>
                    <td className="p-3.5 font-extrabold text-slate-900">${s.revenue.toFixed(2)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          onToggleUserStatus(s.userId, s.status);
                          showToast(`Status toggled for ${s.userName}.`);
                        }}
                        className={`font-bold px-3 py-1 rounded-xl text-[10px] transition-colors cursor-pointer ${
                          s.status === 'active'
                            ? 'bg-emerald-100 text-emerald-900 hover:bg-red-100 hover:text-red-900'
                            : 'bg-red-600 text-white hover:bg-emerald-600'
                        }`}
                      >
                        {s.status === 'active' ? 'Active (Click to Lock)' : 'Locked (Click to Unlock)'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Buyer Performance Profiles */}
      {activeTab === 'buyers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Buyer Performance & Risk Profiles</h3>
              <p className="text-xs text-slate-500">
                Monitor buyer refund frequency, dispute activity, chargebacks, and trust health.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-extrabold">
                  <th className="p-3.5 rounded-l-xl">Buyer</th>
                  <th className="p-3.5">Trust Score</th>
                  <th className="p-3.5">Orders</th>
                  <th className="p-3.5">Disputes</th>
                  <th className="p-3.5">Refunds</th>
                  <th className="p-3.5">Chargebacks</th>
                  <th className="p-3.5">Total Spent</th>
                  <th className="p-3.5 rounded-r-xl text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeBuyerProfiles.map((b) => (
                  <tr key={b.userId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={b.avatar}
                          alt={b.userName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{b.userName}</span>
                          <span className="text-[10px] text-slate-500">{b.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-black px-2 py-0.5 rounded text-[11px] ${
                          b.trustScore >= 80
                            ? 'bg-emerald-50 text-emerald-800'
                            : b.trustScore >= 50
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {b.trustScore} / 100
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">{b.completedOrders} completed</td>
                    <td className="p-3.5 font-semibold text-slate-700">{b.disputes}</td>
                    <td className="p-3.5 font-semibold text-slate-700">{b.refundRequests}</td>
                    <td className="p-3.5 font-semibold text-emerald-700">{b.chargebacks}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">${b.totalSpent.toFixed(2)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          onToggleUserStatus(b.userId, b.status);
                          showToast(`Status updated for ${b.userName}.`);
                        }}
                        className={`font-bold px-3 py-1 rounded-xl text-[10px] transition-colors cursor-pointer ${
                          b.status === 'active'
                            ? 'bg-emerald-100 text-emerald-900 hover:bg-red-100 hover:text-red-900'
                            : 'bg-red-600 text-white hover:bg-emerald-600'
                        }`}
                      >
                        {b.status === 'active' ? 'Active' : 'Restricted'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
