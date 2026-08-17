import React, { useState } from 'react';
import {
  Heart,
  Bookmark,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Share2,
  CheckCircle2,
  PlusCircle,
  X,
  Tag,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { ClassroomInspiration, User } from '../types';
import { INITIAL_INSPIRATIONS } from '../data/classroomInspirationsData';

interface ClassroomInspirationGalleryProps {
  inspirations?: ClassroomInspiration[];
  currentUser?: User;
  onLikeInspiration?: (id: string) => void;
  onSaveInspiration?: (id: string) => void;
  onAddComment?: (inspirationId: string, commentText: string) => void;
  onCreateInspirationClick?: () => void;
  onCreateInspiration?: () => void;
  onOpenProductDetail?: (productId: string) => void;
}

const DEFAULT_GUEST_USER: User = {
  id: 'usr-guest',
  name: 'Classroom Supporter',
  email: 'supporter@marketplaceforteachers.com',
  role: 'guest',
  schoolName: 'Classroom Supporter',
  state: 'OK',
  city: 'Oklahoma City',
  zip: '73159',
  rating: 5.0,
  reviewCount: 0,
  salesCount: 0,
  verified: false,
  verifiedTeacher: false,
};

export const ClassroomInspirationGallery: React.FC<ClassroomInspirationGalleryProps> = ({
  inspirations = INITIAL_INSPIRATIONS,
  currentUser = DEFAULT_GUEST_USER,
  onLikeInspiration,
  onSaveInspiration,
  onAddComment,
  onCreateInspirationClick,
  onCreateInspiration,
  onOpenProductDetail,
}) => {
  const [selectedInspiration, setSelectedInspiration] = useState<ClassroomInspiration | null>(null);
  const [showBeforeToggle, setShowBeforeToggle] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState('');
  const [activeTheme, setActiveTheme] = useState('all');

  const themes = ['all', 'Boho & Calming Neutrals', 'Modern STEM & Laboratory Clean', 'Vibrant & Creative Studio'];

  const listToFilter = Array.isArray(inspirations) && inspirations.length > 0 ? inspirations : INITIAL_INSPIRATIONS;

  const filteredInspirations = listToFilter.filter((insp) => {
    if (!insp) return false;
    return activeTheme === 'all' || insp.theme === activeTheme;
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInspiration || !commentText.trim() || !onAddComment) return;

    onAddComment(selectedInspiration.id, commentText.trim());
    setCommentText('');
  };

  const toggleBeforeAfter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBeforeToggle((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/40 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Classroom Inspiration & Setup Gallery
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            See Real Classrooms. Shop the Exact Supplies.
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Explore authentic learning environments designed by educators. Click interactive pins on photos to find the exact rugs, book bins, storage carts, and flexible cushions on the marketplace!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {currentUser.role === 'teacher' && onCreateInspirationClick && (
              <button
                onClick={onCreateInspirationClick}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Share Your Classroom Transformation
              </button>
            )}
            <span className="text-xs text-emerald-200 font-medium">
              🏷️ Tag surplus items to help colleagues replicate your design
            </span>
          </div>
        </div>
      </div>

      {/* Theme Filters */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setActiveTheme(theme)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              activeTheme === theme
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {theme === 'all' ? 'All Styles & Themes' : theme}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInspirations.map((insp) => {
          const isShowingBefore = showBeforeToggle[insp.id] && insp.beforeImageUrl;
          const displayImage = isShowingBefore ? insp.beforeImageUrl : insp.imageUrl;

          return (
            <div
              key={insp.id}
              onClick={() => setSelectedInspiration(insp)}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer group"
            >
              {/* Photo Area with Tagged Pins */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={displayImage}
                  alt={insp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Before / After Switcher */}
                {insp.beforeImageUrl && (
                  <button
                    onClick={(e) => toggleBeforeAfter(insp.id, e)}
                    className="absolute top-3 left-3 bg-slate-950/80 hover:bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20 shadow-md backdrop-blur-xs flex items-center gap-1 z-20 cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-amber-400" />
                    <span>{isShowingBefore ? 'Viewing BEFORE' : 'Toggle BEFORE'}</span>
                  </button>
                )}

                {/* Tagged Supplies Count Badge */}
                <div className="absolute top-3 right-3 bg-emerald-950/90 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-sm flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{insp.taggedSupplies.length} Tagged Supplies</span>
                </div>

                {/* Interactive Overlay Pin Hotspots */}
                {!isShowingBefore &&
                  insp.taggedSupplies.map((pin) => (
                    <div
                      key={pin.id}
                      style={{ top: `${pin.yPercent}%`, left: `${pin.xPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInspiration(insp);
                      }}
                    >
                      <div className="w-6 h-6 rounded-full bg-white text-emerald-800 font-extrabold text-[10px] flex items-center justify-center shadow-lg ring-2 ring-emerald-500 animate-bounce cursor-pointer">
                        🏷️
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/pin:block bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap">
                        {pin.title} (${pin.price})
                      </div>
                    </div>
                  ))}
              </div>

              {/* Card Footer */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src={insp.teacherAvatar}
                      alt={insp.teacherName}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-bold text-slate-800">{insp.teacherName}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500">{insp.teacherSchool}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {insp.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {insp.description}
                  </p>
                </div>

                {/* Social Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikeInspiration?.(insp.id);
                      }}
                      className="flex items-center gap-1 hover:text-rose-600 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="font-bold">{insp.likesCount}</span>
                    </button>

                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{insp.comments.length}</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveInspiration?.(insp.id);
                    }}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail with "Shop This Look" Supply List */}
      {selectedInspiration && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedInspiration.teacherAvatar}
                  alt={selectedInspiration.teacherName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedInspiration.title}</h3>
                  <p className="text-xs text-slate-500">
                    By {selectedInspiration.teacherName} • {selectedInspiration.teacherSchool} ({selectedInspiration.teacherCity}, {selectedInspiration.teacherState})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInspiration(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Image */}
            <div className="rounded-xl overflow-hidden border border-slate-200 max-h-80 bg-slate-100">
              <img
                src={selectedInspiration.imageUrl}
                alt={selectedInspiration.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Story */}
            <p className="text-xs text-slate-700 leading-relaxed">{selectedInspiration.description}</p>

            {/* "Shop This Classroom Look" Interactive Section */}
            <div className="space-y-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  Shop Featured Supplies in This Setup ({selectedInspiration.taggedSupplies.length})
                </h4>
                <span className="text-[10px] text-emerald-700 font-bold">Direct Marketplace Listings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedInspiration.taggedSupplies.map((pin) => (
                  <div
                    key={pin.id}
                    className="p-2.5 bg-white rounded-xl border border-emerald-200/80 shadow-xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={pin.image}
                        alt={pin.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                      />
                      <div>
                        <p className="font-extrabold text-xs text-slate-900 line-clamp-1">{pin.title}</p>
                        <p className="text-xs font-black text-emerald-700">${pin.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (pin.productId && onOpenProductDetail) {
                          setSelectedInspiration(null);
                          onOpenProductDetail(pin.productId);
                        }
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Buy</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Area */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Educator Comments & Setup Tips ({selectedInspiration.comments.length})
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedInspiration.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{c.userName} ({c.userSchool})</span>
                      <span className="text-[10px] text-slate-400 font-normal">{c.date}</span>
                    </div>
                    <p className="text-slate-600">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or share a setup tip..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
