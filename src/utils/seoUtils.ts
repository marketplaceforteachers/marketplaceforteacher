import { Product } from '../types';

export const updateMetaTags = (
  title: string,
  description: string,
  image?: string,
  url?: string,
  additionalTags?: Record<string, string>
) => {
  document.title = title;
  
  const updateTag = (selector: string, attribute: string, value: string) => {
    let tag = document.querySelector(selector);
    if (!tag) {
      const [tagName, attrSelector] = selector.split('[');
      if (tagName === 'meta') {
        tag = document.createElement('meta');
        if (attrSelector) {
          const match = attrSelector.match(/(name|property)="([^"]+)"/);
          if (match) {
            tag.setAttribute(match[1], match[2]);
            document.head.appendChild(tag);
          }
        }
      } else if (tagName === 'link') {
        tag = document.createElement('link');
        tag.setAttribute('rel', 'canonical');
        document.head.appendChild(tag);
      }
    }
    if (tag) {
      tag.setAttribute(attribute, value);
    }
  };

  updateTag('meta[name="title"]', 'content', title);
  updateTag('meta[name="description"]', 'content', description);
  
  // Open Graph
  updateTag('meta[property="og:title"]', 'content', title);
  updateTag('meta[property="og:description"]', 'content', description);
  if (image) {
    updateTag('meta[property="og:image"]', 'content', image);
    updateTag('meta[name="twitter:image"]', 'content', image);
  }
  if (url) {
    updateTag('meta[property="og:url"]', 'content', url);
    updateTag('link[rel="canonical"]', 'href', url);
  }

  // Twitter
  updateTag('meta[name="twitter:title"]', 'content', title);
  updateTag('meta[name="twitter:description"]', 'content', description);

  // Additional Open Graph / Product tags
  if (additionalTags) {
    Object.entries(additionalTags).forEach(([prop, val]) => {
      updateTag(`meta[property="${prop}"]`, 'content', val);
    });
  }
};

export const injectJsonLd = (id: string, data: object) => {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

export const removeJsonLd = (id: string) => {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
};

export const updateProductMetaTags = (product: Product) => {
  const title = `${product.title} - $${product.price.toFixed(2)} | Marketplace For Teachers™`;
  const description = `${product.title}. ${product.description ? product.description.slice(0, 160) : 'Buy classroom-tested supplies directly from verified teachers with 100% buyer protection guarantee.'} Available for $${product.price.toFixed(2)}.`;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&h=630&q=80';
  const url = `https://marketplaceforteachers.com/?product=${product.id}`;

  const isUnavailable = product.stock === 0 || product.status === 'sold';

  updateMetaTags(title, description, image, url, {
    'og:type': 'product',
    'product:price:amount': product.price.toString(),
    'product:price:currency': 'USD',
    'product:availability': isUnavailable ? 'out of stock' : 'in stock',
    'product:condition': product.condition?.toLowerCase().includes('new') ? 'new' : 'used',
    'product:retailer_item_id': product.id,
    'product:category': product.categoryId || 'Educational Supplies',
    'product:brand': product.sellerSchool || product.sellerName || 'Marketplace For Teachers',
  });

  // Inject Rich Schema.org Product structured data
  injectJsonLd('product-jsonld', {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.images || [image],
    description: product.description || `Classroom supplies offered by ${product.sellerName || 'Verified Educator'}.`,
    sku: `MFT-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.sellerSchool || 'Marketplace For Teachers',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: product.condition?.toLowerCase().includes('new')
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
      availability: isUnavailable
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        name: product.sellerName || 'Verified Educator',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (product.sellerRating || 4.9).toString(),
      reviewCount: (product.sellerSalesCount || 28).toString(),
    },
  });
};

export const updateCategoryMetaTags = (categoryName: string, categoryId: string) => {
  const title = `${categoryName} Classroom Supplies & Books | Marketplace For Teachers™`;
  const description = `Shop verified teacher ${categoryName.toLowerCase()} classroom supplies, STEM equipment, and books with zero upfront fees and 100% buyer protection guarantee.`;
  const url = `https://marketplaceforteachers.com/?category=${encodeURIComponent(categoryId)}`;

  updateMetaTags(title, description, undefined, url, {
    'og:type': 'website',
    'product:category': categoryName,
  });

  injectJsonLd('category-jsonld', {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Classroom Supplies`,
    url,
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Marketplace For Teachers',
      url: 'https://marketplaceforteachers.com/',
    },
  });
};

export const updateViewMetaTags = (view: string) => {
  const viewTitles: Record<string, { title: string; description: string }> = {
    wishlists: {
      title: 'Classroom Wishlists Explorer | Fund Verified Teacher Supplies',
      description: 'Explore and support real teacher classroom wishlists. Direct funding for books, STEM equipment, and elementary supplies.',
    },
    fundraising: {
      title: 'Classroom Project Fundraisers | Marketplace For Teachers™',
      description: 'Support teacher-led classroom crowdfunding initiatives and micro-grants with 0% platform fees.',
    },
    'local-map': {
      title: 'Local Classroom Surplus Pickup Map | Find Nearby Teachers',
      description: 'Browse local school district surplus and teacher supplies available for safe zero-shipping campus pickup.',
    },
    bundles: {
      title: 'Classroom Supply Bundles & Teacher Starter Kits | Save 40%',
      description: 'Curated complete classroom starter bundles for 1st-year educators and grade-level transitions.',
    },
    inspiration: {
      title: 'Classroom Design Inspiration & Setup Gallery | Teacher Ideas',
      description: 'Browse high-impact classroom setups, reading corners, and STEM maker stations with direct product links.',
    },
    community: {
      title: 'Teacher Community & Lesson Surplus Exchange Forum',
      description: 'Connect with verified educators nationwide to share classroom management tips and resource swaps.',
    },
    schools: {
      title: 'USA School District Directory | Partner Campuses & PO Support',
      description: 'Verified public, charter, and private schools active on Marketplace For Teachers with tax-exempt PO fulfillment.',
    },
    rewards: {
      title: 'Teacher Rewards Club & Classroom Grants | Earn Points',
      description: 'Earn educator reward points on every transaction and redeem for classroom supply grants and gift cards.',
    },
    'buyer-protection': {
      title: '100% Buyer Protection Guarantee | Marketplace For Teachers™',
      description: 'Learn how our secure payment protection and verified teacher payout holding safeguards schools and teachers on every purchase.',
    },
    'trust-center': {
      title: 'Trust & Educator Credential Verification Center',
      description: 'State teacher license validation, FERPA/COPPA student privacy compliance, and fraud prevention.',
    },
    'become-a-seller': {
      title: 'Become a Verified Teacher Seller | Turn Surplus into Classroom Funds',
      description: 'Join thousands of teachers earning money by clearing their classroom storage. Zero upfront listing fees.',
    },
  };

  const info = viewTitles[view];
  if (info) {
    updateMetaTags(
      `${info.title} | Marketplace For Teachers™`,
      info.description,
      undefined,
      `https://marketplaceforteachers.com/?view=${view}`
    );
  }
};

export const resetDefaultMetaTags = () => {
  const title = 'Marketplace For Teachers™ | #1 Rated USA Educator Marketplace for Classroom Supplies, Books & STEM';
  const description = 'Marketplace For Teachers is the #1 trusted marketplace for verified USA educators & school districts. Buy, sell, and exchange classroom supplies, books, desks, and STEM kits with 100% buyer protection guarantee.';
  const url = 'https://marketplaceforteachers.com/';
  const image = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&h=630&q=80';

  removeJsonLd('product-jsonld');
  removeJsonLd('category-jsonld');

  updateMetaTags(title, description, image, url, {
    'og:type': 'website',
  });
};
