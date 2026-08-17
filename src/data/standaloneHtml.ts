export const STANDALONE_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>Marketplace For Teachers™ | #1 Rated USA Educator Marketplace for Classroom Supplies, Books & STEM</title>
  <meta name="title" content="Marketplace For Teachers™ | #1 Rated USA Educator Marketplace for Classroom Supplies, Books & STEM">
  <meta name="description" content="The premier verified marketplace for certified USA teachers & school districts. Buy, sell, and exchange classroom supplies, books, teacher desks, and STEM kits with 100% Payment Custody protection and zero listing fees.">
  <meta name="keywords" content="marketplace for teachers, teacher supplies, classroom materials, NY teacher supplies, used textbooks, teacher desks, STEM kits, school district purchase orders, FERPA compliant">
  <meta name="author" content="MarketplaceForTeachers.com, LLC">
  <link rel="canonical" href="https://marketplaceforteachers.com/">
  <meta name="theme-color" content="#1e3a8a">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            }
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  
  <!-- React 18 & Babel Standalone CDNs -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.6/babel.min.js" crossorigin="anonymous"></script>
  <script>
    if (!window.React) {
      document.write('<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"><' + '/script>');
    }
    if (!window.ReactDOM) {
      document.write('<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"><' + '/script>');
    }
    if (!window.Babel) {
      document.write('<script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel.min.js"><' + '/script>');
    }
  </script>

  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    .font-serif { font-family: 'Playfair Display', Georgia, serif; }
    .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    
    /* Smooth Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
  <div id="root">
    <div id="mft-loading-screen" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f8fafc; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #0f172a; text-align: center; padding: 24px;">
      <div style="max-width: 440px; width: 100%; background: #ffffff; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <div style="width: 48px; height: 48px; border: 4px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: mft-spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <h2 style="font-weight: 800; font-size: 20px; margin-bottom: 8px; color: #1e3a8a;">Marketplace For Teachers™</h2>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 16px;">
          Loading USA Educator Supply Exchange & cPanel Production Bundle...
        </p>
        <div style="font-size: 11px; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 8px 12px; border-radius: 10px;">
          ✓ cPanel Production Ready • FERPA Compliant • 100% Escrow Protection
        </div>
      </div>
    </div>
    <style>@keyframes mft-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
  </div>

  <script>
    window.addEventListener('error', function(e) {
      var loader = document.getElementById('mft-loading-screen');
      if (loader) {
        loader.innerHTML = '<div style="color:#dc2626;font-weight:bold;font-size:14px;margin-bottom:8px;">Marketplace For Teachers - Load Notice</div><p style="font-size:12px;color:#475569;margin-bottom:12px;">Script or CDN network loading error detected: ' + (e.message || 'Error') + '</p><button onclick="window.location.reload()" style="background:#2563eb;color:#fff;font-weight:bold;padding:8px 16px;border:none;border-radius:8px;cursor:pointer;">Reload Page</button>';
      }
    });
  </script>

  <script type="text/babel">
    const { useState, useEffect, useMemo, Component } = React;

    // Built-in SVG Icon renderer (Zero third-party DOM mutation crashes)
    const LucideIcon = ({ name, className = "w-4 h-4" }) => {
      const paths = {
        'megaphone': <path d="m3 11 18-5v12L3 14v-3z M11.6 16.8 a3 3 0 1 1-5.8-1.6" />,
        'shield-check': <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />,
        'check-circle-2': <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M9 12l2 2 4-4" />,
        'map-pin': <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
        'search': <path d="m21 21-4.35-4.35 M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />,
        'badge-check': <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z M9 12l2 2 4-4" />,
        'plus-circle': <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v8 M8 12h8" />,
        'shopping-bag': <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" />,
        'layers': <path d="m12 2 10 5-10 5L2 7z M2 17l10 5 10-5 M2 12l10 5 10-5" />,
        'users': <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
        'building-2': <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18 M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2" />,
        'newspaper': <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2 M18 14h-8 M18 18h-8 M18 10h-8" />,
        'heart': <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
        'settings': <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
        'sparkles': <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />,
        'star': <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
        'x': <path d="M18 6 6 18 M6 6l12 12" />,
        'book-open': <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
        'cpu': <g><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 15h3 M1 9h3 M1 15h3" /></g>,
        'armchair': <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3 M5 11v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5 M3 11h18 M6 18v3 M18 18v3" />,
        'microscope': <path d="M6 18h8 M3 22h18 M14 22a7 7 0 1 0-14 0 M9 14l2-2 M12 6l3 3 M9 3l6 6" />,
        'calculator': <g><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M8 10h.01 M12 10h.01 M16 10h.01 M8 14h.01 M12 14h.01 M8 18h.01 M12 18h.01" /></g>,
        'palette': <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.71 1.7-1.63 0-.43-.17-.83-.44-1.14-.27-.31-.44-.71-.44-1.16 0-.92.78-1.67 1.7-1.67h1.98c3.03 0 5.5-2.47 5.5-5.5 0-4.97-4.03-9-9-9z" />,
        'file-text': <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
      };

      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={className}
        >
          {paths[name] || <circle cx="12" cy="12" r="10" />}
        </svg>
      );
    };

    const LOGO_SVG_STR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 100" width="100%" height="100%"><defs><linearGradient id="mft-icon-bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e3a8a" /><stop offset="60%" stop-color="#1e40af" /><stop offset="100%" stop-color="#0f172a" /></linearGradient><linearGradient id="mft-cap-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8" /><stop offset="100%" stop-color="#2563eb" /></linearGradient></defs><g transform="translate(10, 10)"><rect x="0" y="0" width="80" height="80" rx="18" fill="url(#mft-icon-bg)" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.4" /><g transform="translate(11, 11) scale(1.6)"><path d="M5 26.5C8.5 24.5 13 24.8 18 27.5C23 24.8 27.5 24.5 31 26.5V11C27.5 9 23 9.3 18 12C13 9.3 8.5 9 5 11V26.5Z" fill="#ffffff" fill-opacity="0.18" /><path d="M5 26.5C8.5 24.5 13 24.8 18 27.5V12C13 9.3 8.5 9 5 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><path d="M31 26.5C27.5 24.5 23 24.8 18 27.5V12C23 9.3 27.5 9 31 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="18" y1="12" x2="18" y2="28" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round" /><path d="M18 4L28 9L18 14L8 9L18 4Z" fill="url(#mft-cap-grad)" stroke="#e0f2fe" stroke-width="1.2" stroke-linejoin="round" /><path d="M26 10V16.5C26 17 25 17.5 25 18" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" /><circle cx="25" cy="18.5" r="1.2" fill="#ef4444" /><circle cx="18" cy="8.8" r="1.5" fill="#fbbf24" /></g></g><g transform="translate(108, 48)"><text font-family="-apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="800" font-size="34" fill="#0f172a" letter-spacing="-0.5">Marketplace<tspan fill="#dc2626" font-weight="900">ForTeachers</tspan><tspan fill="#64748b" font-size="22" font-weight="600">.com</tspan></text></g><g transform="translate(110, 75)"><text font-family="-apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="13.5" fill="#475569" letter-spacing="1.8">VERIFIED EDUCATOR SUPPLY EXCHANGE</text></g></svg>';

    const LOGO_WHITE_SVG_STR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 100" width="100%" height="100%"><defs><linearGradient id="mft-icon-bg-w" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2563eb" /><stop offset="100%" stop-color="#1d4ed8" /></linearGradient></defs><g transform="translate(10, 10)"><rect x="0" y="0" width="80" height="80" rx="18" fill="url(#mft-icon-bg-w)" stroke="#60a5fa" stroke-width="1.5" /><g transform="translate(11, 11) scale(1.6)"><path d="M5 26.5C8.5 24.5 13 24.8 18 27.5C23 24.8 27.5 24.5 31 26.5V11C27.5 9 23 9.3 18 12C13 9.3 8.5 9 5 11V26.5Z" fill="#ffffff" fill-opacity="0.25" /><path d="M5 26.5C8.5 24.5 13 24.8 18 27.5V12C13 9.3 8.5 9 5 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><path d="M31 26.5C27.5 24.5 23 24.8 18 27.5V12C23 9.3 27.5 9 31 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="18" y1="12" x2="18" y2="28" stroke="#93c5fd" stroke-width="1.8" stroke-linecap="round" /><path d="M18 4L28 9L18 14L8 9L18 4Z" fill="#38bdf8" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round" /><path d="M26 10V16.5C26 17 25 17.5 25 18" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" /><circle cx="25" cy="18.5" r="1.2" fill="#ef4444" /><circle cx="18" cy="8.8" r="1.5" fill="#fbbf24" /></g></g><g transform="translate(108, 48)"><text font-family="-apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="800" font-size="34" fill="#ffffff" letter-spacing="-0.5">Marketplace<tspan fill="#f87171" font-weight="900">ForTeachers</tspan><tspan fill="#94a3b8" font-size="22" font-weight="600">.com</tspan></text></g><g transform="translate(110, 75)"><text font-family="-apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="13.5" fill="#cbd5e1" letter-spacing="1.8">VERIFIED EDUCATOR SUPPLY EXCHANGE</text></g></svg>';

    const INITIAL_SITE_SETTINGS = {
      heroBadge: '100% Buyer Protection Guarantee • Real-Time Carrier Distance Shipping',
      heroTitle: 'Buy, Sell & Exchange Supplies with Fellow Educators',
      heroSubtitle: 'Connect directly with certified public, charter, and private school teachers across New York, Oklahoma, Texas, and all 50 states.',
      promoTitle: 'Teacher Appreciation Discount',
      promoDescription: 'Take $15 OFF classroom library sets, science kits & supplies of $60+.',
      promoCode: 'APPRECIATION',
      showPromoCard: true,
      showTrustSealsBanner: true,
      announcementText: 'Verified US Educators (Sellers) • Buyers: No Verification Needed • Free Shipping Options Available',
      supportEmail: 'info@marketplaceforteachers.com',
      supportPhone: '(405) 555-8322',
      hqAddress: '9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159',
      commissionRate: 5.0
    };

    const CATEGORY_JUMP_CARDS = [
      { id: 'books', name: 'Guided Reading & Books', count: '4,250+ Items', icon: 'book-open', color: 'bg-amber-500' },
      { id: 'stem', name: 'STEM & Robotics Kits', count: '1,820+ Items', icon: 'cpu', color: 'bg-blue-600' },
      { id: 'furniture', name: 'Teacher Desks & Seating', count: '940+ Items', icon: 'armchair', color: 'bg-emerald-600' },
      { id: 'special-ed', name: 'Special Education & Sensory', count: '1,150+ Items', icon: 'heart', color: 'bg-rose-500' },
      { id: 'science', name: 'Science & Lab Equipment', count: '890+ Items', icon: 'microscope', color: 'bg-purple-600' },
      { id: 'math', name: 'Math Manipulatives', count: '1,410+ Items', icon: 'calculator', color: 'bg-teal-600' },
      { id: 'art', name: 'Arts, Crafts & Music', count: '1,680+ Items', icon: 'palette', color: 'bg-orange-500' },
      { id: 'curriculum', name: 'Curriculum & Decor', count: '2,300+ Items', icon: 'sparkles', color: 'bg-indigo-600' },
    ];

    const INITIAL_PRODUCTS = [
      {
        id: 'p-1',
        title: 'Guided Reading Complete Leveled Library (Fountas & Pinnell Levels A-N)',
        price: 85.00,
        originalPrice: 240.00,
        category: 'books',
        condition: 'Like New',
        state: 'NY',
        sellerName: 'Mrs. Sarah Jenkins, M.Ed.',
        sellerSchool: 'NYC District 2 Elementary (PS 116)',
        sellerRating: 4.95,
        photos: [
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Includes 120 guided reading books organized in color-coded book tubs with level stickers. Ideal for K-3 literacy centers or Title I interventions.'
      },
      {
        id: 'p-2',
        title: 'LEGO Education SPIKE Prime & WeDo 2.0 Robotics Classroom Bundle',
        price: 290.00,
        originalPrice: 650.00,
        category: 'stem',
        condition: 'Brand New',
        state: 'OK',
        sellerName: 'Coach Marcus Vance',
        sellerSchool: 'Oklahoma City Public Schools (OKCPS)',
        sellerRating: 5.0,
        photos: [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Complete STEM robotics set with motors, sensors, hubs, and 450+ building elements. Fully sanitized and sorted into original storage bins with curriculum cards.'
      },
      {
        id: 'p-3',
        title: 'Heavy-Duty Teacher Executive Desk with Locking Drawers & Mobile Pod',
        price: 140.00,
        originalPrice: 480.00,
        category: 'furniture',
        condition: 'Gently Used',
        state: 'TX',
        sellerName: 'Dr. Robert Lawson',
        sellerSchool: 'Dallas ISD Academy',
        sellerRating: 4.88,
        photos: [
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Laminate oak finish teacher desk with built-in power strip, cable routing, and filing drawers. School District PO approved for school facility transfer.'
      },
      {
        id: 'p-4',
        title: 'Sensory Room Modular Wobble Stools & Calming Corner Crash Pad',
        price: 65.00,
        originalPrice: 185.00,
        category: 'special-ed',
        condition: 'Like New',
        state: 'NY',
        sellerName: 'Ms. Emily Rivera',
        sellerSchool: 'Brooklyn Public School 321',
        sellerRating: 5.0,
        photos: [
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Set of 4 active ergonomic flexible seating stools and vinyl waterproof sensory crash cushion. Perfect for neurodivergent and ADHD sensory integration.'
      },
      {
        id: 'p-5',
        title: 'Compound Monocular Biology Microscope Lab Pack (Set of 6)',
        price: 210.00,
        originalPrice: 520.00,
        category: 'science',
        condition: 'Like New',
        state: 'NY',
        sellerName: 'Mr. David Chen',
        sellerSchool: 'Queens Academy of Science PS 122',
        sellerRating: 4.98,
        photos: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'All-metal optics, 40X-1000X magnification, dual LED illumination with rechargeable batteries. Includes 50 prepared glass slides and dust covers.'
      },
      {
        id: 'p-6',
        title: 'Base Ten Blocks & Fraction Tile Math Manipulative Station',
        price: 45.00,
        originalPrice: 110.00,
        category: 'math',
        condition: 'Good',
        state: 'OK',
        sellerName: 'Mrs. Amanda Hayes',
        sellerSchool: 'Tulsa Public Schools District 1',
        sellerRating: 4.92,
        photos: [
          'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Classroom set of plastic base-ten cubes, rod blocks, flat units, and magnetic rainbow fraction circles with teacher activity cards.'
      },
      {
        id: 'p-7',
        title: 'Classroom Ukulele & Percussion Rhythm Instrument Cart (24 Instruments)',
        price: 175.00,
        originalPrice: 420.00,
        category: 'art',
        condition: 'Like New',
        state: 'CA',
        sellerName: 'Ms. Chloe Bennett',
        sellerSchool: 'Los Angeles Unified School District (LAUSD)',
        sellerRating: 4.97,
        photos: [
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Includes 12 soprano wooden ukuleles with padded gig bags, 6 tambourines, 6 maracas, and a rolling metal storage rack.'
      },
      {
        id: 'p-8',
        title: 'Interactive World Map Wall Tapestry & Geography Discovery Set',
        price: 38.00,
        originalPrice: 85.00,
        category: 'curriculum',
        condition: 'Brand New',
        state: 'FL',
        sellerName: "Mr. James O'Connor",
        sellerSchool: 'Miami-Dade County Public Schools',
        sellerRating: 4.91,
        photos: [
          'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Large 6x4ft felt world map with 150+ velcro country flags, landmarks, and animals for social studies centers.'
      }
    ];

    const INITIAL_BUNDLES = [
      {
        id: 'b-1',
        title: 'Elementary K-5 Complete STEM Lab Starter Bundle',
        price: 380,
        savings: 'Save $240',
        items: ['SPIKE Prime Robotics Kit', '3D Pen Station', '40x Microscope', 'Science Lab Safety Goggles Pack'],
        tag: 'Top Value Choice'
      },
      {
        id: 'b-2',
        title: 'Title I Guided Reading & Phonics Mastery Kit',
        price: 160,
        savings: 'Save $110',
        items: ['Leveled Library (A-N)', 'Magnetic Letter Boards (Set of 12)', 'Word-Building Phoneme Tiles'],
        tag: 'NY DOE Certified'
      }
    ];

    function App() {
      const [activeTab, setActiveTab] = useState('marketplace');
      const [siteSettings, setSiteSettings] = useState(INITIAL_SITE_SETTINGS);
      const [products, setProducts] = useState(INITIAL_PRODUCTS);
      const [cart, setCart] = useState([]);
      const [couponInput, setCouponInput] = useState('');
      const [discountAmount, setDiscountAmount] = useState(0);
      const [appliedCoupon, setAppliedCoupon] = useState('');
      const [selectedCategory, setSelectedCategory] = useState('all');
      const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedProduct, setSelectedProduct] = useState(null);
      
      // Modals
      const [isCartOpen, setIsCartOpen] = useState(false);
      const [isVerifyOpen, setIsVerifyOpen] = useState(false);
      const [isSellOpen, setIsSellOpen] = useState(false);
      const [isSupportOpen, setIsSupportOpen] = useState(false);
      
      // Teacher Verification Form State
      const [verifEmail, setVerifEmail] = useState('');
      const [verifSchool, setVerifSchool] = useState('');
      const [verifPin, setVerifPin] = useState('');
      const [verifStep, setVerifStep] = useState(1);
      const [isVerifiedTeacher, setIsVerifiedTeacher] = useState(false);
      
      // Sell Item Form State
      const [newTitle, setNewTitle] = useState('');
      const [newPrice, setNewPrice] = useState('');
      const [newCategory, setNewCategory] = useState('books');
      const [newState, setNewState] = useState('NY');
      const [newCondition, setNewCondition] = useState('Like New');
      const [newDesc, setNewDesc] = useState('');

      const [toastMsg, setToastMsg] = useState('');

      const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3500);
      };

      const filteredProducts = useMemo(() => {
        return products.filter(p => {
          if (selectedStateFilter !== 'ALL' && p.state !== selectedStateFilter) return false;
          if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sellerSchool.toLowerCase().includes(q);
          }
          return true;
        });
      }, [products, selectedStateFilter, selectedCategory, searchQuery]);

      const addToCart = (product) => {
        setCart(prev => [...prev, product]);
        showToast(\`Added "\${product.title.slice(0, 28)}..." to cart!\`);
      };

      const applyCoupon = () => {
        const code = couponInput.trim().toUpperCase();
        if (code === siteSettings.promoCode || code === 'APPRECIATION') {
          setDiscountAmount(15.00);
          setAppliedCoupon(code);
          showToast('Applied $15.00 Teacher Appreciation Discount!');
        } else if (code === 'TEACHER10') {
          const cartTotal = cart.reduce((a, b) => a + b.price, 0);
          setDiscountAmount(cartTotal * 0.10);
          setAppliedCoupon('TEACHER10');
          showToast('Applied 10% Educator Discount!');
        } else {
          showToast('Invalid promo code. Try APPRECIATION or TEACHER10');
        }
      };

      const handleRequestPin = (e) => {
        e.preventDefault();
        if (!verifEmail || !verifEmail.includes('@')) {
          showToast('Please enter a valid school webmail address.');
          return;
        }
        setVerifStep(2);
        showToast(\`PIN sent to \${verifEmail}! Use test PIN: 849201\`);
      };

      const handleVerifyPin = (e) => {
        e.preventDefault();
        setIsVerifiedTeacher(true);
        setIsVerifyOpen(false);
        setVerifStep(1);
        showToast('Congratulations! Verified Educator Badge activated!');
      };

      const handleCreateListing = (e) => {
        e.preventDefault();
        if (!newTitle || !newPrice) {
          showToast('Title and Price are required.');
          return;
        }
        const newProd = {
          id: 'p-' + Date.now(),
          title: newTitle,
          price: parseFloat(newPrice) || 0,
          originalPrice: (parseFloat(newPrice) || 0) * 2,
          category: newCategory,
          condition: newCondition,
          state: newState,
          sellerName: 'Verified Educator',
          sellerSchool: verifSchool || 'USA Public School District',
          sellerRating: 5.0,
          photos: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'],
          description: newDesc || 'Quality classroom supply listed with zero seller fees.'
        };
        setProducts([newProd, ...products]);
        setIsSellOpen(false);
        setNewTitle('');
        setNewPrice('');
        setNewDesc('');
        showToast('Listing posted successfully with 0% seller fee!');
      };

      const rawCartTotal = cart.reduce((a, b) => a + b.price, 0);
      const finalCartTotal = Math.max(0, rawCartTotal - discountAmount);

      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          {/* Top Announcement Bar */}
          <div className="bg-amber-400 text-slate-950 text-xs py-1.5 px-4 font-bold border-b border-amber-500/30">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate">
                <LucideIcon name="megaphone" className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                <span className="truncate">{siteSettings.announcementText}</span>
              </span>
              <button onClick={() => setIsSupportOpen(true)} className="text-slate-900 hover:underline cursor-pointer text-[11px] font-extrabold shrink-0">
                Contact Support →
              </button>
            </div>
          </div>

          {/* Top Security & Compliance Bar */}
          <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <LucideIcon name="shield-check" className="w-3.5 h-3.5" />
                  <span>100% Payment Custody Protection</span>
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="hidden sm:flex items-center gap-1 text-slate-300">
                  <LucideIcon name="check-circle-2" className="w-3.5 h-3.5 text-blue-400" />
                  <span>Verified USA Educators Only (.edu / School Webmail)</span>
                </span>
                <span className="hidden md:inline text-slate-600">•</span>
                <span className="hidden md:inline text-amber-300 font-medium">FERPA & School Purchase Order (PO) Certified</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <LucideIcon name="map-pin" className="w-3.5 h-3.5 text-rose-400" />
                  <span>HQ: Oklahoma City, OK • NY DOE Active</span>
                </span>
                <span>•</span>
                <button onClick={() => setIsSupportOpen(true)} className="hover:text-white underline cursor-pointer">Support Desk</button>
              </div>
            </div>
          </div>

          {/* Main Dark Blue Header Navigation */}
          <header className="sticky top-0 z-40 bg-[#13284c] border-b border-blue-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
              <div className="flex items-center justify-between gap-4">
                {/* Logo */}
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('marketplace'); }} className="flex items-center gap-2 shrink-0">
                  <div className="w-52 sm:w-64 h-10" dangerouslySetInnerHTML={{ __html: LOGO_WHITE_SVG_STR }} />
                </a>

                {/* Search Bar & Location Pill */}
                <div className="flex-1 max-w-xl hidden md:flex items-center">
                  <div className="relative w-full flex items-center bg-white/10 rounded-full border border-white/20 focus-within:bg-white/20 focus-within:border-white/40 px-3.5 py-1.5 transition-all">
                    <LucideIcon name="search" className="w-4 h-4 text-white/70 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search classroom supplies, city, state, or ZIP..."
                      className="bg-transparent border-none text-xs text-white w-full focus:outline-none placeholder:text-white/60"
                    />
                    <div className="h-4 w-px bg-white/20 mx-2.5 shrink-0" />
                    <button 
                      onClick={() => setSelectedStateFilter('OK')}
                      className="text-xs font-semibold text-white/90 hover:text-white whitespace-nowrap flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      <LucideIcon name="map-pin" className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Oklahoma City, OK (7315...</span>
                    </button>
                  </div>
                </div>

                {/* Right Action Icons & Buttons */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={() => setIsSellOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <LucideIcon name="plus-circle" className="w-3.5 h-3.5" />
                    <span>+ Post Listing</span>
                  </button>

                  <button onClick={() => setIsSupportOpen(true)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg relative cursor-pointer" title="Notifications">
                    <LucideIcon name="bell" className="w-4.5 h-4.5" />
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full leading-tight">2</span>
                  </button>

                  <button onClick={() => setSelectedCategory('all')} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg relative cursor-pointer" title="Wishlist">
                    <LucideIcon name="heart" className="w-4.5 h-4.5" />
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full leading-tight">2</span>
                  </button>

                  <button onClick={() => setIsCartOpen(true)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg relative cursor-pointer" title="Cart">
                    <LucideIcon name="shopping-bag" className="w-4.5 h-4.5" />
                    <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[9px] font-bold px-1 rounded-full leading-tight">{cart.length}</span>
                  </button>

                  <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center border border-emerald-300">
                      AD
                    </div>
                    <button onClick={() => setIsVerifyOpen(true)} className="text-white/80 hover:text-white text-xs font-semibold cursor-pointer hidden sm:inline">
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pt-2.5 border-t border-white/10 mt-2.5 text-xs font-bold text-white/80">
                <button onClick={() => setActiveTab('marketplace')} className={activeTab === 'marketplace' ? "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white shadow-xs" : "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 hover:bg-white/10 text-white/90"}>
                  <LucideIcon name="shopping-bag" className="w-3.5 h-3.5" /> Marketplace
                </button>
                <button onClick={() => setActiveTab('bundles')} className={activeTab === 'bundles' ? "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white shadow-xs" : "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 hover:bg-white/10 text-white/90"}>
                  <LucideIcon name="layers" className="w-3.5 h-3.5" /> Classroom Bundles
                </button>
                <button onClick={() => setActiveTab('community')} className={activeTab === 'community' ? "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white shadow-xs" : "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 hover:bg-white/10 text-white/90"}>
                  <LucideIcon name="users" className="w-3.5 h-3.5" /> Educator Community
                </button>
                <button onClick={() => setActiveTab('directory')} className={activeTab === 'directory' ? "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white shadow-xs" : "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 hover:bg-white/10 text-white/90"}>
                  <LucideIcon name="building-2" className="w-3.5 h-3.5" /> USA School Directory
                </button>
                <button onClick={() => setActiveTab('news')} className={activeTab === 'news' ? "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white shadow-xs" : "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 hover:bg-white/10 text-white/90"}>
                  <LucideIcon name="newspaper" className="w-3.5 h-3.5" /> Marketplace News
                </button>
                <button onClick={() => setActiveTab('fundraising')} className={activeTab === 'fundraising' ? "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white shadow-xs" : "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 hover:bg-white/10 text-white/90"}>
                  <LucideIcon name="heart" className="w-3.5 h-3.5" /> Wishlists & Grants
                </button>
                <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 bg-slate-800 text-white" : "px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 hover:bg-white/10 text-white/70"}>
                  <LucideIcon name="settings" className="w-3.5 h-3.5" /> Admin CMS Portal
                </button>
              </div>
            </div>
          </header>

          {/* Hero Banner */}
          {activeTab === 'marketplace' && (
            <div className="space-y-4">
              <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className={\`\${siteSettings.showPromoCard ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3\`}>
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3.5 py-1 text-xs text-blue-200 font-semibold">
                      <LucideIcon name="sparkles" className="w-3.5 h-3.5 text-amber-300" />
                      <span>{siteSettings.heroBadge}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      {siteSettings.heroTitle}
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
                      {siteSettings.heroSubtitle}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button onClick={() => setSelectedCategory('all')} className="bg-white text-blue-900 font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-sm hover:bg-slate-100">
                        Browse All Supplies
                      </button>
                      <button onClick={() => setIsSellOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                        Post Free Listing
                      </button>
                    </div>
                  </div>

                  {/* Promo Discount Card */}
                  {siteSettings.showPromoCard && (
                    <div className="lg:col-span-5">
                      <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-white/40 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <LucideIcon name="sparkles" className="w-3 h-3 text-red-600" /> Promo Offer
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">Verified Educator Discount</span>
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">{siteSettings.promoTitle}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{siteSettings.promoDescription}</p>
                        </div>
                        <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-500 font-extrabold uppercase block">Coupon Code</span>
                            <span className="font-mono font-black text-blue-700 text-sm">{siteSettings.promoCode}</span>
                          </div>
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                            -$15.00 OFF
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 5-Star Credibility Banner */}
              {siteSettings.showTrustSealsBanner && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-amber-400">
                        <LucideIcon name="star" className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <LucideIcon name="star" className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <LucideIcon name="star" className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <LucideIcon name="star" className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <LucideIcon name="star" className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="font-extrabold text-slate-900">4.9 / 5.0 Rated Educator Website</span>
                      <span className="text-slate-400 hidden sm:inline">•</span>
                      <span className="text-slate-600 hidden sm:inline">12,450+ Verified USA Teacher Reviews</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <LucideIcon name="shield-check" className="w-3.5 h-3.5" /> 100% Payment Custody
                      </span>
                      <span className="flex items-center gap-1">
                        <LucideIcon name="file-text" className="w-3.5 h-3.5 text-blue-600" /> Tax-Exempt PO Billing
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Jump Cards */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {CATEGORY_JUMP_CARDS.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={\`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer \${
                        selectedCategory === cat.id 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300 hover:shadow-xs'
                      }\`}
                    >
                      <div className={\`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold mb-2 \${cat.color}\`}>
                        <LucideIcon name={cat.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs leading-snug line-clamp-1">{cat.name}</h4>
                        <p className={\`text-[10px] font-semibold mt-0.5 \${selectedCategory === cat.id ? 'text-blue-100' : 'text-slate-500'}\`}>{cat.count}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area (2-Column Layout with Filters Sidebar) */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
            {activeTab === 'marketplace' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Sidebar: Filters */}
                <aside className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-xs tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                      <LucideIcon name="sliders" className="w-3.5 h-3.5 text-blue-600" />
                      FILTERS 8
                    </span>
                    <button 
                      onClick={() => { setSelectedCategory('all'); setSelectedStateFilter('ALL'); setSearchQuery(''); }}
                      className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer uppercase"
                    >
                      RESET
                    </button>
                  </div>

                  {/* Verified Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/80">
                    <input 
                      type="checkbox" 
                      checked={isVerifiedTeacher} 
                      onChange={(e) => setIsVerifiedTeacher(e.target.checked)} 
                      className="mt-0.5 accent-emerald-600 rounded cursor-pointer" 
                    />
                    <div>
                      <span className="text-xs font-extrabold text-emerald-900 block">Verified Teachers Only</span>
                      <span className="text-[10px] text-emerald-700 block leading-tight">Items from authenticated US educators.</span>
                    </div>
                  </label>

                  {/* Category Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">CATEGORY</label>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-600"
                    >
                      <option value="all">All Categories (1770)</option>
                      <option value="books">Guided Reading & Books</option>
                      <option value="stem">STEM & Electronics</option>
                      <option value="furniture">Furniture & Desks</option>
                      <option value="special-ed">Special Education</option>
                      <option value="science">Science Equipment</option>
                      <option value="math">Math Manipulatives</option>
                    </select>
                  </div>

                  {/* Price Range Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <span>PRICE RANGE</span>
                      <span className="text-blue-700">$0 - $300+</span>
                    </div>
                    <input type="range" min="0" max="300" defaultValue="300" className="w-full accent-blue-600 cursor-pointer" />
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      LOCATION / STATE, CITY, ZIP <span className="text-slate-400">HQ: 73159</span>
                    </span>
                    
                    <select 
                      value={selectedStateFilter}
                      onChange={(e) => setSelectedStateFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-600"
                    >
                      <option value="ALL">All 50 US States & Territories</option>
                      <option value="OK">Oklahoma (OK)</option>
                      <option value="TX">Texas (TX)</option>
                      <option value="NY">New York (NY)</option>
                      <option value="CA">California (CA)</option>
                      <option value="FL">Florida (FL)</option>
                      <option value="IL">Illinois (IL)</option>
                    </select>

                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {['OK', 'TX', 'NY', 'CA', 'FL', 'IL'].map(st => (
                        <button 
                          key={st}
                          onClick={() => setSelectedStateFilter(st)}
                          className={selectedStateFilter === st ? "px-2 py-0.5 rounded text-[10px] font-black cursor-pointer transition-colors bg-blue-600 text-white" : "px-2 py-0.5 rounded text-[10px] font-black cursor-pointer transition-colors bg-slate-100 text-slate-600 hover:bg-slate-200"}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <input 
                      type="text" 
                      placeholder="e.g. Oklahoma City, Dallas, 73159..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
                    />
                  </div>
                </aside>

                {/* Right Area: Product Listings Grid */}
                <div className="lg:col-span-9 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span>Showing {filteredProducts.length} classroom supplies</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Sort By:</span>
                      <select className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none">
                        <option>Featured & Best Matches</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Distance: Nearest First</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group relative">
                        
                        {/* Top Badges & Image */}
                        <div>
                          <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                            <img src={product.photos[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            
                            <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                              {product.condition}
                            </span>

                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <button className="w-6 h-6 rounded-full bg-white/90 text-slate-700 hover:text-rose-600 flex items-center justify-center shadow-xs cursor-pointer">
                                <LucideIcon name="heart" className="w-3.5 h-3.5" />
                              </button>
                              <button className="w-6 h-6 rounded-full bg-white/90 text-slate-700 hover:text-blue-600 flex items-center justify-center shadow-xs cursor-pointer">
                                <LucideIcon name="repeat" className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Discount Tag */}
                            <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </span>
                          </div>

                          <div className="p-3 space-y-1.5">
                            {/* Seller & School */}
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-extrabold text-slate-800 flex items-center gap-1 truncate max-w-[130px]">
                                <LucideIcon name="badge-check" className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="truncate">{product.sellerSchool || 'School District'}</span>
                              </span>
                              <span className="text-[10px] font-bold text-amber-500 shrink-0">★ {product.sellerRating}</span>
                            </div>

                            <h3 className="font-black text-slate-900 text-xs line-clamp-2 leading-snug">{product.title}</h3>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                              <span>{product.state === 'OK' ? 'Oklahoma City, OK (2.4m)' : (product.state + ' District')}</span>
                              <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[9px]">PICKUP</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Quick Actions */}
                        <div className="p-3 pt-0 border-t border-slate-100 mt-1 space-y-2">
                          <div className="flex items-baseline justify-between pt-1">
                            <div>
                              <span className="text-base font-black text-slate-900">\${product.price.toFixed(2)}</span>
                              <span className="text-xs text-slate-400 line-through ml-1.5">\${product.originalPrice.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <button onClick={() => setSelectedProduct(product)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-1.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1">
                              <LucideIcon name="eye" className="w-3.5 h-3.5" /> View
                            </button>
                            <button onClick={() => addToCart(product)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1">
                              <LucideIcon name="plus" className="w-3.5 h-3.5" /> Add
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'bundles' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <h2 className="text-xl font-extrabold text-slate-900">Curated Classroom Supply Bundles</h2>
                  <p className="text-xs text-slate-600">Complete multi-item classroom packages compiled by experienced USA educators and district procurement specialists.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {INITIAL_BUNDLES.map(b => (
                    <div key={b.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">{b.tag}</span>
                        <h3 className="text-base font-extrabold text-slate-900">{b.title}</h3>
                        <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                          {b.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <LucideIcon name="check-circle-2" className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div>
                          <span className="text-xl font-black text-slate-900">\${b.price}</span>
                          <span className="text-xs text-emerald-600 font-bold ml-2">{b.savings}</span>
                        </div>
                        <button onClick={() => showToast(\`Added \${b.title} to cart!\`)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                          Add Bundle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h2 className="text-lg font-extrabold text-slate-900">Educator Community & Discussion Forum</h2>
                <p className="text-slate-600">Connect with fellow verified USA public, charter, and private school educators to exchange teaching strategies, grant tips, and classroom surplus advice.</p>
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-extrabold text-blue-900 text-sm">Best strategies for Title I Guided Reading Centers on a tight budget?</span>
                    <p className="text-slate-500">Started by Mrs. Sarah Jenkins • NYC District 2 • 14 Replies</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-extrabold text-blue-900 text-sm">How to streamline Oklahoma City School District PO submissions?</span>
                    <p className="text-slate-500">Started by Coach Marcus Vance • OKCPS • 8 Replies</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'directory' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h2 className="text-lg font-extrabold text-slate-900">USA School District Directory</h2>
                <p className="text-slate-600">Browse verified school districts across New York, Oklahoma, Texas, California, Florida, and all 50 states for PO authorization.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <h3 className="font-extrabold text-slate-900">New York City DOE (NY)</h3>
                    <p className="text-slate-500">Vendor ID #Active • 1,200+ Verified Teachers</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <h3 className="font-extrabold text-slate-900">Oklahoma City Public Schools (OK)</h3>
                    <p className="text-slate-500">PO Department Active • 450+ Verified Teachers</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <h3 className="font-extrabold text-slate-900">Dallas ISD (TX)</h3>
                    <p className="text-slate-500">PO Desk Active • 800+ Verified Teachers</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'news' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h2 className="text-lg font-extrabold text-slate-900">Marketplace News & Educator Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase">Compliance & Grants</span>
                    <h3 className="font-bold text-slate-900 text-sm">How Oklahoma & New York Teachers Save $1,200/Yr on Classroom Out-of-Pocket Expenses</h3>
                    <p className="text-slate-500">Discover peer-to-peer supply exchange strategies and school district purchase order shortcuts.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase">Security Brief</span>
                    <h3 className="font-bold text-slate-900 text-sm">Understanding 100% Payment Custody Safeguards for Educator Purchases</h3>
                    <p className="text-slate-500">Learn how funds remain safely held until verified tracking confirms supply delivery.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fundraising' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h2 className="text-lg font-extrabold text-slate-900">Classroom Wishlists & Supply Grants</h2>
                <p className="text-slate-600">Support verified USA classroom projects directly with supply donations or micro-grants.</p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                  <h3 className="font-bold text-blue-900 text-sm">Ms. Rivera's Brooklyn Elementary Sensory Corner Project</h3>
                  <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-3/4"></div>
                  </div>
                  <div className="flex justify-between text-slate-600 font-bold">
                    <span>Raised: $225 of $300 goal</span>
                    <span>75% Funded</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Admin CMS Portal & Control Center</h2>
                    <p className="text-slate-500">Manage marketplace parameters, system logs, promo discounts, and brand assets.</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full">System Normal</span>
                </div>

                {/* Hero & Promo Discount Controls */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-sm">Hero Banner & Teacher Appreciation Promo Editor</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Promo Card Title</label>
                      <input 
                        type="text" 
                        value={siteSettings.promoTitle} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, promoTitle: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Promo Coupon Code</label>
                      <input 
                        type="text" 
                        value={siteSettings.promoCode} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, promoCode: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-extrabold text-blue-700"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Promo Card Description</label>
                      <input 
                        type="text" 
                        value={siteSettings.promoDescription} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, promoDescription: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={siteSettings.showPromoCard} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, showPromoCard: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-bold text-slate-800">Show Teacher Appreciation Promo Card</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={siteSettings.showTrustSealsBanner} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, showTrustSealsBanner: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-bold text-slate-800">Show 5-Star Educator Website Banner</span>
                    </label>
                  </div>

                  <button onClick={() => showToast('Saved Hero & Promo Discount settings!')} className="bg-blue-600 text-white font-extrabold px-4 py-2 rounded-xl cursor-pointer">
                    Save Changes
                  </button>
                </div>

                {/* Vector Brand Logo Asset Download Center */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">Brand Logo Vector Asset Center</h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                    <div className="w-48 h-10" dangerouslySetInnerHTML={{ __html: LOGO_SVG_STR }} />
                    <button onClick={() => {
                      const blob = new Blob([LOGO_SVG_STR], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'marketplace-for-teachers-logo.svg';
                      a.click();
                      URL.revokeObjectURL(url);
                    }} className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold px-4 py-2 rounded-xl cursor-pointer">
                      Download Vector SVG Logo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-extrabold text-white">MarketplaceForTeachers.com, LLC</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Headquarters: {siteSettings.hqAddress}</p>
              </div>
              <div className="flex items-center gap-4 text-slate-400 flex-wrap">
                <span>FERPA Compliant</span>
                <span>•</span>
                <span>100% Payment Custody</span>
                <span>•</span>
                <span>Resend REST API Active</span>
              </div>
            </div>
          </footer>

          {/* Modal: Product Quick View Detail */}
          {selectedProduct && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button onClick={() => setSelectedProduct(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full cursor-pointer">
                  <LucideIcon name="x" className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <img src={selectedProduct.photos[0]} alt={selectedProduct.title} className="w-full h-60 object-cover rounded-xl" />
                  <div className="space-y-3 text-xs">
                    <span className="bg-blue-100 text-blue-900 font-extrabold px-2.5 py-1 rounded-full uppercase">{selectedProduct.condition}</span>
                    <h3 className="text-base font-extrabold text-slate-900">{selectedProduct.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                    <div className="text-slate-800 font-bold space-y-1 pt-2 border-t border-slate-100">
                      <p>Seller: {selectedProduct.sellerName}</p>
                      <p className="text-slate-500 text-[11px]">{selectedProduct.sellerSchool}</p>
                      <p className="text-emerald-600 text-[11px]">✓ 100% Payment Custody Protection Active</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-900">\${selectedProduct.price.toFixed(2)}</span>
                      <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="bg-blue-600 text-white font-extrabold px-5 py-2.5 rounded-xl cursor-pointer">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Cart Drawer */}
          {isCartOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
              <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl relative">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <LucideIcon name="shopping-bag" className="w-5 h-5 text-blue-600" />
                      <span>Educator Shopping Cart ({cart.length})</span>
                    </h3>
                    <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                      <LucideIcon name="x" className="w-5 h-5" />
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <LucideIcon name="shopping-bag" className="w-12 h-12 mx-auto text-slate-300" />
                      <p className="font-bold text-xs text-slate-600">Your cart is currently empty.</p>
                      <p className="text-[11px] text-slate-400">Browse verified classroom supplies to add items.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl items-center justify-between text-xs">
                          <img src={item.photos[0]} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                            <p className="text-[11px] text-slate-500">\${item.price.toFixed(2)}</p>
                          </div>
                          <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-rose-500 font-bold cursor-pointer">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Coupon Input */}
                  {cart.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700">Have a Teacher Promo Code?</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="APPRECIATION or TEACHER10"
                          className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase"
                        />
                        <button onClick={applyCoupon} className="bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-xl cursor-pointer">
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span>\${rawCartTotal.toFixed(2)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Discount ({appliedCoupon}):</span>
                          <span>-\${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t border-slate-100">
                        <span>Total:</span>
                        <span>\${finalCartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => { setCart([]); setIsCartOpen(false); showToast('Order placed successfully with 100% Payment Custody Protection!'); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl cursor-pointer">
                      Complete Checkout (\${finalCartTotal.toFixed(2)})
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal: Teacher Verification */}
          {isVerifyOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl text-xs">
                <button onClick={() => setIsVerifyOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <LucideIcon name="x" className="w-5 h-5" />
                </button>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <LucideIcon name="badge-check" className="w-5 h-5 text-blue-600" />
                    <span>School Webmail Educator Verification</span>
                  </h3>
                  <p className="text-slate-500 text-[11px]">Verify your school email (.edu, .k12.*, .org) to unlock the Verified Educator Badge & 0% selling fee.</p>
                </div>

                {verifStep === 1 ? (
                  <form onSubmit={handleRequestPin} className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">School Webmail Address</label>
                      <input 
                        type="email" 
                        value={verifEmail}
                        onChange={(e) => setVerifEmail(e.target.value)}
                        placeholder="sjenkins@schools.nyc.gov"
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">School or District Name</label>
                      <input 
                        type="text" 
                        value={verifSchool}
                        onChange={(e) => setVerifSchool(e.target.value)}
                        placeholder="NYC District 2 / PS 116"
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                      />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl cursor-pointer">
                      Send 6-Digit Verification PIN
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPin} className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Enter 6-Digit PIN sent to {verifEmail}</label>
                      <input 
                        type="text" 
                        value={verifPin}
                        onChange={(e) => setVerifPin(e.target.value)}
                        placeholder="849201"
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-center font-mono font-extrabold text-lg text-blue-700 tracking-widest"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl cursor-pointer">
                      Confirm PIN & Activate Badge
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Modal: List Item (Sell) */}
          {isSellOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl text-xs overflow-y-auto max-h-[90vh]">
                <button onClick={() => setIsSellOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <LucideIcon name="x" className="w-5 h-5" />
                </button>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <LucideIcon name="plus-circle" className="w-5 h-5 text-blue-600" />
                    <span>List Item for Sale (0% Seller Listing Fee)</span>
                  </h3>
                  <p className="text-slate-500 text-[11px]">List your unused classroom supplies, books, desks, or science kits for fellow USA teachers.</p>
                </div>

                <form onSubmit={handleCreateListing} className="space-y-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Item Title</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Fountas & Pinnell Guided Reading Kit"
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Selling Price ($)</label>
                      <input 
                        type="number" 
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="75.00"
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white"
                      >
                        <option value="books">Guided Reading & Books</option>
                        <option value="stem">STEM & Robotics</option>
                        <option value="furniture">Desks & Furniture</option>
                        <option value="special-ed">Special Education</option>
                        <option value="science">Science Lab</option>
                        <option value="math">Math Manipulatives</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Condition</label>
                      <select 
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white"
                      >
                        <option value="Brand New">Brand New</option>
                        <option value="Like New">Like New</option>
                        <option value="Gently Used">Gently Used</option>
                        <option value="Good">Good</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">US State Location</label>
                      <select 
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white"
                      >
                        <option value="NY">New York (NY)</option>
                        <option value="OK">Oklahoma (OK)</option>
                        <option value="TX">Texas (TX)</option>
                        <option value="CA">California (CA)</option>
                        <option value="FL">Florida (FL)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Item Description</label>
                    <textarea 
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Describe what is included, grade level, and condition..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl cursor-pointer">
                    Post Item Listing (0% Commission Fee)
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Modal: Support & Help */}
          {isSupportOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl text-xs">
                <button onClick={() => setIsSupportOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <LucideIcon name="x" className="w-5 h-5" />
                </button>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900">Official Educator Support Desk</h3>
                  <p className="text-slate-500 text-[11px]">Contact our Oklahoma City HQ team for purchase orders or verification help.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-700 font-medium">
                  <p><strong>Email:</strong> {siteSettings.supportEmail}</p>
                  <p><strong>Phone:</strong> {siteSettings.supportPhone}</p>
                  <p><strong>HQ:</strong> {siteSettings.hqAddress}</p>
                </div>
                <button onClick={() => { setIsSupportOpen(false); showToast('Support ticket dispatched to HQ team!'); }} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl cursor-pointer">
                  Dispatch Support Inquiry
                </button>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {toastMsg && (
            <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2">
              <LucideIcon name="check-circle-2" className="w-4 h-4 text-emerald-400" />
              <span>{toastMsg}</span>
            </div>
          )}
        </div>
      );
    }

    // Safety Error Boundary
    class ErrorBoundary extends Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      componentDidCatch(error, errorInfo) {
        console.error("Marketplace App Error:", error, errorInfo);
      }
      render() {
        if (this.state.hasError) {
          return (
            <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Marketplace For Teachers</h2>
              <p className="text-xs text-slate-600">The page encountered an error loading. Please refresh your browser.</p>
              <button onClick={() => window.location.reload()} className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
                Reload Website
              </button>
            </div>
          );
        }
        return this.props.children;
      }
    }

    ReactDOM.createRoot(document.getElementById('root')).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  </script>
</body>
</html>
`;
