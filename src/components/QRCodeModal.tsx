import React, { useState } from 'react';
import { QrCode, Download, Share2, CheckCircle2, X, School, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://marketplaceforteachers.com/p/${product.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://marketplaceforteachers.com/p/${product.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-55 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4 text-center">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <QrCode className="w-4 h-4 text-blue-900" /> Listing & Pickup QR
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{product.title}</h4>
          <p className="text-xs text-slate-500">{product.sellerSchool}</p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
          <img src={qrDataUrl} alt="Listing QR Code" className="w-44 h-44 mx-auto rounded-lg" />
        </div>

        <div className="p-2.5 bg-blue-50 text-blue-950 rounded-xl text-[11px] font-medium border border-blue-100 flex items-center gap-2 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Show this QR to the front office secretary or seller to verify instant handoff.</span>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {copied ? 'Link Copied!' : 'Copy Direct Link'}
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
