import React, { useState } from 'react';
import {
  BookOpen,
  Building2,
  ShieldCheck,
  Lock,
  Wallet,
  Scale,
  Truck,
  Receipt,
  LifeBuoy,
  Search,
  Printer,
  Download,
  ChevronDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Bookmark,
  Filter,
} from 'lucide-react';
import { CompanyPlaybookChapter, CompanyPlaybookSOP } from '../../types';
import { COMPANY_PLAYBOOK_CHAPTERS } from '../../data/companyPlaybookData';

interface AdminCompanyPlaybookProps {
  onShowToast?: (msg: string) => void;
}

export const AdminCompanyPlaybook: React.FC<AdminCompanyPlaybookProps> = ({
  onShowToast = () => {},
}) => {
  const [chapters] = useState<CompanyPlaybookChapter[]>(COMPANY_PLAYBOOK_CHAPTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSOPs, setExpandedSOPs] = useState<Record<string, boolean>>({
    'sop-01-core': true,
    'sop-03-vetting': true,
    'sop-04-escrow-flow': true,
  });

  const toggleSOP = (sopId: string) => {
    setExpandedSOPs((prev) => ({
      ...prev,
      [sopId]: !prev[sopId],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    chapters.forEach((ch) => {
      ch.sops.forEach((sop) => {
        allExpanded[sop.id] = true;
      });
    });
    setExpandedSOPs(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSOPs({});
  };

  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return Building2;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Lock':
        return Lock;
      case 'Wallet':
        return Wallet;
      case 'Scale':
        return Scale;
      case 'Truck':
        return Truck;
      case 'Receipt':
        return Receipt;
      default:
        return LifeBuoy;
    }
  };

  // Filter chapters and sops
  const filteredChapters = chapters
    .map((chapter) => {
      const filteredSOPs = chapter.sops.filter((sop) => {
        const matchesCategory =
          selectedCategory === 'all' || sop.category === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === '' ||
          sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sop.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sop.stepByStepGuidelines.some((g) =>
            g.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return matchesCategory && matchesSearch;
      });

      return {
        ...chapter,
        sops: filteredSOPs,
      };
    })
    .filter((chapter) => chapter.sops.length > 0);

  const categories = [
    { id: 'all', label: 'All Chapters & SOPs' },
    { id: 'operations', label: 'Operations & Ethics' },
    { id: 'verification', label: 'Teacher Vetting' },
    { id: 'escrow', label: 'Escrow & Safety' },
    { id: 'finance', label: 'Treasury & Payouts' },
    { id: 'disputes', label: 'Disputes & Returns' },
    { id: 'shipping', label: 'Shipping & Logistics' },
    { id: 'tax', label: 'Tax Compliance' },
    { id: 'support', label: 'Customer Support' },
  ];

  return (
    <div id="admin-company-playbook" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-bold border border-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Corporate SOPs & Legal Manual (2026-2027)</span>
            </div>
            <h2 className="text-2xl font-black text-white">Company Playbook & Operating Manual</h2>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
              The definitive administrative guide governing educator verification, 100% escrow protection, dispute arbitration, state tax compliance, and platform operations for MarketplaceForTeachers.com.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Playbook (PDF)</span>
            </button>
          </div>
        </div>

        {/* Quick Search & Filters */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all SOPs, guidelines, FERPA rules, escrow policies..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder-slate-400 focus:outline-hidden focus:bg-white/15 focus:border-white/40"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold shrink-0">
            <button
              onClick={expandAll}
              className="text-indigo-300 hover:text-white underline cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-slate-500">•</span>
            <button
              onClick={collapseAll}
              className="text-indigo-300 hover:text-white underline cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Chapters & SOPs Content Accordion */}
      <div className="space-y-6">
        {filteredChapters.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No Playbook chapters found</p>
            <p className="text-xs text-slate-400">Try adjusting your search keywords or category filters.</p>
          </div>
        ) : (
          filteredChapters.map((chapter) => {
            const Icon = getChapterIcon(chapter.iconName);
            return (
              <div
                key={chapter.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Chapter Header */}
                <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                        Chapter {chapter.chapterNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {chapter.sops.length} Standard Operating Procedures
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">{chapter.title}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{chapter.subtitle}</p>
                    <p className="text-slate-600 text-xs mt-2 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                      {chapter.overview}
                    </p>
                  </div>
                </div>

                {/* SOP Items */}
                <div className="divide-y divide-slate-100 p-2 sm:p-3">
                  {chapter.sops.map((sop) => {
                    const isExpanded = expandedSOPs[sop.id];
                    return (
                      <div key={sop.id} className="p-3 sm:p-4 rounded-xl hover:bg-slate-50/60 transition-colors">
                        <div
                          onClick={() => toggleSOP(sop.id)}
                          className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md shrink-0">
                              {sop.code}
                            </span>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm">{sop.title}</h4>
                              <p className="text-slate-500 text-xs mt-0.5">{sop.summary}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-3.5 text-xs text-slate-700 pl-2 sm:pl-11">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                                <span className="font-bold text-blue-900 block mb-1">Operational Purpose</span>
                                <p className="text-slate-700 leading-relaxed">{sop.purpose}</p>
                              </div>
                              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                                <span className="font-bold text-slate-900 block mb-1">Applicable Scope</span>
                                <p className="text-slate-700 leading-relaxed">{sop.scope}</p>
                              </div>
                            </div>

                            <div>
                              <span className="font-bold text-slate-900 block mb-2">Step-by-Step Operating Protocol:</span>
                              <div className="space-y-2">
                                {sop.stepByStepGuidelines.map((step, idx) => (
                                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="text-slate-800 leading-relaxed">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                              <div>
                                <span className="font-semibold text-slate-700">Legal Compliance: </span>
                                <span>{sop.complianceNotes}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Author: <strong>{sop.authorRole}</strong></span>
                                <span>•</span>
                                <span>Updated: {sop.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
