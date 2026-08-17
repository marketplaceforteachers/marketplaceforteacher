import React, { useState } from 'react';
import {
  School,
  Search,
  MapPin,
  Users,
  Package,
  Heart,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { SchoolDirectoryItem, User } from '../types';

interface SchoolDirectoryViewProps {
  schools: SchoolDirectoryItem[];
  currentUser: User;
  onSelectSchool?: (school: SchoolDirectoryItem) => void;
  onOpenTeacherProfile?: (teacherId: string) => void;
}

export const SchoolDirectoryView: React.FC<SchoolDirectoryViewProps> = ({
  schools,
  currentUser,
  onSelectSchool,
  onOpenTeacherProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolDirectoryItem | null>(null);

  const filteredSchools = schools.filter((sch) => {
    const matchesQuery =
      sch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.zip.includes(searchQuery);

    const matchesState = selectedState === 'all' || sch.state.toLowerCase() === selectedState.toLowerCase();
    const matchesType = selectedType === 'all' || sch.schoolType.toLowerCase() === selectedType.toLowerCase();

    return matchesQuery && matchesState && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600/50 text-amber-300 text-xs font-bold">
            <School className="w-3.5 h-3.5" />
            School Directory & District Network
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Connect Directly with Schools in Your District
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Browse verified faculty, view active classroom surplus listings by school building, support campus wishlists, and arrange safe intra-district supply transfers.
          </p>

          <div className="flex items-center gap-4 text-xs pt-1 text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% District-Authenticated Faculty
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search school name, school district, city, or ZIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All States</option>
            <option value="OK">Oklahoma (OK)</option>
            <option value="TX">Texas (TX)</option>
            <option value="VA">Virginia (VA)</option>
            <option value="IL">Illinois (IL)</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All School Types</option>
            <option value="Elementary">Elementary Schools</option>
            <option value="Middle">Middle / Junior High</option>
            <option value="High">High Schools</option>
          </select>
        </div>
      </div>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            onClick={() => setSelectedSchool(school)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  {school.schoolType} School
                </span>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-base leading-snug">
                  {school.name}
                </h3>
                <p className="text-xs text-blue-900 font-bold mt-0.5">{school.district}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{school.city}, {school.state} {school.zip}</span>
                </div>
              </div>
            </div>

            {/* School Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-500 font-medium block">Faculty</span>
                <span className="font-black text-slate-900 text-xs">{school.teacherCount}</span>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <span className="text-[10px] text-blue-700 font-medium block">Surplus</span>
                <span className="font-black text-blue-950 text-xs">{school.activeListingsCount} Items</span>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg">
                <span className="text-[10px] text-rose-700 font-medium block">Wishlists</span>
                <span className="font-black text-rose-950 text-xs">{school.activeWishlistsCount}</span>
              </div>
            </div>

            <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
              <span>View Faculty & Marketplace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* School Detail Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-900 text-white rounded-2xl">
                  <School className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">{selectedSchool.name}</h2>
                  <p className="text-xs text-blue-900 font-bold">{selectedSchool.district}</p>
                  <p className="text-xs text-slate-500">{selectedSchool.address}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* School Contact Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Department Email</span>
                  <span className="font-bold text-slate-800">{selectedSchool.contactEmail}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Main Office Phone</span>
                  <span className="font-bold text-slate-800">{selectedSchool.phone}</span>
                </div>
              </div>
            </div>

            {/* Verified Faculty Sellers List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Verified Campus Faculty Sellers ({selectedSchool.teachers?.length || 0})
                </h4>
                <span className="text-[10px] text-emerald-600 font-bold">Safe Inter-School Courier</span>
              </div>

              {selectedSchool.teachers && selectedSchool.teachers.length > 0 ? (
                <div className="space-y-2">
                  {selectedSchool.teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            teacher.avatar ||
                            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                            <span>{teacher.name}</span>
                            {teacher.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{teacher.subject} • {teacher.grade}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg">
                          {teacher.listingsCount} Listings
                        </span>
                        <button
                          onClick={() => {
                            if (onOpenTeacherProfile) {
                              setSelectedSchool(null);
                              onOpenTeacherProfile(teacher.id);
                            }
                          }}
                          className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  No faculty sellers currently listed from this campus. Invite colleagues to earn 200 Reward Points!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
