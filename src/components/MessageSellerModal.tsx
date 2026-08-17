import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Product } from '../types';

interface MessageSellerModalProps {
  product: Product | null;
  onClose: () => void;
  onSendMessage: (sellerId: string, text: string, product: Product) => void;
}

export const MessageSellerModal: React.FC<MessageSellerModalProps> = ({
  product,
  onClose,
  onSendMessage,
}) => {
  if (!product) return null;

  const [text, setText] = useState(`Hi ${product.sellerName}, is this classroom item still available for school pickup or shipping?`);
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(product.sellerId, text, product);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900">Message Teacher</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">Message Sent!</h4>
            <p className="text-xs text-slate-500">
              You can continue this conversation in your Teacher Dashboard Messages tab.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="w-10 h-10 rounded-full object-cover border border-emerald-400"
              />
              <div>
                <p className="font-bold text-slate-900">{product.sellerName}</p>
                <p className="text-[11px] text-slate-500">{product.sellerSchool}</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Message</label>
              <textarea
                rows={4}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:border-blue-600 leading-relaxed"
                placeholder="Ask about school pickup times, bundle discounts, or item condition..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
