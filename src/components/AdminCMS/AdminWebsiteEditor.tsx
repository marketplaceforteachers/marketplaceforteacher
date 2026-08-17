import React, { useState } from 'react';
import { LOGO_SVG, LOGO_WHITE_SVG, LOGO_ICON_SVG } from '../CPanelExportModal';
import {
  Globe,
  Sliders,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  Edit3,
  Eye,
  Megaphone,
  Percent,
  ShieldCheck,
  Compass,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Tag,
  ShoppingBag,
  List,
  Share2,
  Star,
  UserCheck,
  Download,
  Image,
  ExternalLink,
  Award,
  MessageSquare,
  Power,
  Gift,
  HandHeart,
  Package,
  Building2,
  Newspaper,
  ShieldAlert,
} from 'lucide-react';
import {
  SiteSettings,
  CMSPage,
  AdminFeeSettings,
  NavMenuItem,
  CategoryMenuItem,
  SeasonalBarItem,
  TrustTestimonial,
  SocialMediaChannel,
} from '../../types';
import { DEFAULT_SITE_SETTINGS } from '../../data/mockData';

interface AdminWebsiteEditorProps {
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (newSettings: SiteSettings) => void;
  cmsPages: CMSPage[];
  onUpdateCMSPage: (page: CMSPage) => void;
  feeSettings: AdminFeeSettings;
  onUpdateFeeSettings: (feeSettings: AdminFeeSettings) => void;
}

export const AdminWebsiteEditor: React.FC<AdminWebsiteEditorProps> = ({
  siteSettings,
  onUpdateSiteSettings,
  cmsPages,
  onUpdateCMSPage,
  feeSettings,
  onUpdateFeeSettings,
}) => {
  // Local state for site settings
  const [formSettings, setFormSettings] = useState<SiteSettings>({
    ...siteSettings,
    mainNavItems: siteSettings.mainNavItems || DEFAULT_SITE_SETTINGS.mainNavItems || [],
    categoryNavItems: siteSettings.categoryNavItems || DEFAULT_SITE_SETTINGS.categoryNavItems || [],
    seasonalNavItems: siteSettings.seasonalNavItems || DEFAULT_SITE_SETTINGS.seasonalNavItems || [],
    trustTestimonials: siteSettings.trustTestimonials || DEFAULT_SITE_SETTINGS.trustTestimonials || [],
    socialChannels: siteSettings.socialChannels || DEFAULT_SITE_SETTINGS.socialChannels || [],
    featureModules: siteSettings.featureModules || DEFAULT_SITE_SETTINGS.featureModules || {
      enableBlog: true,
      enableWishlists: true,
      enableFundraising: true,
      enableDistrictMap: true,
      enableBundles: true,
      enableCommunityForum: true,
      enableSchoolDirectory: true,
      enableRewardsClub: true,
      enableInspirationGallery: true,
      enableBuyerProtectionPage: true,
      enableDirectMessaging: true,
      enableProductReviews: true,
      enablePriceOffers: true,
      enableGuestCheckout: true,
      enableSchoolEmailVerification: true,
      enableTopAnnouncementBar: true,
    },
    showTopAnnouncementBar: siteSettings.showTopAnnouncementBar ?? true,
    showMainFeatureNav: siteSettings.showMainFeatureNav ?? true,
    showCategoriesNav: siteSettings.showCategoriesNav ?? true,
    showSeasonalCollectionsBar: siteSettings.showSeasonalCollectionsBar ?? true,
    showSellerGuideButton: siteSettings.showSellerGuideButton ?? true,
    showZipFilter: siteSettings.showZipFilter ?? true,
    showNotificationsIcon: siteSettings.showNotificationsIcon ?? true,
    showWishlistIcon: siteSettings.showWishlistIcon ?? true,
    showCartIcon: siteSettings.showCartIcon ?? true,
    showSellButton: siteSettings.showSellButton ?? true,
    showFooter: siteSettings.showFooter ?? true,
    showFooterColumns: siteSettings.showFooterColumns || {
      buyers: true,
      sellers: true,
      trust: true,
      support: true,
    },
  });

  const [activeSubSection, setActiveSubSection] = useState<
    'feature-switchboard' | 'general' | 'navigation' | 'hero' | 'trust' | 'social' | 'contact' | 'cmspages' | 'commission' | 'logo-assets'
  >('feature-switchboard');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Custom Nav Item form state
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavTarget, setNewNavTarget] = useState('marketplace');

  // Selected Testimonial for active editing
  const [activeTestimonialId, setActiveTestimonialId] = useState<string | null>(null);

  // New Social Channel State
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialMediaChannel['platform']>('instagram');
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialHandle, setNewSocialHandle] = useState('');

  // Selected CMS page for editing
  const [selectedCmsSlug, setSelectedCmsSlug] = useState<string>('privacy');
  const activePage = cmsPages.find((p) => p.slug === selectedCmsSlug) || cmsPages[0];
  const [pageTitle, setPageTitle] = useState(activePage?.title || '');
  const [pageContent, setPageContent] = useState(activePage?.content || '');
  const [pageSaved, setPageSaved] = useState(false);

  // Switch CMS page
  const handleSelectPage = (slug: string) => {
    setSelectedCmsSlug(slug);
    const target = cmsPages.find((p) => p.slug === slug);
    if (target) {
      setPageTitle(target.title);
      setPageContent(target.content);
      setPageSaved(false);
    }
  };

  // Save Site Settings
  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSiteSettings(formSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Reset Navigation to defaults
  const handleResetNavigation = () => {
    if (window.confirm('Reset all menu bars and navigation tabs to default verified configuration?')) {
      const resetSettings: SiteSettings = {
        ...formSettings,
        showTopAnnouncementBar: true,
        showMainFeatureNav: true,
        showCategoriesNav: true,
        showSeasonalCollectionsBar: true,
        showSellerGuideButton: true,
        showZipFilter: true,
        showNotificationsIcon: true,
        showWishlistIcon: true,
        showCartIcon: true,
        showSellButton: true,
        showFooter: true,
        showFooterColumns: { buyers: true, sellers: true, trust: true, support: true },
        mainNavItems: DEFAULT_SITE_SETTINGS.mainNavItems ? [...DEFAULT_SITE_SETTINGS.mainNavItems] : [],
        categoryNavItems: DEFAULT_SITE_SETTINGS.categoryNavItems ? [...DEFAULT_SITE_SETTINGS.categoryNavItems] : [],
        seasonalNavItems: DEFAULT_SITE_SETTINGS.seasonalNavItems ? [...DEFAULT_SITE_SETTINGS.seasonalNavItems] : [],
      };
      setFormSettings(resetSettings);
      onUpdateSiteSettings(resetSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Move Main Nav Item Up / Down
  const handleMoveNavItem = (index: number, direction: 'up' | 'down') => {
    const items = [...(formSettings.mainNavItems || [])];
    if (direction === 'up' && index > 0) {
      const temp = items[index];
      items[index] = items[index - 1];
      items[index - 1] = temp;
    } else if (direction === 'down' && index < items.length - 1) {
      const temp = items[index];
      items[index] = items[index + 1];
      items[index + 1] = temp;
    }
    setFormSettings({ ...formSettings, mainNavItems: items });
  };

  // Toggle Main Nav Item Enabled
  const handleToggleNavItem = (id: string) => {
    const items = (formSettings.mainNavItems || []).map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    setFormSettings({ ...formSettings, mainNavItems: items });
  };

  // Update Main Nav Item Label
  const handleUpdateNavLabel = (id: string, newLabel: string) => {
    const items = (formSettings.mainNavItems || []).map((item) =>
      item.id === id ? { ...item, label: newLabel } : item
    );
    setFormSettings({ ...formSettings, mainNavItems: items });
  };

  // Add Custom Nav Tab
  const handleAddCustomNavTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel.trim()) return;
    const newItem: NavMenuItem = {
      id: `custom-nav-${Date.now()}`,
      label: newNavLabel.trim(),
      targetView: newNavTarget,
      iconName: 'Sparkles',
      enabled: true,
      order: (formSettings.mainNavItems?.length || 0) + 1,
      isCustom: true,
    };
    const items = [...(formSettings.mainNavItems || []), newItem];
    setFormSettings({ ...formSettings, mainNavItems: items });
    setNewNavLabel('');
  };

  // Delete Nav Item
  const handleDeleteNavItem = (id: string) => {
    const items = (formSettings.mainNavItems || []).filter((item) => item.id !== id);
    setFormSettings({ ...formSettings, mainNavItems: items });
  };

  // Toggle Category Nav Item
  const handleToggleCategoryItem = (id: string) => {
    const items = (formSettings.categoryNavItems || []).map((cat) =>
      cat.id === id ? { ...cat, enabled: !cat.enabled } : cat
    );
    setFormSettings({ ...formSettings, categoryNavItems: items });
  };

  // Toggle Seasonal Item
  const handleToggleSeasonalItem = (id: string) => {
    const items = (formSettings.seasonalNavItems || []).map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    setFormSettings({ ...formSettings, seasonalNavItems: items });
  };

  // ----------------------------------------------------
  // 5-Star Testimonials Handlers
  // ----------------------------------------------------
  const handleUpdateTestimonial = (id: string, field: keyof TrustTestimonial, value: any) => {
    const updated = (formSettings.trustTestimonials || []).map((t) => {
      if (t.id === id) {
        return { ...t, [field]: value };
      }
      return t;
    });
    setFormSettings({ ...formSettings, trustTestimonials: updated });
  };

  const handleAddTestimonial = () => {
    const newTestimonial: TrustTestimonial = {
      id: `rev-${Date.now()}`,
      name: 'New Verified Educator',
      role: '5th Grade Elementary Teacher',
      school: 'Public School District',
      city: 'Oklahoma City',
      state: 'OK',
      stars: 5,
      verified: true,
      badge: 'State Certified Educator',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      comment: 'Marketplace For Teachers provides safe educator-to-educator transactions and top quality classroom supplies with reliable buyer protection guarantee!',
    };
    const updated = [newTestimonial, ...(formSettings.trustTestimonials || [])];
    setFormSettings({ ...formSettings, trustTestimonials: updated });
    setActiveTestimonialId(newTestimonial.id);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (window.confirm('Are you sure you want to remove this educator testimonial?')) {
      const updated = (formSettings.trustTestimonials || []).filter((t) => t.id !== id);
      setFormSettings({ ...formSettings, trustTestimonials: updated });
      if (activeTestimonialId === id) {
        setActiveTestimonialId(null);
      }
    }
  };

  const handleMoveTestimonial = (index: number, direction: 'up' | 'down') => {
    const items = [...(formSettings.trustTestimonials || [])];
    if (direction === 'up' && index > 0) {
      const temp = items[index];
      items[index] = items[index - 1];
      items[index - 1] = temp;
    } else if (direction === 'down' && index < items.length - 1) {
      const temp = items[index];
      items[index] = items[index + 1];
      items[index + 1] = temp;
    }
    setFormSettings({ ...formSettings, trustTestimonials: items });
  };

  // ----------------------------------------------------
  // Social Media Channels Handlers
  // ----------------------------------------------------
  const handleAddSocialChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialName.trim() || !newSocialUrl.trim()) return;

    const newChannel: SocialMediaChannel = {
      id: `soc-${Date.now()}`,
      platform: newSocialPlatform,
      name: newSocialName.trim(),
      url: newSocialUrl.trim(),
      handle: newSocialHandle.trim() || `@${newSocialName.toLowerCase().replace(/\s+/g, '')}`,
      enabled: true,
      order: (formSettings.socialChannels || []).length + 1,
    };

    setFormSettings({
      ...formSettings,
      socialChannels: [...(formSettings.socialChannels || []), newChannel],
    });

    setNewSocialName('');
    setNewSocialUrl('');
    setNewSocialHandle('');
  };

  const handleAddPresetSocialChannel = (
    platform: SocialMediaChannel['platform'],
    name: string,
    sampleUrl: string,
    sampleHandle: string
  ) => {
    const existing = (formSettings.socialChannels || []).find((s) => s.platform === platform);
    if (existing) {
      alert(`A channel for ${name} is already listed. You can edit its link below.`);
      return;
    }
    const newChannel: SocialMediaChannel = {
      id: `soc-${Date.now()}`,
      platform,
      name,
      url: sampleUrl,
      handle: sampleHandle,
      enabled: true,
      order: (formSettings.socialChannels || []).length + 1,
    };
    setFormSettings({
      ...formSettings,
      socialChannels: [...(formSettings.socialChannels || []), newChannel],
    });
  };

  const handleUpdateSocialChannel = (id: string, field: keyof SocialMediaChannel, value: any) => {
    const updated = (formSettings.socialChannels || []).map((ch) =>
      ch.id === id ? { ...ch, [field]: value } : ch
    );
    setFormSettings({ ...formSettings, socialChannels: updated });
  };

  const handleToggleSocialChannel = (id: string) => {
    const updated = (formSettings.socialChannels || []).map((ch) =>
      ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
    );
    setFormSettings({ ...formSettings, socialChannels: updated });
  };

  const handleDeleteSocialChannel = (id: string) => {
    const updated = (formSettings.socialChannels || []).filter((ch) => ch.id !== id);
    setFormSettings({ ...formSettings, socialChannels: updated });
  };

  const handleMoveSocialChannel = (index: number, direction: 'up' | 'down') => {
    const items = [...(formSettings.socialChannels || [])];
    if (direction === 'up' && index > 0) {
      const temp = items[index];
      items[index] = items[index - 1];
      items[index - 1] = temp;
    } else if (direction === 'down' && index < items.length - 1) {
      const temp = items[index];
      items[index] = items[index + 1];
      items[index + 1] = temp;
    }
    setFormSettings({ ...formSettings, socialChannels: items });
  };

  // Save CMS Page Edit
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePage) return;
    const updated: CMSPage = {
      ...activePage,
      title: pageTitle,
      content: pageContent,
      lastUpdated: 'August 2026 (Updated by Admin)',
    };
    onUpdateCMSPage(updated);
    setPageSaved(true);
    setTimeout(() => setPageSaved(false), 3000);
  };

  const downloadRasterLogo = (svgString: string, fileName: string, format: 'png' | 'jpeg', width = 1040, height = 200) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = url;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-blue-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-black text-lg border border-white/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">Full Website & CMS Editor</h3>
              <span className="bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ADMIN MASTER CONTROL
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Enable, disable, and customize all menu bars, feature tabs, category pills, seasonal promos, and separate pages in real time.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-500 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Site Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 overflow-x-auto text-xs font-bold shadow-2xs">
        <button
          id="tab-feature-switchboard"
          onClick={() => setActiveSubSection('feature-switchboard')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'feature-switchboard'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 font-extrabold'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>⚡ Feature Modules Switchboard</span>
        </button>

        <button
          onClick={() => setActiveSubSection('navigation')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'navigation'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Navigation & Menu Bar Manager</span>
        </button>

        <button
          onClick={() => setActiveSubSection('general')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'general'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Top Announcement Bar</span>
        </button>

        <button
          onClick={() => setActiveSubSection('hero')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'hero'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Hero Banner & Headlines</span>
        </button>

        <button
          onClick={() => setActiveSubSection('trust')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'trust'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trust Seals & 5-Star Testimonials ({(formSettings.trustTestimonials || []).length})</span>
        </button>

        <button
          onClick={() => setActiveSubSection('social')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'social'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social Media Channels ({(formSettings.socialChannels || []).length})</span>
        </button>

        <button
          onClick={() => setActiveSubSection('contact')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'contact'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Oklahoma HQ & Contact Info</span>
        </button>

        <button
          onClick={() => setActiveSubSection('cmspages')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'cmspages'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>CMS Legal & Info Pages ({cmsPages.length})</span>
        </button>

        <button
          onClick={() => setActiveSubSection('commission')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'commission'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Nationwide Sales % Rules</span>
        </button>

        <button
          onClick={() => setActiveSubSection('logo-assets')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'logo-assets'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-amber-800 bg-amber-50 hover:bg-amber-100 font-bold'
          }`}
        >
          <Image className="w-3.5 h-3.5 text-amber-600" />
          <span>🖼️ Brand Logo Assets (PNG, JPEG, SVG)</span>
        </button>
      </div>

      {/* SECTION -1: MASTER FEATURE SWITCHBOARD */}
      {activeSubSection === 'feature-switchboard' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <span>Master Feature Switchboard (All Modules ON / OFF)</span>
                </h4>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Live Global Controls
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1 max-w-2xl">
                Administrators can toggle every individual system component and public-facing module on or off in real time. Changes update headers, navigation bars, and homepage showcases immediately.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allOn = {
                    enableBlog: true,
                    enableWishlists: true,
                    enableFundraising: true,
                    enableDistrictMap: true,
                    enableBundles: true,
                    enableCommunityForum: true,
                    enableSchoolDirectory: true,
                    enableRewardsClub: true,
                    enableInspirationGallery: true,
                    enableBuyerProtectionPage: true,
                    enableDirectMessaging: true,
                    enableProductReviews: true,
                    enablePriceOffers: true,
                    enableGuestCheckout: true,
                    enableSchoolEmailVerification: true,
                    enableTopAnnouncementBar: true,
                  };
                  setFormSettings({
                    ...formSettings,
                    featureModules: allOn,
                    showMainFeatureNav: true,
                    showCategoriesNav: true,
                    showSeasonalCollectionsBar: true,
                    showZipFilter: true,
                    showSellerGuideButton: true,
                    showNotificationsIcon: true,
                    showWishlistIcon: true,
                    showCartIcon: true,
                    showSellButton: true,
                    showFooter: true,
                  });
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs shadow-sm shadow-emerald-700/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Module Settings</span>
              </button>
            </div>
          </div>

          {/* Module Categories Grid */}
          <div className="space-y-6">
            {/* 1. Core Discovery & Community Modules */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  1. Discovery, Community & Content Modules
                </h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    key: 'enableBlog',
                    title: 'Educator Blog & Tax Guides',
                    desc: 'Articles, tax deduction hacks, grant deadlines & classroom stories.',
                    icon: Newspaper,
                    color: 'text-blue-600 bg-blue-50 border-blue-200',
                  },
                  {
                    key: 'enableWishlists',
                    title: 'Classroom Wishlists Hub',
                    desc: 'Teacher wishlists explorer, donor fulfillment & pledge tools.',
                    icon: Gift,
                    color: 'text-pink-600 bg-pink-50 border-pink-200',
                  },
                  {
                    key: 'enableFundraising',
                    title: 'Classroom Grants & Crowdfunding',
                    desc: 'Campaign goals, teacher supply drives & community donations.',
                    icon: HandHeart,
                    color: 'text-rose-600 bg-rose-50 border-rose-200',
                  },
                  {
                    key: 'enableDistrictMap',
                    title: 'District Pickup & Surplus Map',
                    desc: 'Interactive radius map for zero-shipping campus pickups.',
                    icon: MapPin,
                    color: 'text-amber-600 bg-amber-50 border-amber-200',
                  },
                  {
                    key: 'enableBundles',
                    title: 'Starter Bundles & Bulk Kits',
                    desc: 'Grade-level supply packs, discounted multi-item sets.',
                    icon: Package,
                    color: 'text-purple-600 bg-purple-50 border-purple-200',
                  },
                  {
                    key: 'enableCommunityForum',
                    title: 'Educator Community Swaps',
                    desc: 'Teacher discussion boards, surplus trades & advice forum.',
                    icon: MessageSquare,
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                  },
                  {
                    key: 'enableSchoolDirectory',
                    title: 'School Directory & PO Checkout',
                    desc: 'Public and private school rosters with district PO invoicing.',
                    icon: Building2,
                    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
                  },
                  {
                    key: 'enableRewardsClub',
                    title: 'Educator Rewards Club',
                    desc: 'Earn points on listings and purchases, redeem for supplies.',
                    icon: Award,
                    color: 'text-amber-600 bg-amber-50 border-amber-200',
                  },
                  {
                    key: 'enableInspirationGallery',
                    title: 'Classroom Setup Inspiration',
                    desc: 'Teacher-submitted room photos with tagged supplies to buy.',
                    icon: Sparkles,
                    color: 'text-teal-600 bg-teal-50 border-teal-200',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isEnabled = formSettings.featureModules?.[item.key as keyof typeof formSettings.featureModules] ?? true;
                  return (
                    <div
                      key={item.key}
                      className={`p-4 rounded-xl border transition-all ${
                        isEnabled
                          ? 'bg-slate-50/70 border-slate-200 shadow-2xs'
                          : 'bg-slate-100/50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-lg border shrink-0 ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.desc}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const current = formSettings.featureModules || {};
                            setFormSettings({
                              ...formSettings,
                              featureModules: {
                                ...current,
                                [item.key]: !isEnabled,
                              },
                            });
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                            isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Trust, Safety & Authentication Modules */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  2. Trust, Safety & Verification Controls
                </h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    key: 'enableBuyerProtectionPage',
                    title: '100% Buyer Protection Guarantee Page',
                    desc: 'Dedicated trust hub explaining safe payment holding & guarantees.',
                    icon: ShieldAlert,
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                  },
                  {
                    key: 'enableSchoolEmailVerification',
                    title: 'School Webmail Domain Verification',
                    desc: 'Require @k12 / .edu email verification badge for sellers.',
                    icon: UserCheck,
                    color: 'text-blue-600 bg-blue-50 border-blue-200',
                  },
                  {
                    key: 'enableProductReviews',
                    title: 'Educator Ratings & Reviews',
                    desc: 'Verified teacher badges on product feedback and seller profiles.',
                    icon: Star,
                    color: 'text-amber-600 bg-amber-50 border-amber-200',
                  },
                  {
                    key: 'enableDirectMessaging',
                    title: 'In-App Secure Direct Messaging',
                    desc: 'Allow verified teachers to message sellers about supplies & pickup.',
                    icon: MessageSquare,
                    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
                  },
                  {
                    key: 'enablePriceOffers',
                    title: '"Make an Offer" Bargaining',
                    desc: 'Allow buyers to submit custom price offers on surplus items.',
                    icon: Tag,
                    color: 'text-purple-600 bg-purple-50 border-purple-200',
                  },
                  {
                    key: 'enableGuestCheckout',
                    title: 'Guest Checkout Mode',
                    desc: 'Allow parent & supporter checkout without mandatory account signup.',
                    icon: ShoppingBag,
                    color: 'text-teal-600 bg-teal-50 border-teal-200',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isEnabled = formSettings.featureModules?.[item.key as keyof typeof formSettings.featureModules] ?? true;
                  return (
                    <div
                      key={item.key}
                      className={`p-4 rounded-xl border transition-all ${
                        isEnabled
                          ? 'bg-slate-50/70 border-slate-200 shadow-2xs'
                          : 'bg-slate-100/50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-lg border shrink-0 ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.desc}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const current = formSettings.featureModules || {};
                            setFormSettings({
                              ...formSettings,
                              featureModules: {
                                ...current,
                                [item.key]: !isEnabled,
                              },
                            });
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                            isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Header Bars, Buttons & Layout Toggles */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  3. Header Bars, Buttons & Layout Controls
                </h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    stateKey: 'showTopAnnouncementBar',
                    title: 'Top Announcement Promo Bar',
                    desc: 'Yellow banner at the very top of every screen.',
                  },
                  {
                    stateKey: 'showMainFeatureNav',
                    title: 'Main Feature Nav Strip',
                    desc: 'Horizontal navigation tabs below the search bar.',
                  },
                  {
                    stateKey: 'showCategoriesNav',
                    title: 'Category Filter Pills Strip',
                    desc: 'Category buttons (STEM, Books, Furniture, etc.).',
                  },
                  {
                    stateKey: 'showSeasonalCollectionsBar',
                    title: 'Seasonal Promo Collections Bar',
                    desc: 'Back to School, Science Fair, End of Year deals.',
                  },
                  {
                    stateKey: 'showZipFilter',
                    title: 'Zip Radius Location Filter',
                    desc: 'Allows users to enter zip code for local pickup sorting.',
                  },
                  {
                    stateKey: 'showSellerGuideButton',
                    title: 'Seller Guide Header Button',
                    desc: 'Step-by-step onboarding walkthrough for teachers.',
                  },
                  {
                    stateKey: 'showNotificationsIcon',
                    title: 'Notifications Bell Icon',
                    desc: 'Order, badge, and message alert drawer button.',
                  },
                  {
                    stateKey: 'showWishlistIcon',
                    title: 'Header Wishlist Heart Icon',
                    desc: 'Saved item count and drawer opener.',
                  },
                  {
                    stateKey: 'showCartIcon',
                    title: 'Header Shopping Cart Icon',
                    desc: 'Cart item counter and slide-out cart.',
                  },
                  {
                    stateKey: 'showSellButton',
                    title: 'Header "List an Item" Button',
                    desc: 'Direct listing button in the top navigation bar.',
                  },
                  {
                    stateKey: 'showFooter',
                    title: 'Master Website Footer',
                    desc: '4-column links, state tax disclosures & trust seals.',
                  },
                ].map((item) => {
                  const isEnabled = formSettings[item.stateKey as keyof SiteSettings] !== false;
                  return (
                    <div
                      key={item.stateKey}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isEnabled
                          ? 'bg-slate-50/70 border-slate-200'
                          : 'bg-slate-100/50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setFormSettings({
                              ...formSettings,
                              [item.stateKey]: !isEnabled,
                            });
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 mt-0.5 ${
                            isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer text-xs shadow-md shadow-blue-700/20"
            >
              <Save className="w-4 h-4" />
              <span>Save All Feature Switchboard Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 0: MASTER NAVIGATION & MENU BAR MANAGER */}
      {activeSubSection === 'navigation' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Master Menu Bar & Navigation Controls</span>
              </h4>
              <p className="text-slate-500 text-[11px]">
                Turn on or off entire menu bars across the site, toggle individual tabs, reorder buttons, or add custom page links.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetNavigation}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Menu Bars</span>
              </button>
            </div>
          </div>

          {/* SUB-SECTION A: MASTER MENU BAR VISIBILITY SWITCHES */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Site-Wide Menu Bar Visibility Switches</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Top Announcement Ribbon</span>
                  <span className="text-[10px] text-slate-500">Very top gold/amber notification bar</span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.showTopAnnouncementBar ?? true}
                  onChange={(e) => setFormSettings({ ...formSettings, showTopAnnouncementBar: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Main Feature & Community Tabs</span>
                  <span className="text-[10px] text-slate-500">The 14+ feature tabs bar below header</span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.showMainFeatureNav ?? true}
                  onChange={(e) => setFormSettings({ ...formSettings, showMainFeatureNav: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Category Filter Bar</span>
                  <span className="text-[10px] text-slate-500">Pill bar with STEM, Math, Books, Arts</span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.showCategoriesNav ?? true}
                  onChange={(e) => setFormSettings({ ...formSettings, showCategoriesNav: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Seasonal Collections Bar</span>
                  <span className="text-[10px] text-slate-500">Back to School, Clearance & $0 filter</span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.showSeasonalCollectionsBar ?? true}
                  onChange={(e) => setFormSettings({ ...formSettings, showSeasonalCollectionsBar: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Header "Post Listing" Button</span>
                  <span className="text-[10px] text-slate-500">Quick sell button in top navigation</span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.showSellButton ?? true}
                  onChange={(e) => setFormSettings({ ...formSettings, showSellButton: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Master Footer Section</span>
                  <span className="text-[10px] text-slate-500">Site-wide footer links & trust seals</span>
                </div>
                <input
                  type="checkbox"
                  checked={formSettings.showFooter ?? true}
                  onChange={(e) => setFormSettings({ ...formSettings, showFooter: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* SUB-SECTION B: MAIN NAVIGATION TABS CUSTOMIZER */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <List className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Feature Navigation Tabs Manager ({formSettings.mainNavItems?.length || 0} Tabs)</span>
              </h5>
              <span className="text-[11px] text-slate-400">Toggle or reorder any tab below</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {(formSettings.mainNavItems || []).map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                    item.enabled ? 'bg-white hover:bg-slate-50' : 'bg-slate-100/70 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => handleToggleNavItem(item.id)}
                      className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      title="Enable or disable this navigation tab"
                    />

                    <span className="text-slate-400 font-mono text-[11px] w-5 text-center">{idx + 1}</span>

                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateNavLabel(item.id, e.target.value)}
                      className="font-bold text-slate-900 text-xs px-2 py-1 rounded border border-slate-200 bg-white max-w-xs focus:border-blue-600"
                    />

                    <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 truncate">
                      target: {item.targetView}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveNavItem(idx, 'up')}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                      title="Move Tab Left / Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (formSettings.mainNavItems?.length || 1) - 1}
                      onClick={() => handleMoveNavItem(idx, 'down')}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                      title="Move Tab Right / Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                    {item.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteNavItem(item.id)}
                        className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Delete Custom Tab"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Tab Row */}
            <form onSubmit={handleAddCustomNavTab} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="New tab label (e.g. STEM Grants, District Portal)..."
                value={newNavLabel}
                onChange={(e) => setNewNavLabel(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-slate-300 font-medium text-xs focus:border-blue-600"
              />
              <select
                value={newNavTarget}
                onChange={(e) => setNewNavTarget(e.target.value)}
                className="p-2 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:border-blue-600"
              >
                <option value="marketplace">Marketplace</option>
                <option value="buyer-protection">Buyer Protection</option>
                <option value="wishlists">Wishlists</option>
                <option value="fundraising">Grants</option>
                <option value="local-map">Local Map</option>
                <option value="bundles">Bundles</option>
                <option value="inspiration">Inspiration</option>
                <option value="community">Community</option>
                <option value="schools">Schools</option>
                <option value="rewards">Rewards</option>
                <option value="news">News & Tax</option>
                <option value="trust-center">Trust & Safety</option>
                <option value="privacy">Privacy Policy</option>
                <option value="terms">Terms of Service</option>
                <option value="faq">FAQ</option>
                <option value="about">About Us</option>
                <option value="contact">Contact HQ</option>
              </select>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Nav Tab</span>
              </button>
            </form>
          </div>

          {/* SUB-SECTION C: CATEGORIES SUB-NAV BAR TOGGLES */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>3. Categories Filter Bar Pills ({formSettings.categoryNavItems?.length || 0} Categories)</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(formSettings.categoryNavItems || []).map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    cat.enabled ? 'border-slate-200 bg-white hover:bg-slate-50' : 'border-slate-100 bg-slate-100/60 opacity-60'
                  }`}
                >
                  <span className="font-bold text-slate-900 text-xs truncate">{cat.name}</span>
                  <input
                    type="checkbox"
                    checked={cat.enabled}
                    onChange={() => handleToggleCategoryItem(cat.id)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* SUB-SECTION D: SEASONAL PROMO BAR TOGGLES */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>4. Seasonal Collections & Sale Promo Pills</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(formSettings.seasonalNavItems || []).map((s) => (
                <label
                  key={s.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                    s.enabled ? 'border-slate-200 bg-white hover:bg-slate-50' : 'border-slate-100 bg-slate-100/60 opacity-60'
                  }`}
                >
                  <div>
                    <span className="font-extrabold text-slate-900 text-xs block">{s.title}</span>
                    <span className="text-[10px] text-slate-500">{s.tagline}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={() => handleToggleSeasonalItem(s.id)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Save Action Bar */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => handleSaveSettings()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Menu Bar Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: TOP ANNOUNCEMENT BAR */}
      {activeSubSection === 'general' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Header Announcement Ribbon</h4>
              <p className="text-slate-500 text-[11px]">
                Displays at the very top of every page across the marketplace for high-visibility alerts.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={formSettings.announcementActive}
                onChange={(e) => setFormSettings({ ...formSettings, announcementActive: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Enable Announcement Bar</span>
            </label>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Announcement Message Text</label>
              <input
                type="text"
                value={formSettings.announcementText}
                onChange={(e) => setFormSettings({ ...formSettings, announcementText: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Action Button / Link Label</label>
                <input
                  type="text"
                  value={formSettings.announcementLinkText}
                  onChange={(e) => setFormSettings({ ...formSettings, announcementLinkText: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Target Slug</label>
                <select
                  value={formSettings.announcementLinkUrl}
                  onChange={(e) => setFormSettings({ ...formSettings, announcementLinkUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-800"
                >
                  <option value="contact">Contact Support / Tickets</option>
                  <option value="privacy">Privacy & FERPA Protection</option>
                  <option value="terms">Terms of Service</option>
                  <option value="faq">FAQ</option>
                  <option value="become-a-seller">How to Sell</option>
                  <option value="about">About Us</option>
                  <option value="buyer-protection">Buyer Protection</option>
                  <option value="trust-center">Trust Center</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="pt-2">
            <span className="font-bold text-slate-500 block mb-1">Live Ribbon Preview:</span>
            <div className="bg-blue-950 text-white px-4 py-2 rounded-xl text-xs flex items-center justify-between border border-blue-800">
              <span className="truncate">{formSettings.announcementText}</span>
              <span className="bg-blue-800 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer shrink-0 ml-2">
                {formSettings.announcementLinkText} →
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Announcement Bar</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: HERO BANNER & HEADLINES */}
      {activeSubSection === 'hero' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Hero Section Content & Promo Settings</h4>
            <p className="text-slate-500 text-[11px]">
              Customize the main marketplace hero banner, teacher appreciation promotional card, and coupon code.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Security / Safe Harbor Badge Text</label>
              <input
                type="text"
                value={formSettings.heroBadge || ''}
                onChange={(e) => setFormSettings({ ...formSettings, heroBadge: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                placeholder="100% Buyer Protection Guarantee • Real-Time Carrier Distance Shipping"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Main Hero Headline</label>
              <input
                type="text"
                value={formSettings.heroTitle || formSettings.heroHeadline || ''}
                onChange={(e) => setFormSettings({ ...formSettings, heroTitle: e.target.value, heroHeadline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:border-blue-600"
                placeholder="Buy, Sell & Exchange Supplies with Fellow Educators"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Subheadline & Description</label>
              <textarea
                rows={3}
                value={formSettings.heroSubtitle || formSettings.heroSubheadline || ''}
                onChange={(e) => setFormSettings({ ...formSettings, heroSubtitle: e.target.value, heroSubheadline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                placeholder="Connect directly with certified public, charter, and private school teachers across New York, Oklahoma, Texas, and all 50 states."
              />
            </div>

            {/* Teacher Appreciation & Promo Card Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs">Teacher Appreciation Promo Card</h5>
                  <p className="text-slate-500 text-[11px]">Control the featured discount card displayed on the right side of the hero section.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormSettings({ ...formSettings, showPromoCard: !(formSettings.showPromoCard ?? true) })}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    (formSettings.showPromoCard ?? true) ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      (formSettings.showPromoCard ?? true) ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {(formSettings.showPromoCard ?? true) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Promo Title</label>
                    <input
                      type="text"
                      value={formSettings.promoTitle || 'Teacher Appreciation Discount'}
                      onChange={(e) => setFormSettings({ ...formSettings, promoTitle: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 focus:border-blue-600"
                      placeholder="Teacher Appreciation Discount"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={formSettings.promoCode || 'APPRECIATION'}
                      onChange={(e) => setFormSettings({ ...formSettings, promoCode: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-extrabold text-blue-700 focus:border-blue-600"
                      placeholder="APPRECIATION"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Promo Description Text</label>
                    <input
                      type="text"
                      value={formSettings.promoDescription || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, promoDescription: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                      placeholder="Take $15 OFF classroom library sets, science kits & supplies of $60+."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5-Star Trust Seals Banner Toggle Box */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
              <div>
                <h5 className="font-extrabold text-slate-900 text-xs">5-Star Trusted Educator Website Banner</h5>
                <p className="text-slate-600 text-[11px]">Turn on/off the 5-Star Educator Credibility & Trust Seals Bar on the marketplace homepage.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormSettings({ ...formSettings, showTrustSealsBanner: !(formSettings.showTrustSealsBanner ?? true) })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  (formSettings.showTrustSealsBanner ?? true) ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    (formSettings.showTrustSealsBanner ?? true) ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Hero & Promo Content</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION: TRUST SEALS & 5-STAR TESTIMONIALS CREDIBILITY */}
      {activeSubSection === 'trust' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Trust Seals, Star Ratings & 5-Star Educator Testimonials</span>
              </h4>
              <p className="text-slate-500 text-[11px]">
                Customize nationwide educator credibility stats and edit the featured 5-star teacher reviews shown on homepage, hero, and checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTestimonial}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer text-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Educator Review</span>
            </button>
          </div>

          {/* Banner Visibility Master Toggle */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-4">
            <div>
              <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>5-Star Trusted Educator Website Banner Visibility</span>
              </h5>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Toggle whether the 5-Star Credibility Trust Seals bar appears on the marketplace homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormSettings({ ...formSettings, showTrustSealsBanner: !(formSettings.showTrustSealsBanner ?? true) })}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                (formSettings.showTrustSealsBanner ?? true) ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4.5 h-4.5 rounded-full transition-transform ${
                  (formSettings.showTrustSealsBanner ?? true) ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Section 1: Hero Trust Headers & Stats */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Main Trust Headline & Rating Metrics</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Overall Rating Score (e.g. "4.9 / 5.0 Rating")
                </label>
                <input
                  type="text"
                  value={formSettings.trustRatingScore || '4.9 / 5.0 Rating'}
                  onChange={(e) => setFormSettings({ ...formSettings, trustRatingScore: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Verified Reviews Count & States Text
                </label>
                <input
                  type="text"
                  value={formSettings.trustReviewsCount || '12,450+ Verified Reviews across NY, OK & Nationwide'}
                  onChange={(e) => setFormSettings({ ...formSettings, trustReviewsCount: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Buyer Protection Guarantee Label
                </label>
                <input
                  type="text"
                  value={formSettings.trustBuyerGuaranteeText || '100% Escrow Protection Guarantee'}
                  onChange={(e) => setFormSettings({ ...formSettings, trustBuyerGuaranteeText: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teacher Satisfaction Rate
                </label>
                <input
                  type="text"
                  value={formSettings.trustSatisfactionRate || '99.8% Positive Educator Rating'}
                  onChange={(e) => setFormSettings({ ...formSettings, trustSatisfactionRate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 5-Star Educator Testimonials Cards Editor */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>2. Featured 5-Star Educator Reviews ({(formSettings.trustTestimonials || []).length} Active)</span>
              </h5>
              <span className="text-[11px] text-slate-500 font-medium">Click to edit details or reorder</span>
            </div>

            <div className="space-y-3">
              {(formSettings.trustTestimonials || []).map((t, idx) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={t.avatarUrl}
                        alt={t.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-300 shrink-0"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">{t.name}</span>
                        <span className="text-[11px] text-slate-500">{t.role} • {t.school} ({t.city}, {t.state})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMoveTestimonial(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3 text-slate-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveTestimonial(idx, 'down')}
                        disabled={idx === (formSettings.trustTestimonials || []).length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3 text-slate-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Form fields for this testimonial */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Educator Name</label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'name', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Teaching Role / Grade</label>
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'role', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-medium text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">School / District</label>
                      <input
                        type="text"
                        value={t.school}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'school', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-medium text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">City</label>
                      <input
                        type="text"
                        value={t.city}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'city', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-medium text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">State (e.g. OK, NY)</label>
                      <input
                        type="text"
                        value={t.state}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'state', e.target.value.toUpperCase())}
                        className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Star Rating</label>
                      <select
                        value={t.stars}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'stars', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                      >
                        <option value={5}>★★★★★ (5 Stars)</option>
                        <option value={4}>★★★★☆ (4 Stars)</option>
                        <option value={3}>★★★☆☆ (3 Stars)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Verified Badge Text</label>
                      <input
                        type="text"
                        value={t.badge}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'badge', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-medium text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Avatar Photo URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={t.avatarUrl}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'avatarUrl', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 font-mono text-[11px] text-slate-700 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateTestimonial(
                            t.id,
                            'avatarUrl',
                            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
                          )
                        }
                        className="text-[10px] px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded font-bold whitespace-nowrap cursor-pointer"
                      >
                        Preset 1
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateTestimonial(
                            t.id,
                            'avatarUrl',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                          )
                        }
                        className="text-[10px] px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded font-bold whitespace-nowrap cursor-pointer"
                      >
                        Preset 2
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateTestimonial(
                            t.id,
                            'avatarUrl',
                            'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
                          )
                        }
                        className="text-[10px] px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded font-bold whitespace-nowrap cursor-pointer"
                      >
                        Preset 3
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">Educator Testimonial Quote</label>
                    <textarea
                      rows={2}
                      value={t.comment}
                      onChange={(e) => handleUpdateTestimonial(t.id, 'comment', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-medium text-slate-900 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save 5-Star Testimonials & Trust Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION: SOCIAL MEDIA CHANNELS MANAGER */}
      {activeSubSection === 'social' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-600" />
                <span>Social Media Channels & Footer Profiles</span>
              </h4>
              <p className="text-slate-500 text-[11px]">
                Add, toggle, and edit social channels for Marketplace For Teachers (Instagram, Facebook, Pinterest, X, TikTok, LinkedIn, YouTube, Bluesky).
              </p>
            </div>
          </div>

          {/* Quick Presets Ribbon */}
          <div className="space-y-2">
            <span className="font-bold text-slate-600 block text-[11px]">Quick Add Popular Channels:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleAddPresetSocialChannel(
                    'instagram',
                    'Instagram',
                    'https://instagram.com/marketplaceforteachers',
                    '@MarketplaceForTeachers'
                  )
                }
                className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-lg border border-pink-200 cursor-pointer"
              >
                + Instagram
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddPresetSocialChannel(
                    'facebook',
                    'Facebook',
                    'https://facebook.com/marketplaceforteachers',
                    '@MarketplaceForTeachers'
                  )
                }
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 cursor-pointer"
              >
                + Facebook
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddPresetSocialChannel(
                    'pinterest',
                    'Pinterest',
                    'https://pinterest.com/marketplaceforteachers',
                    '@MarketplaceTeachers'
                  )
                }
                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-200 cursor-pointer"
              >
                + Pinterest
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddPresetSocialChannel(
                    'tiktok',
                    'TikTok',
                    'https://tiktok.com/@marketplaceforteachers',
                    '@MarketplaceTeachers'
                  )
                }
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
              >
                + TikTok
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddPresetSocialChannel(
                    'twitter',
                    'X / Twitter',
                    'https://twitter.com/MarketplaceForTeachers',
                    '@MarketplaceTeach'
                  )
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg border border-slate-300 cursor-pointer"
              >
                + X / Twitter
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddPresetSocialChannel(
                    'youtube',
                    'YouTube',
                    'https://youtube.com/@marketplaceforteachers',
                    '@MarketplaceForTeachers'
                  )
                }
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 cursor-pointer"
              >
                + YouTube
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddPresetSocialChannel(
                    'linkedin',
                    'LinkedIn',
                    'https://linkedin.com/company/marketplace-for-teachers',
                    'Marketplace For Teachers'
                  )
                }
                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg border border-sky-200 cursor-pointer"
              >
                + LinkedIn
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddPresetSocialChannel(
                    'bluesky',
                    'Bluesky',
                    'https://bsky.app/profile/marketplaceforteachers.bsky.social',
                    '@marketplaceforteachers.bsky.social'
                  )
                }
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-lg border border-blue-200 cursor-pointer"
              >
                + Bluesky
              </button>
            </div>
          </div>

          {/* Add Custom Social Channel Form */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-extrabold text-slate-800 text-xs block">Add Custom Social Channel:</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <select
                value={newSocialPlatform}
                onChange={(e) => setNewSocialPlatform(e.target.value as any)}
                className="p-2 rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="pinterest">Pinterest</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">X / Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="bluesky">Bluesky</option>
                <option value="custom">Custom Platform</option>
              </select>

              <input
                type="text"
                placeholder="Platform Name (e.g. Instagram)"
                value={newSocialName}
                onChange={(e) => setNewSocialName(e.target.value)}
                className="p-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900"
              />

              <input
                type="url"
                placeholder="https://..."
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                className="p-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900"
              />

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="@handle"
                  value={newSocialHandle}
                  onChange={(e) => setNewSocialHandle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddSocialChannel}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-2 rounded-lg shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Social Channels List */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-600">
              Active Social Links in Footer ({(formSettings.socialChannels || []).length}):
            </h5>

            {(formSettings.socialChannels || []).length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-300 rounded-xl text-slate-500">
                No social media channels added yet. Click one of the quick presets above!
              </div>
            ) : (
              <div className="space-y-2">
                {(formSettings.socialChannels || []).map((ch, idx) => (
                  <div
                    key={ch.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                      ch.enabled
                        ? 'border-slate-200 bg-white'
                        : 'border-slate-200 bg-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <input
                        type="checkbox"
                        checked={ch.enabled}
                        onChange={() => handleToggleSocialChannel(ch.id)}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                        title="Toggle channel visibility"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-[480px]">
                        <input
                          type="text"
                          value={ch.name}
                          onChange={(e) => handleUpdateSocialChannel(ch.id, 'name', e.target.value)}
                          className="p-1.5 rounded border border-slate-300 font-bold text-slate-900 bg-white"
                          placeholder="Name"
                        />
                        <input
                          type="url"
                          value={ch.url}
                          onChange={(e) => handleUpdateSocialChannel(ch.id, 'url', e.target.value)}
                          className="p-1.5 rounded border border-slate-300 font-mono text-[11px] text-slate-700 bg-white"
                          placeholder="URL"
                        />
                        <input
                          type="text"
                          value={ch.handle}
                          onChange={(e) => handleUpdateSocialChannel(ch.id, 'handle', e.target.value)}
                          className="p-1.5 rounded border border-slate-300 font-medium text-slate-800 bg-white"
                          placeholder="@handle"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <a
                        href={ch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Open Link in New Tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleMoveSocialChannel(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3 text-slate-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSocialChannel(idx, 'down')}
                        disabled={idx === (formSettings.socialChannels || []).length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3 text-slate-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSocialChannel(ch.id)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                        title="Delete Channel"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Preview Box */}
          <div className="p-4 bg-slate-950 text-white rounded-xl space-y-2 border border-slate-800">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block">
              Live Footer Social Media Preview:
            </span>
            <div className="flex items-center gap-2">
              {(formSettings.socialChannels || [])
                .filter((ch) => ch.enabled)
                .map((ch) => (
                  <span
                    key={ch.id}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center font-bold text-xs cursor-pointer text-amber-400"
                    title={`${ch.name} (${ch.handle})`}
                  >
                    {ch.name.slice(0, 2).toUpperCase()}
                  </span>
                ))}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Social Media Channels</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION 3: OKLAHOMA HQ & CORPORATE CONTACT */}
      {activeSubSection === 'contact' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Official Oklahoma HQ & Contact Information</h4>
            <p className="text-slate-500 text-[11px]">
              Corporate contact details rendered in footer, privacy policy, and support channels.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Physical Headquarters Address</span>
              </label>
              <input
                type="text"
                value={formSettings.hqAddress}
                onChange={(e) => setFormSettings({ ...formSettings, hqAddress: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Helpline / Telephone Number</span>
              </label>
              <input
                type="text"
                value={formSettings.supportPhone}
                onChange={(e) => setFormSettings({ ...formSettings, supportPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Official Support Email</span>
              </label>
              <input
                type="email"
                value={formSettings.supportEmail}
                onChange={(e) => setFormSettings({ ...formSettings, supportEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Support Business Hours</span>
              </label>
              <input
                type="text"
                value={formSettings.businessHours}
                onChange={(e) => setFormSettings({ ...formSettings, businessHours: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Corporate Info</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION 4: CMS LEGAL & INFO PAGES EDITOR */}
      {activeSubSection === 'cmspages' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">CMS Legal, Help & Policy Pages Editor</h4>
              <p className="text-slate-500 text-[11px]">
                Modify Privacy Policy, Terms of Service, FERPA Safe Harbor, FAQ, and Seller Guides directly in markdown.
              </p>
            </div>

            {pageSaved && (
              <div className="bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Page Published!</span>
              </div>
            )}
          </div>

          {/* Page Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
            {cmsPages.map((page) => (
              <button
                key={page.slug}
                onClick={() => handleSelectPage(page.slug)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCmsSlug === page.slug
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {page.title.split(' ')[0]} ({page.slug})
              </button>
            ))}
          </div>

          <form onSubmit={handleSavePage} className="space-y-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Page Title</label>
              <input
                type="text"
                required
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:border-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Page Content (Markdown / Text)</label>
                <span className="text-[11px] text-slate-400 font-mono">Slug: /{selectedCmsSlug}</span>
              </div>
              <textarea
                rows={12}
                required
                value={pageContent}
                onChange={(e) => setPageContent(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 focus:border-blue-600 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[11px] text-slate-400">
                Last updated: {activePage?.lastUpdated}
              </span>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save "{pageTitle}"</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 5: NATIONWIDE COMMISSION & PLATFORM RULES */}
      {activeSubSection === 'commission' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Platform Transaction Commission & User Policies</h4>
            <p className="text-slate-500 text-[11px]">
              Set global marketplace commission percentage deducted upon successful verified order delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">
                Nationwide Sales Fee Percentage (%):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={feeSettings.nationwideCommissionRate}
                  onChange={(e) =>
                    onUpdateFeeSettings({
                      ...feeSettings,
                      nationwideCommissionRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-28 p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-lg text-blue-900 bg-white"
                />
                <span className="font-black text-slate-700 text-base">%</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Applied nationwide across all 50 states (Oklahoma, Texas, California, Florida, New York, etc.)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block">Registration & Verification Safeguards:</span>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formSettings.requireSchoolEmailForSellers}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      requireSchoolEmailForSellers: e.target.checked,
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Require Official School Webmail (.edu / .k12) for Sellers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formSettings.allowGuestPurchases}
                  onChange={(e) =>
                    setFormSettings({
                      ...formSettings,
                      allowGuestPurchases: e.target.checked,
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Allow Public / Guest Checkout without School Verification</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: BRAND LOGO ASSET DOWNLOAD CENTER (PNG, JPEG, SVG) */}
      {activeSubSection === 'logo-assets' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Image className="w-5 h-5 text-amber-600" />
                <span>Brand Logo Asset Center (PNG, JPEG & SVG Downloads)</span>
              </h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Download high-resolution official brand graphics for marketing, social media, print, merchandise, and site banners.
              </p>
            </div>
            <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-900">
              High Resolution &bull; Transparent PNG & Full White JPEG
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset 1: Primary Full Brand Logo */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Variant 1: Full Horizontal Logo</span>
                <h5 className="font-extrabold text-slate-900 text-sm mb-3">Primary Website & Marketing Header</h5>
                <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-center min-h-[100px] shadow-xs">
                  <div className="w-full max-h-20" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => downloadRasterLogo(LOGO_SVG, 'marketplace-for-teachers-logo.png', 'png', 1040, 200)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download PNG (Transparent)
                </button>
                <button
                  type="button"
                  onClick={() => downloadRasterLogo(LOGO_SVG, 'marketplace-for-teachers-logo.jpg', 'jpeg', 1040, 200)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download JPEG (White BG)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([LOGO_SVG], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'marketplace-for-teachers-logo.svg';
                    link.click();
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Vector SVG
                </button>
              </div>
            </div>

            {/* Asset 2: White Logo for Dark Backgrounds */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between text-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Variant 2: White / Inverse Logo</span>
                <h5 className="font-extrabold text-white text-sm mb-3">Dark Headers, Footers & Banners</h5>
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-center min-h-[100px] shadow-inner">
                  <div className="w-full max-h-20" dangerouslySetInnerHTML={{ __html: LOGO_WHITE_SVG }} />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => downloadRasterLogo(LOGO_WHITE_SVG, 'marketplace-for-teachers-logo-white.png', 'png', 1040, 200)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download PNG (Transparent)
                </button>
                <button
                  type="button"
                  onClick={() => downloadRasterLogo(LOGO_WHITE_SVG, 'marketplace-for-teachers-logo-white.jpg', 'jpeg', 1040, 200)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download JPEG (White BG)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([LOGO_WHITE_SVG], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'marketplace-for-teachers-logo-white.svg';
                    link.click();
                  }}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Vector SVG
                </button>
              </div>
            </div>

            {/* Asset 3: Square Emblem Icon / Favicon */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Variant 3: Square App Icon / Emblem</span>
                <h5 className="font-extrabold text-slate-900 text-sm mb-3">App Favicon, Instagram & Avatar</h5>
                <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-center min-h-[100px] shadow-xs">
                  <div className="w-20 h-20" dangerouslySetInnerHTML={{ __html: LOGO_ICON_SVG }} />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => downloadRasterLogo(LOGO_ICON_SVG, 'marketplace-for-teachers-icon.png', 'png', 800, 800)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download PNG (Transparent)
                </button>
                <button
                  type="button"
                  onClick={() => downloadRasterLogo(LOGO_ICON_SVG, 'marketplace-for-teachers-icon.jpg', 'jpeg', 800, 800)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download JPEG (White BG)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([LOGO_ICON_SVG], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'marketplace-for-teachers-icon.svg';
                    link.click();
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Vector SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

