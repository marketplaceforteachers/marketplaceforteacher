import React, { useState } from 'react';
import {
  DollarSign,
  Download,
  Printer,
  FileText,
  ShieldCheck,
  Info,
  Building,
  TrendingUp,
} from 'lucide-react';
import { Order, User, AdminFeeSettings } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import { PrintableLetterhead } from '../PrintableLetterhead';

interface TaxSummaryTabProps {
  currentUser: User;
  orders: Order[];
  feeSettings?: AdminFeeSettings;
}

export const TaxSummaryTab: React.FC<TaxSummaryTabProps> = ({ currentUser, orders, feeSettings }) => {
  const [showPrintStatement, setShowPrintStatement] = useState(false);
  const commissionRate = feeSettings?.nationwideCommissionRate ?? COMPANY_INFO.commissionRatePercent ?? 5.0;

  const ordersList = orders || [];
  const sellerOrders = ordersList.filter((o) =>
    o?.items?.some((it) => it.sellerId === currentUser.id)
  );

  const grossSales = sellerOrders.reduce(
    (acc, o) =>
      acc +
      (o?.items || [])
        .filter((it) => it.sellerId === currentUser.id)
        .reduce((sum, it) => sum + (it?.price || 0) * (it?.quantity || 1), 0),
    0
  );

  const platformFees = +(grossSales * (commissionRate / 100)).toFixed(2);
  const netEarnings = +(grossSales - platformFees).toFixed(2);

  const handleDownloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      `OrderNumber,Date,Buyer,Item,GrossAmount,PlatformFee${commissionRate}Pct,NetPayout\n` +
      sellerOrders
        .map(
          (o) =>
            `${o.orderNumber},${o.date},"${o.buyerName}","${o.items[0]?.title}",${o.subtotal},${(
              o.subtotal * (commissionRate / 100)
            ).toFixed(2)},${(o.subtotal * (1 - commissionRate / 100)).toFixed(2)}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MFT_Tax_Report_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Annual Tax & 1099-K Financial Center</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time accounting of your classroom surplus sales, platform fees ({commissionRate}% rate), and tax deduction reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowPrintStatement(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Annual Statement</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-xs font-semibold">Annual Gross Sales (YTD)</span>
          <p className="text-2xl font-extrabold text-blue-900">${grossSales.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400">Total classroom materials sold</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-xs font-semibold">{commissionRate}% Marketplace Service Fees</span>
          <p className="text-2xl font-extrabold text-slate-700">-${platformFees.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400">Zero listing fees applied</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-500 text-xs font-semibold">Net Direct Educator Payout</span>
          <p className="text-2xl font-extrabold text-emerald-600">${netEarnings.toFixed(2)}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Disbursed to Bank via Stripe</span>
        </div>
      </div>

      {/* 1099-K Threshold Progress Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-sm">IRS Form 1099-K Reporting Status</h4>
          </div>
          <span className="text-xs font-bold text-slate-600">
            ${grossSales.toFixed(2)} / $5,000.00 Limit
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, (grossSales / 5000) * 100)}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Under current federal IRS guidelines, casual hobby or classroom material exchanges under the reporting threshold do not require automated 1099-K distribution. You can still download our comprehensive annual ledger for your personal records.
        </p>
      </div>

      {/* IRS Educator Expense Deduction Guide */}
      <div className="bg-blue-50/70 border border-blue-200 p-5 rounded-xl text-xs space-y-2 text-blue-900">
        <h4 className="font-bold text-sm flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-700" />
          <span>IRS Educator Expense Deduction (Form 1040 Line 11)</span>
        </h4>
        <p className="leading-relaxed text-blue-800">
          As a K-12 educator, you can deduct up to <strong>$300 ($600 if married filing jointly and both are educators)</strong> of unreimbursed classroom expenses for books, supplies, science equipment, and computer software purchased on MarketplaceForTeachers.com.
        </p>
      </div>

      {/* Print Statement Modal */}
      {showPrintStatement && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-auto">
            <PrintableLetterhead
              type="tax-report"
              onClose={() => setShowPrintStatement(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
