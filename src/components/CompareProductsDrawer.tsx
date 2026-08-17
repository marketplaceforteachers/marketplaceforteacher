import React from 'react';
import { X, Check, ArrowRight, ShieldCheck, Star, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface CompareProductsDrawerProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  onAddToCart?: (product: Product) => void;
  onClose: () => void;
}

export const CompareProductsDrawer: React.FC<CompareProductsDrawerProps> = ({
  products,
  onRemoveProduct,
  onClearAll,
  onAddToCart,
  onClose,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t-2 border-blue-900 shadow-2xl animate-in slide-in-from-bottom duration-200">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-sm">
              Comparing {products.length} Classroom Supplies (Max 4)
            </span>
            <button
              onClick={onClearAll}
              className="text-[11px] text-red-600 hover:underline font-bold"
            >
              Clear All
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-x-auto">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2 relative flex flex-col justify-between"
            >
              <button
                onClick={() => onRemoveProduct(prod.id)}
                className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full border border-slate-200 shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div>
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="w-full h-24 object-cover rounded-lg border border-slate-200 mb-2"
                />
                <h4 className="font-extrabold text-slate-900 line-clamp-1">{prod.title}</h4>
                <p className="text-sm font-black text-blue-950 mt-0.5">
                  {prod.price === 0 ? 'Free' : `$${prod.price.toFixed(2)}`}
                </p>
              </div>

              {/* Attributes comparison */}
              <div className="space-y-1 text-[11px] pt-2 border-t border-slate-200 text-slate-600">
                <p><strong>Condition:</strong> {prod.condition}</p>
                <p><strong>Grade:</strong> {prod.gradeLevel}</p>
                <p><strong>School:</strong> {prod.sellerSchool}</p>
                <p className="text-emerald-700 font-bold">
                  <strong>Pickup:</strong> {prod.shippingOptions.localPickup ? 'Available' : 'Ship only'}
                </p>
              </div>

              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(prod)}
                  className="w-full py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold text-[11px] mt-2 cursor-pointer"
                >
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
