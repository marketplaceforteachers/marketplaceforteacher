import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Heart,
  ShoppingBag,
  Bell,
  PlusCircle,
  ShieldCheck,
  ChevronDown,
  User as UserIcon,
  LayoutDashboard,
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle2,
  X,
  Gift,
  HandHeart,
  Sparkles,
  MessageSquare,
  Building2,
  Award,
  Newspaper,
  Package,
  Lock,
  CheckCircle,
  Menu,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { User, NotificationItem, SiteSettings, AdminNotification } from '../types';
import { CATEGORIES } from '../data/categoriesData';
import {
  formatLocationLabel,
  resolveLocationInputToZip,
  MAJOR_US_CITIES,
  US_STATES_LIST,
} from '../utils/locationUtils';

interface HeaderProps {
  currentUser: User;
  onSwitchUserRole?: (role: 'guest' | 'teacher' | 'admin') => void;
  onRoleChange?: (role: 'guest' | 'teacher' | 'admin') => void;
  onOpenDashboard?: (tab?: string) => void;
  onOpenTeacherDashboard?: () => void;
  onOpenAdminCMS?: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenProfileModal?: () => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenCreateListing?: () => void;
  onOpenCMSPage?: (slug: string) => void;
  onOpenContact?: () => void;
  onOpenCPanelExport?: () => void;
  onOpenAuthModal?: (initialTab?: 'login' | 'register' | 'admin') => void;
  onLogout?: () => void;
  cartCount?: number;
  wishlistCount?: number;
  notifications?: NotificationItem[];
  adminNotifications?: AdminNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onClearAdminNotifications?: () => void;
  onTriggerTestOperation?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (catId: string) => void;
  userZip?: string;
  onUserZipChange?: (zip: string) => void;
  activeView?: string;
  onNavigateHome?: () => void;
  onNavigateView?: (view: any) => void;
  siteSettings?: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUserRole,
  onRoleChange,
  onOpenDashboard,
  onOpenTeacherDashboard,
  onOpenAdminCMS,
  onOpenAdminDashboard,
  onOpenProfileModal,
  onOpenCart = () => {},
  onOpenWishlist = () => {},
  onOpenCreateListing = () => {},
  onOpenCMSPage = (_slug: string) => {},
  onOpenContact,
  onOpenCPanelExport,
  onOpenAuthModal,
  onLogout,
  cartCount = 0,
  wishlistCount = 0,
  notifications = [],
  adminNotifications = [],
  onMarkNotificationRead = (_id: string) => {},
  onClearAdminNotifications,
  onTriggerTestOperation,
  searchQuery = '',
  onSearchChange = (_q: string) => {},
  selectedCategory = '',
  onSelectCategory = (_catId: string) => {},
  userZip = '73159',
  onUserZipChange = (_zip: string) => {},
  activeView = 'marketplace',
  onNavigateHome = () => {},
  onNavigateView,
  siteSettings,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [tempZip, setTempZip] = useState(userZip || '73159');

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadNotifs = safeNotifications.filter((n) => !n?.read);

  const getNavTabIcon = (iconName?: string, id?: string) => {
    switch (iconName || id) {
      case 'marketplace':
      case 'ShoppingBag':
        return ShoppingBag;
      case 'buyer-protection':
      case 'ShieldCheck':
        return ShieldCheck;
      case 'wishlists':
      case 'Gift':
        return Gift;
      case 'fundraising':
      case 'HandHeart':
        return HandHeart;
      case 'local-map':
      case 'MapPin':
        return MapPin;
      case 'bundles':
      case 'Package':
        return Package;
      case 'inspiration':
      case 'Sparkles':
        return Sparkles;
      case 'community':
      case 'MessageSquare':
        return MessageSquare;
      case 'schools':
      case 'Building2':
        return Building2;
      case 'rewards':
      case 'Award':
        return Award;
      case 'news':
      case 'Newspaper':
        return Newspaper;
      case 'trust-center':
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Lock':
        return Lock;
      case 'CheckCircle':
        return CheckCircle;
      default:
        return Sparkles;
    }
  };

  const featureModules = siteSettings?.featureModules || {};
  const isViewEnabledByModule = (viewId: string) => {
    if (viewId === 'news' || viewId === 'blog') return featureModules.enableBlog ?? true;
    if (viewId === 'wishlists') return featureModules.enableWishlists ?? true;
    if (viewId === 'fundraising') return featureModules.enableFundraising ?? true;
    if (viewId === 'local-map') return featureModules.enableDistrictMap ?? true;
    if (viewId === 'bundles') return featureModules.enableBundles ?? true;
    if (viewId === 'inspiration') return featureModules.enableInspirationGallery ?? true;
    if (viewId === 'community') return featureModules.enableCommunityForum ?? true;
    if (viewId === 'schools') return featureModules.enableSchoolDirectory ?? true;
    if (viewId === 'rewards') return featureModules.enableRewardsClub ?? true;
    if (viewId === 'buyer-protection' || viewId === 'trust-center') return featureModules.enableBuyerProtectionPage ?? true;
    return true;
  };

  // Dynamic Navigation items from SiteSettings if present
  const dynamicNavItems = ((siteSettings?.mainNavItems && siteSettings.mainNavItems.length > 0)
    ? siteSettings.mainNavItems
        .filter((item) => item.enabled !== false)
        .filter((item) => {
          if (currentUser.role !== 'guest' && (item.id === 'login' || item.id === 'register' || item.id === 'admin-login')) {
            return false;
          }
          return true;
        })
        .map((item) => ({
          id: item.targetView || item.id,
          label: item.label,
          icon: getNavTabIcon(item.iconName, item.id),
        }))
    : [
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
        { id: 'buyer-protection', label: 'Buyer Protection 🛡️', icon: ShieldCheck },
        { id: 'wishlists', label: 'Wishlists ⭐', icon: Gift },
        { id: 'fundraising', label: 'Classroom Grants', icon: HandHeart },
        { id: 'local-map', label: 'Local Pickup Map', icon: MapPin },
        { id: 'bundles', label: 'Starter Bundles', icon: Package },
        { id: 'inspiration', label: 'Setup Inspiration', icon: Sparkles },
        { id: 'community', label: 'Teacher Community', icon: MessageSquare },
        { id: 'schools', label: 'School Directory', icon: Building2 },
        { id: 'rewards', label: 'Rewards Shop', icon: Award },
        { id: 'news', label: 'Educator News & Tax', icon: Newspaper },
        { id: 'trust-center', label: 'Trust & Safety', icon: ShieldAlert },
      ]
  ).filter((nav) => isViewEnabledByModule(nav.id));

  // Dynamic category items filter
  const visibleCategories = siteSettings?.categoryNavItems
    ? CATEGORIES.filter((cat) => {
        const item = siteSettings.categoryNavItems?.find((c) => c.id === cat.id);
        return item ? item.enabled !== false : true;
      })
    : CATEGORIES;

  const handleRoleSwitch = (role: 'guest' | 'teacher' | 'admin') => {
    if (onSwitchUserRole) {
      onSwitchUserRole(role);
    } else if (onRoleChange) {
      onRoleChange(role);
    }
  };

  const handleOpenTeacher = (tab?: string) => {
    if (onOpenDashboard) {
      onOpenDashboard(tab);
    } else if (onOpenTeacherDashboard) {
      onOpenTeacherDashboard();
    }
  };

  const handleOpenAdmin = () => {
    if (onOpenAdminCMS) {
      onOpenAdminCMS();
    } else if (onOpenAdminDashboard) {
      onOpenAdminDashboard();
    }
  };

  const handleHomeClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else if (onNavigateView) {
      onNavigateView('marketplace');
    }
  };

  const handleZipSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempZip.trim()) {
      const resolved = resolveLocationInputToZip(tempZip.trim());
      onUserZipChange(resolved.zip);
      setShowZipModal(false);
    }
  };

  const handleQuickCitySelect = (cityZip: string) => {
    setTempZip(cityZip);
    onUserZipChange(cityZip);
    setShowZipModal(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-blue-900 border-b border-blue-800 shadow-md">
      {/* Main Header Bar (Deep Blue Background) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            id="nav-home-logo-btn"
            onClick={handleHomeClick}
            className="focus:outline-hidden hover:opacity-95 transition-opacity text-left shrink-0 cursor-pointer"
          >
            <BrandLogo size="md" variant="dark-header" />
          </button>

          {/* High-Density Search Bar with Pill style & Location Divider */}
          <div className="hidden md:flex flex-1 max-w-xl px-2 sm:px-6 items-center">
            <div className="relative w-full flex items-center bg-white/10 rounded-full border border-white/20 focus-within:bg-white/15 focus-within:border-white/40 px-3.5 py-1.5 transition-all">
              <Search className="w-4 h-4 text-white/60 mr-2 shrink-0 pointer-events-none" />
              
              {/* Input field */}
              <input
                id="global-search-input"
                type="text"
                placeholder="Search classroom supplies, city, state, or ZIP..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent border-none text-xs sm:text-sm text-white w-full focus:outline-none placeholder:text-white/50"
              />
              
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="mr-2 text-white/60 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* High-Density Location Separator & Badge */}
              <div className="h-4 w-px bg-white/20 mx-2.5 shrink-0" />
              
              <button
                id="zip-filter-btn"
                type="button"
                onClick={() => setShowZipModal(true)}
                className="text-xs font-semibold text-white/90 hover:text-white whitespace-nowrap flex items-center gap-1 shrink-0 transition-colors cursor-pointer max-w-[160px] truncate"
                title="Change location by City, State, or ZIP code"
              >
                <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                <span className="truncate">{formatLocationLabel(userZip)}</span>
              </button>
            </div>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Create Listing CTA */}
            {currentUser.role !== 'guest' ? (
              <button
                id="header-create-listing-btn"
                onClick={onOpenCreateListing}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post Listing</span>
                <span className="sm:hidden">Sell</span>
              </button>
            ) : (
              <button
                id="header-become-seller-btn"
                onClick={() => onOpenCMSPage('become-a-seller')}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 transition-colors cursor-pointer"
              >
                Sell on MFT
              </button>
            )}

            {/* Notifications / Messages */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg relative transition-colors flex items-center gap-1 cursor-pointer"
                aria-label="Notifications & Messages"
              >
                <Bell className="w-4.5 h-4.5" />
                {(unreadNotifs.length > 0 || (currentUser.role === 'admin' && adminNotifications.length > 0) || currentUser.role === 'guest') && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full leading-tight animate-pulse">
                    {currentUser.role === 'admin' ? (adminNotifications.length || 1) : currentUser.role === 'guest' ? 2 : (unreadNotifs.length || 0)}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div
                  id="notifications-menu"
                  className="absolute right-0 mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        {currentUser.role === 'admin' ? '🛡️ Admin Operations Stream' : currentUser.role === 'guest' ? '📢 Marketplace Alerts & Grants' : 'Teacher Notifications'}
                      </span>
                      <p className="text-[10px] text-slate-500">
                        {currentUser.role === 'admin' ? 'Live alerts for orders, listings, disputes & POs' : currentUser.role === 'guest' ? 'Classroom news, grants & updates' : 'Your classroom updates'}
                      </p>
                    </div>
                    {currentUser.role === 'admin' && onTriggerTestOperation && (
                      <button
                        onClick={onTriggerTestOperation}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-900 text-[10px] font-extrabold px-2 py-1 rounded-md border border-blue-200 transition-colors cursor-pointer"
                        title="Simulate a real-time order or dispute alert"
                      >
                        + Test Event
                      </button>
                    )}
                  </div>

                  {currentUser.role === 'admin' ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {adminNotifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          <p>No active operations yet.</p>
                          <p className="text-[10px] text-slate-400 mt-1">Click "+ Test Event" to test live notification stream!</p>
                        </div>
                      ) : (
                        adminNotifications.slice(0, 8).map((notif) => (
                          <div
                            key={notif.id}
                            className="p-3 text-xs hover:bg-slate-50 transition-colors bg-slate-50/50"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900">{notif.title}</span>
                                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-blue-100 text-blue-900 font-bold">
                                  {notif.type}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">{notif.message}</p>
                            {notif.amount !== undefined && notif.amount > 0 && (
                              <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                                <span>Amount: ${notif.amount.toFixed(2)}</span>
                                {notif.actorName && <span>User: {notif.actorName}</span>}
                              </div>
                            )}
                          </div>
                        ))
                      )}

                      <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => {
                            setShowNotifMenu(false);
                            if (onOpenAdminCMS) onOpenAdminCMS();
                          }}
                          className="font-bold text-blue-700 hover:underline cursor-pointer"
                        >
                          Open Full Admin Stream →
                        </button>
                        {onClearAdminNotifications && adminNotifications.length > 0 && (
                          <button
                            onClick={onClearAdminNotifications}
                            className="text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  ) : currentUser.role === 'guest' ? (
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      <div className="p-3 text-xs hover:bg-blue-50/40 bg-blue-50/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-blue-900 flex items-center gap-1">
                            <span>🎁 $15 Educator Welcome Grant</span>
                          </span>
                          <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-100 px-1 rounded">TEACHER15</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Use code <strong className="text-blue-700 font-mono">TEACHER15</strong> at checkout for $15 off your first classroom supply order over $50!
                        </p>
                      </div>

                      <div className="p-3 text-xs hover:bg-slate-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800">🛡️ 100% Buyer Protection Live</span>
                          <span className="text-[10px] text-slate-400">Active</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          All orders are backed by payment protection until you inspect and confirm materials at your school.
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setShowNotifMenu(false);
                            if (onOpenAuthModal) onOpenAuthModal('login');
                          }}
                          className="w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold text-center transition-colors cursor-pointer"
                        >
                          Sign In / Register
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {safeNotifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          <p>No notifications yet.</p>
                          <p className="text-[10px] text-slate-400 mt-1">Updates on your sales, orders, and messages appear here.</p>
                        </div>
                      ) : (
                        safeNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => onMarkNotificationRead(notif.id)}
                            className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                              !notif.read ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-800">{notif.title}</span>
                              <span className="text-[10px] text-slate-400">{notif.time}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg relative transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full leading-tight">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg relative transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span className="font-bold text-[11px] bg-red-600 text-white px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            </button>

            {/* User Profile / Dashboard Menu button */}
            {currentUser.role === 'admin' ? (
              <div className="flex items-center gap-1">
                {onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    title="Edit Admin Profile & Photo"
                    className="p-1 rounded-lg text-purple-200 hover:text-white hover:bg-purple-800 transition-colors cursor-pointer"
                  >
                    {currentUser.profilePhoto || currentUser.avatar ? (
                      <img
                        src={currentUser.profilePhoto || currentUser.avatar}
                        alt={currentUser.name}
                        className="w-6 h-6 rounded-full object-cover border border-purple-300 shadow-xs"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold text-[10px] flex items-center justify-center">
                        AD
                      </div>
                    )}
                  </button>
                )}
                <button
                  onClick={() => onLogout && onLogout()}
                  title="Sign out"
                  className="px-2.5 py-1 rounded-lg bg-red-900/60 text-red-200 border-red-700/60 hover:bg-red-800 transition-colors text-xs font-bold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : currentUser.role === 'teacher' ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="header-teacher-portal-btn"
                  onClick={() => handleOpenTeacher()}
                  className={`p-1 sm:px-2.5 sm:py-1 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                    activeView === 'teacher-dashboard'
                      ? 'bg-blue-800 text-white border-blue-600 shadow-xs'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  {currentUser.profilePhoto || currentUser.avatar ? (
                    <img
                      src={currentUser.profilePhoto || currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-emerald-400 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center font-bold text-[10px] shadow-sm text-white shrink-0">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('') || 'SJ'}
                    </div>
                  )}
                  <div className="hidden lg:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-white truncate max-w-[95px]">
                      {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1]?.[0] || ''}.
                    </span>
                    <span className="text-[9px] text-emerald-300 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 inline" /> Verified
                    </span>
                  </div>
                </button>
                {onOpenProfileModal && (
                  <button
                    onClick={onOpenProfileModal}
                    title="Change Profile Photo & Info"
                    className="hidden sm:flex text-[10px] font-bold text-blue-200 hover:text-white bg-blue-800/80 hover:bg-blue-700 px-2 py-1 rounded-md border border-blue-600/50 transition-colors cursor-pointer"
                  >
                    Edit Photo
                  </button>
                )}
                <button
                  onClick={() => onLogout && onLogout()}
                  title="Sign out"
                  className="hidden sm:flex text-[10px] font-bold text-red-200 hover:text-white bg-red-800/80 hover:bg-red-700 px-2 py-1 rounded-md border border-red-600/50 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="header-guest-signin-btn"
                  onClick={() => (onOpenAuthModal ? onOpenAuthModal('login') : handleRoleSwitch('teacher'))}
                  className="text-xs font-semibold text-white/90 hover:text-white px-2.5 py-1 rounded-lg border border-white/30 hover:border-white transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="header-guest-register-btn"
                  onClick={() => (onOpenAuthModal ? onOpenAuthModal('register') : handleRoleSwitch('teacher'))}
                  className="text-xs font-bold text-blue-900 bg-white hover:bg-blue-50 px-2.5 py-1 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden">
          <div className="relative flex items-center bg-white/10 rounded-full border border-white/20 px-3 py-1">
            <Search className="w-3.5 h-3.5 text-white/60 mr-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search supplies, books, kits..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs text-white placeholder:text-white/40 bg-transparent focus:outline-hidden"
            />
            <button
              onClick={() => setShowZipModal(true)}
              className="text-[10px] font-semibold text-white/90 flex items-center gap-0.5 whitespace-nowrap pl-1 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-red-400" />
              <span>{userZip || '73159'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer / Hamburger Panel (< 768px) */}
      {showMobileMenu && (
        <div id="mobile-hamburger-drawer" className="md:hidden bg-slate-900 border-t border-slate-800 text-white shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-[80vh] overflow-y-auto px-4 py-3 space-y-4">
            
            {/* User Account / Role Section */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              {currentUser.role === 'admin' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-700 text-white font-bold text-xs flex items-center justify-center">
                        AD
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{currentUser.name}</div>
                        <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Super Administrator</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        if (onLogout) onLogout();
                      }}
                      className="text-xs text-red-300 hover:text-red-200 font-bold px-2 py-1 bg-red-900/60 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        if (onOpenAdminCMS) onOpenAdminCMS();
                      }}
                      className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Admin CMS</span>
                    </button>
                    {onOpenProfileModal && (
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          onOpenProfileModal();
                        }}
                        className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : currentUser.role === 'teacher' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {currentUser.profilePhoto || currentUser.avatar ? (
                        <img
                          src={currentUser.profilePhoto || currentUser.avatar}
                          alt={currentUser.name}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-400"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                          {currentUser.name.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'TC'}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-black text-white">{currentUser.name}</div>
                        <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 inline" /> Verified Educator
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        if (onLogout) onLogout();
                      }}
                      className="text-xs text-red-300 hover:text-red-200 font-bold px-2 py-1 bg-red-900/60 rounded-md cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleOpenTeacher();
                      }}
                      className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        onOpenCreateListing();
                      }}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Post Listing</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-slate-300 font-medium">
                    Sign in to access educator verified listings, direct messaging, and district tax-exempt receipts.
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        if (onOpenAuthModal) onOpenAuthModal('login');
                      }}
                      className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[44px]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Educator Login</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        if (onOpenAuthModal) onOpenAuthModal('register');
                      }}
                      className="w-full py-2.5 bg-white hover:bg-slate-100 text-blue-900 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[44px]"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Create Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Location & Delivery Filter */}
            <div className="flex items-center justify-between p-2.5 bg-blue-950/70 rounded-xl border border-blue-800/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] text-blue-300 font-bold uppercase">Pickup / Delivery Location</div>
                  <div className="text-xs font-bold text-white truncate max-w-[190px]">
                    {formatLocationLabel(userZip)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowZipModal(true);
                }}
                className="text-[11px] font-bold text-amber-300 hover:text-white bg-blue-900 px-2.5 py-1 rounded-md border border-blue-700 cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Main Navigation Links List */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block">
                Explore Marketplace
              </span>
              <div className="grid grid-cols-1 gap-1">
                {dynamicNavItems.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeView === tab.id;
                  return (
                    <button
                      key={`mobile-${tab.id}`}
                      onClick={() => {
                        setShowMobileMenu(false);
                        if (onNavigateView) {
                          onNavigateView(tab.id);
                        } else if (tab.id === 'marketplace') {
                          handleHomeClick();
                        } else if (onOpenCMSPage) {
                          onOpenCMSPage(tab.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors min-h-[44px] cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'text-slate-200 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-blue-400'}`} />
                        <span>{tab.label}</span>
                      </div>
                      <span className="text-[10px] opacity-60">→</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department Categories Filter List */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block">
                Browse Departments
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onSelectCategory('');
                    if (activeView !== 'marketplace') handleHomeClick();
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors min-h-[40px] cursor-pointer ${
                    !selectedCategory ? 'bg-blue-800 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All Items
                </button>
                {visibleCategories.map((cat) => (
                  <button
                    key={`mobile-cat-${cat.id}`}
                    onClick={() => {
                      setShowMobileMenu(false);
                      onSelectCategory(cat.id);
                      if (activeView !== 'marketplace') handleHomeClick();
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left truncate transition-colors min-h-[40px] cursor-pointer ${
                      selectedCategory === cat.id ? 'bg-blue-800 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Quick Links */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenCMSPage('become-a-seller');
                }}
                className="hover:text-white font-bold"
              >
                Seller Guide
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  if (onOpenContact) onOpenContact();
                }}
                className="hover:text-white font-bold"
              >
                Contact & Support
              </button>
              {onOpenCPanelExport && (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onOpenCPanelExport();
                  }}
                  className="hover:text-white font-bold"
                >
                  cPanel Package
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Feature & Community Navigation Tabs Bar */}
      {(siteSettings ? siteSettings.showMainFeatureNav !== false : true) && (
        <div className="hidden md:block bg-blue-950 border-b border-blue-800/80 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1 text-xs">
            {dynamicNavItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (onNavigateView) {
                      onNavigateView(tab.id);
                    } else if (tab.id === 'marketplace') {
                      handleHomeClick();
                    } else if (onOpenCMSPage) {
                      onOpenCMSPage(tab.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-blue-200 hover:text-white hover:bg-blue-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* High-Density Category Sub-Navigation (Category Filter Row) */}
      {activeView === 'marketplace' && (siteSettings ? siteSettings.showCategoriesNav !== false : true) && (
        <nav className="h-9 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-3 sm:gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-600 overflow-x-auto scrollbar-none shadow-xs">
          <button
            onClick={() => onSelectCategory('')}
            className={`h-full flex items-center whitespace-nowrap transition-colors cursor-pointer ${
              !selectedCategory
                ? 'text-blue-900 border-b-2 border-blue-900 font-black'
                : 'hover:text-blue-900 border-b-2 border-transparent'
            }`}
          >
            All Categories
          </button>

          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`h-full flex items-center whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'text-blue-900 border-b-2 border-blue-900 font-black'
                  : 'hover:text-blue-900 border-b-2 border-transparent'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="flex-1 min-w-4" />

          {siteSettings?.showSellerGuideButton !== false && (
            <button
              onClick={() => onOpenCMSPage('become-a-seller')}
              className="whitespace-nowrap bg-blue-50 hover:bg-blue-100 text-blue-900 px-3 py-0.5 rounded border border-blue-200 font-bold text-[10px] transition-colors shrink-0 cursor-pointer"
            >
              Seller Guide
            </button>
          )}
        </nav>
      )}

      {/* Location Modal (City, State, or ZIP Code Search) */}
      {showZipModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Select Your Location</h3>
                  <p className="text-xs text-slate-500">Find nearby teacher supplies & school pickups</p>
                </div>
              </div>
              <button
                onClick={() => setShowZipModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleZipSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter City, State, or 5-Digit US ZIP
                </label>
                <input
                  type="text"
                  value={tempZip}
                  onChange={(e) => setTempZip(e.target.value)}
                  placeholder="e.g. Brooklyn, NY, Dallas, or 73159"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold tracking-wide focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <span>Current:</span>
                  <strong className="text-slate-800">{formatLocationLabel(userZip)}</strong>
                </p>
              </div>

              {/* Quick Select Popular Educator Hubs */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Popular Teacher Supply Hubs:
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {MAJOR_US_CITIES.map((hub) => (
                    <button
                      key={hub.zip + hub.city}
                      type="button"
                      onClick={() => handleQuickCitySelect(hub.zip)}
                      className={`text-left px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        userZip === hub.zip
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{hub.city}, {hub.state}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-1">{hub.zip}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowZipModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white shadow-sm cursor-pointer transition-colors"
                >
                  Apply Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
