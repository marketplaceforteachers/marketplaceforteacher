import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Mail,
  Send,
} from 'lucide-react';
import { Product } from '../types';
import { generateSocialShareLinks, getProductShareUrl, triggerNativeShare } from '../utils/socialShareUtils';

interface SocialShareBarProps {
  product: Product;
  variant?: 'modal' | 'inline' | 'compact';
  onShowToast?: (msg: string) => void;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
  product,
  variant = 'modal',
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const shareLinks = generateSocialShareLinks(product);
  const shareUrl = getProductShareUrl(product);

  const handleCopyLink = () => {
    try {
      navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      if (onShowToast) onShowToast('Listing link copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      if (onShowToast) onShowToast('Listing link copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const shared = await triggerNativeShare(
      product,
      () => {
        if (onShowToast) onShowToast('Shared successfully!');
      },
      () => {
        handleCopyLink();
      }
    );
    if (!shared) {
      handleCopyLink();
    }
  };

  const handleOpenWindow = (url: string, platformName: string) => {
    const width = 600;
    const height = 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      url,
      `share_${platformName}`,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
    if (onShowToast) onShowToast(`Opening ${platformName} share dialog...`);
  };

  return (
    <div id={`social-share-bar-${product.id}`} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-blue-700" />
          <span className="font-bold text-xs text-slate-900">
            Share this Listing with Teachers & Parents
          </span>
        </div>
        <span className="text-[10.5px] text-slate-500 font-medium hidden sm:inline">
          Spread the word & boost discovery
        </span>
      </div>

      {/* Social Button Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* 1. Facebook */}
        <button
          type="button"
          id={`share-fb-${product.id}`}
          onClick={() => handleOpenWindow(shareLinks.find((l) => l.id === 'facebook')?.url || '', 'Facebook')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1877F2] hover:bg-[#1565C0] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          title="Share on Facebook Groups & Timeline"
        >
          <span className="font-black text-sm leading-none">f</span>
          <span>Facebook</span>
        </button>

        {/* 2. X (Twitter) */}
        <button
          type="button"
          id={`share-x-${product.id}`}
          onClick={() => handleOpenWindow(shareLinks.find((l) => l.id === 'x')?.url || '', 'X')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-black hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          title="Post on X (Twitter)"
        >
          <span className="font-black text-sm leading-none">𝕏</span>
          <span>Post on 𝕏</span>
        </button>

        {/* 3. LinkedIn */}
        <button
          type="button"
          id={`share-li-${product.id}`}
          onClick={() => handleOpenWindow(shareLinks.find((l) => l.id === 'linkedin')?.url || '', 'LinkedIn')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          title="Share on LinkedIn Educator Network"
        >
          <span className="font-black text-xs leading-none bg-white text-[#0A66C2] px-1 py-0.5 rounded-xs">in</span>
          <span>LinkedIn</span>
        </button>

        {/* 4. Pinterest */}
        <button
          type="button"
          id={`share-pin-${product.id}`}
          onClick={() => handleOpenWindow(shareLinks.find((l) => l.id === 'pinterest')?.url || '', 'Pinterest')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#E60023] hover:bg-[#b8001c] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          title="Pin to Classroom Board on Pinterest"
        >
          <span className="font-black text-sm leading-none">P</span>
          <span>Pinterest</span>
        </button>
      </div>

      {/* Second Row: WhatsApp, Email & Copy Link Direct */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/80">
        <button
          type="button"
          id={`share-whatsapp-${product.id}`}
          onClick={() => handleOpenWindow(shareLinks.find((l) => l.id === 'whatsapp')?.url || '', 'WhatsApp')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors cursor-pointer"
          title="Share via WhatsApp chat"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          id={`share-email-${product.id}`}
          onClick={() => {
            const mailUrl = shareLinks.find((l) => l.id === 'email')?.url;
            if (mailUrl) window.location.href = mailUrl;
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          title="Email to Teacher Colleague"
        >
          <Mail className="w-3.5 h-3.5 text-slate-600" />
          <span>Email</span>
        </button>

        <button
          type="button"
          id={`share-copy-btn-${product.id}`}
          onClick={handleCopyLink}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-800 border-slate-300 hover:border-blue-500 hover:bg-blue-50/50'
          }`}
          title="Copy direct shareable link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            id={`share-native-btn-${product.id}`}
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
            title="More share options on your device"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>More</span>
          </button>
        )}
      </div>
    </div>
  );
};
