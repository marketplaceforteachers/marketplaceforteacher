import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Truck,
  User,
  Package,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  PlusCircle,
  X,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import {
  DisputeCase,
  DisputeReason,
  DisputeStatus,
  DisputeEvidence,
  Order,
  User as UserType,
} from '../types';

interface DisputeCenterViewProps {
  disputes: DisputeCase[];
  orders: Order[];
  currentUser: UserType;
  onOpenDispute: (disputeData: {
    orderId: string;
    reason: DisputeReason;
    reasonTitle: string;
    detailedExplanation: string;
    requestedResolution: 'full_refund' | 'partial_refund' | 'replacement';
    requestedAmount?: number;
    evidence: DisputeEvidence[];
  }) => void;
  onSellerReply: (
    disputeId: string,
    reply: string,
    evidence?: DisputeEvidence[],
    trackingProof?: { carrier?: string; trackingNumber?: string; receiptUrl?: string; notes?: string }
  ) => void;
  onAdminResolve: (
    disputeId: string,
    decision:
      | 'Approve Buyer - Full Refund'
      | 'Approve Buyer - Partial Refund'
      | 'Approve Seller - Release Payout'
      | 'Reject Claim'
      | 'Request More Information',
    notes: string,
    refundAmount?: number
  ) => void;
  onNavigateHome?: () => void;
}

export const DisputeCenterView: React.FC<DisputeCenterViewProps> = ({
  disputes = [],
  orders = [],
  currentUser,
  onOpenDispute,
  onSellerReply,
  onAdminResolve,
  onNavigateHome,
}) => {
  const safeDisputes = Array.isArray(disputes) ? disputes : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(
    safeDisputes.length > 0 ? safeDisputes[0] : null
  );
  const [showNewDisputeModal, setShowNewDisputeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New Dispute Form State
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [disputeReason, setDisputeReason] = useState<DisputeReason>('item_not_received');
  const [detailedExplanation, setDetailedExplanation] = useState('');
  const [requestedResolution, setRequestedResolution] = useState<
    'full_refund' | 'partial_refund' | 'replacement'
  >('full_refund');
  const [requestedAmount, setRequestedAmount] = useState<string>('');
  const [evidenceFiles, setEvidenceFiles] = useState<
    { name: string; url: string; type: 'photo' | 'receipt' | 'document'; description: string }[]
  >([]);
  const [tempFileUrl, setTempFileUrl] = useState('');
  const [tempFileName, setTempFileName] = useState('');
  const [tempFileDesc, setTempFileDesc] = useState('');

  // Seller Reply State
  const [sellerReplyText, setSellerReplyText] = useState('');
  const [sellerProofCarrier, setSellerProofCarrier] = useState('USPS Priority Mail');
  const [sellerProofTracking, setSellerProofTracking] = useState('');
  const [sellerProofReceiptUrl, setSellerProofReceiptUrl] = useState('');
  const [sellerProofNotes, setSellerProofNotes] = useState('');

  // Admin Arbitration State
  const [adminDecision, setAdminDecision] = useState<
    | 'Approve Buyer - Full Refund'
    | 'Approve Buyer - Partial Refund'
    | 'Approve Seller - Release Payout'
    | 'Reject Claim'
    | 'Request More Information'
  >('Approve Buyer - Full Refund');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminRefundAmount, setAdminRefundAmount] = useState<string>('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Filter disputes according to user role
  const filteredDisputes = safeDisputes.filter((d) => {
    if (!d) return false;
    if (currentUser?.role === 'admin') {
      // Admin sees all
    } else if (currentUser?.role === 'teacher') {
      // Teacher sees if they are buyer or seller
      if (d.buyerId !== currentUser?.id && d.sellerId !== currentUser?.id) return false;
    } else {
      // Guest or buyer sees if they are buyer
      if (d.buyerId !== currentUser?.id) return false;
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'open' && (d.status === 'Open' || d.status === 'Under Review' || d.status === 'Awaiting Seller' || d.status === 'Awaiting Buyer')) {
        // match
      } else if (statusFilter === 'resolved' && (d.status || '').startsWith('Resolved')) {
        // match
      } else if (statusFilter === 'rejected' && (d.status || '').startsWith('Closed')) {
        // match
      } else if (d.status !== statusFilter) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = (d.disputeNumber || '').toLowerCase().includes(q) || (d.orderNumber || '').toLowerCase().includes(q);
      const matchBuyer = (d.buyerName || '').toLowerCase().includes(q);
      const matchSeller = (d.sellerName || '').toLowerCase().includes(q);
      const matchReason = (d.reasonTitle || '').toLowerCase().includes(q) || (d.detailedExplanation || '').toLowerCase().includes(q);
      if (!matchNumber && !matchBuyer && !matchSeller && !matchReason) return false;
    }

    return true;
  });

  // Eligible orders for opening a new dispute (User is buyer, order not already disputed, paid or shipped or delivered)
  const eligibleOrders = safeOrders.filter((o) => {
    if (!o) return false;
    if (o.buyerId !== currentUser?.id) return false;
    const existingDispute = safeDisputes.some((d) => d.orderId === o.id);
    return !existingDispute && o.status !== 'Cancelled' && o.status !== 'Pending Payment';
  });

  const selectedOrderObj = safeOrders.find((o) => o.id === selectedOrderId);

  const handleAddEvidence = () => {
    if (!tempFileUrl.trim() && !tempFileName.trim()) return;
    setEvidenceFiles((prev) => [
      ...prev,
      {
        name: tempFileName.trim() || 'evidence_upload.jpg',
        url:
          tempFileUrl.trim() ||
          'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
        type: 'photo',
        description: tempFileDesc.trim() || 'Uploaded proof documentation',
      },
    ]);
    setTempFileUrl('');
    setTempFileName('');
    setTempFileDesc('');
  };

  const handleOpenDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) return;

    const reasonTitles: Record<DisputeReason, string> = {
      item_not_received: 'Item Not Received / Lost in Transit',
      wrong_item: 'Incorrect Item / Wrong Grade Level Shipped',
      significantly_different: 'Item Significantly Not As Described',
      damaged_shipment: 'Item Damaged in Transit',
      missing_parts: 'Missing Parts, Pieces, or Volumes',
      unauthorized_transaction: 'Unauthorized Charge Inquiry',
    };

    const formattedEvidence: DisputeEvidence[] = evidenceFiles.map((f, i) => ({
      id: `ev-new-${Date.now()}-${i}`,
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      uploaderRole: 'buyer',
      type: f.type,
      fileUrl: f.url,
      fileName: f.name,
      description: f.description,
      timestamp: new Date().toLocaleString(),
    }));

    onOpenDispute({
      orderId: order.id,
      reason: disputeReason,
      reasonTitle: reasonTitles[disputeReason],
      detailedExplanation,
      requestedResolution,
      requestedAmount: requestedAmount ? parseFloat(requestedAmount) : undefined,
      evidence: formattedEvidence,
    });

    setActionSuccessToast(
      `Dispute opened for Order #${order.orderNumber}. Payout paused and order placed Under Review.`
    );
    setTimeout(() => setActionSuccessToast(null), 5000);

    setShowNewDisputeModal(false);
    setSelectedOrderId('');
    setDetailedExplanation('');
    setEvidenceFiles([]);
  };

  const handleSellerReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !sellerReplyText.trim()) return;

    const trackingProof =
      sellerProofTracking.trim() || sellerProofReceiptUrl.trim()
        ? {
            carrier: sellerProofCarrier,
            trackingNumber: sellerProofTracking.trim() || undefined,
            receiptUrl: sellerProofReceiptUrl.trim() || undefined,
            notes: sellerProofNotes.trim() || undefined,
          }
        : undefined;

    onSellerReply(selectedDispute.id, sellerReplyText.trim(), undefined, trackingProof);

    setActionSuccessToast('Your response and proof have been submitted to the dispute record.');
    setTimeout(() => setActionSuccessToast(null), 5000);
    setSellerReplyText('');
  };

  const handleAdminDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;

    const refundAmt =
      adminDecision === 'Approve Buyer - Partial Refund' && adminRefundAmount
        ? parseFloat(adminRefundAmount)
        : adminDecision === 'Approve Buyer - Full Refund'
        ? selectedDispute.disputeAmount
        : undefined;

    onAdminResolve(selectedDispute.id, adminDecision, adminNotes, refundAmt);

    setActionSuccessToast(`Decision logged: ${adminDecision}. Activity log and order state updated.`);
    setTimeout(() => setActionSuccessToast(null), 5000);
    setAdminNotes('');
  };

  return (
    <div id="dispute-center-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{actionSuccessToast}</span>
          </div>
          <button
            onClick={() => setActionSuccessToast(null)}
            className="text-white hover:text-emerald-200 font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black px-3.5 py-1 rounded-full">
            <Scale className="w-3.5 h-3.5" />
            <span>PAYMENT PROTECTION ARBITRATION CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Dispute & Resolution Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All order disputes pause seller payout automatically. Upload evidence, communicate directly with educators, and resolve claims with complete audit trail logging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {eligibleOrders.length > 0 && (
            <button
              id="open-new-dispute-btn"
              onClick={() => {
                setSelectedOrderId(eligibleOrders[0]?.id || '');
                setShowNewDisputeModal(true);
              }}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue / Open Dispute</span>
            </button>
          )}

          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left List + Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dispute List & Filters */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by dispute #, order #, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
              {[
                { id: 'all', label: 'All Cases' },
                { id: 'open', label: 'Active / Under Review' },
                { id: 'resolved', label: 'Resolved' },
                { id: 'rejected', label: 'Closed' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === filter.id
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-3">
            {filteredDisputes.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 text-xs shadow-xs">
                <Scale className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800">No disputes found</h4>
                <p className="text-slate-500">
                  {currentUser.role === 'admin'
                    ? 'There are currently no matching dispute cases in the system.'
                    : 'You have no open disputes on your purchases or sales.'}
                </p>
              </div>
            ) : (
              filteredDisputes.map((dispute) => {
                const isSelected = selectedDispute?.id === dispute.id;
                const isResolved = dispute.status.startsWith('Resolved');
                const isUnderReview = dispute.status === 'Under Review' || dispute.status === 'Open';

                return (
                  <div
                    key={dispute.id}
                    onClick={() => setSelectedDispute(dispute)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 shadow-md ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-[11px]">
                        {dispute.disputeNumber}
                      </span>
                      <span
                        className={`font-black px-2 py-0.5 rounded-full text-[10px] ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isUnderReview
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {dispute.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 line-clamp-1">{dispute.reasonTitle}</h4>

                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Order: #{dispute.orderNumber}</span>
                      <span className="font-extrabold text-blue-900">
                        ${dispute.disputeAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Buyer: {dispute.buyerName.split(' ')[0]}</span>
                      <span>Seller: {dispute.sellerName.split(' ')[0]}</span>
                      <span>{dispute.createdAt.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Dispute Case Details & Arbitration Controls */}
        <div className="lg:col-span-7 space-y-6">
          {selectedDispute ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              {/* Header Bar */}
              <div className="bg-slate-900 text-white p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-400" />
                    <span className="font-mono font-bold text-sm">{selectedDispute.disputeNumber}</span>
                  </div>

                  <span
                    className={`font-extrabold px-3 py-1 rounded-full text-[11px] ${
                      selectedDispute.status.startsWith('Resolved')
                        ? 'bg-emerald-500 text-white'
                        : selectedDispute.status === 'Under Review'
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    Status: {selectedDispute.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-slate-300 text-[11px]">
                  <span>
                    Order: <strong className="text-white">#{selectedDispute.orderNumber}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Dispute Amount: <strong className="text-emerald-400">${selectedDispute.disputeAmount.toFixed(2)}</strong>
                  </span>
                  <span>•</span>
                  <span>Opened: {selectedDispute.createdAt}</span>
                </div>
              </div>

              {/* Dispute Body */}
              <div className="p-6 space-y-6">
                {/* Payout Freeze Banner */}
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-start gap-2.5 text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Payment Protection Guarantee Active:</strong>
                    <p className="text-amber-900 mt-0.5 leading-relaxed text-[11px]">
                      Seller payout is <strong>locked on hold in escrow</strong>. Funds will not be disbursed until this dispute case is mutually resolved or arbitrated by platform administration.
                    </p>
                  </div>
                </div>

                {/* Claim Breakdown Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Buyer's Claim & Statement</span>
                    </h4>
                    <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      Requested: {selectedDispute.requestedResolution.replace('_', ' ').toUpperCase()}
                      {selectedDispute.requestedAmount ? ` ($${selectedDispute.requestedAmount.toFixed(2)})` : ''}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed space-y-1">
                    <p className="font-bold text-slate-900">{selectedDispute.reasonTitle}</p>
                    <p className="text-slate-600 text-xs">{selectedDispute.detailedExplanation}</p>
                  </div>

                  {/* Buyer Uploaded Evidence */}
                  {selectedDispute.buyerEvidence.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="font-bold text-slate-700 text-[11px] block">
                        Buyer Uploaded Documentation ({selectedDispute.buyerEvidence.length} items):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedDispute.buyerEvidence.map((ev) => (
                          <div
                            key={ev.id}
                            className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-xs"
                          >
                            <img
                              src={ev.fileUrl}
                              alt={ev.fileName}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div className="overflow-hidden">
                              <p className="font-bold text-slate-900 truncate">{ev.fileName}</p>
                              <p className="text-[10px] text-slate-500 truncate">{ev.description || 'Photo proof'}</p>
                              <a
                                href={ev.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-blue-600 hover:underline font-bold flex items-center gap-0.5"
                              >
                                View full image <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Seller Reply Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Seller's Response & Counter-Proof</span>
                    </h4>
                    <span className="text-slate-500 text-[11px]">
                      Seller: <strong>{selectedDispute.sellerName}</strong>
                    </span>
                  </div>

                  {selectedDispute.sellerReply ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 space-y-2">
                      <p className="leading-relaxed">{selectedDispute.sellerReply}</p>
                      {selectedDispute.sellerReplyAt && (
                        <p className="text-[10px] text-slate-400">Replied on: {selectedDispute.sellerReplyAt}</p>
                      )}

                      {/* Tracking / Drop-off proof */}
                      {selectedDispute.sellerTrackingProof && (
                        <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 text-[11px] text-emerald-950 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <span>
                                {selectedDispute.sellerTrackingProof.carrier}:{' '}
                                <strong>{selectedDispute.sellerTrackingProof.trackingNumber || 'Receipt Attached'}</strong>
                              </span>
                              {selectedDispute.sellerTrackingProof.notes && (
                                <p className="text-emerald-800 text-[10px]">
                                  {selectedDispute.sellerTrackingProof.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          {selectedDispute.sellerTrackingProof.receiptUrl && (
                            <a
                              href={selectedDispute.sellerTrackingProof.receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 font-bold hover:underline shrink-0 text-[10px]"
                            >
                              View Drop-Off Receipt →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-slate-500 space-y-1">
                      <Clock className="w-5 h-5 text-amber-500 mx-auto" />
                      <p className="font-bold text-slate-700">Awaiting seller response</p>
                      <p className="text-[11px]">The teacher seller has 48 hours to reply with evidence or agree to resolution.</p>
                    </div>
                  )}

                  {/* Seller Reply Form (if currentUser is seller or admin) */}
                  {(currentUser.id === selectedDispute.sellerId || currentUser.role === 'admin') &&
                    !selectedDispute.status.startsWith('Resolved') && (
                      <form onSubmit={handleSellerReplySubmit} className="pt-2 space-y-3 border-t border-slate-200">
                        <label className="block font-bold text-slate-800 text-xs">
                          {currentUser.role === 'admin' ? 'Add Official Note to Case' : 'Post Seller Reply & Evidence:'}
                        </label>
                        <textarea
                          rows={3}
                          value={sellerReplyText}
                          onChange={(e) => setSellerReplyText(e.target.value)}
                          placeholder="Provide explanation, offer replacement item, or agree to refund..."
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
                          required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Carrier (e.g. USPS Priority Mail)"
                            value={sellerProofCarrier}
                            onChange={(e) => setSellerProofCarrier(e.target.value)}
                            className="p-2 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Tracking Number or Drop-off Ref #"
                            value={sellerProofTracking}
                            onChange={(e) => setSellerProofTracking(e.target.value)}
                            className="p-2 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Seller Statement</span>
                        </button>
                      </form>
                    )}
                </div>

                {/* Admin Arbitration Decision Box (if currentUser is Admin) */}
                {currentUser.role === 'admin' && (
                  <div className="bg-purple-50/80 p-5 rounded-2xl border border-purple-200 space-y-4 text-purple-950">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-purple-700" />
                        <h4 className="font-extrabold text-sm text-purple-950">
                          Administrative Arbitration & Fund Control
                        </h4>
                      </div>
                      <span className="bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        Admin Only
                      </span>
                    </div>

                    <form onSubmit={handleAdminDecisionSubmit} className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          Select Arbitration Decision:
                        </label>
                        <select
                          value={adminDecision}
                          onChange={(e: any) => setAdminDecision(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-purple-300 bg-white text-xs font-bold focus:outline-hidden"
                        >
                          <option value="Approve Buyer - Full Refund">
                            Approve Buyer - Issue 100% Full Refund (${selectedDispute.disputeAmount.toFixed(2)})
                          </option>
                          <option value="Approve Buyer - Partial Refund">
                            Approve Buyer - Issue Partial Discount Refund
                          </option>
                          <option value="Approve Seller - Release Payout">
                            Approve Seller - Release Escrow Payout to Teacher
                          </option>
                          <option value="Request More Information">
                            Request More Information from Buyer / Seller
                          </option>
                          <option value="Reject Claim">
                            Reject Claim - Close Dispute without Refund
                          </option>
                        </select>
                      </div>

                      {adminDecision === 'Approve Buyer - Partial Refund' && (
                        <div>
                          <label className="block font-bold text-slate-800 text-xs mb-1">
                            Partial Refund Amount ($ USD):
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            max={selectedDispute.disputeAmount}
                            placeholder="e.g. 35.00"
                            value={adminRefundAmount}
                            onChange={(e) => setAdminRefundAmount(e.target.value)}
                            className="w-full p-2 rounded-lg border border-purple-300 bg-white text-xs font-bold"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          Official Decision Summary / Explanation (Logged to Audit Trail):
                        </label>
                        <textarea
                          rows={2}
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Provide detailed justification for decision..."
                          className="w-full p-2.5 text-xs rounded-xl border border-purple-300 bg-white focus:outline-hidden"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-black py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Execute Decision & Update Escrow Ledger</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Audit Trail & History Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                    Logged Activity & Escrow History Trail ({selectedDispute.history.length} events)
                  </h4>

                  <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                    {selectedDispute.history.map((log, idx) => (
                      <div key={idx} className="relative space-y-0.5 text-xs pb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute -left-[21px] top-1 border-2 border-white ring-2 ring-blue-100" />
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{log.action}</span>
                          <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{log.note}</p>
                        {log.fundChange && (
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-0.5">
                            {log.fundChange}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
              <Scale className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">Select a dispute case</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose a case from the list on the left to review claims, evidence, and arbitration actions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Dispute Modal */}
      {showNewDisputeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Open a Protected Order Dispute</h3>
                  <p className="text-slate-500 text-[11px]">
                    100% Escrow Protection: Payout is paused immediately upon submission.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewDisputeModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOpenDisputeSubmit} className="space-y-4">
              {/* Order Select */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Order to Dispute:</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs focus:outline-hidden focus:border-blue-600"
                  required
                >
                  {eligibleOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      Order #{o.orderNumber} - {o.items[0]?.title.slice(0, 35)}... (${o.total.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dispute Reason */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Reason for Dispute:</label>
                <select
                  value={disputeReason}
                  onChange={(e: any) => setDisputeReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs focus:outline-hidden focus:border-blue-600"
                >
                  <option value="item_not_received">Item Not Received / Lost in Transit</option>
                  <option value="wrong_item">Wrong Item / Incorrect Grade Level Shipped</option>
                  <option value="significantly_different">Significantly Different from Description</option>
                  <option value="damaged_shipment">Damaged During Shipment / Cracks / Tears</option>
                  <option value="missing_parts">Missing Parts, Pieces, or Volumes</option>
                  <option value="unauthorized_transaction">Other Inquiry</option>
                </select>
              </div>

              {/* Detailed Explanation */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Detailed Explanation (What happened?):
                </label>
                <textarea
                  rows={4}
                  value={detailedExplanation}
                  onChange={(e) => setDetailedExplanation(e.target.value)}
                  placeholder="Describe what arrived, what was missing or broken, or tracking discrepancy..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-blue-600 bg-slate-50"
                  required
                />
              </div>

              {/* Desired Resolution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Desired Resolution:</label>
                  <select
                    value={requestedResolution}
                    onChange={(e: any) => setRequestedResolution(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-xs focus:outline-hidden"
                  >
                    <option value="full_refund">Full 100% Escrow Refund</option>
                    <option value="partial_refund">Partial Refund (Keep item with discount)</option>
                    <option value="replacement">Free Replacement from Teacher</option>
                  </select>
                </div>

                {requestedResolution === 'partial_refund' && (
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Requested Refund Amount ($ USD):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 20.00"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Evidence Upload Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Attach Photos & Proof Documentation:</span>
                  <span className="text-[10px] text-slate-500">{evidenceFiles.length} attached</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Document Name (e.g. damage.jpg)"
                    value={tempFileName}
                    onChange={(e) => setTempFileName(e.target.value)}
                    className="p-2 rounded-lg border border-slate-300 text-[11px] bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Photo Image URL (or paste image link)"
                    value={tempFileUrl}
                    onChange={(e) => setTempFileUrl(e.target.value)}
                    className="p-2 rounded-lg border border-slate-300 text-[11px] bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddEvidence}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Attach Photo</span>
                  </button>
                </div>

                {evidenceFiles.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {evidenceFiles.map((f, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]"
                      >
                        <span className="font-bold text-slate-800 truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => setEvidenceFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewDisputeModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>Submit Dispute & Pause Payout</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
