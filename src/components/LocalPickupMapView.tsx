import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  School,
  ShieldCheck,
  Search,
  Filter,
  Package,
  Clock,
  Car,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { Product, User } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

interface LocalPickupMapViewProps {
  products?: Product[];
  currentUser?: User;
  userZip?: string;
  onOpenProductDetail?: (productId: string) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
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

export const LocalPickupMapView: React.FC<LocalPickupMapViewProps> = ({
  products = MOCK_PRODUCTS,
  currentUser = DEFAULT_GUEST_USER,
  userZip = '73159',
  onOpenProductDetail,
  onSelectProduct,
  onAddToCart,
}) => {
  const safeProducts = Array.isArray(products) && products.length > 0 ? products : MOCK_PRODUCTS;
  const [selectedRadius, setSelectedRadius] = useState<number>(25);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [activeListing, setActiveListing] = useState<Product | null>(safeProducts[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);

  // Filter local pickup eligible products
  const pickupProducts = safeProducts.filter((p) => {
    if (!p) return false;
    const allowsPickup = p.shippingOptions?.localPickup ?? true;
    const title = p.title || '';
    const city = p.location?.city || '';
    const school = p.sellerSchool || '';
    const district = p.sellerDistrict || '';

    const matchesQuery =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict =
      selectedDistrict === 'all' ||
      district.toLowerCase().includes(selectedDistrict.toLowerCase());
    const matchesFree = !filterFreeOnly || p.price === 0;

    // Simulated distance calculation based on radius
    const dist = p.location?.distanceMiles ?? Math.floor(Math.random() * 30) + 3;
    const matchesRadius = dist <= selectedRadius;

    return allowsPickup && matchesQuery && matchesDistrict && matchesFree && matchesRadius;
  });

  const districts = ['all', 'Moore Public Schools', 'Norman Public Schools', 'Oklahoma City Public Schools', 'Edmond Public Schools'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600/50 text-emerald-300 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            Interactive Local School Pickup Map
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Find Surplus Supplies in Neighboring Schools
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Eliminate shipping costs and packaging waste by picking up heavy furniture, classroom books, and STEM kits directly at verified school front offices and district depots.
          </p>

          <div className="flex items-center gap-4 text-xs pt-1 text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Safe Campus Front-Desk Exchange
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Car className="w-4 h-4 text-blue-400" /> 0 Shipping Fees
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Radius, District, Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search nearby supplies (e.g. rugs, lab glassware, math tiles)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Radius:</span>
            <select
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(Number(e.target.value))}
              className="font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value={5}>Within 5 miles</option>
              <option value={15}>Within 15 miles</option>
              <option value={25}>Within 25 miles</option>
              <option value={50}>Within 50 miles</option>
              <option value={100}>Within 100 miles</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Districts' : d}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setFilterFreeOnly(!filterFreeOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              filterFreeOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            🎁 Free Only
          </button>
        </div>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Map Visual Stage (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-800 relative h-[480px] flex flex-col justify-between p-4">
          {/* Simulated Map Canvas Texture & Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          {/* Top Map HUD */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-slate-950/90 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-2 shadow-lg">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>Center: ZIP {userZip} (Oklahoma City Metro)</span>
            </div>

            <div className="bg-blue-900/90 text-white px-2.5 py-1 rounded-lg border border-blue-600/50 text-[11px] font-extrabold shadow-sm">
              {pickupProducts.length} Pickup Points Found
            </div>
          </div>

          {/* Interactive School Map Markers */}
          <div className="relative z-10 h-64 w-full flex items-center justify-center">
            {/* Pulsing center radar */}
            <div className="absolute w-48 h-48 rounded-full border border-blue-500/30 animate-ping pointer-events-none" />
            <div className="absolute w-72 h-72 rounded-full border border-blue-500/20 pointer-events-none" />

            {/* School Pins Scattered Realistically */}
            {pickupProducts.slice(0, 8).map((prod, idx) => {
              const isSelected = activeListing?.id === prod.id;
              // Deterministic pseudo coordinates
              const topOffset = 25 + ((idx * 27) % 55);
              const leftOffset = 20 + ((idx * 33) % 65);

              return (
                <div
                  key={prod.id}
                  style={{ top: `${topOffset}%`, left: `${leftOffset}%` }}
                  onClick={() => setActiveListing(prod)}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                >
                  <div
                    className={`relative p-2 rounded-2xl transition-transform duration-200 ${
                      isSelected
                        ? 'bg-red-600 text-white scale-125 shadow-xl ring-4 ring-red-400/50'
                        : 'bg-blue-900 text-white hover:scale-110 shadow-md border border-blue-500/50'
                    }`}
                  >
                    <School className="w-4 h-4" />
                    {prod.price === 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
                    )}
                  </div>

                  {/* Marker Tooltip on Hover / Selected */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-slate-950 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold border border-slate-700 shadow-xl pointer-events-none ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity`}
                  >
                    <span className="text-amber-300 font-bold">${prod.price}</span> • {prod.sellerSchool}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 bg-slate-950/90 text-slate-300 p-2.5 rounded-xl border border-slate-800 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-blue-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Verified School Campus
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Free Classroom Donation
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Click any marker to inspect</span>
          </div>
        </div>

        {/* Selected Listing Detailed Card & List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeListing ? (
            <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-md space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={activeListing.images[0]}
                    alt={activeListing.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Local Pickup Ready
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug mt-1">
                      {activeListing.title}
                    </h3>
                    <p className="text-xs font-black text-blue-950 mt-0.5">
                      {activeListing.price === 0 ? '🎁 Free Donation ($0)' : `$${activeListing.price.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* School Pickup Location Details */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-extrabold text-slate-900">
                  <School className="w-4 h-4 text-blue-700" />
                  <span>{activeListing.sellerSchool}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{activeListing.location.city}, {activeListing.location.state} {activeListing.location.zip}</span>
                  <span className="text-blue-600 font-bold ml-auto">
                    ~{activeListing.location.distanceMiles || 8} miles away
                  </span>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg text-[11px] font-medium border border-emerald-200">
                  <strong>Safe Campus Pickup:</strong> Front reception security desk check-in. Zero stranger home visits.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                {onAddToCart && (
                  <button
                    onClick={() => onAddToCart(activeListing)}
                    className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5" />
                    Reserve for Local Pickup
                  </button>
                )}

                {(onOpenProductDetail || onSelectProduct) && (
                  <button
                    onClick={() => {
                      if (onOpenProductDetail) onOpenProductDetail(activeListing.id);
                      if (onSelectProduct) onSelectProduct(activeListing);
                    }}
                    className="p-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Inspect
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Select a school pin on the map to see pickup logistics.
            </div>
          )}

          {/* Quick List of Nearby Supplies */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Nearby Campus Listings ({pickupProducts.length})
            </h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto divide-y divide-slate-100">
              {pickupProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setActiveListing(prod)}
                  className={`pt-2 pb-1.5 px-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    activeListing?.id === prod.id ? 'bg-blue-50/80 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{prod.title}</p>
                      <p className="text-[10px] text-slate-500">{prod.sellerSchool}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-blue-950">
                    {prod.price === 0 ? 'Free' : `$${prod.price}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
