import React, { useState } from 'react';
import { X, Flag, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Product } from '../types';

interface ReportListingModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmitReport: (productId: string, reason: string, details: string) => void;
}

export const ReportListingModal: React.FC<ReportListingModalProps> = ({
  product,
  onClose,
  onSubmitReport,
}) => {
  if (!product) return null;

  const [reason, setReason] = useState('FERPA / Student Privacy Violation (Names or records present)');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(product.id, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900">Report Classroom Listing</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">Report Received</h4>
            <p className="text-xs text-slate-500">
              Our educator moderation team will inspect this listing within 4 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-slate-600">
              Reporting: <strong>{product.title}</strong>
            </p>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-hidden focus:border-red-500 font-medium"
              >
                <option value="FERPA / Student Privacy Violation (Names or records present)">
                  FERPA / Student Privacy Violation (Names or records present)
                </option>
                <option value="Prohibited or Non-Educational Item">
                  Prohibited or Non-Educational Item
                </option>
                <option value="Misleading Condition or Inaccurate Photos">
                  Misleading Condition or Inaccurate Photos
                </option>
                <option value="Suspicious / Not an Educator">
                  Suspicious / Not an Educator
                </option>
                <option value="Other Policy Violation">Other Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Additional Details for Moderator
              </label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why this listing violates marketplace educator policies..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
