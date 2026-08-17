import React from 'react';
import {
  ShieldCheck,
  Tag,
  Sparkles,
  MapPin,
  ArrowRight,
  GraduationCap,
  Truck,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { CATEGORIES } from '../data/categoriesData';
import { SiteSettings } from '../types';
import { TrustSealsBanner } from './TrustSealsBanner';

interface HeroSectionProps {
  onSelectCategory: (catId: string) => void;
  onOpenCreateListing: () => void;
  onOpenCMSPage: (slug: string) => void;
  userZip: string;
  siteSettings?: SiteSettings;
  onOpenTrustCenter?: () => void;
  onOpenBuyerProtection?: () => void;
  onOpenDisputeCenter?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectCategory,
  onOpenCreateListing,
  onOpenCMSPage,
  userZip,
  siteSettings,
  onOpenTrustCenter,
  onOpenBuyerProtection,
  onOpenDisputeCenter,
}) => {
  const heroBadge = siteSettings?.heroBadge || 'Dedicated Exclusively to USA Teachers & Schools';
  const heroTitle = siteSettings?.heroTitle || 'Buy, Sell & Exchange Supplies with Fellow Educators';
  const heroSubtitle = siteSettings?.heroSubtitle || 'Stock classroom libraries, grab hands-on STEM kits, or pass along surplus furniture. Zero listing fees, verified educator trust, and contact-free school pickups.';
  const promoTitle = siteSettings?.promoTitle || 'Teacher Appreciation Discount';
  const promoDescription = siteSettings?.promoDescription || 'Take $15 OFF classroom library sets, science kits & supplies of $60+.';
  const promoCode = siteSettings?.promoCode || 'APPRECIATION';
  const showPromoCard = siteSettings?.showPromoCard ?? siteSettings?.featureModules?.enablePromoCard ?? true;
  const showTrustSeals = siteSettings?.showTrustSealsBanner ?? siteSettings?.featureModules?.enableTrustSealsBanner ?? true;

  return (
    <div id="marketplace-hero-section" className="space-y-3.5 sm:space-y-4">
      {/* Main Educator Banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-md border border-blue-700/50">
        {/* Subtle decorative circles & grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className={`${showPromoCard ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-2 sm:space-y-2.5`}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>{heroBadge}</span>
            </div>

            <h1 className="text-xl sm:text-2.5xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug">
              {heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl font-normal">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onSelectCategory('classroom-supplies')}
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse Classroom Listings</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>

              <button
                onClick={onOpenCreateListing}
                className="bg-blue-700/80 hover:bg-blue-600/90 text-white font-semibold text-xs px-3.5 py-2 rounded-lg border border-blue-400/40 backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                <span>Post Free Teacher Listing</span>
              </button>
            </div>

            {/* Micro Trust Proofs */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-blue-700/60 text-xs">
              <div className="flex items-center gap-1 text-blue-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px]">100% Verified Teachers</span>
              </div>
              <div className="flex items-center gap-1 text-blue-100">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px]">Local & Media Mail Ship</span>
              </div>
              <div className="flex items-center gap-1 text-blue-100">
                <GraduationCap className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span className="text-[10px] sm:text-[11px]">Save 50–80% vs Retail</span>
              </div>
            </div>
          </div>

          {/* Right Column: Promotional Teacher Appreciation Spotlight Card */}
          {showPromoCard && (
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-md text-slate-900 p-3.5 sm:p-4 rounded-xl shadow-md border border-white/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-red-600" /> Promo Code
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" /> Near {userZip}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                    {promoTitle}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {promoDescription}
                  </p>
                </div>

                <div className="bg-slate-100 border border-dashed border-slate-300 rounded-lg p-2 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                      Coupon Code
                    </span>
                    <span className="font-mono font-extrabold text-blue-700 text-sm tracking-wider">
                      {promoCode}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    -$15.00 OFF
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>⚡ Free local pickup at school office</span>
                  <button
                    onClick={() => onOpenCMSPage('faq')}
                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    How it works →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5-Star NY & USA Educator Credibility Trust Bar */}
      {showTrustSeals && (
        <TrustSealsBanner
          onOpenTrustCenter={onOpenTrustCenter}
          onOpenBuyerProtection={onOpenBuyerProtection}
          onOpenDisputeCenter={onOpenDisputeCenter}
          variant="banner"
          siteSettings={siteSettings}
        />
      )}

      {/* Category Visual Jump Cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>Explore Classroom Categories</span>
          </h2>
          <span className="text-[11px] text-slate-500">
            Over 1,700 active items
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative bg-white rounded-lg p-2 sm:p-2.5 border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all text-left flex items-center gap-2.5 overflow-hidden cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={cat.featuredImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">
                  {cat.itemCount} items
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
