import React, { useState } from 'react';
import { Order } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import {
  Printer,
  Download,
  ShieldCheck,
  QrCode,
  Building,
  CheckCircle2,
  FileText,
  Award,
  BadgePercent,
  X,
} from 'lucide-react';

interface PrintableLetterheadProps {
  order?: Order;
  type?: 'invoice' | 'statement' | 'tax-report' | 'purchase-order';
  onClose?: () => void;
}

export const PrintableLetterhead: React.FC<PrintableLetterheadProps> = ({
  order,
  type: initialType = 'invoice',
  onClose,
}) => {
  const [docType, setDocType] = useState<'invoice' | 'purchase-order' | 'tax-cert' | 'packing-slip'>(
    initialType === 'purchase-order' ? 'purchase-order' : 'invoice'
  );

  const handlePrint = () => {
    window.print();
  };

  const sampleOrder: Order = order || {
    id: 'ord-sample',
    orderNumber: 'MFT-2026-8942',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    buyerId: 'usr-teacher-01',
    buyerName: 'Sarah Jenkins, M.Ed.',
    buyerEmail: 'sjenkins@okcps.org',
    items: [
      {
        productId: 'prod-01',
        title: 'Complete Crayola Bulk Classroom Marker Pack (200ct Broad Line)',
        price: 34.00,
        quantity: 1,
        shippingCost: 6.50,
        shippingMethod: 'usps',
        image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=300&q=80',
        sellerId: 'usr-teacher-02',
        sellerName: 'David Martinez (Dallas ISD)',
      },
      {
        productId: 'prod-05',
        title: 'Fellowes Heavy-Duty Classroom Thermal Laminator (12.5-inch)',
        price: 42.00,
        quantity: 1,
        shippingCost: 7.00,
        shippingMethod: 'ups',
        image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=300&q=80',
        sellerId: 'usr-teacher-01',
        sellerName: 'Sarah Jenkins, M.Ed.',
      },
    ],
    subtotal: 76.00,
    shippingTotal: 13.50,
    taxTotal: 6.80,
    discountTotal: 5.00,
    commissionFee: 3.80,
    sellerEarnings: 72.20,
    total: 91.30,
    paymentMethod: 'stripe',
    paymentStatus: 'Paid & Certified',
    status: 'Delivered / Verified',
    stateTaxRate: 8.95,
    stateName: 'Oklahoma',
    carrier: 'USPS Priority Commercial Mail',
    trackingNumber: '9400 1118 9956 2948 2103 41',
    shippingAddress: {
      fullName: 'Sarah Jenkins, M.Ed. (Attn: STEM Lab Room 204)',
      schoolName: 'Prairie View Elementary School (OKCPS)',
      addressLine1: '9905 S Pennsylvania Ave Ste A',
      city: 'Oklahoma City',
      state: 'OK',
      zip: '73159',
      phone: '(405) 555-8322',
    },
    orderNotes: 'Official classroom instructional materials order for 2026-2027 academic session.',
  };

  const currentOrder = order || sampleOrder;

  const getDocumentTitle = () => {
    switch (docType) {
      case 'purchase-order':
        return 'SCHOOL DISTRICT PURCHASE ORDER & REQUISITION';
      case 'tax-cert':
        return 'IRS FORM 1040 LINE 11 EDUCATOR EXPENSE CERTIFICATION';
      case 'packing-slip':
        return 'CERTIFIED EDUCATOR PACKING SLIP & DISBURSEMENT';
      default:
        return 'OFFICIAL EDUCATOR TAX INVOICE & RECEIPT';
    }
  };

  return (
    <div id="printable-letterhead-root" className="bg-slate-100 p-2 sm:p-6 rounded-2xl max-w-4xl mx-auto space-y-4">
      {/* Non-Printable Top Action Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider">Format:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setDocType('invoice')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                docType === 'invoice'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School Tax Invoice
            </button>
            <button
              onClick={() => setDocType('purchase-order')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                docType === 'purchase-order'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              District PO Requisition
            </button>
            <button
              onClick={() => setDocType('tax-cert')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                docType === 'tax-cert'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IRS 1040 Certificate
            </button>
            <button
              onClick={() => setDocType('packing-slip')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                docType === 'packing-slip'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Packing Slip
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-extrabold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Certified Letterhead</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* THE OFFICIAL PRINTABLE LETTERHEAD SHEET */}
      <div
        id="printable-letterhead-paper"
        className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-xl border-4 border-double border-slate-300 relative space-y-6 font-sans print:shadow-none print:border-none print:p-0"
      >
        {/* TOP EMBOSSED GOLD/NAVY BAR */}
        <div className="h-2 w-full bg-linear-to-r from-blue-950 via-blue-700 to-amber-500 rounded-full mb-4" />

        {/* OFFICIAL LETTERHEAD HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center font-black text-xl tracking-tight shadow-xs border border-amber-400/40">
                M
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950">
                  Marketplace<span className="text-blue-600">For</span>Teachers
                  <span className="text-xs text-red-600 font-bold ml-1 uppercase">.com</span>
                </h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  USA Verified Educator Resource & Classroom Exchange
                </p>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 leading-relaxed sm:border-l sm:border-slate-200 sm:pl-6">
            <p className="font-black text-slate-900 text-sm">{COMPANY_INFO.legalName}</p>
            <p>{COMPANY_INFO.address}</p>
            <p>{COMPANY_INFO.city}, {COMPANY_INFO.state} {COMPANY_INFO.zip}, USA</p>
            <p className="font-semibold text-slate-800">
              Tel: {COMPANY_INFO.phone} • Email: <strong className="text-blue-900">info@marketplaceforteachers.com</strong>
            </p>
            <p className="text-blue-700 font-bold text-[11px]">{COMPANY_INFO.website}</p>
          </div>
        </div>

        {/* DOCUMENT TYPE BANNER */}
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-lg flex items-center justify-between shadow-xs">
          <span className="font-black text-xs sm:text-sm tracking-wide uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            {getDocumentTitle()}
          </span>
          <span className="text-[11px] font-mono font-bold text-amber-300">
            REF: #{currentOrder.orderNumber}
          </span>
        </div>

        {/* METADATA & RECIPIENT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {/* Billed To / School Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
              Educator & Campus Requisition To:
            </span>
            <p className="font-extrabold text-slate-900 text-sm">{currentOrder.shippingAddress.fullName}</p>
            {currentOrder.shippingAddress.schoolName && (
              <p className="font-bold text-blue-900 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                {currentOrder.shippingAddress.schoolName}
              </p>
            )}
            <p className="text-slate-700">{currentOrder.shippingAddress.addressLine1}</p>
            <p className="text-slate-700">
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zip}, USA
            </p>
            <div className="pt-1 border-t border-slate-200 text-slate-500 space-y-0.5 text-[11px]">
              <p>Contact Phone: {currentOrder.shippingAddress.phone}</p>
              <p>School District Email: {currentOrder.buyerEmail}</p>
            </div>
          </div>

          {/* Transaction Certification Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-right text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Document Date:</span>
              <span className="font-bold text-slate-900">{currentOrder.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Order Ref #:</span>
              <span className="font-mono font-extrabold text-blue-950">{currentOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10.5px]">
                {currentOrder.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Carrier Fulfillment:</span>
              <span className="font-semibold text-slate-800">{currentOrder.carrier || 'USPS Priority Mail'}</span>
            </div>
            {currentOrder.trackingNumber && (
              <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200">
                <span className="text-slate-500">Tracking Code:</span>
                <span className="font-mono font-bold text-slate-900">{currentOrder.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* ITEMIZED TABLE */}
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-bold">
              <th className="p-3 rounded-l-lg">Item Description & Classroom Listing</th>
              <th className="p-3 text-center">Verified Seller / District</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right rounded-r-lg">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentOrder.items.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-800">
                  {item.title}
                  <span className="block text-[10px] text-slate-400 font-normal">
                    Fulfillment: {item.shippingMethod?.toUpperCase() || 'USPS'} Verified Delivery
                  </span>
                </td>
                <td className="p-3 text-center text-slate-600 font-medium">{item.sellerName}</td>
                <td className="p-3 text-center font-bold text-slate-900">{item.quantity}</td>
                <td className="p-3 text-right font-mono text-slate-700">${item.price.toFixed(2)}</td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FINANCIAL SUMMARY & ESCROW VERIFICATION SEAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-300">
          {/* Official Verification Seal & QR Box */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="w-20 h-20 bg-white border border-slate-300 p-1.5 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-xs">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-black text-slate-900 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Certified Escrow Transaction</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-snug">
                Authenticated by MarketplaceForTeachers.com. Retain for school board audit & state tax exemption records.
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                AUTH-HASH: 8F92-OKC-{currentOrder.orderNumber}
              </p>
            </div>
          </div>

          {/* Totals Calculation */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Instructional Materials Subtotal:</span>
              <span className="font-mono font-semibold text-slate-900">${currentOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping & District Delivery:</span>
              <span className="font-mono font-semibold text-slate-900">${currentOrder.shippingTotal.toFixed(2)}</span>
            </div>
            {currentOrder.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Educator Appreciation Discount:</span>
                <span className="font-mono">-${currentOrder.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>
                State Sales Tax ({currentOrder.stateName || 'State'} {currentOrder.stateTaxRate || 8.95}%):
              </span>
              <span className="font-mono font-semibold text-slate-900">${currentOrder.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-blue-950 pt-2 border-t-2 border-slate-900">
              <span>Grand Total Paid (USD):</span>
              <span className="font-mono text-blue-950">${currentOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* OFFICIAL SIGNATURE & TAX ATTESTATION */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-700">Educator Expense Tax Compliance Note:</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Under Section 62(a)(2)(D) of the Internal Revenue Code, eligible K-12 educators may deduct up to $300 of out-of-pocket qualified classroom expenses on IRS Form 1040.
            </p>
          </div>

          <div className="space-y-3">
            <div className="border-b border-slate-400 pb-1 flex justify-between items-end">
              <span className="font-serif italic text-slate-700 text-sm font-semibold">Sarah Jenkins, M.Ed.</span>
              <span className="text-[10px] text-slate-400 font-mono">{currentOrder.date}</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              Authorized Educator Signature & Date
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 text-center text-[10.5px] text-slate-400 space-y-0.5">
          <p className="font-semibold text-slate-600">
            MarketplaceForTeachers.com, LLC • 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159
          </p>
          <p>
            Helpline: (405) 555-8322 • Email: <strong className="text-slate-700">info@marketplaceforteachers.com</strong> • Web: https://marketplaceforteachers.com
          </p>
        </div>
      </div>
    </div>
  );
};
