import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  PlusCircle,
  X,
  ShoppingBag,
} from 'lucide-react';
import { ProductBundle, User } from '../types';
import { INITIAL_BUNDLES } from '../data/bundlesData';

interface ClassroomBundlesShowcaseProps {
  bundles?: ProductBundle[];
  currentUser?: User;
  onAddToCart?: (bundle: ProductBundle) => void;
  onBuyBundle?: (bundle: ProductBundle) => void;
  onSelectBundle?: (bundle: ProductBundle) => void;
  onCreateBundleClick?: () => void;
  onOpenBundleBuilder?: () => void;
}

const DEFAULT_GUEST_USER: User = {
  id: 'usr-guest',
  name: 'Classroom Supporter',
  email: 'supporter@marketplaceforteachers.com',
  role: 'guest',
  schoolName: 'Community Supporter',
  state: 'OK',
  city: 'Oklahoma City',
  zip: '73159',
  rating: 5.0,
  reviewCount: 0,
  salesCount: 0,
  verified: false,
  verifiedTeacher: false,
};

export const ClassroomBundlesShowcase: React.FC<ClassroomBundlesShowcaseProps> = ({
  bundles = INITIAL_BUNDLES,
  currentUser = DEFAULT_GUEST_USER,
  onAddToCart,
  onBuyBundle,
  onSelectBundle,
  onCreateBundleClick,
  onOpenBundleBuilder,
}) => {
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(null);
  const safeBundles = Array.isArray(bundles) && bundles.length > 0 ? bundles : INITIAL_BUNDLES;

  const handleBuy = (bundle: ProductBundle) => {
    if (onBuyBundle) {
      onBuyBundle(bundle);
    } else if (onAddToCart) {
      onAddToCart(bundle);
    }
  };

  const handleCreate = () => {
    if (onCreateBundleClick) {
      onCreateBundleClick();
    } else if (onOpenBundleBuilder) {
      onOpenBundleBuilder();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/40 text-amber-300 text-xs font-bold">
            <Package className="w-3.5 h-3.5" />
            Curated Classroom Starter Bundles
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Save Up to 45% with Complete Supply Packages
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Specially bundled by veteran educators for first-year teachers, grade-level switches, science lab revamps, and complete sensory corners.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {currentUser?.role === 'teacher' && (onCreateBundleClick || onOpenBundleBuilder) && (
              <button
                onClick={handleCreate}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Build & List a Custom Surplus Bundle
              </button>
            )}
            <span className="text-xs text-blue-200 font-medium">
              📦 Single shipping box for all bundled items
            </span>
          </div>
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeBundles.map((bundle) => {
          const savings = bundle.originalPrice - bundle.bundlePrice;
          const imageSrc = bundle.images?.[0] || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80';

          return (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={imageSrc}
                    alt={bundle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                    {bundle.discountPercent}% OFF BUNDLE
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {Array.isArray(bundle.gradeLevel) ? bundle.gradeLevel.join(', ') : bundle.gradeLevel} • {bundle.itemTitles?.length || 0} Supplies Included
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={bundle.sellerAvatar}
                      alt={bundle.sellerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">{bundle.sellerName}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500">{bundle.sellerSchool}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {bundle.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Package Contents</span>
                    <div className="space-y-1">
                      {(bundle.itemTitles || []).slice(0, 3).map((itemTitle, idx) => (
                        <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1 font-medium">{itemTitle}</span>
                        </div>
                      ))}
                      {(bundle.itemTitles?.length || 0) > 3 && (
                        <span className="text-[10px] font-bold text-blue-700 pl-5">
                          + {(bundle.itemTitles?.length || 0) - 3} more items in bundle
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Buy footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-900">${bundle.bundlePrice.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 line-through font-semibold">
                      ${bundle.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-extrabold">
                    You save ${savings.toFixed(2)} instantly
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedBundle(bundle)}
                    className="p-2 border border-slate-300 hover:bg-white text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    onClick={() => onAddToCart?.(bundle)}
                    className="py-2 px-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Buy Bundle
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bundle Detail Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  {selectedBundle.discountPercent}% Bundle Discount
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedBundle.title}</h3>
                <p className="text-xs text-slate-500">Curated by {selectedBundle.sellerName} • {selectedBundle.sellerSchool}</p>
              </div>
              <button
                onClick={() => setSelectedBundle(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedBundle.images?.[0] || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80'}
              alt={selectedBundle.title}
              className="w-full h-52 object-cover rounded-xl border border-slate-200"
            />

            <p className="text-xs text-slate-700 leading-relaxed">{selectedBundle.description}</p>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                All Included Supplies ({selectedBundle.itemTitles?.length || 0})
              </h4>
              <div className="space-y-2">
                {(selectedBundle.itemTitles || []).map((title, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">{title}</span>
                    <span className="font-bold text-emerald-700">Included in Bundle</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 block font-medium">Bundled Deal Price</span>
                <span className="text-2xl font-black text-emerald-950">${selectedBundle.bundlePrice.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through ml-2">${selectedBundle.originalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={() => {
                  onAddToCart?.(selectedBundle);
                  setSelectedBundle(null);
                }}
                className="py-2.5 px-5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
              >
                Add Complete Bundle to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
