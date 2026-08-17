import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  FileText,
  Target,
} from 'lucide-react';
import { CMS_PAGES } from '../data/cmsPagesData';
import { COMPANY_INFO } from '../data/mockData';
import { CMSPage } from '../types';

interface CMSPageModalProps {
  slug: string | null;
  onClose: () => void;
  cmsPages?: CMSPage[];
}

export const CMSPageModal: React.FC<CMSPageModalProps> = ({ slug, onClose, cmsPages }) => {
  if (!slug) return null;

  const dynamicPage = cmsPages?.find((p) => p.slug === slug);
  const fallbackPage = CMS_PAGES.find((p) => p.slug === slug) || CMS_PAGES[0];

  const page = dynamicPage
    ? {
        title: dynamicPage.title,
        lastUpdated: dynamicPage.lastUpdated,
        content: dynamicPage.content,
      }
    : fallbackPage;

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSchool, setContactSchool] = useState('');
  const [contactTopic, setContactTopic] = useState('School District Purchase Order (PO)');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactMessage('');
    }, 4000);
  };

  const renderInlineFormattedText = (text: string): React.ReactNode => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|__.*?__|`.*?`)/g);

    return parts.map((part, pIdx) => {
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        return (
          <strong key={pIdx} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={pIdx} className="font-mono bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-[11px] font-bold border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={pIdx}>{part}</span>;
    });
  };

  const renderMarkdownContent = (raw: string) => {
    if (!raw) return null;
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = (key: string) => {
      if (listBuffer && listBuffer.items.length > 0) {
        if (listBuffer.type === 'ul') {
          elements.push(
            <ul key={`ul-${key}`} className="space-y-2.5 my-3 pl-1">
              {listBuffer.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <div className="flex-1">{renderInlineFormattedText(item)}</div>
                </li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <div key={`ol-${key}`} className="space-y-2.5 my-3 pl-1">
              {listBuffer.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                    {idx + 1}
                  </span>
                  <div className="flex-1">{renderInlineFormattedText(item)}</div>
                </div>
              ))}
            </div>
          );
        }
        listBuffer = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList(`empty-${index}`);
        return;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ')) {
        const itemText = trimmed.substring(2);
        if (!listBuffer || listBuffer.type !== 'ul') {
          flushList(`switch-ul-${index}`);
          listBuffer = { type: 'ul', items: [] };
        }
        listBuffer.items.push(itemText);
        return;
      }

      if (/^\d+[\.\)]\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+[\.\)]\s+/, '');
        if (!listBuffer || listBuffer.type !== 'ol') {
          flushList(`switch-ol-${index}`);
          listBuffer = { type: 'ol', items: [] };
        }
        listBuffer.items.push(itemText);
        return;
      }

      flushList(`line-${index}`);

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index}`} className="text-xl sm:text-2xl font-black text-slate-900 mt-5 mb-2 border-b border-slate-200 pb-2">
            {trimmed.substring(2)}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="text-lg sm:text-xl font-extrabold text-slate-900 mt-4 mb-2">
            {trimmed.substring(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="text-base sm:text-lg font-extrabold text-slate-900 mt-4 mb-2 flex items-center gap-2 border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>{trimmed.substring(4)}</span>
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${index}`} className="text-sm sm:text-base font-extrabold text-slate-800 mt-3 mb-1">
            {trimmed.substring(5)}
          </h4>
        );
      } else if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
        elements.push(
          <hr key={`hr-${index}`} className="my-5 border-t border-slate-200" />
        );
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote key={`quote-${index}`} className="my-2.5 pl-3 border-l-4 border-blue-500 bg-blue-50/50 p-2.5 rounded-r-xl text-xs sm:text-sm text-slate-800 italic">
            {renderInlineFormattedText(trimmed.substring(2))}
          </blockquote>
        );
      } else {
        elements.push(
          <p key={`p-${index}`} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-2">
            {renderInlineFormattedText(trimmed)}
          </p>
        );
      }
    });

    flushList('final');
    return <div className="space-y-1">{elements}</div>;
  };

  return (
    <div id="cms-page-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="cms-page-modal-container"
        className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-900">MarketplaceForTeachers.com</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700">{page.title}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {page.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Last updated: {page.lastUpdated}</p>
          </div>

          {/* Render Rich Formatted Markdown Content */}
          <div className="space-y-3">
            {renderMarkdownContent(page.content)}
          </div>

          {/* If Contact Page, show interactive School District PO / Teacher Helpline Form */}
          {slug === 'contact' && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>Send an Official Inquiry or School District PO</span>
                </h3>

                {contactSubmitted ? (
                  <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Thank You for Contacting Us!</p>
                      <p className="mt-0.5">
                        Our Oklahoma City educator support team will respond to {contactEmail} within 4 business hours.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Principal Jane Miller"
                          className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">School / District *</label>
                        <input
                          type="text"
                          required
                          value={contactSchool}
                          onChange={(e) => setContactSchool(e.target.value)}
                          placeholder="e.g. Oklahoma City Public Schools (OKCPS)"
                          className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. jmiller@okcps.org"
                          className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Inquiry Topic *</label>
                        <select
                          value={contactTopic}
                          onChange={(e) => setContactTopic(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                        >
                          <option value="School District Purchase Order (PO)">
                            School District Purchase Order (PO)
                          </option>
                          <option value="Teacher Verification Assistance">
                            Teacher Verification Assistance
                          </option>
                          <option value="Escrow & Payment Inquiries">
                            Escrow & Payment Inquiries
                          </option>
                          <option value="General Support">General Support</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Detailed Message *</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Please describe your inquiry, district requirements, or order details..."
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
