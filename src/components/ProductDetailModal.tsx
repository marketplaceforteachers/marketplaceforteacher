import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  MapPin,
  Truck,
  Star,
  Share2,
  Flag,
  MessageSquare,
  DollarSign,
  PackageCheck,
  CheckCircle,
  Play,
  ArrowRight,
  Info,
  Calendar,
  Scale,
  Calculator,
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { calculateShippingRates } from '../utils/shippingCalculator';
import { SocialShareBar } from './SocialShareBar';
import { triggerNativeShare, getProductShareUrl } from '../utils/socialShareUtils';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, qty?: number) => void;
  onBuyNow: (p: Product) => void;
  onOpenMakeOffer: (p: Product) => void;
  onOpenMessageSeller: (p: Product) => void;
  onOpenReportListing: (p: Product) => void;
  onSelectRelated: (p: Product) => void;
  relatedProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenMakeOffer,
  onOpenMessageSeller,
  onOpenReportListing,
  onSelectRelated,
  relatedProducts,
}) => {
  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [calcZip, setCalcZip] = useState('73159');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleShare = async () => {
    const shared = await triggerNativeShare(
      product,
      () => {},
      () => {
        const shareUrl = getProductShareUrl(product);
        navigator.clipboard?.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      }
    );
    if (!shared) {
      const shareUrl = getProductShareUrl(product);
      navigator.clipboard?.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <div id="product-detail-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="product-detail-modal-container"
        className="bg-white rounded-2xl max-w-5xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
      >
        {/* Top Floating Close & Share Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-blue-700">MarketplaceForTeachers.com</span>
            <span>/</span>
            <span className="capitalize">{product.categoryId.replace('-', ' ')}</span>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-md">{product.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Gallery & Video */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                {!showVideo ? (
                  <img
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-4">
                    <video
                      controls
                      autoPlay
                      className="max-h-full rounded-lg"
                      src={product.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                    />
                  </div>
                )}

                {product.videoUrl && (
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{showVideo ? 'Show Photos' : 'Watch Teacher Demo'}</span>
                  </button>
                )}

                {/* Condition pill */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm border border-slate-200">
                  Condition: <span className="text-blue-700 font-extrabold">{product.condition}</span>
                </div>
              </div>

              {/* Thumbnails list with up to 10 photos support */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Classroom Photos ({product.images.length} of 10)</span>
                  <span>Photo {selectedImageIndex + 1} of {product.images.length}</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImageIndex(idx);
                        setShowVideo(false);
                      }}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImageIndex === idx && !showVideo
                          ? 'border-blue-600 ring-2 ring-blue-100'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Teacher Seller Card with Privacy Shield */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.sellerAvatar}
                      alt={product.sellerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{product.sellerName}</h4>
                        {product.sellerVerified && (
                          <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Educator
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{product.sellerSchool}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.sellerRating.toFixed(2)}</span>
                        </span>
                        <span>•</span>
                        <span>{product.sellerSalesCount} sales completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onOpenMessageSeller(product)}
                      className="text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Message</span>
                    </button>
                    <button
                      onClick={() => onOpenMakeOffer(product)}
                      className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Make Offer</span>
                    </button>
                  </div>
                </div>

                {/* Privacy Shield Notice */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Educator Privacy Shield: <strong className="text-slate-800">Phone & Personal Address Prohibited/Hidden</strong></span>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    FERPA & Educator Safe
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Checkout CTA, Shipping info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                    {product.categoryId.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Listed on {product.createdAt}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {product.title}
                </h1>

                {/* Pricing Block */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-blue-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-700">
                        You save ${(product.originalPrice! - product.price).toFixed(2)} ({discountPercent}% off retail)
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 block">
                      In Stock ({product.stock})
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Tax exempt with school PO
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 font-semibold text-sm text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onAddToCart(product, quantity)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-bold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-red-500'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* Trust & Escrow Guarantee Box */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Escrow Protection & Buyer Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Your payment is held safely until you receive and inspect your classroom items. <strong>Buyers do NOT need school verification to purchase.</strong>
                  </p>
                </div>

                <button
                  onClick={() => onBuyNow(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Now • Secure Escrow Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Delivery & Pickup Breakdown */}
              {(() => {
                const liveRates = calculateShippingRates(product, calcZip);
                const pkg = product.packageMeasurements;
                return (
                  <div className="border border-slate-200 rounded-xl p-4 space-y-3 text-xs bg-slate-50/40">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Fulfillment & Carrier Distance Rates</span>
                      </h4>
                      {product.shippingOptions.freeShipping && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          FREE SHIPPING
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5 text-slate-600">
                      <div className="flex items-start justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          <span>Ships from Seller:</span>
                        </span>
                        <span className="font-semibold text-slate-800">
                          {product.location.city}, {product.location.state} {product.location.zip}
                        </span>
                      </div>

                      {pkg && (
                        <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                          <span className="flex items-center gap-1">
                            <Scale className="w-3.5 h-3.5 text-blue-600" />
                            <span>Package Specs:</span>
                          </span>
                          <span className="font-semibold">
                            {pkg.weightLbs} lbs {pkg.weightOz ? `${pkg.weightOz} oz` : ''} • {pkg.lengthInches}" × {pkg.widthInches}" × {pkg.heightInches}"
                          </span>
                        </div>
                      )}

                      {/* Distance ZIP Estimator Input */}
                      <div className="p-2.5 rounded-lg bg-white border border-blue-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                            <Calculator className="w-3.5 h-3.5 text-blue-600" />
                            <span>Calculate Shipping to Your School / ZIP:</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={calcZip}
                              onChange={(e) => setCalcZip(e.target.value.slice(0, 5))}
                              className="w-16 px-1.5 py-0.5 border border-slate-300 rounded font-mono font-bold text-center text-xs"
                              placeholder="73159"
                            />
                          </div>
                        </div>

                        {/* Live Carrier Breakdown */}
                        <div className="space-y-1.5 pt-1">
                          {liveRates.map((rate, rIdx) => (
                            <div
                              key={rate.carrierKey ? `${rate.carrierKey}-${rIdx}` : `${rate.id}-${rate.serviceName}-${rIdx}`}
                              className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 last:border-0"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-800">
                                  {rate.carrierName || rate.carrierKey.toUpperCase()} {rate.serviceName}
                                </span>
                                <span className="text-[10px] text-slate-400">({rate.estimatedDays})</span>
                              </div>
                              <span className="font-mono font-bold text-blue-900">
                                {rate.rate === 0 ? 'FREE' : `$${rate.rate.toFixed(2)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {product.shippingOptions.localPickup && (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                          <span className="font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Free Local Pickup Available
                          </span>
                          <p className="text-[11px] text-emerald-700">
                            {product.shippingOptions.pickupInstructions || 'Safe contactless pickup at campus front office.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Social Media Sharing Suite: Facebook, X, LinkedIn, Pinterest, WhatsApp, Copy Link */}
              <SocialShareBar product={product} />

              {/* Report Listing Flag */}
              <div className="text-right">
                <button
                  onClick={() => onOpenReportListing(product)}
                  className="text-[11px] text-slate-400 hover:text-red-500 font-medium inline-flex items-center gap-1"
                >
                  <Flag className="w-3 h-3" /> Report this listing
                </button>
              </div>
            </div>
          </div>

          {/* Description & Technical Specs */}
          <div className="border-t border-slate-200 pt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
              <h3 className="font-bold text-base text-slate-900">Item Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>

              {/* Grade levels & tags */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Recommended Grade Levels
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.gradeLevel.map((gl, glIdx) => (
                    <span
                      key={`${gl}-${glIdx}`}
                      className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      {gl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="md:col-span-4 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                  Item Specifications
                </h4>
                <div className="divide-y divide-slate-200 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="py-1.5 flex justify-between gap-2">
                      <span className="text-slate-500">{key}:</span>
                      <span className="font-semibold text-slate-800 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Verified Educator Reviews</h3>
                <p className="text-xs text-slate-500">
                  Reviews from authenticated teachers who purchased this item or transacted with {product.sellerName}.
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.sellerRating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {product.reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-lg">
                No reviews yet for this specific listing. {product.sellerName} holds a {product.sellerRating} overall rating across {product.sellerSalesCount} transactions.
              </p>
            ) : (
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rev.userName}</span>
                        <span className="text-slate-500">({rev.userSchool})</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Classroom Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Similar Classroom Listings</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white cursor-pointer group transition-all space-y-2"
                  >
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={rel.images[0]}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-blue-600">
                        {rel.title}
                      </h5>
                      <span className="font-extrabold text-blue-900 text-xs">
                        ${rel.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
