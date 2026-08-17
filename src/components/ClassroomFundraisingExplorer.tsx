import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Users,
  Calendar,
  Heart,
  DollarSign,
  Share2,
  CheckCircle2,
  PlusCircle,
  X,
  School,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { ClassroomProject, User } from '../types';
import { INITIAL_PROJECTS } from '../data/classroomProjectsData';

interface ClassroomFundraisingExplorerProps {
  projects?: ClassroomProject[];
  currentUser?: User;
  onDonateToProject?: (projectId: string, amount: number, donorName: string, comment: string) => void;
  onDonate?: (project: ClassroomProject, amount: number) => void;
  onCreateProjectClick?: () => void;
  onCreateProject?: () => void;
}

const DEFAULT_GUEST_USER: User = {
  id: 'usr-guest',
  name: 'Anonymous Donor',
  email: 'donor@marketplaceforteachers.com',
  role: 'guest',
  schoolName: 'Classroom Benefactor',
  state: 'OK',
  city: 'Oklahoma City',
  zip: '73159',
  rating: 5.0,
  reviewCount: 0,
  salesCount: 0,
  verified: false,
  verifiedTeacher: false,
};

export const ClassroomFundraisingExplorer: React.FC<ClassroomFundraisingExplorerProps> = ({
  projects = INITIAL_PROJECTS,
  currentUser = DEFAULT_GUEST_USER,
  onDonateToProject,
  onDonate,
  onCreateProjectClick,
  onCreateProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ClassroomProject | null>(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('50');
  const [donorName, setDonorName] = useState(currentUser?.name || 'Anonymous Donor');
  const [donorComment, setDonorComment] = useState('Proud to invest in our future scientists!');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    'all',
    'STEM Lab',
    'Reading Corner',
    'Art Supplies',
    'Music Equipment',
    'Sensory & Calming',
    'Robotics & Tech',
    'Classroom Garden',
  ];

  const listToFilter = Array.isArray(projects) && projects.length > 0 ? projects : INITIAL_PROJECTS;

  const filteredProjects = listToFilter.filter((p) => {
    if (!p) return false;
    return selectedCategory === 'all' || p.category === selectedCategory;
  });

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const amount = parseFloat(donationAmount) || 50;
    if (onDonateToProject) {
      onDonateToProject(selectedProject.id, amount, donorName, donorComment);
    }
    if (onDonate) {
      onDonate(selectedProject, amount);
    }
    setShowDonateModal(false);
  };

  const handleShare = (p: ClassroomProject) => {
    navigator.clipboard.writeText(`https://marketplaceforteachers.com/projects/${p.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-700/60 border border-indigo-500/40 text-amber-300 text-xs font-bold">
            <Target className="w-3.5 h-3.5" />
            Classroom Grant & Project Crowdfunding
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Fund Hands-On Classroom Transformations
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Directly fund STEM MakerSpaces, calming sensory rooms, classroom book libraries, robotics clubs, and music instruments proposed by verified classroom teachers with zero middleman administrative cuts.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {currentUser?.role === 'teacher' && (onCreateProjectClick || onCreateProject) && (
              <button
                onClick={() => (onCreateProjectClick ? onCreateProjectClick() : onCreateProject?.())}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Submit a Classroom Project Grant
              </button>
            )}
            <span className="text-xs text-blue-200 font-medium">
              ⚡ 100% of community contributions go directly to supply procurement
            </span>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Projects' : cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredProjects.map((p) => {
          const pct = Math.min(100, Math.round((p.raisedAmount / (p.goalAmount || 1)) * 100));
          const isFunded = pct >= 100;

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row"
            >
              {/* Image side */}
              <div className="md:w-5/12 relative h-48 md:h-auto bg-slate-100 shrink-0 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-blue-950/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {p.category}
                </div>
                {isFunded && (
                  <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" /> Fully Funded!
                  </div>
                )}
              </div>

              {/* Content side */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src={p.teacherAvatar}
                      alt={p.teacherName}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-extrabold text-slate-900">{p.teacherName}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500">{p.schoolName}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Progress Stats */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-black text-slate-900 text-sm">
                      ${p.raisedAmount.toLocaleString()} <span className="text-slate-400 text-xs font-normal">raised</span>
                    </span>
                    <span className="font-bold text-slate-500">${p.goalAmount.toLocaleString()} Goal</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFunded
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{pct}% Funded • {p.donorsCount} Supporters</span>
                    <span>{p.daysLeft > 0 ? `${p.daysLeft} days left` : 'Completed'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedProject(p)}
                    className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Project & Budget</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProject(p);
                      setShowDonateModal(true);
                    }}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    Donate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProject.teacherAvatar}
                  alt={selectedProject.teacherName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedProject.teacherName}</h2>
                    {selectedProject.teacherVerified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                        Verified Faculty
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedProject.schoolName} • {selectedProject.city}, {selectedProject.state}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-900">{selectedProject.title}</h3>
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-56 object-cover rounded-xl border border-slate-100"
              />
              <p className="text-xs text-slate-700 leading-relaxed">{selectedProject.description}</p>
            </div>

            {/* Impact Story */}
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Classroom Impact</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedProject.impactStory}</p>
            </div>

            {/* Itemized Budget Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Transparent Supply Budget Breakdown
              </h4>
              <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200/60 overflow-hidden text-xs">
                {selectedProject.budgetBreakdown.map((b, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between font-semibold">
                    <span className="text-slate-800">{b.item}</span>
                    <span className="font-extrabold text-blue-950">${b.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Updates */}
            {selectedProject.updates && selectedProject.updates.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Teacher Project Updates ({selectedProject.updates.length})
                </h4>
                {selectedProject.updates.map((u) => (
                  <div key={u.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{u.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{u.date}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{u.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Donors List */}
            {selectedProject.donors && selectedProject.donors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Donors & Supporters ({selectedProject.donors.length})
                </h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs">
                  {selectedProject.donors.map((d) => (
                    <div key={d.id} className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{d.donorName}</span>
                        {d.comment && <p className="text-[11px] text-slate-600 italic">"{d.comment}"</p>}
                      </div>
                      <span className="font-extrabold text-emerald-700">${d.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDonateModal(true)}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                Donate to This Classroom Project
              </button>

              <button
                onClick={() => handleShare(selectedProject)}
                className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedLink ? 'Link Copied!' : 'Share Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donate Modal */}
      {showDonateModal && selectedProject && (
        <div className="fixed inset-0 z-55 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Contribute to Classroom Goal</h3>
                  <p className="text-xs text-slate-500">{selectedProject.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDonateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDonateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Donation Tier</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['25', '50', '100', '250'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setDonationAmount(amt)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                        donationAmount === amt
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
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold"
                  placeholder="Custom Amount"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Words of Support for the Class</label>
                <textarea
                  value={donorComment}
                  onChange={(e) => setDonorComment(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                />
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
                  Confirm Contribution (${donationAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
