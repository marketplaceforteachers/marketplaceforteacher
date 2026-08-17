import { Product } from '../types';

export interface SocialShareLink {
  id: 'facebook' | 'x' | 'linkedin' | 'pinterest' | 'whatsapp' | 'email' | 'copy';
  name: string;
  url: string;
  bgColor: string;
  textColor: string;
  iconName: string;
}

export function getProductShareUrl(product: Product): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    return `${origin}?product=${product.id}`;
  }
  return `https://marketplaceforteachers.com/listing/${product.id}`;
}

export function generateSocialShareLinks(product: Product): SocialShareLink[] {
  const shareUrl = getProductShareUrl(product);
  const title = product.title;
  const description = `${product.title} - Only $${product.price.toFixed(2)} on MarketplaceForTeachers.com! Verified teacher-to-teacher classroom supplies.`;
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80';

  // 1. Facebook Share URL
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(description)}`;

  // 2. X (Twitter) Share URL
  const xText = `Check out "${title}" ($${product.price.toFixed(2)}) for classrooms on MarketplaceForTeachers.com! #TeacherSupplies #EdTech #ClassroomResources`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}&url=${encodeURIComponent(shareUrl)}`;

  // 3. LinkedIn Share URL
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  // 4. Pinterest Pin URL
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(primaryImage)}&description=${encodeURIComponent(description)}`;

  // 5. WhatsApp Share URL
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${description} ${shareUrl}`)}`;

  // 6. Direct Email Share URL
  const emailSubject = `Thought you'd like this classroom supply: ${title}`;
  const emailBody = `Hi,\n\nI found this classroom listing on MarketplaceForTeachers.com that might be great for your school or classroom:\n\n${title}\nPrice: $${product.price.toFixed(2)}\nSeller: ${product.sellerName} (${product.sellerSchool || 'Educator'})\n\nView listing here: ${shareUrl}\n\n- Sent via MarketplaceForTeachers.com`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return [
    {
      id: 'facebook',
      name: 'Facebook',
      url: fbUrl,
      bgColor: 'bg-[#1877F2] hover:bg-[#166fe5]',
      textColor: 'text-white',
      iconName: 'facebook',
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      url: xUrl,
      bgColor: 'bg-black hover:bg-slate-900',
      textColor: 'text-white',
      iconName: 'twitter',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: linkedInUrl,
      bgColor: 'bg-[#0A66C2] hover:bg-[#095196]',
      textColor: 'text-white',
      iconName: 'linkedin',
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      url: pinterestUrl,
      bgColor: 'bg-[#E60023] hover:bg-[#c9001f]',
      textColor: 'text-white',
      iconName: 'pinterest',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: whatsAppUrl,
      bgColor: 'bg-[#25D366] hover:bg-[#20ba5a]',
      textColor: 'text-white',
      iconName: 'message-circle',
    },
    {
      id: 'email',
      name: 'Email',
      url: emailUrl,
      bgColor: 'bg-slate-700 hover:bg-slate-800',
      textColor: 'text-white',
      iconName: 'mail',
    },
  ];
}

/**
 * Native Share Sheet for mobile browsers supporting Web Share API
 */
export async function triggerNativeShare(
  product: Product,
  onSuccess?: () => void,
  onFallback?: () => void
): Promise<boolean> {
  const shareUrl = getProductShareUrl(product);
  const title = `${product.title} - MarketplaceForTeachers.com`;
  const text = `Classroom supply listing: "${product.title}" ($${product.price.toFixed(2)}) by ${product.sellerName}.`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      // User canceled or failed
      if ((err as Error)?.name !== 'AbortError' && onFallback) {
        onFallback();
      }
      return false;
    }
  } else {
    if (onFallback) onFallback();
    return false;
  }
}
