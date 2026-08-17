import React from 'react';
import { Sparkles, Backpack, Ghost, Snowflake, Heart, Flower2, GraduationCap, Sun } from 'lucide-react';

export interface SeasonalCollection {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  queryKeyword: string;
}

export const SEASONAL_COLLECTIONS: SeasonalCollection[] = [
  {
    id: 'all',
    name: 'All Classroom Supplies',
    shortName: 'All Items',
    tagline: 'Explore full nationwide teacher catalog',
    icon: Sparkles,
    color: 'bg-blue-900 text-white border-blue-800',
    badge: 'Catalog',
    queryKeyword: '',
  },
  {
    id: 'back-to-school',
    name: 'Back to School Launch',
    shortName: '🎒 Back to School',
    tagline: 'Pencils, whiteboards, bins & bulletin decor',
    icon: Backpack,
    color: 'bg-amber-500 text-white border-amber-600',
    badge: 'Popular Now',
    queryKeyword: 'school',
  },
  {
    id: 'fall-halloween',
    name: 'Fall & Halloween Crafts',
    shortName: '🎃 Fall & Crafts',
    tagline: 'Pumpkins, autumn leaves, sensory crafts',
    icon: Ghost,
    color: 'bg-orange-600 text-white border-orange-700',
    badge: 'Seasonal',
    queryKeyword: 'art',
  },
  {
    id: 'winter-holidays',
    name: 'Winter & Holiday Reading',
    shortName: '❄️ Winter Library',
    tagline: 'Cozy books, STEM winter inquiry, festive decor',
    icon: Snowflake,
    color: 'bg-cyan-700 text-white border-cyan-800',
    badge: 'Cozy Season',
    queryKeyword: 'book',
  },
  {
    id: '100th-day-valentines',
    name: '100th Day & Valentine’s',
    shortName: '❤️ 100 Days & SEL',
    tagline: 'Counting manipulatives, kindness certificates',
    icon: Heart,
    color: 'bg-rose-600 text-white border-rose-700',
    badge: 'Celebrations',
    queryKeyword: 'math',
  },
  {
    id: 'spring-stem',
    name: 'Spring STEM & Earth Day',
    shortName: '🌱 Spring STEM',
    tagline: 'Plant life cycles, solar kits, weather stations',
    icon: Flower2,
    color: 'bg-emerald-600 text-white border-emerald-700',
    badge: 'Hands-On',
    queryKeyword: 'stem',
  },
  {
    id: 'graduation-summer',
    name: 'End of Year & Summer School',
    shortName: '🎓 End of Year',
    tagline: 'Awards, memory books, summer prep packets',
    icon: GraduationCap,
    color: 'bg-indigo-600 text-white border-indigo-700',
    badge: 'Prep',
    queryKeyword: 'storage',
  },
];

export interface SeasonalCollectionsBarProps {
  activeCollection?: string;
  onSelectCollection?: (colId: string) => void;
  onSelectTag?: (tag: string) => void;
  donationOnlyFilter?: boolean;
  onToggleDonationOnly?: () => void;
}

export const SeasonalCollectionsBar: React.FC<SeasonalCollectionsBarProps> = ({
  activeCollection = 'all',
  onSelectCollection = (_colId?: string) => {},
  onSelectTag = (_tag?: string) => {},
  donationOnlyFilter = false,
  onToggleDonationOnly,
}) => {
  const handleSelect = (col: SeasonalCollection) => {
    if (typeof onSelectCollection === 'function') {
      onSelectCollection(col.id);
    }
    if (typeof onSelectTag === 'function') {
      onSelectTag(col.queryKeyword || col.shortName);
    }
  };

  return (
    <div className="bg-slate-900 text-white py-2 px-4 sm:px-6 shadow-inner border-y border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto py-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Seasonal Hub:
          </span>

          {SEASONAL_COLLECTIONS.map((col) => {
            const isSelected = activeCollection === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => handleSelect(col)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? `${col.color} ring-2 ring-white/30 shadow-xs scale-105`
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <span>{col.shortName}</span>
                {isSelected && (
                  <span className="text-[9px] bg-white/20 px-1 rounded-full font-extrabold">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feature 18: $0 Free Surplus / Classroom Donation Toggle */}
        {typeof onToggleDonationOnly === 'function' && (
          <button
            type="button"
            onClick={onToggleDonationOnly}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
              donationOnlyFilter
                ? 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-300'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>🎁 Free Surplus / $0 Donations Only</span>
          </button>
        )}
      </div>
    </div>
  );
};
