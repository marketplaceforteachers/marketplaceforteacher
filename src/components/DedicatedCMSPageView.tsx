import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  HelpCircle,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Clock,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Search,
  ChevronRight,
  Sparkles,
  Award,
  AlertCircle,
  Layers,
  Scale,
  Send,
  Building2,
  ExternalLink,
  Share2,
  Maximize2,
  Target,
  Users,
  HeartHandshake,
  DollarSign,
  Truck,
  GraduationCap,
  Store,
  Check,
} from 'lucide-react';
import { CMSPage, SiteSettings, User } from '../types';
import { CMS_PAGES } from '../data/cmsPagesData';

interface DedicatedCMSPageViewProps {
  slug: string;
  cmsPages?: CMSPage[];
  siteSettings?: SiteSettings;
  currentUser?: User;
  onNavigateView: (view: string) => void;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
  onAddAdminNotification?: (notif: any) => void;
}

export const DedicatedCMSPageView: React.FC<DedicatedCMSPageViewProps> = ({
  slug,
  cmsPages,
  siteSettings,
  currentUser,
  onNavigateView,
  onOpenAuthModal,
  onAddAdminNotification,
}) => {
  // Smooth scroll to top whenever page slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Find current active page from dynamic CMS pages or default fallback
  const activePage = useMemo(() => {
    // Exact match in dynamic cmsPages
    const dynamic = cmsPages?.find((p) => p.slug === slug);
    if (dynamic && dynamic.content) return dynamic;

    // Direct match in CMS_PAGES
    const fallback = CMS_PAGES.find((p) => p.slug === slug);
    if (fallback && fallback.content) return fallback;

    // Normalizations & Aliases
    if (slug === 'about' || slug === 'about-us' || slug === 'aboutUs') {
      return (
        cmsPages?.find((p) => p.slug === 'about') ||
        CMS_PAGES.find((p) => p.slug === 'about') ||
        CMS_PAGES[0]
      );
    }
    if (slug === 'mission' || slug === 'our-mission' || slug === 'vision') {
      return (
        cmsPages?.find((p) => p.slug === 'mission') ||
        CMS_PAGES.find((p) => p.slug === 'mission') ||
        cmsPages?.find((p) => p.slug === 'about') ||
        CMS_PAGES.find((p) => p.slug === 'about') ||
        CMS_PAGES[0]
      );
    }
    if (slug === 'terms' || slug === 'terms-of-service' || slug === 'tos') {
      return (
        cmsPages?.find((p) => p.slug === 'terms') ||
        CMS_PAGES.find((p) => p.slug === 'terms') ||
        CMS_PAGES[0]
      );
    }
    if (slug === 'privacy' || slug === 'privacy-policy') {
      return (
        cmsPages?.find((p) => p.slug === 'privacy') ||
        CMS_PAGES.find((p) => p.slug === 'privacy') ||
        CMS_PAGES[0]
      );
    }
    if (slug === 'buyer-protection' || slug === 'buyer-protection-policy') {
      return (
        cmsPages?.find((p) => p.slug === 'buyer-protection-policy' || p.slug === 'buyer-protection') ||
        CMS_PAGES.find((p) => p.slug === 'buyer-protection-policy' || p.slug === 'buyer-protection') ||
        CMS_PAGES[0]
      );
    }
    if (slug === 'trust-center' || slug === 'trust') {
      return (
        cmsPages?.find((p) => p.slug === 'trust-center') ||
        CMS_PAGES.find((p) => p.slug === 'trust-center') ||
        CMS_PAGES[0]
      );
    }

    return (
      cmsPages?.[0] ||
      CMS_PAGES[0] || {
        id: 'page-about',
        slug: 'about',
        title: 'About Marketplace For Teachers',
        category: 'information',
        lastUpdated: 'August 2026',
        content: '### About Marketplace For Teachers\n\nBuilt by educators for educators across America.',
      }
    );
  }, [cmsPages, slug]);

  // Search state for FAQ page
  const [faqSearch, setFaqSearch] = useState('');
  const [faqFilter, setFaqFilter] = useState<'all' | 'buyers' | 'sellers' | 'shipping' | 'escrow'>('all');

  // Contact / PO Form State
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactSchool, setContactSchool] = useState(currentUser?.schoolName || '');
  const [contactCategory, setContactCategory] = useState('School District Purchase Order (PO)');
  const [contactPoNumber, setContactPoNumber] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(newTicket);
    setContactSubmitted(true);

    if (onAddAdminNotification) {
      onAddAdminNotification({
        title: `📝 New Support Ticket / District PO: ${newTicket}`,
        message: `Inquiry submitted by ${contactName} (${contactSchool || 'Educator'}). Category: ${contactCategory}.`,
        type: 'contact',
        priority: 'medium',
        actorName: contactName,
        actorSchool: contactSchool,
        details: contactMessage,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenNewWindow = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=750,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${activePage.title} - MarketplaceForTeachers.com</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; }
              h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 26px; }
              h2, h3, h4 { color: #0f172a; margin-top: 24px; }
              .meta { font-size: 12px; color: #64748b; margin-bottom: 24px; background: #f8fafc; padding: 10px; border-radius: 8px; }
              hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
              ul, ol { padding-left: 24px; }
              li { margin-bottom: 8px; }
              .badge { display: inline-block; background: #dbeafe; color: #1e40af; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <span class="badge">MarketplaceForTeachers.com Official Governance</span>
            <h1>${activePage.title}</h1>
            <div class="meta">
              <strong>Category:</strong> ${activePage.category || 'Information'} | 
              <strong>Last Updated:</strong> ${activePage.lastUpdated || 'August 2026'} | 
              <strong>Jurisdiction:</strong> Oklahoma City, OK (73159)
            </div>
            <div>
              ${activePage.content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/---/g, '<hr/>').replace(/- (.*?)\n/g, '<li>$1</li>')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Inline formatting helper for bold, italic, code, links
  const renderInlineFormattedText = (text: string): React.ReactNode => {
    if (!text) return null;

    // Split on bold **text** or __text__
    const parts = text.split(/(\*\*.*?\*\*|__.*?__|`.*?`)/g);

    return parts.map((part, pIdx) => {
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        const inner = part.slice(2, -2);
        return (
          <strong key={pIdx} className="font-extrabold text-slate-900">
            {inner}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        const inner = part.slice(1, -1);
        return (
          <code key={pIdx} className="font-mono bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-[11px] font-bold border border-slate-200">
            {inner}
          </code>
        );
      }
      return <span key={pIdx}>{part}</span>;
    });
  };

  // Robust Markdown Parser into fully visible, high-contrast, beautiful elements
  const renderFormattedMarkdown = (raw: string) => {
    if (!raw) {
      return (
        <div className="text-slate-500 italic py-4">
          No content has been published for this section yet.
        </div>
      );
    }

    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = (key: string) => {
      if (listBuffer && listBuffer.items.length > 0) {
        if (listBuffer.type === 'ul') {
          elements.push(
            <ul key={`ul-${key}`} className="space-y-2.5 my-3.5 pl-1">
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
            <div key={`ol-${key}`} className="space-y-2.5 my-3.5 pl-1">
              {listBuffer.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
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

      // Empty lines
      if (!trimmed) {
        flushList(`empty-${index}`);
        return;
      }

      // Unordered list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ')) {
        const itemText = trimmed.substring(2);
        if (!listBuffer || listBuffer.type !== 'ul') {
          flushList(`switch-ul-${index}`);
          listBuffer = { type: 'ul', items: [] };
        }
        listBuffer.items.push(itemText);
        return;
      }

      // Ordered list item
      if (/^\d+[\.\)]\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+[\.\)]\s+/, '');
        if (!listBuffer || listBuffer.type !== 'ol') {
          flushList(`switch-ol-${index}`);
          listBuffer = { type: 'ol', items: [] };
        }
        listBuffer.items.push(itemText);
        return;
      }

      // Otherwise, flush any pending list
      flushList(`line-${index}`);

      // Headings
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index}`} className="text-xl sm:text-2xl font-black text-slate-900 mt-6 mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span>{trimmed.substring(2)}</span>
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="text-lg sm:text-xl font-extrabold text-slate-900 mt-5 mb-2 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>{trimmed.substring(3)}</span>
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="text-base sm:text-lg font-extrabold text-slate-900 mt-5 mb-2 flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>{trimmed.substring(4)}</span>
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${index}`} className="text-sm sm:text-base font-extrabold text-slate-800 mt-4 mb-1.5">
            {trimmed.substring(5)}
          </h4>
        );
      } else if (trimmed.startsWith('##### ')) {
        elements.push(
          <h5 key={`h5-${index}`} className="text-xs sm:text-sm font-bold text-slate-800 mt-3 mb-1 uppercase tracking-wider">
            {trimmed.substring(6)}
          </h5>
        );
      } else if (trimmed.startsWith('---') || trimmed.startsWith('***') || trimmed.startsWith('___')) {
        elements.push(
          <hr key={`hr-${index}`} className="my-6 border-t border-slate-200" />
        );
      } else if (trimmed.startsWith('> ')) {
        // Blockquote
        elements.push(
          <blockquote key={`quote-${index}`} className="my-3 pl-4 border-l-4 border-blue-500 bg-blue-50/50 p-3 rounded-r-xl text-xs sm:text-sm text-slate-800 italic leading-relaxed">
            {renderInlineFormattedText(trimmed.substring(2))}
          </blockquote>
        );
      } else {
        // Standard Paragraph
        elements.push(
          <p key={`p-${index}`} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-2.5">
            {renderInlineFormattedText(trimmed)}
          </p>
        );
      }
    });

    flushList('final');
    return <div className="space-y-1">{elements}</div>;
  };

  // FAQ items for interactive accordion
  const faqItems = [
    {
      q: 'Who is eligible to buy and sell on MarketplaceForTeachers.com?',
      category: 'buyers',
      a: 'Anyone can browse and purchase instructional supplies, books, and STEM materials as a guest or registered buyer with no teacher verification required! To list items for sale, sellers undergo verification with an active school email (.k12, .edu, district portal), state teaching license, or school staff ID.',
    },
    {
      q: 'How does the 100% Escrow Buyer Protection Guarantee work?',
      category: 'escrow',
      a: 'When you purchase supplies, your payment is safely held in custody by MarketplaceForTeachers.com. The seller is only disbursed funds after postal tracking confirms delivery and you have a 48-hour window to inspect the package.',
    },
    {
      q: 'How does Local Campus Pickup work without shipping fees?',
      category: 'shipping',
      a: 'Educators in the same city or district can choose Local Pickup. The seller designates a safe, convenient public location—such as the school front office or district administrative building during standard hours. $0 shipping is charged.',
    },
    {
      q: 'What is the marketplace seller fee structure?',
      category: 'sellers',
      a: 'Listing classroom items is 100% free with zero upfront charges or monthly subscription fees. When an item sells, a modest 5% platform fee is deducted to cover secure payment processing, escrow protection, and educator server hosting.',
    },
    {
      q: 'Can public school districts submit tax-exempt Purchase Orders (POs)?',
      category: 'buyers',
      a: 'Yes! We actively support US public school districts, charter networks, and 501(c)(3) educational non-profits. Submit your approved district PO of $250+ on our Contact page or email info@marketplaceforteachers.com with Net-30 invoicing.',
    },
    {
      q: 'How are used items graded for condition?',
      category: 'sellers',
      a: 'Sellers follow standard classroom grading criteria: Brand New (sealed packaging), Like New (opened but complete with no markings), Gently Used (clean, fully functional with minimal cosmetic wear), and Fair (complete learning value with visible student wear).',
    },
  ];

  const filteredFaqs = faqItems.filter((item) => {
    const matchesFilter = faqFilter === 'all' || item.category === faqFilter;
    const matchesSearch =
      faqSearch === '' ||
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="dedicated-cms-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => onNavigateView('marketplace')}
            className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>
          <span>/</span>
          <span className="text-slate-400 capitalize">{activePage.category || 'Information'}</span>
          <span>/</span>
          <span className="text-slate-900 font-extrabold truncate max-w-xs">{activePage.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Page Jump Buttons */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => onNavigateView('about')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                slug === 'about' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => onNavigateView('mission')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                slug === 'mission' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Our Mission
            </button>
            <button
              onClick={() => onNavigateView('faq')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                slug === 'faq' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigateView('contact')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                slug === 'contact' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contact
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Print this policy document"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleOpenNewWindow}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Open clean printable view"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Stand-alone View</span>
          </button>

          <button
            onClick={() => onNavigateView('marketplace')}
            className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Shop Supplies
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 border border-white/20 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            {slug === 'privacy' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            {slug === 'terms' && <Scale className="w-4 h-4 text-amber-400" />}
            {slug === 'faq' && <HelpCircle className="w-4 h-4 text-cyan-400" />}
            {slug === 'about' && <BookOpen className="w-4 h-4 text-blue-400" />}
            {slug === 'mission' && <Target className="w-4 h-4 text-emerald-400" />}
            {slug === 'become-a-seller' && <Sparkles className="w-4 h-4 text-amber-300" />}
            {slug === 'contact' && <Mail className="w-4 h-4 text-emerald-300" />}
            {slug === 'trust-center' && <Award className="w-4 h-4 text-amber-300" />}
            <span>Official Policy & Governance Center</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {activePage.title}
          </h1>

          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
            {activePage.excerpt ||
              'MarketplaceForTeachers.com maintains rigorous standards for educator privacy, student data safe harbor (FERPA/COPPA), and transparent peer-to-peer commerce.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-blue-300 font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Last updated: {activePage.lastUpdated || 'August 2026'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Oklahoma City HQ (73159)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>FERPA & COPPA Compliant</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left Navigation / TOC & Right Article Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Quick Links & Trust Box */}
        <div className="lg:col-span-4 space-y-5 sticky top-20">
          {/* Quick Page Directory */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
              Governance & Legal Pages
            </h3>
            <nav className="space-y-1 text-xs font-bold">
              {[
                { id: 'about', label: 'About Us & Story', icon: BookOpen },
                { id: 'mission', label: 'Our Mission & Commitment', icon: Target },
                { id: 'privacy', label: 'Privacy Policy & FERPA', icon: ShieldCheck },
                { id: 'terms', label: 'Terms of Service & Rules', icon: Scale },
                { id: 'faq', label: 'FAQ & Help Center', icon: HelpCircle },
                { id: 'become-a-seller', label: 'Become a Seller Guide', icon: Sparkles },
                { id: 'contact', label: 'Contact Oklahoma HQ & POs', icon: Mail },
                { id: 'buyer-protection', label: 'Buyer Protection Policy', icon: Lock },
                { id: 'trust-center', label: 'Trust & Safety Center', icon: Award },
                { id: 'teacher-standards', label: 'Educator Condition Standards', icon: FileText },
                { id: 'district-invoicing', label: 'District Invoicing & POs', icon: Building2 },
                { id: 'dispute-center', label: 'Dispute Resolution Desk', icon: AlertCircle },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = slug === item.id || (slug === 'buyer-protection-policy' && item.id === 'buyer-protection');
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigateView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs font-extrabold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Headquarters Trust Badge */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold">
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>Official Corporate Registry</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              <strong>MarketplaceForTeachers.com, LLC</strong>
              <br />
              {siteSettings?.hqAddress || '9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159'}
            </p>
            <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{siteSettings?.supportPhone || '(405) 555-8322'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold">{siteSettings?.supportEmail || 'info@marketplaceforteachers.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{siteSettings?.businessHours || 'Mon - Fri: 8:00 AM – 6:00 PM CST'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Article Body */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Article Container */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            {/* Rich Rendered HTML / Markdown Content */}
            <div id="cms-article-content" className="space-y-4 text-slate-800">
              {renderFormattedMarkdown(activePage.content)}
            </div>

            {/* IF ABOUT US OR MISSION PAGE: High-Impact Visual Pillars */}
            {(slug === 'about' || slug === 'mission' || slug === 'about-us') && (
              <div className="pt-6 border-t border-slate-200 space-y-5">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-blue-700" />
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    The 4 Core Commitments of Marketplace For Teachers
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span>Verified Educator Community</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Sellers are verified via .edu / .k12 webmail, state teaching licenses, or district school ID badges.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>100% Escrow Protection</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Funds are held safely in custody until carrier delivery is confirmed and the buyer verifies package condition.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span>$0 Local Pickup & Low Shipping</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Swap materials safely at school office buildings or ship nationwide with discounted USPS Media Mail and parcel rates.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span>Modest 5% Transparent Fee</span>
                    </div>
                    <p className="text-[11px] text-purple-800 leading-relaxed">
                      Zero upfront listing fees. A simple 5% transaction commission covers payment security and teacher support.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-extrabold text-xs sm:text-sm text-white">Have surplus classroom supplies?</h4>
                    <p className="text-[11px] text-slate-300">Open your free verified classroom shop in less than 2 minutes.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenAuthModal) onOpenAuthModal('register');
                      else onNavigateView('teacher-dashboard');
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shrink-0 transition-colors cursor-pointer"
                  >
                    Open Seller Account
                  </button>
                </div>
              </div>
            )}

            {/* IF PRIVACY PAGE: Key Pillars Highlight Cards */}
            {slug === 'privacy' && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Educator Privacy & Safety Guarantees</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>Zero Student Data Policy</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Sellers are mandated to scrub all materials of student names, IEPs, and grades. We never collect or store pupil records.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Shielded Contact Info</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Teachers' personal phone numbers and home addresses are never published. All communication is routed securely via internal chat.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                      <Scale className="w-4 h-4 text-purple-600" />
                      <span>Zero Data Monetization</span>
                    </div>
                    <p className="text-[11px] text-purple-800 leading-relaxed">
                      We strictly do not sell, rent, or trade educator profiles or email addresses to advertisers, data brokers, or marketing networks.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Level-1 PCI-DSS Security</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      All payment cards are encrypted via Stripe, Square, and PayPal. Funds are held in escrow until carrier-verified delivery.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* IF FAQ PAGE: Interactive Search & Accordion */}
            {slug === 'faq' && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search FAQ questions (e.g., escrow, returns, verification, PO)..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
                    <button
                      onClick={() => setFaqFilter('all')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        faqFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFaqFilter('buyers')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        faqFilter === 'buyers' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Buyers
                    </button>
                    <button
                      onClick={() => setFaqFilter('sellers')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        faqFilter === 'sellers' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Sellers
                    </button>
                    <button
                      onClick={() => setFaqFilter('escrow')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        faqFilter === 'escrow' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Escrow
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {filteredFaqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-xs text-slate-600 pl-6 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IF CONTACT PAGE: Interactive School PO & Concierge Form */}
            {slug === 'contact' && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-700" />
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        Submit an Educator Ticket or District Purchase Order (PO)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Our Oklahoma educator concierge team reviews tickets within 4 business hours.
                      </p>
                    </div>
                  </div>

                  {contactSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-5 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Support Ticket Successfully Created!</span>
                      </div>
                      <p className="text-xs text-emerald-900">
                        Ticket Reference Number: <strong className="font-mono bg-emerald-200/60 px-2 py-0.5 rounded">{ticketId}</strong>
                      </p>
                      <p className="text-xs text-emerald-800">
                        We sent a confirmation notice to <strong>{contactEmail}</strong>. An educator specialist will assist you promptly.
                      </p>
                      <button
                        onClick={() => {
                          setContactSubmitted(false);
                          setContactMessage('');
                        }}
                        className="mt-2 text-xs font-bold text-emerald-700 underline cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sarah Jenkins, M.Ed."
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:border-blue-600 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. sjenkins@okcps.org"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:border-blue-600 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">School / District Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Oklahoma City Public Schools"
                            value={contactSchool}
                            onChange={(e) => setContactSchool(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:border-blue-600 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Inquiry Category *</label>
                          <select
                            value={contactCategory}
                            onChange={(e) => setContactCategory(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:border-blue-600 bg-white"
                          >
                            <option>School District Purchase Order (PO)</option>
                            <option>Educator Verification Help</option>
                            <option>Escrow & Order Protection</option>
                            <option>Tax Exemption Certificate</option>
                            <option>Local Pickup Assistance</option>
                            <option>General Educator Support</option>
                          </select>
                        </div>
                      </div>

                      {contactCategory.includes('Purchase Order') && (
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">District PO Number (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. PO-2026-OKCPS-9912"
                            value={contactPoNumber}
                            onChange={(e) => setContactPoNumber(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:border-blue-600 bg-white"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Detailed Message / Order Notes *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Provide details about your classroom supply inquiry, order ID, or district billing instructions..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:border-blue-600 leading-relaxed bg-white"
                        />
                      </div>

                      <div className="flex items-center justify-end pt-2">
                        <button
                          type="submit"
                          className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer text-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Official Ticket</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* IF BECOME A SELLER PAGE: Call to Action */}
            {slug === 'become-a-seller' && (
              <div className="pt-6 border-t border-slate-200 bg-amber-50/50 p-6 rounded-2xl border border-amber-200 space-y-3">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Ready to Open Your Verified Classroom Shop?</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Join thousands of teachers across all 50 states. Listing takes less than 2 minutes and is 100% free.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onOpenAuthModal) {
                        onOpenAuthModal('register');
                      } else {
                        onNavigateView('teacher-dashboard');
                      }
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Start Free Seller Registration
                  </button>

                  <button
                    onClick={() => onNavigateView('marketplace')}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Browse Active Listings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
