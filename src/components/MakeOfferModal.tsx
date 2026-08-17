import React, { useState } from 'react';
import { Tag, AlertCircle, X } from 'lucide-react';
import { Product, User, ProductOffer } from '../types';

interface MakeOfferModalProps {
  product: Product | null;
  onClose: () => void;
  currentUser?: User;
  onSubmitOffer: (productId: string, amount: number, message: string) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  product,
  onClose,
  currentUser,
  onSubmitOffer,
}) => {
  const [offerAmount, setOfferAmount] = useState(
    product ? Math.round(product.price * 0.85).toString() : '20'
  );
  const [message, setMessage] = useState(
    'Hi! I am purchasing this for my classroom. Would you consider this offer?'
  );
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;

  const currentPrice = product.price;
  const numericOffer = parseFloat(offerAmount) || currentPrice;
  const discountPct = Math.round(((currentPrice - numericOffer) / currentPrice) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericOffer <= 0 || numericOffer > currentPrice) {
      setError(`Please enter a valid offer between $1 and $${currentPrice}.`);
      return;
    }

    onSubmitOffer(product.id, numericOffer, message.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-55 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Make an Offer</h3>
              <p className="text-xs text-slate-500">Negotiate directly with verified teacher seller</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-14 h-14 rounded-lg object-cover border border-slate-200"
          />
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{product.title}</h4>
            <p className="text-[11px] text-slate-500">{product.sellerSchool}</p>
            <p className="text-xs font-black text-blue-950 mt-0.5">
              Listed Price: ${product.price.toFixed(2)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Your Offered Price ($ USD)</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[0.9, 0.85, 0.8].map((mult) => {
                const val = Math.round(product.price * mult);
                return (
                  <button
                    type="button"
                    key={mult}
                    onClick={() => setOfferAmount(val.toString())}
                    className={`py-1.5 rounded-lg font-bold border transition-colors ${
                      offerAmount === val.toString()
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ${val} ({Math.round((1 - mult) * 100)}% off)
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                type="number"
                min="1"
                max={product.price}
                step="1"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 font-black text-sm text-slate-900"
                required
              />
            </div>
            {discountPct > 0 && (
              <p className="text-[11px] text-emerald-700 font-bold mt-1">
                You are offering {discountPct}% below the asking price.
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Note to Teacher Seller</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
              placeholder="e.g. Can pick up at your school office this Friday!"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-[11px] font-medium border border-blue-100 flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              The teacher has 48 hours to accept, counter, or decline. If accepted, you will be notified to finalize payment.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-black bg-blue-900 hover:bg-blue-800 text-white shadow-sm"
            >
              Send Offer to Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
