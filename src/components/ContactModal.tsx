import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Package,
  DollarSign,
  Building,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ContactTicket } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { sendAdminCustomEmail } from '../services/emailService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  initialSubject?: string;
  onSubmitTicket?: (ticket: ContactTicket) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'general',
  initialSubject = '',
  onSubmitTicket,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'buyer' | 'teacher_seller' | 'school_admin' | 'guest'>('buyer');
  const [category, setCategory] = useState<ContactTicket['category']>(
    (defaultCategory as ContactTicket['category']) || 'general'
  );
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<ContactTicket | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newTicket: ContactTicket = {
        id: `ticket-${Date.now()}`,
        ticketNumber: `MFT-TK-${Math.floor(10000 + Math.random() * 90000)}`,
        senderName: name,
        senderEmail: email,
        senderRole: role,
        category,
        subject: subject || `${category.replace('_', ' ').toUpperCase()} Inquiry`,
        message: orderNumber ? `[Associated Order #${orderNumber}]\n\n${message}` : message,
        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Open',
      };

      setSubmittedTicket(newTicket);
      if (onSubmitTicket) {
        onSubmitTicket(newTicket);
      }

      // Dispatch automated Resend email receipt to user
      sendAdminCustomEmail({
        to: email,
        subject: `Ticket Received: ${newTicket.ticketNumber} - Marketplace For Teachers Support`,
        headline: `Support Ticket Created: ${newTicket.ticketNumber} 🎫`,
        messageContent: `Dear ${name},\n\nThank you for reaching out to Educator Support. Your ticket ${newTicket.ticketNumber} has been registered under category ${category.replace('_', ' ').toUpperCase()}.\n\nSubject: ${newTicket.subject}\nMessage: "${message}"\n\nOur teacher support team will respond within 2-4 business hours.`,
      }).catch((err) => console.warn('Resend support ticket email error:', err));
    }, 600);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setOrderNumber('');
    onClose();
  };

  return (
    <div
      id="contact-modal-backdrop"
      className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="contact-modal-container"
        className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-linear-to-r from-blue-900 via-indigo-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center font-bold border border-white/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Contact Marketplace Support</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  24/7 Response
                </span>
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Teacher verification help, escrow payments, order tracking, or general inquiries.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Contact Info Quick Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Email:</span>
            <a
              href="mailto:info@marketplaceforteachers.com"
              className="font-bold text-blue-700 hover:underline"
            >
              info@marketplaceforteachers.com
            </a>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Educator Helpline:</span>
            <a href="tel:4055558322" className="font-bold text-slate-900 hover:underline">
              (405) 555-8322
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {submittedTicket ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-blue-100 text-blue-800 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  Ticket #{submittedTicket.ticketNumber}
                </span>
                <h4 className="font-extrabold text-xl text-slate-900 mt-2">
                  Support Ticket Received!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Thank you, <strong>{submittedTicket.senderName}</strong>. A confirmation email has been dispatched to <strong className="text-slate-900">{submittedTicket.senderEmail}</strong>. Our educator support team will review your inquiry within 2-4 hours.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-1.5">
                <p>
                  <strong>Category:</strong>{' '}
                  <span className="capitalize">{submittedTicket.category.replace('_', ' ')}</span>
                </p>
                <p>
                  <strong>Subject:</strong> {submittedTicket.subject}
                </p>
                <p>
                  <strong>Submitted:</strong> {submittedTicket.createdAt}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    Open (Priority Queue)
                  </span>
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Role selector banner */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3">
                <label className="block font-bold text-blue-950 mb-1.5">I am contacting as:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'buyer', label: 'Buyer (Parent/Donor)' },
                    { id: 'teacher_seller', label: 'Teacher / Seller' },
                    { id: 'school_admin', label: 'School / Principal' },
                    { id: 'guest', label: 'General Guest' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`p-2 rounded-lg font-bold text-[11px] text-center border transition-all ${
                        role === r.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sjenkins@okcps.org or parent@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                  />
                  <span className="text-[10px] text-slate-400">
                    Buyers can use any email. Sellers must verify with school webmail.
                  </span>
                </div>
              </div>

              {/* Category & Order # */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inquiry Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:border-blue-600"
                  >
                    <option value="general">General Support & Feedback</option>
                    <option value="teacher_verification">School Webmail / Teacher Verification Help</option>
                    <option value="escrow_help">Escrow Payment & Fund Release</option>
                    <option value="order_shipping">Order Shipping & Tracking Information</option>
                    <option value="privacy_protection">Report Privacy Concern (Protected Info)</option>
                    <option value="district_po">School District Purchase Orders (PO)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Associated Order # (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MFT-2026-8942"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g. Question regarding escrow release for STEM Kit"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium text-slate-900"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe how we can assist you with your classroom supplies, order, or verification..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 leading-relaxed text-slate-900"
                />
              </div>

              {/* Privacy Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-amber-900 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Platform Privacy Guarantee:</strong> Seller phone numbers and private home addresses are strictly prohibited from being disclosed. Support messages are encrypted and handled exclusively by verified marketplace staff.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting Ticket...' : 'Send Message to Support'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
