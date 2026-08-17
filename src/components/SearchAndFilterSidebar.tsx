import React from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Truck,
  Building2,
  Search,
  X,
} from 'lucide-react';
import { ProductCondition } from '../types';
import { CATEGORIES } from '../data/categoriesData';
import { US_STATES_LIST, getStateFullName } from '../utils/locationUtils';

export interface FilterState {
  categoryId: string;
  subcategoryId: string;
  minPrice: number;
  maxPrice: number;
  conditions: ProductCondition[];
  gradeLevels: string[];
  localPickupOnly: boolean;
  freeShippingOnly: boolean;
  verifiedOnly: boolean;
  selectedState: string;
  cityOrZip?: string;
  maxDistance: number;
  minRating: number;
}

interface SearchAndFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
  userZip: string;
}

const ALL_CONDITIONS: ProductCondition[] = ['Brand New', 'Like New', 'Gently Used', 'Fair'];
const ALL_GRADES = ['Pre-K', 'K-2', '3-5', '6-8', '9-12', 'Higher Ed'];
const POPULAR_STATES = ['OK', 'TX', 'NY', 'CA', 'FL', 'IL'];

export const SearchAndFilterSidebar: React.FC<SearchAndFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
  userZip,
}) => {
  const activeCat = CATEGORIES.find((c) => c.id === filters.categoryId);

  const toggleCondition = (cond: ProductCondition) => {
    const currentConditions = Array.isArray(filters.conditions) ? filters.conditions : [];
    const updated = currentConditions.includes(cond)
      ? currentConditions.filter((c) => c !== cond)
      : [...currentConditions, cond];
    onFilterChange({ ...filters, conditions: updated });
  };

  const toggleGrade = (grade: string) => {
    const currentGrades = Array.isArray(filters.gradeLevels) ? filters.gradeLevels : [];
    const updated = currentGrades.includes(grade)
      ? currentGrades.filter((g) => g !== grade)
      : [...currentGrades, grade];
    onFilterChange({ ...filters, gradeLevels: updated });
  };

  return (
    <aside id="filters-sidebar" className="bg-white rounded-lg border border-slate-200 p-3 space-y-3 shadow-xs text-left">
      {/* Header with clear filters */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-700" />
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-800">Filters</h3>
          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded">
            {totalResults}
          </span>
        </div>

        <button
          onClick={onResetFilters}
          className="text-[10px] font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors uppercase tracking-wider"
          title="Reset all filters"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Verified Educator Guarantee Toggle */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-md p-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
            className="mt-0.5 rounded text-blue-700 focus:ring-blue-500 border-slate-300"
          />
          <div className="text-[10.5px]">
            <span className="font-bold text-blue-950 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Teachers Only
            </span>
            <p className="text-[9.5px] text-blue-800/80 mt-0.5">
              Items from authenticated US educators.
            </p>
          </div>
        </label>
      </div>

      {/* Categories & Subcategories Tree */}
      <div>
        <h4 className="text-[9.5px] font-black text-slate-400 uppercase mb-1 tracking-widest">
          Category
        </h4>
        <select
          value={filters.categoryId}
          onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value, subcategoryId: '' })}
          className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:outline-none focus:border-blue-600"
        >
          <option value="">All Categories ({(CATEGORIES || []).reduce((acc, c) => acc + (c?.itemCount || 0), 0)})</option>
          {(CATEGORIES || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.itemCount})
            </option>
          ))}
        </select>

        {activeCat && activeCat.subcategories.length > 0 && (
          <div className="pt-1.5 pl-2 border-l-2 border-blue-300 mt-1.5 space-y-0.5">
            <span className="text-[9.5px] font-bold text-slate-400 block uppercase tracking-wider">
              Subcategory:
            </span>
            <button
              onClick={() => onFilterChange({ ...filters, subcategoryId: '' })}
              className={`block text-[11px] w-full text-left py-0.5 px-1.5 rounded ${
                !filters.subcategoryId ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All {activeCat.name}
            </button>
            {activeCat.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onFilterChange({ ...filters, subcategoryId: sub.id })}
                className={`block text-[11px] w-full text-left py-0.5 px-1.5 rounded flex items-center justify-between ${
                  filters.subcategoryId === sub.id
                    ? 'bg-blue-100 text-blue-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{sub.name}</span>
                <span className="text-[9px] text-slate-400">{sub.itemCount}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest">
            Price Range
          </h4>
          <span className="text-[11px] font-bold text-slate-900">
            ${filters.minPrice} - ${filters.maxPrice >= 300 ? '300+' : filters.maxPrice}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice === 0 ? '' : filters.minPrice}
            onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) || 0 })}
            className="w-1/2 text-[11px] border border-slate-200 rounded p-1 text-slate-800 bg-slate-50 focus:outline-none"
          />
          <span className="text-slate-300">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) || 300 })}
            className="w-1/2 text-[11px] border border-slate-200 rounded p-1 text-slate-800 bg-slate-50 focus:outline-none"
          />
        </div>
        <input
          type="range"
          min={0}
          max={300}
          step={5}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-700 h-1.5"
        />
      </div>

      {/* Location / State, City & ZIP Code Filter */}
      <div className="pt-1.5 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-500" /> Location / State, City, ZIP
          </h4>
          <span className="text-[9.5px] font-bold text-slate-400">HQ: 73159</span>
        </div>

        {/* State Select Dropdown (All 50 States + DC) */}
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
            US State
          </label>
          <select
            id="sidebar-state-filter"
            value={filters.selectedState}
            onChange={(e) => onFilterChange({ ...filters, selectedState: e.target.value })}
            className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="">All 50 US States & Territories</option>
            {US_STATES_LIST.map((st) => (
              <option key={st.code} value={st.code}>
                {st.name} ({st.code})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Popular State Chips */}
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[9px] text-slate-400 font-medium">Quick:</span>
          {POPULAR_STATES.map((st) => {
            const isSelected = filters.selectedState === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onFilterChange({ ...filters, selectedState: isSelected ? '' : st })}
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={getStateFullName(st)}
              >
                {st}
              </button>
            );
          })}
          {filters.selectedState && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, selectedState: '' })}
              className="text-[9px] text-red-500 hover:underline font-semibold ml-auto cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* City or Zip Code Filter Input */}
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
            City or ZIP Code
          </label>
          <div className="relative">
            <input
              id="sidebar-city-zip-filter"
              type="text"
              placeholder="e.g. Oklahoma City, Dallas, 73159..."
              value={filters.cityOrZip || ''}
              onChange={(e) => onFilterChange({ ...filters, cityOrZip: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded p-1.5 pl-6 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
            {filters.cityOrZip && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, cityOrZip: '' })}
                className="absolute right-1.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Distance Slider */}
        <div className="space-y-0.5 pt-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">Local Radius:</span>
            <span className="font-bold text-slate-800">
              {filters.maxDistance >= 500 ? 'Any distance' : `Within ${filters.maxDistance} mi`}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={500}
            step={25}
            value={filters.maxDistance}
            onChange={(e) => onFilterChange({ ...filters, maxDistance: Number(e.target.value) })}
            className="w-full accent-blue-700 h-1.5"
          />
        </div>
      </div>

      {/* Shipping & Delivery Options */}
      <div className="pt-1.5 border-t border-slate-100">
        <h4 className="text-[9.5px] font-black text-slate-400 uppercase mb-1 tracking-widest">
          Delivery Options
        </h4>
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={filters.localPickupOnly}
              onChange={(e) => onFilterChange({ ...filters, localPickupOnly: e.target.checked })}
              className="rounded text-blue-700 focus:ring-blue-500 border-slate-300"
            />
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-500" /> Local School Pickup
            </span>
          </label>

          <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={filters.freeShippingOnly}
              onChange={(e) => onFilterChange({ ...filters, freeShippingOnly: e.target.checked })}
              className="rounded text-blue-700 focus:ring-blue-500 border-slate-300"
            />
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-emerald-600" /> Free Shipping
            </span>
          </label>
        </div>
      </div>

      {/* Condition Filter */}
      <div className="pt-1.5 border-t border-slate-100">
        <h4 className="text-[9.5px] font-black text-slate-400 uppercase mb-1 tracking-widest">
          Condition
        </h4>
        <div className="grid grid-cols-2 gap-1">
          {ALL_CONDITIONS.map((cond) => (
            <label
              key={cond}
              className="flex items-center gap-1.5 text-[10.5px] text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={filters.conditions.includes(cond)}
                onChange={() => toggleCondition(cond)}
                className="rounded text-blue-700 focus:ring-blue-500 border-slate-300"
              />
              <span className="font-medium">{cond}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Grade Level Filter */}
      <div className="pt-1.5 border-t border-slate-100">
        <h4 className="text-[9.5px] font-black text-slate-400 uppercase mb-1 tracking-widest">
          Grade Level
        </h4>
        <div className="flex flex-wrap gap-1">
          {ALL_GRADES.map((grade) => {
            const isSelected = filters.gradeLevels.includes(grade);
            return (
              <button
                key={grade}
                type="button"
                onClick={() => toggleGrade(grade)}
                className={`text-[9.5px] px-1.5 py-0.5 rounded border font-bold uppercase transition-colors ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
      </div>

      {/* Marketplace Info Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-md p-2 text-[10px] text-slate-700 space-y-0.5">
        <div className="font-bold flex items-center gap-1 text-slate-900 uppercase tracking-wider text-[9px]">
          <Building2 className="w-3 h-3 text-blue-700" /> Marketplace HQ
        </div>
        <p className="text-slate-600 leading-tight">9905 S Pennsylvania Ave Ste A</p>
        <p className="text-slate-600 leading-tight">Oklahoma City, OK 73159, USA</p>
      </div>
    </aside>
  );
};
