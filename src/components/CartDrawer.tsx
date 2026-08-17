import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { CartItem, ShippingMethodType } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onUpdateShipping: (productId: string, method: ShippingMethodType) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onUpdateShipping,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const itemsList = items || [];
  const subtotal = itemsList.reduce((acc, it) => acc + (it?.product?.price || 0) * (it?.quantity || 1), 0);
  const shippingTotal = itemsList.reduce((acc, it) => acc + (it?.shippingCost || 0) * (it?.quantity || 1), 0);
  const total = subtotal + shippingTotal;

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base text-slate-900">Your Classroom Cart</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800">Your Cart is Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse affordable classroom libraries, markers, STEM kits, and furniture to get started!
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm"
              >
                Browse Listings
              </button>
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.product.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={it.product.images[0]}
                    alt={it.product.title}
                    className="w-16 h-16 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight">
                      {it.product.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Seller: {it.product.sellerSchool}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-extrabold text-blue-900 text-sm">
                        ${it.product.price.toFixed(2)}
                      </span>

                      {/* Quantity buttons */}
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button
                          onClick={() => onUpdateQuantity(it.product.id, it.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(it.product.id, it.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Selector per item */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <select
                      value={it.selectedShipping}
                      onChange={(e) =>
                        onUpdateShipping(it.product.id, e.target.value as ShippingMethodType)
                      }
                      className="bg-white border border-slate-300 rounded text-[11px] font-medium py-1 px-1.5 focus:outline-hidden"
                    >
                      {it.product.shippingOptions.localPickup && (
                        <option value="pickup">Local School Pickup ($0.00)</option>
                      )}
                      {it.product.shippingOptions.freeShipping && (
                        <option value="free">Free Standard Shipping ($0.00)</option>
                      )}
                      {it.product.shippingOptions.usps && (
                        <option value="usps">
                          USPS Media/Priority (${it.product.shippingOptions.flatRate.toFixed(2)})
                        </option>
                      )}
                      {it.product.shippingOptions.ups && (
                        <option value="ups">
                          UPS Ground (${(it.product.shippingOptions.flatRate + 3.0).toFixed(2)})
                        </option>
                      )}
                    </select>
                  </div>

                  <button
                    onClick={() => onRemoveItem(it.product.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Materials Subtotal:</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Est.:</span>
                <span className="font-semibold text-slate-900">${shippingTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Est. Total:</span>
                <span className="text-blue-900 text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified Teacher Protected Escrow
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
