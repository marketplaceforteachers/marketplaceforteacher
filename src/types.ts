export type UserRole = 'guest' | 'teacher' | 'admin' | 'buyer';

export type ProductCondition = 'Brand New' | 'Like New' | 'Gently Used' | 'Fair';

export type ShippingMethodType = 'usps' | 'ups' | 'fedex' | 'pickup' | 'free';

export interface PackageMeasurements {
  weightLbs: number;
  weightOz: number;
  lengthInches: number;
  widthInches: number;
  heightInches: number;
  packageType?: 'box' | 'padded_envelope' | 'tube' | 'large_package';
}

export interface CalculatedShippingRate {
  id: ShippingMethodType;
  carrierKey: string;
  carrierName: string;
  serviceName: string;
  rate: number;
  estimatedDays: string;
  isFree?: boolean;
  isPickup?: boolean;
  distanceMiles: number;
  billableWeightLbs: number;
  zone: number;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userSchool: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  subcategoryId: string;
  condition: ProductCondition;
  images: string[];
  videoUrl?: string;
  location: {
    city: string;
    state: string;
    zip: string;
    distanceMiles?: number;
  };
  sellerId: string;
  sellerName: string;
  sellerSchool: string;
  sellerDistrict?: string;
  sellerVerified: boolean;
  sellerRating: number;
  sellerSalesCount: number;
  sellerAvatar: string;
  stock: number;
  packageMeasurements?: PackageMeasurements;
  shippingOptions: {
    pricingType?: 'calculated' | 'flat_rate' | 'free_shipping';
    usps: boolean;
    ups: boolean;
    fedex: boolean;
    localPickup: boolean;
    freeShipping: boolean;
    flatRate: number;
    estimatedFee?: number;
    pickupInstructions?: string;
  };
  gradeLevel: string[];
  tags: string[];
  createdAt: string;
  featured: boolean;
  viewsCount: number;
  savesCount: number;
  reviews: ProductReview[];
  specs?: Record<string, string>;
  status?: 'active' | 'pending' | 'sold' | 'draft' | 'flagged';
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  subcategories: SubCategory[];
  featuredImage: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedShipping: ShippingMethodType;
  shippingCost: number;
}

export interface Address {
  fullName: string;
  schoolName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  shippingCost: number;
  shippingMethod: ShippingMethodType;
  image: string;
  sellerId: string;
  sellerName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  discountTotal: number;
  commissionFee: number;
  sellerEarnings: number;
  total: number;
  paymentMethod: 'stripe' | 'paypal' | 'square' | 'applepay' | 'googlepay';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded' | 'Partially Refunded' | 'Failed';
  status:
    | 'Pending Payment'
    | 'Paid'
    | 'Awaiting Shipment'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Completed'
    | 'Under Review'
    | 'Cancelled'
    | 'Refunded';
  sellerPayoutStatus?: 'Pending' | 'Eligible' | 'On Hold' | 'Released' | 'Refunded';
  shippingAddress: Address;
  carrier?: string;
  trackingNumber?: string;
  orderNotes?: string;
  couponCode?: string;
  stateTaxRate: number;
  stateName: string;
  buyerProtectionStatus?: 'Held' | 'Released' | 'Disputed' | 'Refunded';
  escrowStatus?: 'Held' | 'Released' | 'Disputed' | 'Refunded'; // backward compatibility
  heldAmount?: number;
  escrowAmount?: number;
  fundsReleaseDate?: string;
  escrowReleaseDate?: string;
  autoReleaseDate?: string;
  buyerConfirmedReceipt?: boolean;
  buyerConfirmedDate?: string;
  shippedAt?: string;
  deliveredAt?: string;
  estimatedDelivery?: string;
  shippingNotes?: string;
  shippingReceiptUrl?: string;
  deliveryProofUrl?: string;
  shippingProof?: {
    carrier?: string;
    trackingNumber?: string;
    receiptImage?: string;
    deliveryProofImage?: string;
    proofNotes?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  disputeId?: string;
  riskScore?: number; // 0 - 100
  riskReason?: string;
  riskFlags?: string[];
  isHighRisk?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  schoolEmail?: string;
  schoolEmailVerified?: boolean;
  verifiedEmail?: boolean;
  emailVerificationCode?: string;
  isBuyerOnly?: boolean;
  role: UserRole;
  schoolName: string;
  district?: string;
  state: string;
  city: string;
  zip: string;
  profilePhoto?: string;
  avatar?: string;
  verifiedTeacher?: boolean;
  verified?: boolean;
  status?: string;
  verificationBadgeType?: 'K-12 Public' | 'Private/Charter' | 'Homeschool' | 'Higher Ed';
  verificationDoc?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  rating: number;
  reviewCount: number;
  salesCount: number;
  joinDate?: string;
  bio?: string;
  phone?: string;
  gradesTaught?: string[];
  subjectsTaught?: string[];
  savedAddresses?: Address[];
  balance?: number;
  protectedBalance?: number;
  escrowBalance?: number; // backwards compatibility
  lifetimeEarnings?: number;
  withdrawnAmount?: number;
  payoutMethodPreference?: PayoutMethodType;
  payoutDetails?: {
    accountHolderName?: string;
    bankName?: string;
    routingNumber?: string;
    accountNumberLast4?: string;
    paypalEmail?: string;
    checkMailingAddress?: string;
    stripeCardLast4?: string;
  };
}

export interface ContactTicket {
  id: string;
  ticketNumber: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'buyer' | 'teacher_seller' | 'school_admin' | 'guest';
  category: 'general' | 'teacher_verification' | 'buyer_protection_help' | 'escrow_help' | 'order_shipping' | 'privacy_protection' | 'district_po';
  subject: string;
  message: string;
  createdAt: string;
  status: 'Open' | 'In Review' | 'Resolved';
}

export type MessageThread = Conversation;

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
  productId?: string;
  productTitle?: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantSchool: string;
  participantAvatar: string;
  participantVerified: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
  messages: Message[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend: number;
  expiresAt: string;
  usageCount: number;
  maxUses: number;
  isActive: boolean;
}

export interface EmailTemplate {
  id: string;
  trigger: string;
  name: string;
  subject: string;
  previewText: string;
  category: 'Transactional' | 'Drip Campaign' | 'Promotional' | 'System';
  htmlContent: string;
  active: boolean;
  sentCount: number;
  openRate: string;
  clickRate: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  templateName: string;
  subject: string;
  sentAt: string;
  status: 'Delivered' | 'Opened' | 'Clicked' | 'Bounced';
}

export interface InboundEmailReply {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  sentAt: string;
  resendId?: string;
}

export interface InboundEmailMessage {
  id: string;
  ticketId: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  content: string;
  receivedAt: string;
  category: 'po_request' | 'teacher_verification' | 'escrow_order' | 'tax_exempt' | 'general';
  status: 'unread' | 'read' | 'replied' | 'archived';
  schoolName?: string;
  poNumber?: string;
  replies?: InboundEmailReply[];
}

export interface TaxReportItem {
  state: string;
  stateCode: string;
  taxRatePercent: number;
  grossSales: number;
  taxableSales: number;
  taxCollected: number;
  orderCount: number;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
  category: 'legal' | 'information' | 'help' | 'blog';
  readTime?: string;
  author?: string;
  excerpt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'message' | 'verification' | 'listing' | 'promo';
  linkTo?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'listing' | 'verification' | 'dispute' | 'escrow' | 'user' | 'contact' | 'system' | 'security';
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actorName?: string;
  actorRole?: string;
  actorSchool?: string;
  targetId?: string;
  targetLink?: string;
  amount?: number;
  details?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed';
  adminName?: string;
  details?: string;
  targetId?: string;
}

export interface AdminFeeSettings {
  nationwideCommissionRate: number; // e.g. 5.0%
  feeModel: 'deduct_seller' | 'add_buyer' | 'split';
  applyToAllStates: boolean;
  universalTaxRateEnabled: boolean;
  universalTaxRatePercent: number;
  stateTaxRates: Record<string, number>;
  stateSurcharges: Record<string, number>;
  lastUpdated: string;
  updatedBy: string;
}

export interface USStateInfo {
  code: string;
  name: string;
  baseTaxRate: number;
  majorCities: string[];
  surchargePercent: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  linkText: string;
  linkUrl: string;
  backgroundColor: string;
  textColor: string;
  active: boolean;
}

export interface NavMenuItem {
  id: string;
  label: string;
  targetView: string;
  iconName?: string;
  enabled: boolean;
  order: number;
  isCustom?: boolean;
}

export interface CategoryMenuItem {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface SeasonalBarItem {
  id: string;
  title: string;
  tagline: string;
  query: string;
  enabled: boolean;
}

export interface FooterColumnsSettings {
  buyers: boolean;
  sellers: boolean;
  trust: boolean;
  support: boolean;
}

export interface TrustTestimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  city: string;
  state: string;
  avatarUrl: string;
  stars: number;
  badge: string;
  comment: string;
  verified: boolean;
  date?: string;
}

export interface SocialMediaChannel {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'pinterest' | 'linkedin' | 'youtube' | 'tiktok' | 'bluesky' | 'custom';
  name: string;
  url: string;
  handle: string;
  enabled: boolean;
  order: number;
}

export interface SiteFeatureModules {
  enableBlog: boolean;                   // Educator Blog & Insights
  enableWishlists: boolean;              // Classroom Wishlists Explorer
  enableFundraising: boolean;            // Grants & Project Crowdfunding
  enableDistrictMap: boolean;            // Local Campus Pickup & Surplus Map
  enableBundles: boolean;                // Starter Bundles & Supply Packs
  enableCommunityForum: boolean;         // Teacher Community Swaps & Discussion
  enableSchoolDirectory: boolean;        // School Directory & PO Checkout
  enableRewardsClub: boolean;            // Educator Rewards & Points
  enableInspirationGallery: boolean;     // Classroom Decor & Inspiration Gallery
  enableBuyerProtectionPage: boolean;    // Buyer Protection & Trust Hub
  enableDirectMessaging: boolean;        // Live Chat & In-App Messaging
  enableProductReviews: boolean;         // Ratings & Review Badges
  enablePriceOffers: boolean;            // "Make an Offer" Bargaining
  enableGuestCheckout: boolean;          // Guest Checkout Option
  enableSchoolEmailVerification: boolean;// Require School Email for Sellers
  enableTopAnnouncementBar: boolean;     // Global Announcement Header
  enableTrustSealsBanner?: boolean;      // 5-Star Credibility & Trust Seals Bar
  enablePromoCard?: boolean;             // Teacher Appreciation Promo Card
}

export interface SiteSettings {
  announcementText: string;
  announcementLinkText: string;
  announcementLinkUrl: string;
  announcementActive: boolean;
  announcementBgColor?: string;
  announcementTextColor?: string;

  // Master Granular Feature Modules On/Off Toggles
  featureModules?: SiteFeatureModules;

  // Master Menu Bar Visibility Toggles
  showTopAnnouncementBar?: boolean;
  showMainFeatureNav?: boolean;
  showCategoriesNav?: boolean;
  showSeasonalCollectionsBar?: boolean;
  showSellerGuideButton?: boolean;
  showZipFilter?: boolean;
  showNotificationsIcon?: boolean;
  showWishlistIcon?: boolean;
  showCartIcon?: boolean;
  showSellButton?: boolean;
  showFooter?: boolean;
  showPromoCard?: boolean;
  showTrustSealsBanner?: boolean;
  showFooterColumns?: FooterColumnsSettings;

  // Configurable Menu Lists
  mainNavItems?: NavMenuItem[];
  categoryNavItems?: CategoryMenuItem[];
  seasonalNavItems?: SeasonalBarItem[];

  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  heroTitle?: string;
  heroSubtitle?: string;
  promoTitle?: string;
  promoDescription?: string;
  promoCode?: string;
  supportEmail: string;
  supportPhone: string;
  hqAddress: string;
  businessHours: string;
  commissionRate: number;
  allowGuestPurchases: boolean;
  requireSchoolEmailForSellers: boolean;
  freeShippingThreshold?: number;

  // Trust & Credibility Settings (Admin Editable)
  trustHeroTitle?: string;
  trustHeroSubtitle?: string;
  trustRatingScore?: string;
  trustReviewsCount?: string;
  trustBuyerGuaranteeText?: string;
  trustSatisfactionRate?: string;
  trustTestimonials?: TrustTestimonial[];

  // Social Media Channels (Admin Configurable)
  socialChannels?: SocialMediaChannel[];

  // Resend Email Integration Settings (Admin Editable)
  resendApiKey?: string;
  resendFromEmail?: string;
  resendReplyToEmail?: string;
  resendConnected?: boolean;
  resendLastTestedAt?: string;
}

// 1. Teacher Reputation & Trust Score
export interface TeacherReputation {
  score: number; // 0 - 100
  tier: 'Platinum Educator' | 'Gold Educator' | 'Silver Educator';
  responseTimeText: string; // e.g. "< 30 mins"
  avgDispatchDays: number; // e.g. 1.2
  successfulSalesRate: number; // e.g. 99.8%
  yearsActive: number;
  verifiedBadges: string[];
  disputeRatePercent: number; // e.g. 0.0%
}

// 2. Classroom Wishlist System
export interface WishlistItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  quantityNeeded: number;
  quantityFulfilled: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  itemUrl?: string;
  imageUrl?: string;
  donorNames?: string[];
  isCustom?: boolean;
}

export interface ClassroomWishlist {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  teacherVerified: boolean;
  schoolName: string;
  district?: string;
  city: string;
  state: string;
  zip: string;
  gradeLevel: string;
  subject?: string;
  title: string;
  classroomStory: string;
  bannerImage: string;
  classroomPhoto?: string;
  shareSlug: string;
  items: WishlistItem[];
  totalGoal: number;
  totalFulfilled: number;
  donorsCount: number;
  thankYouMessage?: string;
  lastUpdated: string;
  donors?: Array<{
    id: string;
    donorName: string;
    amount: number;
    itemName?: string;
    date: string;
    message?: string;
    isAnonymous?: boolean;
  }>;
}

// 3. Classroom Fundraising & Grants
export interface ClassroomProjectUpdate {
  id: string;
  date: string;
  title: string;
  text: string;
  imageUrl?: string;
}

export interface ProjectDonor {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  comment?: string;
  isAnonymous?: boolean;
}

export interface ClassroomProject {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  teacherVerified: boolean;
  schoolName: string;
  district?: string;
  city: string;
  state: string;
  zip: string;
  gradeLevel: string;
  title: string;
  category: 'STEM Lab' | 'Reading Corner' | 'Art Supplies' | 'Music Equipment' | 'Sensory & Calming' | 'Robotics & Tech' | 'Field Trip' | 'Classroom Garden';
  goalAmount: number;
  raisedAmount: number;
  donorsCount: number;
  daysLeft: number;
  description: string;
  impactStory: string;
  imageUrl: string;
  budgetBreakdown: Array<{ item: string; cost: number }>;
  updates: ClassroomProjectUpdate[];
  donors: ProjectDonor[];
  status: 'active' | 'funded' | 'completed';
  createdAt: string;
}

// 4. Classroom Bundles
export interface ProductBundle {
  id: string;
  title: string;
  description: string;
  sellerId: string;
  sellerName: string;
  sellerSchool: string;
  sellerVerified: boolean;
  sellerAvatar: string;
  productIds: string[];
  itemTitles: string[];
  originalPrice: number;
  bundlePrice: number;
  discountPercent: number;
  gradeLevel: string[];
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  status: 'active' | 'sold';
  createdAt: string;
}

// 5. Classroom Inspiration Gallery
export interface TaggedSupplyPin {
  id: string;
  title: string;
  price: number;
  productId?: string;
  image: string;
  xPercent: number; // 0-100% position on photo
  yPercent: number;
}

export interface InspirationComment {
  id: string;
  userName: string;
  userAvatar: string;
  userSchool: string;
  text: string;
  date: string;
}

export interface ClassroomInspiration {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherSchool: string;
  teacherCity: string;
  teacherState: string;
  teacherAvatar: string;
  teacherVerified: boolean;
  title: string;
  description: string;
  theme: string;
  gradeLevel: string;
  imageUrl: string;
  beforeImageUrl?: string;
  likesCount: number;
  savesCount: number;
  userLiked?: boolean;
  userSaved?: boolean;
  comments: InspirationComment[];
  taggedSupplies: TaggedSupplyPin[];
  createdAt: string;
}

// 6. Teacher Community Discussion Boards
export type CommunityCategory =
  | 'Classroom Ideas'
  | 'Lesson Planning'
  | 'Classroom Management'
  | 'EdTech & AI'
  | 'STEM & Science'
  | 'Reading & Literacy'
  | 'Art & Decor'
  | 'Grants & Fundraising';

export interface CommunityReply {
  id: string;
  authorId: string;
  authorName: string;
  authorSchool: string;
  authorAvatar: string;
  authorVerified: boolean;
  content: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  isTeacherVerifiedAnswer?: boolean;
}

export interface CommunityThread {
  id: string;
  title: string;
  content: string;
  category: CommunityCategory;
  authorId: string;
  authorName: string;
  authorSchool: string;
  authorAvatar: string;
  authorVerified: boolean;
  authorBadge?: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  tags: string[];
  repliesCount: number;
  replies: CommunityReply[];
  isPinned?: boolean;
}

// 7. School Directory & District Network
export interface SchoolDirectoryTeacher {
  id: string;
  name: string;
  grade: string;
  subject: string;
  verified: boolean;
  listingsCount: number;
  avatar?: string;
}

export interface SchoolDirectoryItem {
  id: string;
  name: string;
  district: string;
  city: string;
  state: string;
  zip: string;
  schoolType: 'Elementary' | 'Middle' | 'High' | 'K-8' | 'Charter' | 'Private';
  teacherCount: number;
  activeListingsCount: number;
  activeWishlistsCount: number;
  contactEmail: string;
  address: string;
  mascot?: string;
  phone?: string;
  teachers: SchoolDirectoryTeacher[];
}

// 8. Teacher Rewards & Loyalty Points
export interface RewardItem {
  id: string;
  title: string;
  costPoints: number;
  description: string;
  icon: string;
  rewardType: 'fee_discount' | 'featured_listing' | 'badge' | 'store_credit';
  value: string;
}

export interface RewardActivity {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
}

// 9. Marketplace News & Educator Blog Articles
export interface EducatorArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorTitle: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: 'Teaching Tips' | 'Classroom Ideas' | 'Grants & Funding' | 'Product Reviews' | 'Seasonal Guides' | 'District Purchasing' | 'STEM Innovations';
  featuredImage: string;
  tags: string[];
  likes: number;
  userLiked?: boolean;
  status?: 'published' | 'draft' | 'hidden';
  viewsCount?: number;
  featured?: boolean;
  seoDescription?: string;
  seoKeywords?: string[];
  updatedAt?: string;
}

// 10. Featured Teacher Stories & Spotlights
export interface TeacherStory {
  id: string;
  teacherName: string;
  school: string;
  city: string;
  state: string;
  headline: string;
  story: string;
  avatarUrl: string;
  classroomImageUrl: string;
  totalSavedOrEarned: number;
  gradeLevel: string;
  quote: string;
  yearJoined: string;
}

// 11. Saved Searches
export interface SavedSearch {
  id: string;
  query: string;
  categoryId?: string;
  maxPrice?: number;
  condition?: string;
  zip?: string;
  radius?: number;
  emailAlerts: boolean;
  createdAt: string;
}

// 12. Product Offers & Counter-Offers
export interface ProductOffer {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  originalPrice: number;
  offerAmount: number;
  counterOfferAmount?: number;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  createdAt: string;
  message?: string;
  counterMessage?: string;
}

// 13. Dispute & Payment Protection Center
export type DisputeReason =
  | 'item_not_received'
  | 'wrong_item'
  | 'significantly_different'
  | 'damaged_shipment'
  | 'missing_parts'
  | 'unauthorized_transaction';

export type DisputeStatus =
  | 'Open'
  | 'Under Review'
  | 'Awaiting Seller'
  | 'Awaiting Buyer'
  | 'Resolved Refunded'
  | 'Resolved Released'
  | 'Resolved Partial'
  | 'Closed Rejected';

export interface DisputeEvidence {
  id: string;
  uploaderId: string;
  uploaderName: string;
  uploaderRole: 'buyer' | 'seller' | 'admin';
  type: 'photo' | 'receipt' | 'tracking_proof' | 'document';
  fileUrl: string;
  fileName: string;
  description?: string;
  timestamp: string;
}

export interface DisputeActivityLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'buyer' | 'seller' | 'admin' | 'system';
  action: string;
  note?: string;
  fundChange?: string;
}

export interface DisputeCase {
  id: string;
  disputeNumber: string;
  orderId: string;
  orderNumber: string;
  productTitle: string;
  productImage?: string;
  disputeAmount: number;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  reason: DisputeReason;
  reasonTitle: string;
  detailedExplanation: string;
  requestedResolution: 'full_refund' | 'partial_refund' | 'replacement';
  requestedAmount?: number;
  status: DisputeStatus;
  createdAt: string;
  updatedAt: string;
  buyerEvidence: DisputeEvidence[];
  sellerEvidence: DisputeEvidence[];
  sellerReply?: string;
  sellerReplyAt?: string;
  sellerTrackingProof?: {
    carrier?: string;
    trackingNumber?: string;
    receiptUrl?: string;
    deliveryProofUrl?: string;
    notes?: string;
  };
  adminDecision?:
    | 'Approve Buyer - Full Refund'
    | 'Approve Buyer - Partial Refund'
    | 'Approve Seller - Release Payout'
    | 'Reject Claim'
    | 'Request More Information';
  adminDecisionNotes?: string;
  refundAmountIssued?: number;
  history: DisputeActivityLog[];
}

// 14. Admin Safety Dashboard & Fraud Detection
export type FraudAlertType =
  | 'large_purchase'
  | 'repeated_refunds'
  | 'failed_payments'
  | 'multiple_registrations'
  | 'repeated_disputes'
  | 'duplicate_listings'
  | 'excessive_cancellations'
  | 'high_complaints';

export interface FraudAlert {
  id: string;
  type: FraudAlertType;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  targetUserId?: string;
  targetUserName?: string;
  targetUserRole?: 'buyer' | 'seller' | 'guest';
  targetOrderId?: string;
  targetOrderNumber?: string;
  targetListingId?: string;
  riskScore: number; // 0 - 100
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  actionTaken?: string;
}

// 15. Seller Verification Queue Item
export interface SellerVerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  schoolName: string;
  district?: string;
  state: string;
  roleTitle: string;
  badgeType: 'K-12 Public' | 'Private/Charter' | 'Homeschool' | 'Higher Ed';
  documentType: 'school_id' | 'teaching_license' | 'pay_stub' | 'district_directory';
  documentUrl: string;
  documentName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'more_info_needed';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// 16. Performance Dashboards
export interface SellerPerformanceProfile {
  userId: string;
  userName: string;
  userSchool: string;
  avatar: string;
  trustScore: number; // 0 - 100
  successfulSales: number;
  completedOrders: number;
  averageRating: number;
  reviewCount: number;
  refundPercent: number;
  disputePercent: number;
  lateShipmentPercent: number;
  responseTime: string;
  revenue: number;
  joinedDate: string;
  status: 'active' | 'warning' | 'suspended';
}

export interface BuyerPerformanceProfile {
  userId: string;
  userName: string;
  email: string;
  schoolName: string;
  avatar: string;
  completedOrders: number;
  refundRequests: number;
  disputes: number;
  chargebacks: number;
  averageSpending: number;
  totalSpent: number;
  trustScore: number; // 0 - 100
  joinedDate: string;
  status: 'active' | 'warning' | 'restricted';
}

// 17. Seller Payouts & Balance Withdrawals
export type PayoutMethodType = 'ach' | 'stripe_instant' | 'paypal' | 'check';

export interface SellerPayoutRequest {
  id: string;
  payoutNumber: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerSchool?: string;
  amount: number;
  payoutFee: number;
  netAmount: number;
  method: PayoutMethodType;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  requestedAt: string;
  processedAt?: string;
  estimatedArrival?: string;
  destinationDetails: {
    accountHolderName: string;
    bankName?: string;
    routingNumber?: string;
    accountNumberLast4?: string;
    paypalEmail?: string;
    checkMailingAddress?: string;
    stripeCardLast4?: string;
  };
  transactionReference: string;
  notes?: string;
}

// 18. Company Payment Gateway Configuration
export interface CompanyPaymentGatewayConfig {
  stripe: {
    enabled: boolean;
    mode: 'test' | 'live';
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    connectClientId: string;
    connectType: 'express' | 'custom' | 'standard';
    autoEscrowSplitPercent: number;
    statementDescriptor: string;
  };
  paypal: {
    enabled: boolean;
    mode: 'sandbox' | 'live';
    clientId: string;
    clientSecret: string;
    merchantId: string;
    partnerFeePercent: number;
  };
  districtPO: {
    enabled: boolean;
    requireEin: boolean;
    netPaymentDays: 30 | 60;
    achBankName: string;
    achRoutingNumber: string;
    achAccountNumber: string;
    districtEmailInvoiceAutoSend: boolean;
  };
  digitalWallets: {
    applePay: boolean;
    googlePay: boolean;
    appleMerchantId: string;
    domainAssociationVerified: boolean;
  };
  escrowSettings: {
    autoReleaseDays: number;
    allowBuyerManualRelease: boolean;
    instantDisputeHold: boolean;
    minimumWithdrawalThreshold: number;
    escrowFeePercent: number;
  };
  corporateSettlement: {
    legalEntityName: string;
    federalEin: string;
    depositBankName: string;
    routingNumber: string;
    accountNumberLast4: string;
    settlementSchedule: 'daily_rolling' | 'weekly_friday' | 'monthly_1st';
  };
}

// 19. Company Playbook & SOPs
export interface CompanyPlaybookSOP {
  id: string;
  code: string;
  title: string;
  category: 'operations' | 'verification' | 'escrow' | 'finance' | 'disputes' | 'shipping' | 'tax' | 'support' | 'legal';
  summary: string;
  purpose: string;
  scope: string;
  stepByStepGuidelines: string[];
  complianceNotes: string;
  lastUpdated: string;
  authorRole: string;
}

export interface CompanyPlaybookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  iconName: string;
  overview: string;
  sops: CompanyPlaybookSOP[];
}




