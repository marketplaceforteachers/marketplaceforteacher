import React, { useState } from 'react';
import {
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CreditCard,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  Info,
  HelpCircle,
  Sparkles,
  Lock,
  FileText,
  X,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { User, Order, SellerPayoutRequest, PayoutMethodType } from '../../types';

interface SellerPayoutsTabProps {
  currentUser: User;
  orders: Order[];
  payoutRequests: SellerPayoutRequest[];
  onRequestWithdrawal: (request: Omit<SellerPayoutRequest, 'id' | 'payoutNumber' | 'requestedAt'>) => void;
  onOpenDisputeCenter?: () => void;
}

export const SellerPayoutsTab: React.FC<SellerPayoutsTabProps> = ({
  currentUser,
  orders = [],
  payoutRequests = [],
  onRequestWithdrawal,
  onOpenDisputeCenter,
}) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<SellerPayoutRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing'>('all');

  // Compute live balances from orders and payouts
  const sellerOrders = orders.filter((o) =>
    o?.items?.some((it) => it.sellerId === currentUser.id)
  );

  const totalLifetimeSales = sellerOrders.reduce(
    (sum, o) => sum + (o.sellerEarnings || o.subtotal || 0),
    0
  );

  const pendingEscrowBalance = sellerOrders
    .filter((o) => o.sellerPayoutStatus === 'Pending' || o.escrowStatus === 'Held')
    .reduce((sum, o) => sum + (o.sellerEarnings || o.subtotal || 0), 0);

  const releasedFromOrders = sellerOrders
    .filter((o) => o.sellerPayoutStatus === 'Released' || o.status === 'Completed' || o.escrowStatus === 'Released')
    .reduce((sum, o) => sum + (o.sellerEarnings || o.subtotal || 0), 0);

  const totalWithdrawnAmount = payoutRequests
    .filter((p) => p.sellerId === currentUser.id && p.status !== 'cancelled' && p.status !== 'failed')
    .reduce((sum, p) => sum + p.amount, 0);

  // Available balance: base earned released minus withdrawn (with minimum floor at 0)
  // Ensure default mock users have realistic available balance
  const availableBalance = Math.max(
    0,
    releasedFromOrders > 0 ? releasedFromOrders - totalWithdrawnAmount : 385.5 - totalWithdrawnAmount > 0 ? 385.5 - totalWithdrawnAmount : 0
  );

  // Withdrawal form state
  const [withdrawMethod, setWithdrawMethod] = useState<PayoutMethodType>('ach');
  const [withdrawAmount, setWithdrawAmount] = useState<string>(
    availableBalance > 0 ? availableBalance.toFixed(2) : '50.00'
  );
  const [accountHolder, setAccountHolder] = useState(currentUser.name || 'Sarah Jenkins');
  const [bankName, setBankName] = useState('First National Bank of Oklahoma');
  const [routingNumber, setRoutingNumber] = useState('103000123');
  const [accountNumber, setAccountNumber] = useState('4829103849');
  const [stripeCard, setStripeCard] = useState('4242');
  const [paypalEmail, setPaypalEmail] = useState(currentUser.email || 'teacher@school.edu');
  const [checkAddress, setCheckAddress] = useState(
    `${currentUser.schoolName || 'Prairie View Elementary'}, Attn: ${currentUser.name}, Oklahoma City, OK 73159`
  );
  const [withdrawError, setWithdrawError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMaxAmount = () => {
    setWithdrawAmount(availableBalance.toFixed(2));
    setWithdrawError('');
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');

    const parsed = parseFloat(withdrawAmount);
    if (isNaN(parsed) || parsed < 5.0) {
      setWithdrawError('Minimum withdrawal amount is $5.00.');
      return;
    }

    if (parsed > availableBalance) {
      setWithdrawError(`Amount cannot exceed available balance of $${availableBalance.toFixed(2)}.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let destDetails: any = {
        accountHolderName: accountHolder,
      };

      if (withdrawMethod === 'ach') {
        destDetails = {
          accountHolderName: accountHolder,
          bankName,
          routingNumber,
          accountNumberLast4: accountNumber.slice(-4),
        };
      } else if (withdrawMethod === 'stripe_instant') {
        destDetails = {
          accountHolderName: accountHolder,
          stripeCardLast4: stripeCard,
          bankName: 'Debit Card (Instant)',
        };
      } else if (withdrawMethod === 'paypal') {
        destDetails = {
          accountHolderName: accountHolder,
          paypalEmail,
        };
      } else {
        destDetails = {
          accountHolderName: accountHolder,
          checkMailingAddress: checkAddress,
        };
      }

      onRequestWithdrawal({
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerEmail: currentUser.email,
        sellerSchool: currentUser.schoolName,
        amount: parsed,
        payoutFee: 0.0,
        netAmount: parsed,
        method: withdrawMethod,
        status: withdrawMethod === 'stripe_instant' ? 'completed' : 'processing',
        estimatedArrival:
          withdrawMethod === 'stripe_instant'
            ? 'Instant (Within 10 mins)'
            : withdrawMethod === 'ach'
            ? '1-2 Business Days'
            : withdrawMethod === 'paypal'
            ? 'Today (Within 2 hours)'
            : '3-5 Business Days (USPS Mail)',
        destinationDetails: destDetails,
        transactionReference: `TRF-${Date.now().toString().slice(-8)}`,
        notes: `Classroom surplus sales withdrawal requested by ${currentUser.name}.`,
      });

      setIsSubmitting(false);
      setIsWithdrawModalOpen(false);
    }, 400);
  };

  const filteredPayouts = payoutRequests.filter((p) => {
    if (filterStatus === 'completed') return p.status === 'completed';
    if (filterStatus === 'processing') return p.status === 'processing' || p.status === 'pending';
    return true;
  });

  return (
    <div id="seller-payouts-dashboard" className="space-y-6">
      {/* Top Banner: Financial Overview Header */}
      <div className="bg-linear-to-r from-blue-950 via-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-800/80 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Escrow Protected & Zero Payout Fees</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Seller Balances & Payout Hub</h2>
            <p className="text-blue-200 text-xs max-w-xl leading-relaxed">
              Track your classroom earnings, view funds held in delivery escrow, and withdraw available funds with 0% bank transfer fees.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="open-withdraw-modal-btn"
              onClick={() => {
                setWithdrawAmount(availableBalance > 0 ? availableBalance.toFixed(2) : '5.00');
                setIsWithdrawModalOpen(true);
              }}
              disabled={availableBalance < 5.0}
              className={`px-5 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                availableBalance >= 5.0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-emerald-900/40 hover:scale-[1.02]'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>Request Withdrawal</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Stat Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-blue-800/60">
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-300">Available for Withdrawal</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">${availableBalance.toFixed(2)}</p>
            <span className="text-[10px] text-emerald-200/80 font-medium">Ready for immediate transfer</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300">Pending in Escrow</span>
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">${pendingEscrowBalance.toFixed(2)}</p>
            <span className="text-[10px] text-amber-200/80 font-medium">Releases on delivery confirmation</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-200">Total Lifetime Sales</span>
              <DollarSign className="w-4 h-4 text-blue-300" />
            </div>
            <p className="text-2xl font-black text-white mt-1">${totalLifetimeSales.toFixed(2)}</p>
            <span className="text-[10px] text-blue-200/80 font-medium">Net after 5% platform fee</span>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Total Withdrawn to Date</span>
              <CheckCircle2 className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-2xl font-black text-white mt-1">${totalWithdrawnAmount.toFixed(2)}</p>
            <span className="text-[10px] text-slate-300 font-medium">{payoutRequests.length} total transfers</span>
          </div>
        </div>
      </div>

      {/* Escrow Timeline Guide & Information Bar */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">How Escrow Payouts Work for Teachers</h4>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              When a buyer purchases your supplies, payment is safely locked in escrow. Once you upload tracking and delivery is verified (or buyer confirms receipt), funds move to your <strong>Available Balance</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-[11px]">
            0% Withdrawal Fee
          </span>
          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md text-[11px]">
            $5.00 Min Payout
          </span>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Withdrawal & Payout History</h3>
            <p className="text-slate-500 text-xs">Complete audit trail of all disbursements and bank transfers</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-200/80 p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({payoutRequests.length})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterStatus === 'completed'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus('processing')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterStatus === 'processing'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Processing
              </button>
            </div>
          </div>
        </div>

        {filteredPayouts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Wallet className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No withdrawal requests found</p>
            <p className="text-xs text-slate-400">
              When you submit a withdrawal from your available balance, it will appear in this ledger.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Payout #</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Payout Method & Destination</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4 font-bold text-slate-900">Net Transferred</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">{payout.payoutNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {new Date(payout.requestedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(payout.requestedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {payout.method === 'ach' && (
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Building className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {payout.method === 'stripe_instant' && (
                          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <CreditCard className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {payout.method === 'paypal' && (
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {payout.method === 'check' && (
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">
                            {payout.method === 'ach' && 'Direct ACH Deposit'}
                            {payout.method === 'stripe_instant' && 'Stripe Instant Payout'}
                            {payout.method === 'paypal' && 'PayPal Transfer'}
                            {payout.method === 'check' && 'Mailed District Check'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">
                            {payout.destinationDetails.bankName && `${payout.destinationDetails.bankName} `}
                            {payout.destinationDetails.accountNumberLast4 &&
                              `•••• ${payout.destinationDetails.accountNumberLast4}`}
                            {payout.destinationDetails.stripeCardLast4 &&
                              `Card ending in ${payout.destinationDetails.stripeCardLast4}`}
                            {payout.destinationDetails.paypalEmail && payout.destinationDetails.paypalEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">${payout.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">$0.00</td>
                    <td className="py-3 px-4 font-black text-slate-950 text-sm">${payout.netAmount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {payout.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                      )}
                      {payout.status === 'processing' && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                          <span>In Transit</span>
                        </span>
                      )}
                      {payout.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(payout)}
                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WITHDRAWAL REQUEST MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
            <div className="bg-linear-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-5 border-b border-blue-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Request Seller Withdrawal</h3>
                  <p className="text-blue-200 text-xs">Direct funds transfer from your classroom sales balance</p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {withdrawError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{withdrawError}</span>
                </div>
              )}

              {/* Balance summary card */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 block">Available for Withdrawal</span>
                  <span className="text-2xl font-black text-emerald-950">${availableBalance.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleMaxAmount}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  Withdraw All
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Withdrawal Amount ($ USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-base">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="5.00"
                    max={availableBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value);
                      setWithdrawError('');
                    }}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 text-base focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Minimum payout: $5.00 • 100% of requested amount will be disbursed.</p>
              </div>

              {/* Payout Method Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Select Payout Method *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('ach')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      withdrawMethod === 'ach'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span>Direct ACH</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">1-2 days • $0 Fee</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('stripe_instant')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      withdrawMethod === 'stripe_instant'
                        ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span>Instant Card</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Instant • $0 Fee</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('paypal')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      withdrawMethod === 'paypal'
                        ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                      <span>PayPal</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Within 2 hrs • $0 Fee</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('check')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      withdrawMethod === 'check'
                        ? 'border-slate-800 bg-slate-100 ring-1 ring-slate-800'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Mail className="w-4 h-4 text-slate-700" />
                      <span>Mailed Check</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">3-5 days • $0 Fee</p>
                  </button>
                </div>
              </div>

              {/* Dynamic Destination Inputs based on Method */}
              {withdrawMethod === 'ach' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Bank Account Details (US Checking/Savings)</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Holder Full Name</label>
                    <input
                      type="text"
                      required
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        required
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Routing # (9 digits)</label>
                      <input
                        type="text"
                        required
                        maxLength={9}
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              {withdrawMethod === 'stripe_instant' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-purple-50/80 border border-purple-200">
                  <div className="font-bold text-purple-950 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                    <span>Instant Debit Card Payout</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Debit Card Number (Last 4 digits)</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={stripeCard}
                      onChange={(e) => setStripeCard(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono text-center tracking-widest font-bold"
                    />
                  </div>
                  <p className="text-[10px] text-purple-800">
                    Transferred instantly through Stripe Connect direct rails to your linked Visa/Mastercard educator debit card.
                  </p>
                </div>
              )}

              {withdrawMethod === 'paypal' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                    <span>PayPal Account Destination</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">PayPal Verified Email</label>
                    <input
                      type="email"
                      required
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              )}

              {withdrawMethod === 'check' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-700" />
                    <span>Mailing Destination (School or District Office)</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mailing Address</label>
                    <textarea
                      rows={2}
                      required
                      value={checkAddress}
                      onChange={(e) => setCheckAddress(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Fee & Net Transfer Summary */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Gross Payout Request:</span>
                  <span className="font-semibold">${(parseFloat(withdrawAmount) || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>Platform Payout Fee:</span>
                  <span>$0.00 (Free)</span>
                </div>
                <div className="flex items-center justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-100">
                  <span>Total Net Disbursed:</span>
                  <span className="text-emerald-700">${(parseFloat(withdrawAmount) || 0).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Transfer...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Confirm & Disburse ${(parseFloat(withdrawAmount) || 0).toFixed(2)}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT / PRINTABLE INVOICE MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative">
            <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">Official Payout Transfer Voucher</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="text-center pb-3 border-b border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  MarketplaceForTeachers.com Treasury
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-1">${selectedReceipt.netAmount.toFixed(2)}</h4>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px] mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Transfer Verified & Disbursed</span>
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Payout Reference #:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.payoutNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-blue-900">{selectedReceipt.transactionReference}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date Disbursed:</span>
                  <span className="font-bold text-slate-800">
                    {new Date(selectedReceipt.requestedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.sellerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">School Affiliation:</span>
                  <span className="font-medium text-slate-800">{selectedReceipt.sellerSchool || 'Classroom Educator'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Disbursement Method:</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedReceipt.method}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-snug">
                This document serves as an official accounting receipt for educator income records and IRS Form 1099-K reconciliation.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
