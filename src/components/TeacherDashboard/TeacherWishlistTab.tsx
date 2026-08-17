import React from 'react';
import { Heart, ShoppingBag, Trash2, Eye } from 'lucide-react';
import { Product } from '../../types';

interface TeacherWishlistTabProps {
  wishlist: Product[];
  onRemoveFromWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
}

export const TeacherWishlistTab: React.FC<TeacherWishlistTabProps> = ({
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base">My Saved Classroom Wishlist</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Curate materials for upcoming lesson units, grant proposals, or next school term.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Heart className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800">Your classroom wishlist is empty</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any classroom supply to save it here for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-400 transition-colors"
            >
              <div className="flex gap-3">
                <img
                  src={prod.images[0]}
                  alt={prod.title}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {prod.condition}
                  </span>
                  <h4
                    onClick={() => onSelectProduct(prod)}
                    className="font-bold text-xs text-slate-900 line-clamp-2 cursor-pointer hover:text-blue-600 mt-1"
                  >
                    {prod.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{prod.sellerSchool}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-base font-extrabold text-blue-900">
                  ${prod.price.toFixed(2)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRemoveFromWishlist(prod)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
