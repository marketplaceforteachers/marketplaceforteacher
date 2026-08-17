import React from 'react';
import {
  Heart,
  ShieldCheck,
  MapPin,
  Truck,
  Star,
  Eye,
  Plus,
  ArrowRightLeft,
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onCompare?: (product: Product) => void;
  isCompared?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onCompare,
  isCompared = false,
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative text-left"
    >
      {/* Top Image Container */}
      <div
        className="relative aspect-16/11 overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Condition Tag */}
        <span
          className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider ${
            product.condition === 'Brand New'
              ? 'bg-emerald-600 text-white'
              : product.condition === 'Like New'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-white'
          }`}
        >
          {product.condition}
        </span>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute bottom-1.5 left-1.5 bg-red-600 text-white text-[8.5px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wide">
            {discountPercent}% OFF
          </span>
        )}

        {/* Action button overlay: Wishlist & Compare */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-1 rounded-full backdrop-blur-md shadow-xs transition-transform active:scale-90 ${
              isWishlisted
                ? 'bg-red-50 text-red-600'
                : 'bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {onCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCompare(product);
              }}
              className={`p-1 rounded-full backdrop-blur-md shadow-xs transition-transform active:scale-90 ${
                isCompared
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white'
              }`}
              title={isCompared ? 'Comparing item' : 'Compare with other supplies'}
            >
              <ArrowRightLeft className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
        {/* Seller Info line */}
        <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1 truncate max-w-[75%]">
            <span className="text-slate-600 truncate">{product.sellerSchool}</span>
            {product.sellerVerified && (
              <span title="Verified K-12 Educator">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0 inline" />
              </span>
            )}
          </div>
          {product.reviews.length > 0 ? (
            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[9.5px] shrink-0">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{product.sellerRating.toFixed(1)}</span>
            </div>
          ) : (
            <span className="text-[8.5px] text-slate-400">Verified</span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="text-[11.5px] font-bold text-slate-900 line-clamp-2 group-hover:text-blue-700 cursor-pointer transition-colors leading-tight min-h-[2.1rem]"
        >
          {product.title}
        </h3>

        {/* Location & Delivery */}
        <div className="flex items-center justify-between text-[9.5px] text-slate-500">
          <span className="flex items-center gap-0.5 truncate max-w-[60%]">
            <MapPin className="w-2.5 h-2.5 text-red-500 shrink-0" />
            <span className="truncate">
              {product.location.city}, {product.location.state}
              {product.location.distanceMiles !== undefined && ` (${product.location.distanceMiles}m)`}
            </span>
          </span>

          {product.shippingOptions.localPickup ? (
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded text-[8.5px] border border-emerald-100 shrink-0 uppercase">
              Pickup
            </span>
          ) : product.shippingOptions.freeShipping ? (
            <span className="text-blue-700 font-bold bg-blue-50 px-1 py-0.2 rounded text-[8.5px] border border-blue-100 shrink-0 uppercase">
              Free Ship
            </span>
          ) : null}
        </div>

        {/* Price and Action Buttons */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-[9px] text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
              title="Quick view product details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="p-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white transition-colors shadow-2xs cursor-pointer"
              title="Add item to classroom cart"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
