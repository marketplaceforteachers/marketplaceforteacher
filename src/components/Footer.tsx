import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Heart,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { COMPANY_INFO } from '../data/mockData';
import { SiteSettings, SocialMediaChannel } from '../types';
import { Globe, Share2 } from 'lucide-react';

interface FooterProps {
  onOpenCMSPage: (slug: string) => void;
  onSelectCategory: (catId: string) => void;
  onOpenContact?: () => void;
  onOpenCPanelExport?: () => void;
  onOpenBuyerProtection?: () => void;
  onOpenTrustCenter?: () => void;
  onOpenDisputeCenter?: () => void;
  onOpenAuthModal?: (tab?: 'login' | 'register' | 'admin') => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCMSPage,
  onSelectCategory,
  onOpenContact,
  onOpenCPanelExport,
  onOpenBuyerProtection,
  onOpenTrustCenter,
  onOpenDisputeCenter,
  onOpenAuthModal,
  siteSettings,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const supportEmail = siteSettings?.supportEmail || COMPANY_INFO.email;
  const supportPhone = siteSettings?.supportPhone || COMPANY_INFO.phone;
  const address = siteSettings?.address || `${COMPANY_INFO.address}, ${COMPANY_INFO.city}, ${COMPANY_INFO.state} ${COMPANY_INFO.zip}, USA`;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-900/60 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Verified Teachers Only</h4>
              <p className="text-slate-400 mt-0.5">
                Every educator credential is authenticated to ensure trusted, safe classroom exchanges.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-900/60 text-emerald-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Zero Upfront Listing Fees</h4>
              <p className="text-slate-400 mt-0.5">
                List unlimited books, furniture, and STEM sets for free. Only a low 5% fee when items sell.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-900/60 text-amber-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Safe School Office Pickups</h4>
              <p className="text-slate-400 mt-0.5">
                Save on freight costs with secure contact-free swaps at local district offices or campuses.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-purple-900/60 text-purple-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Tax-Exempt Ready Invoices</h4>
              <p className="text-slate-400 mt-0.5">
                Official PDF receipts and school district purchase order (PO) workflows ready to print.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10 border-b border-slate-800">
          {/* Company Column */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="lg" variant="white" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier USA peer-to-peer marketplace empowering educators to circulate classroom supplies, books, furniture, and STEM learning kits affordably.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>HQ Address:</strong> {address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Teacher Helpline: {supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{supportEmail}</span>
              </div>
            </div>

            {/* Social Media Channels (Admin Configurable) */}
            {siteSettings?.socialChannels && siteSettings.socialChannels.filter(s => s.enabled).length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Connect With Our Educator Community
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {siteSettings.socialChannels
                    .filter((ch) => ch.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((channel) => (
                      <a
                        key={channel.id}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                        title={`${channel.name}: ${channel.handle}`}
                      >
                        <Share2 className="w-3 h-3 text-blue-400" />
                        <span>{channel.name}</span>
                      </a>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Classroom Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('classroom-supplies')}
                  className="hover:text-white transition-colors"
                >
                  Classroom Supplies & Markers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('books')}
                  className="hover:text-white transition-colors"
                >
                  Textbooks & Guided Reading
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('furniture')}
                  className="hover:text-white transition-colors"
                >
                  Teacher Desks & Storage Cubbies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('electronics')}
                  className="hover:text-white transition-colors"
                >
                  Projectors & Laminators
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('learning-materials')}
                  className="hover:text-white transition-colors"
                >
                  STEM & Science Lab Kits
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Legal Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Trust & Educator Center
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => (onOpenBuyerProtection ? onOpenBuyerProtection() : onOpenCMSPage('buyer-protection'))}
                  className="hover:text-emerald-300 text-emerald-400 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Buyer Protection Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onOpenTrustCenter ? onOpenTrustCenter() : onOpenCMSPage('trust-center'))}
                  className="hover:text-blue-300 text-blue-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Trust & Safety Center</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onOpenDisputeCenter ? onOpenDisputeCenter() : onOpenCMSPage('dispute-center'))}
                  className="hover:text-amber-300 text-amber-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Dispute Resolution Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCMSPage('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCMSPage('become-a-seller')}
                  className="hover:text-white transition-colors font-semibold text-blue-400 cursor-pointer"
                >
                  Become a Teacher Seller
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCMSPage('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCMSPage('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCMSPage('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy & FERPA Protection
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onOpenContact ? onOpenContact() : onOpenCMSPage('contact'))}
                  className="hover:text-white transition-colors text-slate-300 font-semibold cursor-pointer"
                >
                  Contact Form & Tickets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : null}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Educator Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </li>
              <li>
                <button
                  id="footer-super-admin-portal-link"
                  onClick={() => onOpenCMSPage ? onOpenCMSPage('admin-login') : (onOpenAuthModal ? onOpenAuthModal('admin') : null)}
                  className="hover:text-amber-300 text-slate-500 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 mt-1 pt-1 border-t border-slate-800"
                >
                  <Lock className="w-3 h-3" />
                  <span>Super Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Teacher Appreciation Perks
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get seasonal classroom grant alerts, $15 off coupon codes, and local surplus notifications.
            </p>
            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are subscribed! Welcome email sent.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="your.email@school.org"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-l-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-lg font-semibold text-xs flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  We respect teacher inboxes. No spam, ever.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Trust Seal & Compliance Pillars */}
        <div className="py-6 border-b border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
            <div className="w-10 h-10 rounded-lg bg-blue-900/80 text-blue-400 flex items-center justify-center font-black text-sm shrink-0 border border-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">Verified Educator Network</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Teacher license authentication across NY, OK, TX, CA and all 50 states.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
            <div className="w-10 h-10 rounded-lg bg-indigo-900/80 text-indigo-400 flex items-center justify-center font-black text-sm shrink-0 border border-indigo-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">District PO & FERPA Compliant</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Certified educational vendor supporting school district invoices & Form 1040 deductions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/80 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">100% Buyer Protection Guarantee</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Funds held securely until verified delivery or contact-free school office pickup.
              </p>
            </div>
          </div>
        </div>

        {/* SEO State & City Directory Crawling Section for Google Top Indexing */}
        <div className="py-5 border-b border-slate-800/80 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Top Teacher Supply Hubs & State Directories:
            </span>
            <span className="text-[10px] text-blue-400">All 50 US States Active</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            <strong className="text-slate-300">New York (NY):</strong> New York City, Brooklyn, Queens, Manhattan, Bronx, Staten Island, Buffalo, Rochester, Syracuse, Albany, Long Island, Yonkers •{' '}
            <strong className="text-slate-300">Oklahoma (OK):</strong> Oklahoma City, Tulsa, Norman, Edmond, Broken Arrow, Lawton •{' '}
            <strong className="text-slate-300">Texas (TX):</strong> Dallas, Houston, Austin, San Antonio, Fort Worth, El Paso •{' '}
            <strong className="text-slate-300">California (CA):</strong> Los Angeles, San Diego, San Francisco, San Jose, Sacramento, Fresno •{' '}
            <strong className="text-slate-300">Midwest & East Coast:</strong> Chicago (IL), Philadelphia (PA), Miami (FL), Atlanta (GA), Columbus (OH), Charlotte (NC), Phoenix (AZ), Seattle (WA).
          </p>
        </div>

        {/* Bottom Bar: Copyright & Accepted Payment Methods */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MarketplaceForTeachers.com, LLC. All rights reserved. Dedicated to USA Educators.</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">Supported Gateways:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-semibold">Stripe</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-semibold">PayPal</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-semibold">Square</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-semibold">Apple Pay</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-semibold">Google Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
