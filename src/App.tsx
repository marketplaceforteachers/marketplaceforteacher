import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  MapPin,
  Heart,
  Grid,
  List,
  CheckCircle2,
  Plus,
  Package,
  Layers,
  FileCode,
  Users,
  Settings,
  Mail,
  Receipt,
  Percent,
  Camera,
  Globe,
  Gift,
  HandHeart,
  MessageSquare,
  Building2,
  Award,
  Newspaper,
  TrendingUp,
  Scale,
  ShieldAlert,
  Wallet,
  CreditCard,
  BookOpen,
  RefreshCw,
  Server,
} from 'lucide-react';
import {
  User,
  Product,
  CartItem,
  Order,
  ShippingMethodType,
  AuditLog,
  NotificationItem,
  AdminNotification,
  AdminFeeSettings,
  SiteSettings,
  CMSPage,
  ProductBundle,
  DisputeCase,
  FraudAlert,
  SellerVerificationRequest,
  SellerPayoutRequest,
  CompanyPaymentGatewayConfig,
  EducatorArticle,
} from './types';
import {
  MOCK_USERS,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_AUDIT_LOGS,
  MOCK_NOTIFICATIONS,
  MOCK_DISPUTES,
  MOCK_FRAUD_ALERTS,
  MOCK_SELLER_VERIFICATIONS,
  DEFAULT_ADMIN_FEE_SETTINGS,
  DEFAULT_SITE_SETTINGS,
} from './data/mockData';
import { CMS_PAGES_DATA } from './data/cmsPagesData';
import { MOCK_BUNDLES } from './data/bundlesData';
import { DEFAULT_PAYMENT_GATEWAY_CONFIG, MOCK_PAYOUT_REQUESTS } from './data/gatewayData';
import { INITIAL_ARTICLES } from './data/articlesData';
import {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendMessageNotificationEmail,
  sendAdminCustomEmail,
} from './services/emailService';

// Main Navigation & Header
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchAndFilterSidebar, FilterState } from './components/SearchAndFilterSidebar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MakeOfferModal } from './components/MakeOfferModal';
import { ReportListingModal } from './components/ReportListingModal';
import { MessageSellerModal } from './components/MessageSellerModal';
import { CMSPageModal } from './components/CMSPageModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ContactModal } from './components/ContactModal';
import { CPanelExportModal } from './components/CPanelExportModal';
import { AuthPage } from './components/AuthPage';
import { Footer } from './components/Footer';
import { DedicatedCMSPageView } from './components/DedicatedCMSPageView';
import { AdminLoginPage } from './components/AdminLoginPage';
import { isLocationMatchingQuery, getStateFullName } from './utils/locationUtils';
import { updateMetaTags, updateProductMetaTags, updateCategoryMetaTags, resetDefaultMetaTags } from './utils/seoUtils';

// Buyer & Trust & Dispute Center Views
import { BuyerProtectionPage } from './components/BuyerProtectionPage';
import { TrustCenterPage } from './components/TrustCenterPage';
import { DisputeCenterView } from './components/DisputeCenterView';

// Teacher-Centric Exploration Views
import { ClassroomWishlistExplorer } from './components/ClassroomWishlistExplorer';
import { ClassroomFundraisingExplorer } from './components/ClassroomFundraisingExplorer';
import { LocalPickupMapView } from './components/LocalPickupMapView';
import { ClassroomBundlesShowcase } from './components/ClassroomBundlesShowcase';
import { ClassroomBundleBuilderModal } from './components/ClassroomBundleBuilderModal';
import { ClassroomInspirationGallery } from './components/ClassroomInspirationGallery';
import { TeacherCommunityView } from './components/TeacherCommunityView';
import { SchoolDirectoryView } from './components/SchoolDirectoryView';
import { TeacherRewardsShop } from './components/TeacherRewardsShop';
import { MarketplaceNewsView } from './components/MarketplaceNewsView';
import { CompareProductsDrawer } from './components/CompareProductsDrawer';
import { SeasonalCollectionsBar, SEASONAL_COLLECTIONS } from './components/SeasonalCollectionsBar';
import { TeacherSpotlightSection } from './components/TeacherSpotlightSection';
import { BlogShowcaseSection } from './components/BlogShowcaseSection';
import { SellerAnalyticsView } from './components/SellerAnalyticsView';

// Teacher Dashboard Sub-tabs
import { ListingManagerTab } from './components/TeacherDashboard/ListingManagerTab';
import { SellerOrdersTab } from './components/TeacherDashboard/SellerOrdersTab';
import { BuyerOrdersTab } from './components/TeacherDashboard/BuyerOrdersTab';
import { TeacherMessagesTab } from './components/TeacherDashboard/TeacherMessagesTab';
import { TaxSummaryTab } from './components/TeacherDashboard/TaxSummaryTab';
import { TeacherVerificationTab } from './components/TeacherDashboard/TeacherVerificationTab';
import { TeacherWishlistTab } from './components/TeacherDashboard/TeacherWishlistTab';
import { SellerPayoutsTab } from './components/TeacherDashboard/SellerPayoutsTab';

// Admin CMS Sub-tabs
import { AdminOverviewTab } from './components/AdminCMS/AdminOverviewTab';
import { AdminConfigSyncCheck } from './components/AdminCMS/AdminConfigSyncCheck';
import { AdminSalesReportsGenerator } from './components/AdminCMS/AdminSalesReportsGenerator';
import { AdminSalesFeeManager } from './components/AdminCMS/AdminSalesFeeManager';
import { AdminUsersManager } from './components/AdminCMS/AdminUsersManager';
import { AdminListingsManager } from './components/AdminCMS/AdminListingsManager';
import { AdminEmailCampaigns } from './components/AdminCMS/AdminEmailCampaigns';
import { AdminDatabaseSchemaViewer } from './components/AdminCMS/AdminDatabaseSchemaViewer';
import { AdminAuditLogs } from './components/AdminCMS/AdminAuditLogs';
import { AdminWebsiteEditor } from './components/AdminCMS/AdminWebsiteEditor';
import { AdminBlogManager } from './components/AdminCMS/AdminBlogManager';
import { AdminSafetyDashboard } from './components/AdminCMS/AdminSafetyDashboard';
import { AdminPaymentGateways } from './components/AdminCMS/AdminPaymentGateways';
import { AdminCompanyPlaybook } from './components/AdminCMS/AdminCompanyPlaybook';

function loadFromStorage<T>(key: string, fallback: T, isArray = false): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (isArray) {
      return Array.isArray(parsed) ? (parsed as unknown as T) : fallback;
    }
    if (!parsed || typeof parsed !== 'object') return fallback;
    return parsed as unknown as T;
  } catch (err) {
    return fallback;
  }
}

export const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    // Check if user specifically wanted to be a guest or hasn't logged in yet
    const saved = localStorage.getItem('mft_user');
    const guestUser = { id: 'guest', name: 'Guest', email: '', role: 'guest', state: '', city: '', zip: '', schoolName: '', rating: 0, reviewCount: 0, salesCount: 0 } as User;
    if (!saved) return guestUser;
    return loadFromStorage<User>('mft_user', guestUser);
  });

  const [feeSettings, setFeeSettings] = useState<AdminFeeSettings>(() =>
    loadFromStorage<AdminFeeSettings>('mft_fee_settings', DEFAULT_ADMIN_FEE_SETTINGS)
  );

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadFromStorage<SiteSettings>('mft_site_settings', DEFAULT_SITE_SETTINGS)
  );

  const [cmsPages, setCmsPages] = useState<CMSPage[]>(() => {
    const saved = loadFromStorage<CMSPage[]>('mft_cms_pages', CMS_PAGES_DATA, true);
    if (Array.isArray(saved) && saved.length > 0) {
      const merged = [...saved];
      CMS_PAGES_DATA.forEach((defaultPage) => {
        if (!merged.some((p) => p.slug === defaultPage.slug)) {
          merged.push(defaultPage);
        }
      });
      return merged;
    }
    return CMS_PAGES_DATA;
  });

  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>('mft_products', MOCK_PRODUCTS, true)
  );

  const [bundles, setBundles] = useState<ProductBundle[]>(() =>
    loadFromStorage<ProductBundle[]>('mft_bundles', MOCK_BUNDLES, true)
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage<Order[]>('mft_orders', MOCK_ORDERS, true)
  );

  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage<User[]>('mft_users_list', MOCK_USERS, true)
  );

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadFromStorage<AuditLog[]>('mft_audit_logs', MOCK_AUDIT_LOGS, true)
  );

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>('mft_cart', [], true)
  );

  const [wishlist, setWishlist] = useState<Product[]>(() =>
    loadFromStorage<Product[]>('mft_wishlist', [MOCK_PRODUCTS[0], MOCK_PRODUCTS[3]], true)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage<NotificationItem[]>('mft_notifications', [], true)
  );

  const [disputes, setDisputes] = useState<DisputeCase[]>(() =>
    loadFromStorage<DisputeCase[]>('mft_disputes', [], true)
  );

  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(() =>
    loadFromStorage<FraudAlert[]>('mft_fraud_alerts', [], true)
  );

  const [sellerVerifications, setSellerVerifications] = useState<SellerVerificationRequest[]>(() =>
    loadFromStorage<SellerVerificationRequest[]>('mft_seller_verifications', [], true)
  );

  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() =>
    loadFromStorage<AdminNotification[]>('mft_admin_notifications', [], true)
  );

  const [payoutRequests, setPayoutRequests] = useState<SellerPayoutRequest[]>(() =>
    loadFromStorage<SellerPayoutRequest[]>('mft_payout_requests', MOCK_PAYOUT_REQUESTS, true)
  );

  const [gatewayConfig, setGatewayConfig] = useState<CompanyPaymentGatewayConfig>(() =>
    loadFromStorage<CompanyPaymentGatewayConfig>('mft_gateway_config', DEFAULT_PAYMENT_GATEWAY_CONFIG)
  );

  const [articles, setArticles] = useState<EducatorArticle[]>(() =>
    loadFromStorage<EducatorArticle[]>('mft_articles', INITIAL_ARTICLES, true)
  );

  useEffect(() => {
    try {
      localStorage.setItem('mft_articles', JSON.stringify(articles));
    } catch (err) {
      // ignore
    }
  }, [articles]);

  // Navigation & View State
  const [activeView, setActiveView] = useState<
    | 'marketplace'
    | 'wishlists'
    | 'fundraising'
    | 'local-map'
    | 'bundles'
    | 'inspiration'
    | 'community'
    | 'schools'
    | 'rewards'
    | 'news'
    | 'buyer-protection'
    | 'trust-center'
    | 'dispute-center'
    | 'teacher-dashboard'
    | 'admin'
    | 'admin-login'
    | 'login'
    | 'register'
    | 'playbook'
    | 'wishlist'
    | string
  >(() => {
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    const isAdminRoute =
      path === '/admin' ||
      path === '/admin-login' ||
      search.includes('view=admin') ||
      search.includes('admin=1') ||
      search.includes('admin=true') ||
      hash === '#admin' ||
      hash === '#admin-login';

    if (isAdminRoute) {
      const guestUser = { id: 'guest', name: 'Guest', email: '', role: 'guest', state: '', city: '', zip: '', schoolName: '', rating: 0, reviewCount: 0, salesCount: 0 } as User;
      const user = loadFromStorage<User>('mft_user', guestUser);
      return user.role === 'admin' ? 'admin' : 'admin-login';
    }
    if (path === '/login' || search.includes('view=login') || hash === '#login') return 'login';
    if (path === '/register' || search.includes('view=register') || hash === '#register') return 'register';
    return 'marketplace';
  });

  useEffect(() => {
    let path = '/';
    if (activeView === 'admin-login' || activeView === 'admin') path = '/admin';
    else if (activeView === 'login') path = '/login';
    else if (activeView === 'register') path = '/register';
    
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [activeView]);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path === '/cpanel' || search.includes('cpanel') || search.includes('export') || hash.includes('cpanel')) {
        setIsCPanelModalOpen(true);
      }

      if (
        path === '/admin' ||
        path === '/admin-login' ||
        search.includes('view=admin') ||
        search.includes('admin=1') ||
        search.includes('admin=true') ||
        hash === '#admin' ||
        hash === '#admin-login'
      ) {
        setActiveView(currentUser.role === 'admin' ? 'admin' : 'admin-login');
      } else if (path === '/login' || search.includes('view=login') || hash === '#login') {
        setActiveView('login');
      } else if (path === '/register' || search.includes('view=register') || hash === '#register') {
        setActiveView('register');
      }
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [currentUser.role]);

  useEffect(() => {
    const forcedLogout = localStorage.getItem('mft_forced_logout_v1');
    if (!forcedLogout) {
      localStorage.setItem('mft_forced_logout_v1', 'true');
      handleLogout();
    }
  }, []);

  const [teacherSubTab, setTeacherSubTab] = useState<
    | 'overview'
    | 'listings'
    | 'bundles'
    | 'analytics'
    | 'seller-orders'
    | 'buyer-orders'
    | 'payouts'
    | 'messages'
    | 'wishlist'
    | 'tax'
    | 'verification'
  >('overview');

  const [adminSubTab, setAdminSubTab] = useState<
    | 'overview'
    | 'config-sync'
    | 'sales-reports'
    | 'website-editor'
    | 'blog'
    | 'sales-fees'
    | 'payment-gateways'
    | 'playbook'
    | 'safety'
    | 'users'
    | 'listings'
    | 'emails'
    | 'database'
    | 'audit'
  >('overview');

  const [salesReportTimeframe, setSalesReportTimeframe] = useState<'today' | 'month' | 'year' | 'anytime'>('today');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeasonalCollection, setActiveSeasonalCollection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest' | 'rating'>('featured');
  const [filters, setFilters] = useState<FilterState>({
    categoryId: '',
    subcategoryId: '',
    minPrice: 0,
    maxPrice: 300,
    conditions: [],
    gradeLevels: [],
    localPickupOnly: false,
    freeShippingOnly: false,
    verifiedOnly: false,
    selectedState: '',
    maxDistance: 500,
    minRating: 0,
  });

  // Comparison State
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [isBundleBuilderOpen, setIsBundleBuilderOpen] = useState(false);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCPanelModalOpen, setIsCPanelModalOpen] = useState(false);
  const [offerProduct, setOfferProduct] = useState<Product | null>(null);
  const [reportProduct, setReportProduct] = useState<Product | null>(null);
  const [messageProduct, setMessageProduct] = useState<Product | null>(null);
  const [cmsPageSlug, setCmsPageSlug] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('mft_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mft_fee_settings', JSON.stringify(feeSettings));
  }, [feeSettings]);

  useEffect(() => {
    localStorage.setItem('mft_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('mft_cms_pages', JSON.stringify(cmsPages));
  }, [cmsPages]);

  useEffect(() => {
    localStorage.setItem('mft_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mft_bundles', JSON.stringify(bundles));
  }, [bundles]);

  useEffect(() => {
    localStorage.setItem('mft_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mft_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('mft_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('mft_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mft_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('mft_fraud_alerts', JSON.stringify(fraudAlerts));
  }, [fraudAlerts]);

  useEffect(() => {
    localStorage.setItem('mft_seller_verifications', JSON.stringify(sellerVerifications));
  }, [sellerVerifications]);

  useEffect(() => {
    localStorage.setItem('mft_admin_notifications', JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  useEffect(() => {
    localStorage.setItem('mft_payout_requests', JSON.stringify(payoutRequests));
  }, [payoutRequests]);

  useEffect(() => {
    localStorage.setItem('mft_gateway_config', JSON.stringify(gatewayConfig));
  }, [gatewayConfig]);

  // SEO & Open Graph Updates
  useEffect(() => {
    if (selectedProduct) {
      updateProductMetaTags(selectedProduct);
    } else if (filters.categoryId) {
      const catName = filters.categoryId.charAt(0).toUpperCase() + filters.categoryId.slice(1);
      updateCategoryMetaTags(catName, filters.categoryId);
    } else {
      resetDefaultMetaTags();
    }
  }, [selectedProduct, filters.categoryId]);

  const handleRequestWithdrawal = (req: Omit<SellerPayoutRequest, 'id' | 'payoutNumber' | 'requestedAt'>) => {
    const newPayout: SellerPayoutRequest = {
      ...req,
      id: `po-${Date.now()}`,
      payoutNumber: `MFT-PO-${Math.floor(10000 + Math.random() * 90000)}`,
      requestedAt: new Date().toISOString(),
    };
    setPayoutRequests((prev) => [newPayout, ...prev]);
    addAdminNotification({
      title: `Educator Balance Withdrawal: $${req.amount.toFixed(2)} (${req.method.toUpperCase()})`,
      message: `${req.sellerName} requested $${req.amount.toFixed(2)} earnings payout via ${req.method}.`,
      type: 'escrow',
      priority: 'high',
      amount: req.amount,
      actorName: req.sellerName,
      actorSchool: req.sellerSchool,
      details: `Destination: ${req.destinationDetails?.bankName || req.destinationDetails?.paypalEmail || 'Direct Deposit'}. Zero fee applied.`,
    });
    showToast(`Withdrawal request for $${req.amount.toFixed(2)} submitted successfully! 💰`);
  };

  const addAdminNotification = (notif: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AdminNotification = {
      id: `an-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      read: false,
      ...notif,
    };
    setAdminNotifications((prev) => {
      const updated = [newNotif, ...(prev || [])];
      try {
        localStorage.setItem('mft_admin_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`🔔 Admin Alert: ${notif.title}`);
  };

  const handleClearAdminNotifications = () => {
    setAdminNotifications([]);
    localStorage.setItem('mft_admin_notifications', JSON.stringify([]));
    showToast('Admin notification stream cleared.');
  };

  const handleTriggerTestOperation = () => {
    const operations = [
      {
        title: 'New Escrow Purchase #ORD-9104',
        message: 'Dr. Rebecca Martinez placed an order for 24pk Crayola Bulk Markers ($68.50). Funds secured in escrow.',
        type: 'order' as const,
        priority: 'high' as const,
        amount: 68.50,
        actorName: 'Dr. Rebecca Martinez',
        details: 'Payment verified via Stripe 3D Secure. School office pickup chosen.'
      },
      {
        title: 'State Teaching License Verified',
        message: 'Marcus Brody from Dallas ISD verified Texas Educator Certificate #TX-94821.',
        type: 'verification' as const,
        priority: 'medium' as const,
        actorName: 'Marcus Brody (Dallas ISD)',
        details: 'Auto-verified with state portal database lookup.'
      },
      {
        title: 'District Purchase Order PO-OKC-492',
        message: 'Oklahoma City Public Schools submitted a $1,250.00 Net-30 PO for classroom STEM lab microscopes.',
        type: 'contact' as const,
        priority: 'high' as const,
        amount: 1250.00,
        actorName: 'OKCPS District Procurement',
        details: 'Tax-exempt certificate on file. Invoiced via W-9.'
      },
      {
        title: 'Escrow Payout Disbursed',
        message: '$140.00 disbursem*nt released to David Vance after buyer confirmed receipt of Document Camera.',
        type: 'escrow' as const,
        priority: 'medium' as const,
        amount: 140.00,
        actorName: 'David Vance',
        details: '5% platform service fee deducted.'
      },
      {
        title: 'Dispute Resolution Request',
        message: 'Buyer reported parcel transit delay on Order #ORD-7721. Resolution desk opened.',
        type: 'dispute' as const,
        priority: 'urgent' as const,
        amount: 45.00,
        actorName: 'Emily Clark',
        details: 'Escrow release held pending USPS tracking update.'
      },
    ];
    const picked = operations[Math.floor(Math.random() * operations.length)];
    addAdminNotification(picked);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      (prev || []).map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Trigger brief Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dispute & Payment Protection Handlers
  const handleOpenDispute = (
    orderId: string,
    reason: DisputeCase['reason'],
    description: string,
    requestedResolution: DisputeCase['requestedResolution'],
    evidenceUrls: string[] = []
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const newDisputeId = `disp-${Date.now()}`;
    const disputeNum = `DSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDispute: DisputeCase = {
      id: newDisputeId,
      disputeNumber: disputeNum,
      orderId,
      orderNumber: targetOrder?.orderNumber || 'MFT-ORD',
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      sellerId: targetOrder?.items[0]?.sellerId || 'usr-teacher-01',
      sellerName: targetOrder?.items[0]?.sellerName || 'Educator Seller',
      sellerEmail: 'seller@schooldistrict.org',
      productTitle: targetOrder?.items[0]?.title || 'Classroom Supplies',
      productImage: targetOrder?.items[0]?.image || '',
      disputeAmount: targetOrder?.total || 0,
      status: 'Under Review',
      reason,
      reasonTitle: reason.replace(/_/g, ' ').toUpperCase(),
      detailedExplanation: description,
      buyerEvidence: evidenceUrls.map((url, i) => ({
        id: `ev-${Date.now()}-${i}`,
        uploaderId: currentUser.id,
        uploaderName: currentUser.name,
        uploaderRole: 'buyer' as const,
        type: 'photo' as const,
        fileUrl: url,
        fileName: `Evidence_Photo_${i + 1}.jpg`,
        description: 'Uploaded by buyer during dispute filing',
        timestamp: new Date().toISOString(),
      })),
      sellerEvidence: [],
      requestedResolution,
      requestedAmount: targetOrder?.total || 0,
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorName: currentUser.name,
          actorRole: 'buyer',
          action: 'Dispute filed with requested resolution: ' + requestedResolution,
          note: description,
          fundChange: `Escrow $${(targetOrder?.sellerEarnings || 0).toFixed(2)} placed on hold`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);

    // Update order: status = 'Under Review', sellerPayoutStatus = 'On Hold', disputeId linked
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Under Review',
              sellerPayoutStatus: 'On Hold',
              disputeId: newDisputeId,
            }
          : o
      )
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentUser.name,
      action: `Dispute Case #${disputeNum} filed for Order #${targetOrder?.orderNumber}. Payout paused. Reason: ${reason}`,
      target: targetOrder?.orderNumber || 'Order',
      ipAddress: '192.168.1.1',
      status: 'Warning',
      details: description,
      targetId: orderId,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Admin & Seller notifications
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Dispute Filed: Order #${targetOrder?.orderNumber}`,
      message: `Buyer ${currentUser.name} reported: "${reason}". Payout placed on hold for admin review.`,
      time: 'Just now',
      read: false,
      type: 'order',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addAdminNotification({
      title: `⚖️ Dispute Case #${disputeNum} Filed: Order #${targetOrder?.orderNumber || 'MFT-ORD'}`,
      message: `Buyer ${currentUser.name} reported: "${reason}". Escrow funds ($${(targetOrder?.total || 0).toFixed(2)}) placed on hold.`,
      type: 'dispute',
      priority: 'urgent',
      amount: targetOrder?.total || 0,
      actorName: currentUser.name,
      actorSchool: currentUser.schoolName,
      details: description,
    });

    showToast(`Dispute opened. Order marked 'Under Review' and seller payout placed on hold.`);
  };

  const handleResolveDispute = (
    disputeId: string,
    decision:
      | 'Approve Buyer - Full Refund'
      | 'Approve Buyer - Partial Refund'
      | 'Approve Seller - Release Payout'
      | 'Reject Claim'
      | 'Request More Information',
    notes: string,
    refundAmount?: number,
    releaseSellerAmount?: number
  ) => {
    const targetDispute = disputes.find((d) => d.id === disputeId);
    if (!targetDispute) return;

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status:
                decision === 'Approve Buyer - Full Refund'
                  ? 'Resolved Refunded'
                  : decision === 'Approve Buyer - Partial Refund'
                  ? 'Resolved Partial'
                  : decision === 'Approve Seller - Release Payout'
                  ? 'Resolved Released'
                  : decision === 'Reject Claim'
                  ? 'Closed Rejected'
                  : 'Under Review',
              adminDecision: decision,
              adminDecisionNotes: notes,
              refundAmountIssued: refundAmount,
              updatedAt: new Date().toISOString(),
              history: [
                ...d.history,
                {
                  id: `hist-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  actorName: currentUser.name,
                  actorRole: 'admin',
                  action: `Admin Decision: ${decision}`,
                  note: notes,
                  fundChange: decision.includes('Refund')
                    ? `Refund of $${(refundAmount || d.disputeAmount).toFixed(2)} approved`
                    : `Seller payout approved`,
                },
              ],
            }
          : d
      )
    );

    // Update corresponding order
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === targetDispute.orderId) {
          if (decision === 'Approve Buyer - Full Refund') {
            return {
              ...o,
              status: 'Refunded',
              escrowStatus: 'Refunded',
              sellerPayoutStatus: 'Refunded',
            };
          } else if (decision === 'Approve Buyer - Partial Refund') {
            return {
              ...o,
              status: 'Completed',
              escrowStatus: 'Released',
              sellerPayoutStatus: 'Released',
              discountTotal: (o.discountTotal || 0) + (refundAmount || 0),
            };
          } else if (decision === 'Approve Seller - Release Payout') {
            return {
              ...o,
              status: 'Completed',
              escrowStatus: 'Released',
              sellerPayoutStatus: 'Released',
              escrowReleasedAt: new Date().toISOString(),
            };
          } else {
            return {
              ...o,
              status: 'Completed',
              escrowStatus: 'Released',
              sellerPayoutStatus: 'Released',
              escrowReleasedAt: new Date().toISOString(),
            };
          }
        }
        return o;
      })
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentUser.name,
      action: `Dispute Case #${targetDispute.disputeNumber} resolved: ${decision}. Notes: ${notes}`,
      target: targetDispute.orderNumber,
      ipAddress: '192.168.1.1',
      status: 'Success',
      details: notes,
      targetId: targetDispute.orderId,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    addAdminNotification({
      title: `Dispute Case #${targetDispute.disputeNumber} Resolved`,
      message: `Admin determined decision: "${decision}". Order #${targetDispute.orderNumber}.`,
      type: 'dispute',
      priority: 'medium',
      amount: refundAmount || targetDispute.disputeAmount,
      actorName: currentUser.name,
      details: notes,
    });

    showToast(`Dispute #${targetDispute.disputeNumber} resolved: ${decision}`);
  };

  const handleReleasePayout = (orderId: string, reason?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Completed',
              escrowStatus: 'Released',
              sellerPayoutStatus: 'Released',
              escrowReleasedAt: new Date().toISOString(),
            }
          : o
      )
    );

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentUser.name,
      action: `Admin released payout of $${(targetOrder?.sellerEarnings || 0).toFixed(2)} for Order #${targetOrder?.orderNumber}. Reason: ${reason || 'Admin manual approval'}`,
      target: targetOrder?.orderNumber || 'Order',
      ipAddress: '192.168.1.1',
      status: 'Success',
      details: reason || 'Admin manual escrow payout release',
      targetId: orderId,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    addAdminNotification({
      title: `Escrow Payout Disbursed: Order #${targetOrder?.orderNumber}`,
      message: `$${(targetOrder?.sellerEarnings || 0).toFixed(2)} escrow payout disbursed to educator. Reason: ${reason || 'Admin approval'}.`,
      type: 'escrow',
      priority: 'medium',
      amount: targetOrder?.sellerEarnings || 0,
      actorName: targetOrder?.items?.[0]?.sellerName || 'Educator Seller',
      details: reason || 'Escrow released upon verified delivery.',
    });

    if (targetOrder) {
      sendOrderStatusUpdateEmail({
        order: targetOrder,
        previousStatus: targetOrder.status,
        newStatus: 'Completed',
        recipientEmail: 'seller@school.edu',
        recipientName: targetOrder.items?.[0]?.sellerName || 'Educator Seller',
        notes: `Admin released escrow payout of $${(targetOrder.sellerEarnings || 0).toFixed(2)}. ${reason || ''}`,
      }).catch((err) => console.warn('Resend release payout email error:', err));
    }

    showToast(`Seller payout of $${(targetOrder?.sellerEarnings || 0).toFixed(2)} released! Resend notice sent. 💸`);
  };

  const handleHoldPayout = (orderId: string, reason?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Under Review',
              sellerPayoutStatus: 'On Hold',
            }
          : o
      )
    );

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentUser.name,
      action: `Admin put payout on hold for Order #${targetOrder?.orderNumber}. Reason: ${reason || 'Investigation'}`,
      target: targetOrder?.orderNumber || 'Order',
      ipAddress: '192.168.1.1',
      status: 'Warning',
      details: reason || 'Escrow hold requested for review',
      targetId: orderId,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (targetOrder) {
      sendOrderStatusUpdateEmail({
        order: targetOrder,
        previousStatus: targetOrder.status,
        newStatus: 'Under Review',
        notes: `Payout placed on hold for review. Reason: ${reason || 'Investigation'}`,
      }).catch((err) => console.warn('Resend hold payout email error:', err));
    }

    addAdminNotification({
      title: `Escrow Hold Activated: Order #${targetOrder?.orderNumber}`,
      message: `Payout of $${(targetOrder?.sellerEarnings || 0).toFixed(2)} placed on hold. Reason: ${reason || 'Investigation'}.`,
      type: 'escrow',
      priority: 'urgent',
      amount: targetOrder?.sellerEarnings || 0,
      actorName: targetOrder?.items?.[0]?.sellerName || 'Educator Seller',
      details: reason || 'Escrow hold requested for dispute review.',
    });

    showToast(`Payout on hold for Order #${targetOrder?.orderNumber}. Order moved to 'Under Review'.`);
  };

  // Role Switching Handler
  const handleRoleChange = (role: 'guest' | 'teacher' | 'admin') => {
    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(targetUser);
    if (role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('marketplace');
    }
    showToast(`Switched persona to: ${targetUser.name} (${role.toUpperCase()})`);
  };

  const handleLogout = () => {
    const guestUser: User = { id: 'guest', name: 'Guest', email: '', role: 'guest', state: '', city: '', zip: '', schoolName: '', rating: 0, reviewCount: 0, salesCount: 0 } as User;
    setCurrentUser(guestUser);
    localStorage.setItem('mft_user', JSON.stringify(guestUser));
    setActiveView('marketplace');
    showToast('You have been logged out.');
  };

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedShipping: product.shippingOptions.freeShipping
            ? 'free'
            : product.shippingOptions.localPickup
            ? 'pickup'
            : 'usps',
          shippingCost: product.shippingOptions.freeShipping
            ? 0
            : product.shippingOptions.localPickup
            ? 0
            : product.shippingOptions.flatRate,
        },
      ];
    });
    showToast(`Added "${product.title.slice(0, 25)}..." to cart`);
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  const handleUpdateShipping = (productId: string, method: ShippingMethodType) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          let cost = 0;
          if (method === 'usps') cost = item.product.shippingOptions.flatRate;
          if (method === 'ups') cost = item.product.shippingOptions.flatRate + 3.0;
          if (method === 'fedex') cost = item.product.shippingOptions.flatRate + 4.5;
          return { ...item, selectedShipping: method, shippingCost: cost };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from classroom wishlist`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved to classroom wishlist ⭐`);
        return [...prev, product];
      }
    });
  };

  // Product Comparison Toggle
  const handleToggleCompare = (product: Product) => {
    setComparedProductIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('You can compare a maximum of 4 items at once.');
        return prev;
      }
      showToast(`Added "${product.title.slice(0, 20)}..." to side-by-side comparison`);
      return [...prev, product.id];
    });
  };

  // Order Placement
  const handleCompleteOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // clear cart
    addAdminNotification({
      title: `New Escrow Order #${newOrder.orderNumber} Placed`,
      message: `${newOrder.buyerName} placed an escrow order for ${newOrder.items.length} item(s) ($${newOrder.total.toFixed(2)}). Funds secured in custody.`,
      type: 'order',
      priority: 'high',
      amount: newOrder.total,
      actorName: newOrder.buyerName,
      actorSchool: currentUser.schoolName || 'Public School District',
      details: `Payment via ${newOrder.paymentMethod}. Direct escrow release pending teacher delivery confirmation.`,
    });

    // Automated Resend Email Triggers
    sendOrderConfirmationEmail(newOrder).catch((err) =>
      console.warn('Resend order confirmation error:', err)
    );
    sendOrderStatusUpdateEmail({
      order: newOrder,
      newStatus: 'Awaiting Shipment',
      recipientEmail: 'seller@school.edu',
      recipientName: newOrder.items?.[0]?.sellerName || 'Teacher Seller',
      notes: `New classroom order placed by ${newOrder.buyerName}. Please pack and dispatch items to receive payout!`,
    }).catch((err) =>
      console.warn('Resend seller alert error:', err)
    );

    showToast(`Order #${newOrder.orderNumber} placed successfully! Email notifications dispatched via Resend.`);
  };

  // Create Listing Handler
  const handleCreateProduct = (newProdData: Partial<Product>) => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar || currentUser.profilePhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
      sellerSchool: currentUser.schoolName || 'Oklahoma City Public Schools',
      sellerRating: 5.0,
      sellerSalesCount: 1,
      sellerVerified: Boolean(currentUser.verified || currentUser.verifiedTeacher),
      title: newProdData.title || 'Classroom Item',
      description: newProdData.description || '',
      price: newProdData.price || 10,
      originalPrice: newProdData.originalPrice,
      categoryId: newProdData.categoryId || 'classroom-supplies',
      subcategoryId: newProdData.subcategoryId || 'markers',
      condition: newProdData.condition || 'Like New',
      stock: newProdData.stock || 1,
      images: newProdData.images || ['https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'],
      location: {
        city: currentUser.city || 'Oklahoma City',
        state: currentUser.state || 'OK',
        zip: currentUser.zip || '73159',
        distanceMiles: 2.1,
      },
      shippingOptions: newProdData.shippingOptions || {
        usps: true,
        ups: false,
        fedex: false,
        localPickup: true,
        freeShipping: false,
        flatRate: 6.5,
        pickupInstructions: 'Available for school office pickup.',
      },
      gradeLevel: newProdData.gradeLevel || ['K-2', '3-5'],
      tags: newProdData.tags || ['Classroom'],
      reviews: [],
      featured: false,
      viewsCount: 1,
      savesCount: 0,
      createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    };

    setProducts((prev) => [newProd, ...prev]);
    addAdminNotification({
      title: `New Classroom Listing: ${newProd.title}`,
      message: `${currentUser.name} (${currentUser.schoolName || 'Educator'}) published "${newProd.title}" for $${newProd.price.toFixed(2)}.`,
      type: 'listing',
      priority: 'medium',
      amount: newProd.price,
      actorName: currentUser.name,
      actorSchool: currentUser.schoolName,
      details: `Category: ${newProd.categoryId} • Condition: ${newProd.condition} • Zero listing fee applied.`,
    });
    showToast(`Listing "${newProd.title}" published with zero listing fees!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Listing deleted`);
  };

  // Create Bundle Handler
  const handleSaveBundle = (newBundle: ProductBundle) => {
    setBundles((prev) => [newBundle, ...prev]);
    setIsBundleBuilderOpen(false);
    showToast(`Classroom Starter Bundle "${newBundle.title}" created with bundle savings! 📦`);
  };

  // Filter & Search Logic with State name, City, Zipcode, Title, Desc, and School support
  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter((prod) => {
      if (!prod) return false;

      // Search text match (Supports title, description, tags, seller school, seller name, state name, city, and zip code)
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = (prod.title || '').toLowerCase().includes(q);
        const matchesDesc = (prod.description || '').toLowerCase().includes(q);
        const matchesSchool = (prod.sellerSchool || '').toLowerCase().includes(q);
        const matchesSeller = (prod.sellerName || '').toLowerCase().includes(q);
        const matchesCategory = (prod.categoryId || '').toLowerCase().includes(q) || (prod.subcategoryId || '').toLowerCase().includes(q);
        const matchesTag = (prod.tags || []).some((t) => (t || '').toLowerCase().includes(q));
        const matchesLocation = isLocationMatchingQuery(prod.location, q);

        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesSchool &&
          !matchesSeller &&
          !matchesCategory &&
          !matchesTag &&
          !matchesLocation
        ) {
          return false;
        }
      }

      // Category match
      if (filters.categoryId && prod.categoryId !== filters.categoryId) return false;
      if (filters.subcategoryId && prod.subcategoryId !== filters.subcategoryId) return false;

      // Price match
      if (prod.price !== undefined && prod.price < (filters.minPrice || 0)) return false;
      if (filters.maxPrice < 300 && prod.price !== undefined && prod.price > filters.maxPrice) return false;

      // Condition match
      if (
        Array.isArray(filters.conditions) &&
        filters.conditions.length > 0 &&
        !filters.conditions.includes(prod.condition)
      )
        return false;

      // Grade levels match
      if (
        Array.isArray(filters.gradeLevels) &&
        filters.gradeLevels.length > 0 &&
        (!Array.isArray(prod.gradeLevel) ||
          !prod.gradeLevel.some((gl) => filters.gradeLevels.includes(gl)))
      )
        return false;

      // Local pickup only
      if (filters.localPickupOnly && !prod.shippingOptions?.localPickup) return false;

      // Free shipping only
      if (filters.freeShippingOnly && !prod.shippingOptions?.freeShipping) return false;

      // Verified teachers only
      if (filters.verifiedOnly && !prod.sellerVerified) return false;

      // State match (Matches 2-letter state code or full state name)
      if (filters.selectedState) {
        const targetState = filters.selectedState.trim().toUpperCase();
        const prodState = (prod.location?.state || '').trim().toUpperCase();
        if (prodState !== targetState) return false;
      }

      // City or Zipcode search filter from sidebar
      if (filters.cityOrZip?.trim()) {
        const locTerm = filters.cityOrZip.trim().toLowerCase();
        const matchesCityOrZip = isLocationMatchingQuery(prod.location, locTerm);
        if (!matchesCityOrZip) return false;
      }

      // Distance match
      if (
        filters.maxDistance < 500 &&
        prod.location?.distanceMiles !== undefined &&
        prod.location.distanceMiles > filters.maxDistance
      )
        return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.sellerRating || 0) - (a.sellerRating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchQuery, filters, sortBy]);

  const comparedProducts = useMemo(() => {
    return (products || []).filter((p) => comparedProductIds.includes(p.id));
  }, [products, comparedProductIds]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header with Global Features Navigation */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onSwitchUserRole={handleRoleChange}
        onLogout={handleLogout}
        cartCount={(cartItems || []).reduce((acc, it) => acc + (it?.quantity || 1), 0)}
        wishlistCount={(wishlist || []).length}
        notifications={notifications || []}
        onMarkNotificationRead={handleMarkNotificationRead}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCreateListing={() => {
          setActiveView('teacher-dashboard');
          setTeacherSubTab('listings');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={filters.categoryId}
        onSelectCategory={(catId) => {
          setActiveView('marketplace');
          setFilters({ ...filters, categoryId: catId, subcategoryId: '' });
        }}
        onOpenTeacherDashboard={() => setActiveView('teacher-dashboard')}
        onOpenDashboard={() => setActiveView('teacher-dashboard')}
        onOpenAdminDashboard={() => currentUser.role === 'admin' ? setActiveView('admin') : setActiveView('admin-login')}
        onOpenAdminCMS={() => currentUser.role === 'admin' ? setActiveView('admin') : setActiveView('admin-login')}
        onOpenAdminLoginPage={() => setActiveView('admin-login')}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenCMSPage={(slug) => {
          setActiveView(slug);
          setCmsPageSlug(null);
        }}
        onOpenWishlist={() => setActiveView('wishlist')}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenAuthModal={(tab) => {
          if (tab === 'admin') {
            setActiveView(currentUser.role === 'admin' ? 'admin' : 'admin-login');
          } else {
            setActiveView(tab || 'login');
          }
        }}
        userZip={currentUser.zip || '73159'}
        onUserZipChange={(zip) => setCurrentUser((prev) => ({ ...prev, zip }))}
        activeView={activeView}
        onNavigateHome={() => setActiveView('marketplace')}
        onNavigateView={(view) => setActiveView(view)}
        siteSettings={siteSettings}
        adminNotifications={adminNotifications}
        onClearAdminNotifications={handleClearAdminNotifications}
        onTriggerTestOperation={handleTriggerTestOperation}
      />

      {/* Primary Application Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 py-3.5 sm:py-4 space-y-4">
        {/* VIEW 1: MARKETPLACE BROWSE & SHOP */}
        {activeView === 'marketplace' && (
          <div className="space-y-4">
            {/* Seasonal Filter Bar */}
            <SeasonalCollectionsBar
              activeCollection={activeSeasonalCollection}
              onSelectCollection={(colId) => {
                setActiveSeasonalCollection(colId);
                const col = SEASONAL_COLLECTIONS.find((c) => c.id === colId);
                if (!col || colId === 'all') {
                  setSearchQuery('');
                  showToast('Viewing all nationwide teacher classroom supplies');
                } else {
                  setSearchQuery(col.queryKeyword || col.shortName);
                  showToast(`Filtering for ${col.name}`);
                }
              }}
              onSelectTag={(tag) => {
                setSearchQuery(tag);
                showToast(`Filtering for curated ${tag} items`);
              }}
              donationOnlyFilter={filters.minPrice === 0 && filters.maxPrice === 0}
              onToggleDonationOnly={() => {
                if (filters.maxPrice === 0) {
                  setFilters({ ...filters, minPrice: 0, maxPrice: 300 });
                  showToast('Showing all priced and free items');
                } else {
                  setFilters({ ...filters, minPrice: 0, maxPrice: 0 });
                  showToast('Showing only $0 free surplus & teacher donations 🎁');
                }
              }}
            />

            {/* Hero Section */}
            <HeroSection
              onSelectCategory={(catId) => setFilters({ ...filters, categoryId: catId, subcategoryId: '' })}
              onOpenCreateListing={() => {
                setActiveView('teacher-dashboard');
                setTeacherSubTab('listings');
              }}
              onOpenCMSPage={(slug) => setCmsPageSlug(slug)}
              userZip={currentUser.zip || '73159'}
              siteSettings={siteSettings}
              onOpenTrustCenter={() => setActiveView('trust-center')}
              onOpenBuyerProtection={() => setActiveView('buyer-protection')}
              onOpenDisputeCenter={() => setActiveView('dispute-center')}
            />

            {/* Catalog Grid & Filters Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
              {/* Left Filters Sidebar (Desktop) */}
              <div className="hidden lg:block lg:col-span-3 sticky top-20">
                <SearchAndFilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={() =>
                    setFilters({
                      categoryId: '',
                      subcategoryId: '',
                      minPrice: 0,
                      maxPrice: 300,
                      conditions: [],
                      gradeLevels: [],
                      localPickupOnly: false,
                      freeShippingOnly: false,
                      verifiedOnly: false,
                      selectedState: '',
                      maxDistance: 500,
                      minRating: 0,
                    })
                  }
                  totalResults={filteredProducts.length}
                  userZip={currentUser.zip || '73159'}
                />
              </div>

              {/* Right Catalog Area */}
              <div className="lg:col-span-9 space-y-3">
                {/* Catalog Controls & Sorting Bar */}
                <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                      className="lg:hidden bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                      <span>Filters</span>
                    </button>

                    <span className="text-xs text-slate-500 font-medium">
                      Showing <strong className="text-slate-900">{filteredProducts.length}</strong> classroom supplies
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium hidden sm:inline">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-50 border border-slate-300 rounded-md px-2 py-1 font-semibold text-slate-800 text-xs focus:outline-hidden focus:border-blue-600"
                    >
                      <option value="featured">Featured & Best Matches</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated Educators</option>
                      <option value="newest">Recently Listed</option>
                    </select>
                  </div>
                </div>

                {/* Mobile Filter Drawer */}
                {mobileFilterOpen && (
                  <div className="lg:hidden">
                    <SearchAndFilterSidebar
                      filters={filters}
                      onFilterChange={setFilters}
                      onResetFilters={() =>
                        setFilters({
                          categoryId: '',
                          subcategoryId: '',
                          minPrice: 0,
                          maxPrice: 300,
                          conditions: [],
                          gradeLevels: [],
                          localPickupOnly: false,
                          freeShippingOnly: false,
                          verifiedOnly: false,
                          selectedState: '',
                          maxDistance: 500,
                          minRating: 0,
                        })
                      }
                      totalResults={filteredProducts.length}
                      userZip={currentUser.zip || '73159'}
                    />
                  </div>
                )}

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-lg border border-slate-200 p-8 text-center space-y-2.5">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-800 text-sm">No classroom listings found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try adjusting your price range, clearing condition filters, or expanding your local pickup radius.
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          categoryId: '',
                          subcategoryId: '',
                          minPrice: 0,
                          maxPrice: 300,
                          conditions: [],
                          gradeLevels: [],
                          localPickupOnly: false,
                          freeShippingOnly: false,
                          verifiedOnly: false,
                          selectedState: '',
                          maxDistance: 500,
                          minRating: 0,
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        isWishlisted={wishlist.some((w) => w.id === prod.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onSelectProduct={(p) => setSelectedProduct(p)}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        onCompare={handleToggleCompare}
                        isCompared={comparedProductIds.includes(prod.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Educator Blog & Insights Showcase */}
            {(siteSettings.featureModules?.enableBlog ?? true) && (
              <BlogShowcaseSection
                articles={articles}
                onSelectArticle={(article) => {
                  setActiveView('news');
                }}
                onViewAllArticles={() => setActiveView('news')}
              />
            )}
          </div>
        )}

        {/* VIEW: CLASSROOM WISHLISTS EXPLORER ⭐⭐⭐⭐⭐ */}
        {activeView === 'wishlists' && (
          <ClassroomWishlistExplorer
            onAddToCart={(item) => {
              const syntheticProd: Product = {
                id: `wishlist-${item.id}`,
                sellerId: 'teacher-wishlist-donor',
                sellerName: 'Classroom Wishlist Project',
                sellerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
                sellerSchool: 'Wishlist Recipient School',
                sellerRating: 5.0,
                sellerSalesCount: 1,
                sellerVerified: true,
                title: item.title,
                description: `Gift purchase fulfillment for teacher classroom wishlist.`,
                price: item.price,
                categoryId: 'classroom-supplies',
                subcategoryId: 'markers',
                condition: 'Brand New',
                stock: 1,
                images: [item.image || 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'],
                location: { city: 'Oklahoma City', state: 'OK', zip: '73159' },
                shippingOptions: { usps: true, ups: false, fedex: false, localPickup: false, freeShipping: true, flatRate: 0 },
                gradeLevel: ['K-2'],
                tags: ['Wishlist', 'Donation'],
                reviews: [],
                featured: false,
                viewsCount: 1,
                savesCount: 0,
                createdAt: 'Today',
              };
              handleAddToCart(syntheticProd, 1);
              setIsCartOpen(true);
            }}
            onCreateWishlist={() => {
              setActiveView('teacher-dashboard');
              setTeacherSubTab('wishlist');
            }}
          />
        )}

        {/* VIEW: CLASSROOM FUNDRAISING & GRANTS */}
        {activeView === 'fundraising' && (
          <ClassroomFundraisingExplorer
            onDonate={(proj, amount) => {
              showToast(`Thank you! $${amount} donation to "${proj.title}" added to checkout.`);
              const donationProd: Product = {
                id: `fund-${proj.id}-${Date.now()}`,
                sellerId: proj.teacherId,
                sellerName: proj.teacherName,
                sellerAvatar: proj.teacherAvatar,
                sellerSchool: proj.schoolName,
                sellerRating: 5.0,
                sellerSalesCount: 1,
                sellerVerified: true,
                title: `Donation: ${proj.title}`,
                description: `Tax-deductible classroom grant support for ${proj.schoolName}.`,
                price: amount,
                categoryId: 'fundraising',
                subcategoryId: 'grants',
                condition: 'Brand New',
                stock: 1,
                images: [proj.image],
                location: { city: proj.city, state: proj.state, zip: '73159' },
                shippingOptions: { usps: false, ups: false, fedex: false, localPickup: false, freeShipping: true, flatRate: 0 },
                gradeLevel: [proj.gradeLevel],
                tags: ['ClassroomGrant', proj.category],
                reviews: [],
                featured: false,
                viewsCount: 1,
                savesCount: 0,
                createdAt: 'Today',
              };
              handleAddToCart(donationProd, 1);
              setIsCartOpen(true);
            }}
            onCreateProject={() => {
              setActiveView('teacher-dashboard');
              setTeacherSubTab('listings');
            }}
          />
        )}

        {/* VIEW: LOCAL SAFE PICKUP MAP */}
        {activeView === 'local-map' && (
          <LocalPickupMapView
            products={products}
            userZip={currentUser.zip || '73159'}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {/* VIEW: CLASSROOM STARTER BUNDLES */}
        {activeView === 'bundles' && (
          <div className="space-y-4">
            <ClassroomBundlesShowcase
              bundles={bundles}
              onSelectBundle={(b) => {
                showToast(`Viewing details for bundle: ${b.title}`);
              }}
              onBuyBundle={(b) => {
                const bundleProd: Product = {
                  id: `bundle-${b.id}`,
                  sellerId: b.sellerId,
                  sellerName: b.sellerName,
                  sellerAvatar: b.sellerAvatar,
                  sellerSchool: b.sellerSchool,
                  sellerRating: 5.0,
                  sellerSalesCount: 1,
                  sellerVerified: true,
                  title: b.title,
                  description: b.description,
                  price: b.bundlePrice,
                  originalPrice: b.totalValue,
                  categoryId: b.categoryId,
                  subcategoryId: 'bundles',
                  condition: 'Like New',
                  stock: 1,
                  images: [b.bannerImage || b.items[0]?.image || 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'],
                  location: { city: 'Oklahoma City', state: 'OK', zip: '73159' },
                  shippingOptions: { usps: true, ups: false, fedex: false, localPickup: true, freeShipping: true, flatRate: 0 },
                  gradeLevel: [b.gradeLevel],
                  tags: ['ClassroomBundle', ...b.tags],
                  reviews: [],
                  featured: true,
                  viewsCount: 1,
                  savesCount: 0,
                  createdAt: 'Today',
                };
                handleAddToCart(bundleProd, 1);
                setIsCartOpen(true);
              }}
              onOpenBundleBuilder={() => setIsBundleBuilderOpen(true)}
            />
          </div>
        )}

        {/* VIEW: CLASSROOM INSPIRATION GALLERY */}
        {activeView === 'inspiration' && (
          <ClassroomInspirationGallery
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
          />
        )}

        {/* VIEW: TEACHER COMMUNITY DISCUSSION BOARDS */}
        {activeView === 'community' && (
          <TeacherCommunityView
            currentUser={currentUser}
            onSelectProductTag={(tag) => {
              setActiveView('marketplace');
              setSearchQuery(tag);
            }}
          />
        )}

        {/* VIEW: SCHOOL DIRECTORY & DISTRICT ROSTER */}
        {activeView === 'schools' && (
          <SchoolDirectoryView
            onSelectSchool={(schoolName) => {
              setActiveView('marketplace');
              setSearchQuery(schoolName);
            }}
          />
        )}

        {/* VIEW: TEACHER REWARDS & LOYALTY SHOP */}
        {activeView === 'rewards' && (
          <TeacherRewardsShop
            currentUser={currentUser}
            onRedeemReward={(reward) => {
              showToast(`Redeemed ${reward.title}! Added to educator voucher wallet.`);
            }}
          />
        )}

        {/* VIEW: EDUCATOR NEWS & TAX DEDUCTION GUIDES */}
        {activeView === 'news' && (
          <MarketplaceNewsView
            articles={articles}
            onSelectArticleTag={(tag) => {
              setActiveView('marketplace');
              setSearchQuery(tag);
            }}
          />
        )}

        {/* VIEW: BUYER PROTECTION GUARANTEE */}
        {activeView === 'buyer-protection' && (
          <BuyerProtectionPage
            onOpenDisputeCenter={() => setActiveView('dispute-center')}
            onNavigateMarketplace={() => setActiveView('marketplace')}
          />
        )}

        {/* VIEW: TRUST & SAFETY CENTER */}
        {activeView === 'trust-center' && (
          <TrustCenterPage
            onOpenBuyerProtection={() => setActiveView('buyer-protection')}
            onOpenDisputeCenter={() => setActiveView('dispute-center')}
            onNavigateMarketplace={() => setActiveView('marketplace')}
          />
        )}

        {/* VIEW: DISPUTE RESOLUTION CENTER */}
        {activeView === 'dispute-center' && (
          <DisputeCenterView
            currentUser={currentUser}
            orders={orders}
            disputes={disputes}
            onOpenDispute={handleOpenDispute}
            onResolveDispute={handleResolveDispute}
            onBackToOrders={() => {
              setActiveView('teacher-dashboard');
              setTeacherSubTab('buyer-orders');
            }}
            onNavigateMarketplace={() => setActiveView('marketplace')}
          />
        )}

        {/* VIEW: DEDICATED ADMIN LOGIN PORTAL */}
        {activeView === 'admin-login' && (
          <AdminLoginPage
            onAdminLoginSuccess={(adminUser) => {
              setCurrentUser(adminUser);
              setActiveView('admin');
              showToast('Super Administrator session authorized! 🛡️');
            }}
            onNavigateHome={() => setActiveView('marketplace')}
            onOpenContact={() => setIsContactModalOpen(true)}
          />
        )}

        {/* VIEW: COMPANY PLAYBOOK & SOPs (INTERNAL ADMIN ONLY) */}
        {activeView === 'playbook' && (
          currentUser.role === 'admin' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-xs font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  ← Back to Super Admin Dashboard
                </button>
              </div>
              <AdminCompanyPlaybook onShowToast={showToast} />
            </div>
          ) : (
            <AdminLoginPage
              onAdminLoginSuccess={(adminUser) => {
                setCurrentUser(adminUser);
                setActiveView('admin');
                setAdminSubTab('playbook');
                showToast('Super Administrator session authorized! 🛡️');
              }}
              onNavigateHome={() => setActiveView('marketplace')}
              onOpenContact={() => setIsContactModalOpen(true)}
            />
          )
        )}

        {/* VIEW: DEDICATED CMS LEGAL & INFO PAGES */}
        {(['privacy', 'privacy-policy', 'terms', 'terms-of-service', 'faq', 'faqs', 'about', 'about-us', 'aboutUs', 'mission', 'our-mission', 'vision', 'contact', 'become-a-seller', 'buyer-protection', 'buyer-protection-policy', 'trust-center', 'district-invoicing', 'escrow-protection', 'ferpa-compliance', 'teacher-standards', 'classroom-budget-decorating', 'hands-on-stem-kits-guide'].includes(activeView) || (cmsPages && cmsPages.some((p) => p.slug === activeView))) && (
          <DedicatedCMSPageView
            slug={activeView}
            cmsPages={cmsPages}
            siteSettings={siteSettings}
            currentUser={currentUser}
            onNavigateView={(v) => setActiveView(v)}
            onOpenAuthModal={(tab) => {
              setActiveView(tab || 'register');
            }}
            onAddAdminNotification={addAdminNotification}
          />
        )}

        {/* VIEW 2: TEACHER DASHBOARD (BUYER & SELLER CENTER) */}
        {activeView === 'teacher-dashboard' && (
          <div className="space-y-4">
            {/* Top Dashboard Header */}
            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                  <img
                    src={currentUser.profilePhoto || currentUser.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-xs group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      {currentUser.name}
                    </h2>
                    {(currentUser.verified || currentUser.verifiedTeacher) && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Educator
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                    <span>{currentUser.schoolName || 'Oklahoma City Public Schools'} • {currentUser.city}, {currentUser.state}</span>
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <Camera className="w-3 h-3" /> Change Photo
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('marketplace')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  ← Back to Marketplace
                </button>
                <button
                  onClick={() => setTeacherSubTab('listings')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Listing</span>
                </button>
              </div>
            </div>

            {/* Dashboard Tabs Nav */}
            <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1.5 text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview', icon: Layers },
                { id: 'listings', label: 'My Listings & Tools', icon: Tag },
                { id: 'bundles', label: 'Classroom Bundles', icon: Package },
                { id: 'analytics', label: 'Sales Analytics', icon: TrendingUp },
                { id: 'seller-orders', label: 'Incoming Sales', icon: ShoppingBag },
                { id: 'buyer-orders', label: 'Purchases & POs', icon: Receipt },
                { id: 'payouts', label: 'Balances & Withdrawals', icon: Wallet },
                { id: 'messages', label: 'Messages & Offers', icon: Mail },
                { id: 'wishlist', label: 'My Classroom Wishlist', icon: Gift },
                { id: 'tax', label: 'Tax Reports & 1099-K', icon: Receipt },
                { id: 'verification', label: 'Educator Verification', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTeacherSubTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors text-xs cursor-pointer ${
                      teacherSubTab === tab.id
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab Views */}
            {teacherSubTab === 'overview' && (
              <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-semibold">Total Surplus Sales</span>
                    <p className="text-xl font-extrabold text-blue-950">
                      ${(orders || [])
                        .filter((o) => o?.items?.some((it) => it.sellerId === currentUser.id))
                        .reduce((acc, o) => acc + (o?.sellerEarnings || 0), 0)
                        .toFixed(2)}
                    </p>
                    <span className="text-[9.5px] text-emerald-600 font-bold block">Direct Payout via Stripe</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-semibold">Active Listings</span>
                    <p className="text-xl font-extrabold text-slate-900">
                      {(products || []).filter((p) => p.sellerId === currentUser.id).length}
                    </p>
                    <span className="text-[9.5px] text-slate-400 block">Zero listing fees applied</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-semibold">Completed Orders</span>
                    <p className="text-xl font-extrabold text-slate-900">
                      {(orders || []).filter((o) => o.buyerId === currentUser.id).length}
                    </p>
                    <span className="text-[9.5px] text-blue-700 font-medium block">Tax deduction invoices ready</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-0.5">
                    <span className="text-slate-500 text-[11px] font-semibold">Educator Rating</span>
                    <p className="text-xl font-extrabold text-amber-500">5.0 ★</p>
                    <span className="text-[9.5px] text-slate-400 block">100% positive feedback</span>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
                  <div
                    onClick={() => setTeacherSubTab('listings')}
                    className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Tag className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">AI Listing Assistant & Bulk Upload</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Instantly generate classroom titles, auto-scan ISBN barcodes, or upload multiple supplies.
                    </p>
                  </div>

                  <div
                    onClick={() => setTeacherSubTab('buyer-orders')}
                    className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">Print School Invoices</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Official IRS Form 1040 line 11 receipts with full school district letterhead ready to print.
                    </p>
                  </div>

                  <div
                    onClick={() => setTeacherSubTab('messages')}
                    className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">Classroom Messages & Offers</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Negotiate offers, coordinate contact-free school office pickups, and chat with teachers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {teacherSubTab === 'listings' && (
              <ListingManagerTab
                products={products}
                currentUserId={currentUser.id}
                currentUser={currentUser}
                onCreateProduct={handleCreateProduct}
                onDeleteProduct={handleDeleteProduct}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onOpenVerification={() => setTeacherSubTab('verification')}
              />
            )}

            {teacherSubTab === 'bundles' && (
              <ClassroomBundlesShowcase
                bundles={bundles}
                onSelectBundle={(b) => showToast(`Bundle: ${b.title}`)}
                onBuyBundle={(b) => showToast(`Buying bundle: ${b.title}`)}
                onOpenBundleBuilder={() => setIsBundleBuilderOpen(true)}
              />
            )}

            {teacherSubTab === 'analytics' && (
              <SellerAnalyticsView />
            )}

            {teacherSubTab === 'seller-orders' && (
              <SellerOrdersTab
                orders={orders}
                currentUserId={currentUser.id}
                onUpdateShipping={(orderId, carrier, tracking, delivery, notes, shippingProof) => {
                  const targetOrder = orders.find((o) => o.id === orderId);
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === orderId
                        ? {
                            ...o,
                            status: 'Shipped',
                            carrier,
                            trackingNumber: tracking,
                            estimatedDelivery: delivery,
                            shippingNotes: notes,
                            shippingProof: shippingProof || o.shippingProof,
                            sellerPayoutStatus: 'Pending',
                            shippedAt: new Date().toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }),
                          }
                        : o
                    )
                  );
                  if (targetOrder) {
                    sendOrderStatusUpdateEmail({
                      order: targetOrder,
                      previousStatus: targetOrder.status,
                      newStatus: 'Shipped',
                      carrier,
                      trackingNumber: tracking,
                      estimatedDelivery: delivery,
                      notes,
                    }).catch((err) => console.warn('Resend shipping update email error:', err));
                  }
                  showToast(`Shipping updated with ${carrier} tracking: ${tracking}. Buyer notified via Resend email!`);
                }}
                onOpenDisputeCenter={(disputeId) => {
                  setActiveView('dispute-center');
                }}
                onPrintSlip={(_order) => {
                  window.print();
                }}
              />
            )}

            {teacherSubTab === 'buyer-orders' && (
              <BuyerOrdersTab
                orders={orders}
                currentUserId={currentUser.id}
                onConfirmReceiptAndReleaseEscrow={(orderId) => {
                  const targetOrder = orders.find((o) => o.id === orderId);
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === orderId
                        ? {
                            ...o,
                            status: 'Completed',
                            escrowStatus: 'Released',
                            sellerPayoutStatus: 'Released',
                            escrowReleasedAt: new Date().toISOString(),
                          }
                        : o
                    )
                  );
                  if (targetOrder) {
                    sendOrderStatusUpdateEmail({
                      order: targetOrder,
                      previousStatus: targetOrder.status,
                      newStatus: 'Completed',
                      recipientEmail: 'seller@school.edu',
                      recipientName: targetOrder.items?.[0]?.sellerName || 'Teacher Seller',
                      notes: 'Buyer confirmed receipt! Escrow payment released to teacher balance.',
                    }).catch((err) => console.warn('Resend completion email error:', err));
                  }
                  addAdminNotification({
                    title: `Escrow Payout Disbursed: Order #${targetOrder?.orderNumber || 'MFT-ORD'}`,
                    message: `Buyer confirmed receipt. $${(targetOrder?.sellerEarnings || targetOrder?.subtotal || 0).toFixed(2)} released to educator.`,
                    type: 'escrow',
                    priority: 'medium',
                    amount: targetOrder?.sellerEarnings || targetOrder?.subtotal || 0,
                    actorName: targetOrder?.items?.[0]?.sellerName || 'Educator Seller',
                    details: 'Direct payout completed upon classroom delivery verification.',
                  });
                  showToast(
                    `Delivery confirmed! Escrow payment of $${(targetOrder?.sellerEarnings || targetOrder?.subtotal || 0).toFixed(
                      2
                    )} released to educator.`
                  );
                }}
                onOpenDisputeCenter={(disputeId) => {
                  setActiveView('dispute-center');
                }}
                onOpenDisputeModal={(order) => {
                  setActiveView('dispute-center');
                }}
                onPrintInvoice={(_order) => {
                  window.print();
                }}
                onOpenContactSupport={(_cat, _subj) => {
                  setIsContactModalOpen(true);
                }}
              />
            )}

            {teacherSubTab === 'payouts' && (
              <SellerPayoutsTab
                currentUser={currentUser}
                orders={orders}
                payoutRequests={payoutRequests}
                onRequestWithdrawal={handleRequestWithdrawal}
                onOpenDisputeCenter={() => setActiveView('dispute-center')}
              />
            )}

            {teacherSubTab === 'messages' && (
              <TeacherMessagesTab currentUser={currentUser} />
            )}

            {teacherSubTab === 'wishlist' && (
              <TeacherWishlistTab
                wishlist={wishlist}
                onRemoveFromWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            )}

            {teacherSubTab === 'tax' && (
              <TaxSummaryTab currentUser={currentUser} orders={orders} feeSettings={feeSettings} />
            )}

            {teacherSubTab === 'verification' && (
              <TeacherVerificationTab
                currentUser={currentUser}
                onUpdateVerification={(status) => {
                  const updated = {
                    ...currentUser,
                    verified: status,
                    verifiedTeacher: status,
                  };
                  setCurrentUser(updated);
                  setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
                  showToast('Teacher verification status updated! 🎓');
                }}
              />
            )}
          </div>
        )}

        {/* VIEW 3: SAVED WISHLIST */}
        {activeView === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-xl text-slate-900">Saved Classroom Wishlist</h2>
              <button
                onClick={() => setActiveView('marketplace')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                ← Back to Marketplace
              </button>
            </div>

            <TeacherWishlistTab
              wishlist={wishlist}
              onRemoveFromWishlist={handleToggleWishlist}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </div>
        )}

        {/* VIEW 4: ADMIN CMS & MODERATION PORTAL */}
        {activeView === 'admin' && (
          <div className="space-y-6">
            {/* Top Admin Header */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                    Admin Portal
                  </span>
                  <h2 className="font-extrabold text-lg sm:text-xl">
                    MarketplaceForTeachers.com Control Center
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platform revenue monitoring, educator moderation, nationwide sales percentage control & PHP/MySQL schema inspector.
                </p>
              </div>

              <button
                onClick={() => setActiveView('marketplace')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                ← Back to Marketplace
              </button>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-bold">
              {[
                { id: 'overview', label: 'Platform Overview', icon: Layers },
                { id: 'config-sync', label: 'Configuration Sync Check', icon: RefreshCw },
                { id: 'sales-reports', label: 'Sales Reports & Generator', icon: TrendingUp },
                { id: 'payment-gateways', label: 'Payment Gateways Setup', icon: CreditCard },
                { id: 'playbook', label: 'Company Playbook & SOPs', icon: BookOpen },
                { id: 'safety', label: 'Payment Protection & Escrow', icon: ShieldAlert },
                { id: 'website-editor', label: 'Website & CMS Editor', icon: Globe },
                { id: 'blog', label: 'Educator Blog & Articles', icon: Newspaper },
                { id: 'sales-fees', label: 'Sales % & US Tax Control', icon: Percent },
                { id: 'users', label: 'Teacher Verification Queue', icon: Users },
                { id: 'listings', label: 'Catalog Moderation', icon: Tag },
                { id: 'emails', label: 'Automated Email System', icon: Mail },
                { id: 'database', label: 'Deployment Center (Node.js & MySQL)', icon: Server },
                { id: 'audit', label: 'Audit Log Trail', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminSubTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                      adminSubTab === tab.id
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tabs Rendering */}
            {adminSubTab === 'overview' && (
              <AdminOverviewTab
                orders={orders}
                products={products}
                users={users}
                feeSettings={feeSettings}
                onSelectTab={(tab) => setAdminSubTab(tab)}
                onOpenSalesReport={(tf) => {
                  setSalesReportTimeframe(tf);
                  setAdminSubTab('sales-reports');
                }}
                adminNotifications={adminNotifications}
                onClearNotifications={handleClearAdminNotifications}
                onTriggerTestOperation={handleTriggerTestOperation}
              />
            )}

            {adminSubTab === 'config-sync' && (
              <AdminConfigSyncCheck onOpenCpanelExport={() => setIsCPanelModalOpen(true)} />
            )}

            {adminSubTab === 'sales-reports' && (
              <AdminSalesReportsGenerator
                orders={orders}
                products={products}
                users={users}
                feeSettings={feeSettings}
                initialTimeframe={salesReportTimeframe}
                onNavigateTab={(tab) => setAdminSubTab(tab as any)}
              />
            )}

            {adminSubTab === 'payment-gateways' && (
              <AdminPaymentGateways
                gatewayConfig={gatewayConfig}
                onSaveGatewayConfig={(cfg) => {
                  setGatewayConfig(cfg);
                  showToast('Payment gateways & corporate settlement updated! 💳');
                }}
                onShowToast={showToast}
              />
            )}

            {adminSubTab === 'playbook' && (
              <AdminCompanyPlaybook onShowToast={showToast} />
            )}

            {adminSubTab === 'safety' && (
              <AdminSafetyDashboard
                orders={orders}
                disputes={disputes}
                fraudAlerts={fraudAlerts}
                sellerVerifications={sellerVerifications}
                feeSettings={feeSettings}
                onReleasePayout={handleReleasePayout}
                onHoldPayout={handleHoldPayout}
                onResolveDispute={handleResolveDispute}
                onUpdateVerification={(id, status) => {
                  setSellerVerifications((prev) =>
                    prev.map((v) => (v.id === id ? { ...v, status, reviewedAt: new Date().toISOString() } : v))
                  );
                  showToast(`Verification status updated to ${status}`);
                }}
              />
            )}

            {adminSubTab === 'website-editor' && (
              <AdminWebsiteEditor
                siteSettings={siteSettings}
                onUpdateSiteSettings={(newSettings) => {
                  setSiteSettings(newSettings);
                  showToast('Global website configuration & hero banner saved successfully! 🌐');
                }}
                cmsPages={cmsPages}
                onUpdateCMSPage={(page) => {
                  setCmsPages((prev) => prev.map((p) => (p.slug === page.slug ? page : p)));
                  showToast(`CMS Page "${page.title}" updated and published! 📄`);
                }}
                feeSettings={feeSettings}
                onUpdateFeeSettings={(newFees) => {
                  setFeeSettings(newFees);
                  showToast('Fee & escrow settings updated!');
                }}
              />
            )}

            {adminSubTab === 'blog' && (
              <AdminBlogManager
                articles={articles}
                onUpdateArticles={(newArticles) => {
                  setArticles(newArticles);
                  showToast('Blog articles and educator tax guides saved! 📰');
                }}
                siteSettings={siteSettings}
                onUpdateSiteSettings={(newSettings) => {
                  setSiteSettings(newSettings);
                  showToast('Blog module visibility settings updated!');
                }}
                onSelectArticle={(article) => {
                  setActiveView('news');
                }}
                onNavigateToView={(view) => {
                  setActiveView(view as any);
                }}
              />
            )}

            {adminSubTab === 'sales-fees' && (
              <AdminSalesFeeManager
                feeSettings={feeSettings}
                onUpdateFeeSettings={(newSettings) => {
                  setFeeSettings(newSettings);
                  showToast(`Sales fee rate updated to ${newSettings.nationwideCommissionRate}% across all US states & cities!`);
                }}
              />
            )}

            {adminSubTab === 'users' && (
              <AdminUsersManager
                users={users}
                products={products}
                onToggleVerification={(userId) => {
                  setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, verified: !u.verified, verifiedTeacher: !u.verified } : u))
                  );
                  showToast('Updated educator verification status');
                }}
                onToggleActive={(userId) => {
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === userId
                        ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
                        : u
                    )
                  );
                  showToast('Updated user status');
                }}
                onUpdateUserBalance={(userId, newBalance) => {
                  setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? { ...u, balance: newBalance } : u))
                  );
                  showToast('User balance successfully adjusted! 💰');
                }}
                onShowToast={showToast}
              />
            )}

            {adminSubTab === 'listings' && (
              <AdminListingsManager
                products={products}
                onToggleFeatured={(productId) => {
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === productId ? { ...p, featured: !p.featured } : p
                    )
                  );
                  showToast('Featured status updated for homepage spotlight');
                }}
                onDeleteListing={handleDeleteProduct}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            )}

            {adminSubTab === 'emails' && (
              <AdminEmailCampaigns
                users={users}
                onShowToast={showToast}
              />
            )}

            {adminSubTab === 'database' && (
              <AdminDatabaseSchemaViewer onOpenCpanelExport={() => setIsCPanelModalOpen(true)} />
            )}

            {adminSubTab === 'audit' && <AdminAuditLogs logs={auditLogs} />}
          </div>
        )}

        {/* VIEW: AUTHENTICATION */}
        {(activeView === 'login' || activeView === 'register') && (
          <AuthPage
            initialTab={activeView}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'admin') {
                setActiveView('admin');
                showToast(`Welcome Super Admin (${user.name})! Full site control unlocked.`);
              } else if (user.role === 'teacher') {
                setActiveView('teacher-dashboard');
                showToast(`Welcome back, ${user.name}! Verified Educator credentials loaded.`);
              } else {
                setActiveView('marketplace');
                showToast(`Welcome back, ${user.name}!`);
              }
            }}
            onRegisterSuccess={(newUser) => {
              setCurrentUser(newUser);
              setUsers((prev) => [newUser, ...prev]);
              if (newUser.role === 'teacher') {
                setActiveView('teacher-dashboard');
                setTeacherSubTab('overview');
                showToast(`Account registered! Verification email sent to ${newUser.schoolEmail || newUser.email}. Verified teacher badge active 🎓`);
              } else {
                setActiveView('marketplace');
                showToast(`Account registered! Welcome to Marketplace for Teachers, ${newUser.name}!`);
              }
            }}
            onOpenCMSPage={(slug) => {
              setActiveView(slug);
              setCmsPageSlug(null);
            }}
            onNavigateHome={() => setActiveView('marketplace')}
            onOpenCPanelExport={() => setIsCPanelModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      {(activeView !== 'login' && activeView !== 'register' && activeView !== 'admin-login') && (
        <Footer
          onOpenCMSPage={(slug) => {
            setActiveView(slug);
            setCmsPageSlug(null);
          }}
          onSelectCategory={(catId) => {
            setActiveView('marketplace');
            setFilters({ ...filters, categoryId: catId, subcategoryId: '' });
          }}
          onOpenContact={() => setIsContactModalOpen(true)}
          onOpenCPanelExport={() => setIsCPanelModalOpen(true)}
          onOpenBuyerProtection={() => setActiveView('buyer-protection')}
          onOpenTrustCenter={() => setActiveView('trust-center')}
          onOpenDisputeCenter={() => setActiveView('dispute-center')}
          siteSettings={siteSettings}
        />
      )}

      {/* Side-by-side Compare Supplies Drawer */}
      <CompareProductsDrawer
        products={comparedProducts}
        onRemoveProduct={(id) => setComparedProductIds((prev) => prev.filter((i) => i !== id))}
        onClearAll={() => setComparedProductIds([])}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onClose={() => setComparedProductIds([])}
      />

      {/* Bundle Builder Modal */}
      <ClassroomBundleBuilderModal
        isOpen={isBundleBuilderOpen}
        onClose={() => setIsBundleBuilderOpen(false)}
        currentUser={currentUser}
        availableProducts={products.filter((p) => p.sellerId === currentUser.id)}
        onSaveBundle={handleSaveBundle}
      />

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isWishlisted={wishlist.some((w) => w.id === selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={(p, qty) => {
            handleAddToCart(p, qty || 1);
            setIsCartOpen(true);
          }}
          onBuyNow={(p) => {
            handleAddToCart(p, 1);
            setSelectedProduct(null);
            setIsCheckoutOpen(true);
          }}
          onOpenMakeOffer={(p) => setOfferProduct(p)}
          onOpenMessageSeller={(p) => setMessageProduct(p)}
          onOpenReportListing={(p) => setReportProduct(p)}
          onSelectRelated={(p) => setSelectedProduct(p)}
          relatedProducts={products.filter(
            (p) => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id
          )}
        />
      )}

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onUpdateShipping={handleUpdateShipping}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        feeSettings={feeSettings}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* 4. Make Offer Modal */}
      <MakeOfferModal
        product={offerProduct}
        onClose={() => setOfferProduct(null)}
        onSubmitOffer={(productId, amount, note) => {
          showToast(`Offer of $${amount.toFixed(2)} submitted to teacher!`);
        }}
      />

      {/* 5. Message Seller Modal */}
      <MessageSellerModal
        product={messageProduct}
        onClose={() => setMessageProduct(null)}
        onSendMessage={(sellerId, text, prod) => {
          const targetProd = prod || messageProduct;
          if (targetProd) {
            sendMessageNotificationEmail({
              senderName: currentUser.name || 'Educator',
              senderRole: currentUser.role === 'teacher_seller' ? 'Verified Teacher' : 'Buyer',
              recipientName: targetProd.sellerName,
              recipientEmail: 'seller@school.edu',
              messageText: text,
              productTitle: targetProd.title,
            }).catch((err) => console.warn('Resend message notification error:', err));
          }
          showToast(`Message sent to ${targetProd?.sellerName || 'teacher'}! Email notification dispatched via Resend.`);
        }}
      />

      {/* 6. Report Listing Modal */}
      <ReportListingModal
        product={reportProduct}
        onClose={() => setReportProduct(null)}
        onSubmitReport={(productId, reason, details) => {
          showToast('Listing reported to moderation team. Thank you for keeping our community safe.');
        }}
      />

      {/* 7. CMS Page Modal */}
      <CMSPageModal slug={cmsPageSlug} onClose={() => setCmsPageSlug(null)} cmsPages={cmsPages} />

      {/* 8. User Profile Photo & Details Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          showToast('Profile photo and credentials updated successfully! 🍎');
        }}
      />

      {/* 9. Official Educator Contact & Support Ticket Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        currentUser={currentUser}
        onTicketSubmitted={(ticket) => {
          showToast(
            `Support Ticket #${ticket.ticketId} created! Confirmation dispatched to ${ticket.senderEmail}`
          );
        }}
      />

      {/* 10. cPanel / PHP 8.2 Production Package Exporter Modal */}
      <CPanelExportModal
        isOpen={isCPanelModalOpen}
        onClose={() => setIsCPanelModalOpen(false)}
      />

    </div>
  );
};

export default App;
