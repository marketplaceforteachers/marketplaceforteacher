import React, { useState } from 'react';
import {
  Heart,
  Gift,
  Share2,
  CheckCircle2,
  Search,
  Filter,
  School,
  MapPin,
  Sparkles,
  ExternalLink,
  PlusCircle,
  X,
  DollarSign,
  UserCheck,
  Award,
} from 'lucide-react';
import { ClassroomWishlist, WishlistItem, User, Product } from '../types';
import { INITIAL_WISHLISTS } from '../data/classroomWishlistsData';

interface ClassroomWishlistExplorerProps {
  wishlists?: ClassroomWishlist[];
  currentUser?: User;
  onFulfillItem?: (wishlistId: string, itemId: string, quantity: number, donorName: string, donorMsg: string) => void;
  onDonateToWishlist?: (wishlistId: string, amount: number, donorName: string, donorMsg: string) => void;
  onCreateWishlistClick?: () => void;
  onCreateWishlist?: () => void;
  onAddToCart?: (item: WishlistItem | Product | any) => void;
  onOpenProductDetail?: (productId: string) => void;
}

const DEFAULT_GUEST_USER: User = {
  id: 'usr-guest',
  name: 'Kind Supporter',
  email: 'supporter@marketplaceforteachers.com',
  role: 'guest',
  schoolName: 'Kind Supporter',
  state: 'OK',
  city: 'Oklahoma City',
  zip: '73159',
  rating: 5.0,
  reviewCount: 0,
  salesCount: 0,
  verified: false,
  verifiedTeacher: false,
};

export const ClassroomWishlistExplorer: React.FC<ClassroomWishlistExplorerProps> = ({
  wishlists = INITIAL_WISHLISTS,
  currentUser = DEFAULT_GUEST_USER,
  onFulfillItem,
  onDonateToWishlist,
  onCreateWishlistClick,
  onCreateWishlist,
  onAddToCart,
  onOpenProductDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedWishlist, setSelectedWishlist] = useState<ClassroomWishlist | null>(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedItemToFulfill, setSelectedItemToFulfill] = useState<WishlistItem | null>(null);
  const [donorName, setDonorName] = useState(currentUser?.name || 'Kind Donor');
  const [donorMsg, setDonorMsg] = useState('Thank you for all you do for your students!');
  const [customDonationAmount, setCustomDonationAmount] = useState('25');
  const [copiedLink, setCopiedLink] = useState(false);

  const listToFilter = Array.isArray(wishlists) && wishlists.length > 0 ? wishlists : INITIAL_WISHLISTS;

  // Filter wishlists
  const filteredWishlists = listToFilter.filter((wl) => {
    if (!wl) return false;
    const title = wl.title || '';
    const teacher = wl.teacherName || '';
    const school = wl.schoolName || '';
    const city = wl.city || '';
    const items = Array.isArray(wl.items) ? wl.items : [];

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      items.some((it) => (it?.title || '').toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesState = selectedState === 'all' || (wl.state || '').toLowerCase() === selectedState.toLowerCase();
    const matchesGrade = selectedGrade === 'all' || (wl.gradeLevel || '').toLowerCase().includes(selectedGrade.toLowerCase());

    return matchesSearch && matchesState && matchesGrade;
  });

  const handleCopyLink = (shareSlug: string) => {
    navigator.clipboard.writeText(`https://marketplaceforteachers.com/wishlist/${shareSlug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConfirmDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWishlist) return;

    if (selectedItemToFulfill && onFulfillItem) {
      onFulfillItem(selectedWishlist.id, selectedItemToFulfill.id, 1, donorName, donorMsg);
    } else if (onDonateToWishlist) {
      const amount = parseFloat(customDonationAmount) || 25;
      onDonateToWishlist(selectedWishlist.id, amount, donorName, donorMsg);
    }

    setShowDonateModal(false);
    setSelectedItemToFulfill(null);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/40 text-amber-300 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-amber-300" />
            Classroom Wishlist Registry ⭐⭐⭐⭐⭐
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Support Verified Teachers Directly
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Parents, PTAs, community donors, and school supporters can fulfill vital classroom supplies or fund specific learning tools requested by verified public and private educators.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {currentUser?.role === 'teacher' && (onCreateWishlistClick || onCreateWishlist) && (
              <button
                onClick={() => (onCreateWishlistClick ? onCreateWishlistClick() : onCreateWishlist?.())}
                className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Create or Edit My Classroom Wishlist
              </button>
            )}
            <span className="text-xs text-blue-200 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% of gifted items shipped directly to school addresses
            </span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by teacher, school, district, city, or item (e.g. microscopes, decodables)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All States (Nationwide)</option>
            <option value="OK">Oklahoma (OK)</option>
            <option value="TX">Texas (TX)</option>
            <option value="VA">Virginia (VA)</option>
            <option value="IL">Illinois (IL)</option>
            <option value="CA">California (CA)</option>
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All Grade Levels</option>
            <option value="1st">1st - 2nd Grade</option>
            <option value="3rd">3rd - 5th Grade</option>
            <option value="6th">6th - 8th Middle School</option>
            <option value="9th">9th - 12th High School</option>
          </select>
        </div>
      </div>

      {/* Wishlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWishlists.map((wl) => {
          const fulfilledPct = Math.min(100, Math.round(((wl.totalFulfilled || 0) / (wl.totalGoal || 1)) * 100));
          const itemsNeededCount = (wl.items || []).filter((it) => (it.quantityFulfilled || 0) < (it.quantityNeeded || 1)).length;

          return (
            <div
              key={wl.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Card Banner */}
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={wl.bannerImage}
                  alt={wl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-200">
                    <School className="w-3.5 h-3.5" />
                    <span>{wl.schoolName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-300">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>{wl.city}, {wl.state} • {wl.gradeLevel}</span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-blue-900/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-400/40">
                  {itemsNeededCount} Needed
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Teacher Info */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <img
                      src={wl.teacherAvatar}
                      alt={wl.teacherName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-xs font-extrabold text-slate-900">
                        <span>{wl.teacherName}</span>
                        {wl.teacherVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">{wl.subject || wl.district}</p>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                    {wl.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {wl.classroomStory}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-blue-950 font-black">${wl.totalFulfilled} Raised / Gifted</span>
                    <span className="text-slate-500">${wl.totalGoal} Goal</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${fulfilledPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{fulfilledPct}% Fulfilled</span>
                    <span>{wl.donorsCount} Donors</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedWishlist(wl)}
                    className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    View & Fulfill Items
                  </button>

                  <button
                    onClick={() => handleCopyLink(wl.shareSlug)}
                    title="Copy Shareable Link"
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Wishlist Detail Modal */}
      {selectedWishlist && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWishlist.teacherAvatar}
                  alt={selectedWishlist.teacherName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-black text-slate-900">{selectedWishlist.teacherName}</h2>
                    {selectedWishlist.teacherVerified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Faculty
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedWishlist.schoolName} • {selectedWishlist.city}, {selectedWishlist.state}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedWishlist(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story & Banner */}
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-blue-950">{selectedWishlist.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedWishlist.classroomStory}</p>
            </div>

            {/* Wishlist Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Requested Supplies ({selectedWishlist.items.length})
                </h4>
                <span className="text-[11px] text-emerald-700 font-bold">
                  Ships directly to verified school address
                </span>
              </div>

              <div className="space-y-2">
                {selectedWishlist.items.map((item) => {
                  const isFulfilled = item.quantityFulfilled >= item.quantityNeeded;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isFulfilled ? 'bg-slate-50/80 border-slate-200 opacity-75' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                          />
                        )}
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900">{item.title}</h5>
                          <p className="text-[11px] text-slate-500">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-black text-blue-900">${item.price.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] font-bold text-slate-600">
                              {item.quantityFulfilled} of {item.quantityNeeded} gifted
                            </span>
                            {item.priority === 'high' && (
                              <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.2 rounded">
                                High Priority
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isFulfilled ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fulfilled
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedItemToFulfill(item);
                              setShowDonateModal(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            Gift This (${item.price.toFixed(2)})
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donor Wall / Messages */}
            {selectedWishlist.donors && selectedWishlist.donors.length > 0 && (
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Community Supporters ({selectedWishlist.donors.length})
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedWishlist.donors.map((d) => (
                    <div key={d.id} className="text-xs text-slate-700 flex items-start gap-2">
                      <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 fill-rose-500" />
                      <div>
                        <span className="font-bold text-slate-900">{d.donorName}</span>
                        {d.itemName && <span className="text-slate-500"> gifted {d.itemName}</span>}
                        {d.message && <p className="text-[11px] text-slate-600 italic">"{d.message}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedItemToFulfill(null);
                  setShowDonateModal(true);
                }}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-xl text-xs font-black flex items-center gap-2 transition-colors cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                Make Custom Classroom Gift ($)
              </button>

              <button
                onClick={() => handleCopyLink(selectedWishlist.shareSlug)}
                className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedLink ? 'Copied Link!' : 'Share Wishlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donate / Gift Checkout Modal */}
      {showDonateModal && selectedWishlist && (
        <div className="fixed inset-0 z-55 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {selectedItemToFulfill ? 'Gift Classroom Item' : 'Support Classroom Wishlist'}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedWishlist.teacherName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDonateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDonation} className="space-y-3">
              {selectedItemToFulfill ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Selected Item</span>
                  <p className="text-xs font-extrabold text-slate-900">{selectedItemToFulfill.title}</p>
                  <p className="text-sm font-black text-blue-900 mt-1">
                    ${selectedItemToFulfill.price.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gift Amount ($ USD)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['15', '25', '50', '100'].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setCustomDonationAmount(amt)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          customDonationAmount === amt
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="5"
                    step="1"
                    value={customDonationAmount}
                    onChange={(e) => setCustomDonationAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name / Family</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. The Rodriguez Family, PTA Supporter"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note of Encouragement</label>
                <textarea
                  value={donorMsg}
                  onChange={(e) => setDonorMsg(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-[11px] font-medium border border-blue-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant tax-deductible contribution receipt generated.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Complete Classroom Gift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
