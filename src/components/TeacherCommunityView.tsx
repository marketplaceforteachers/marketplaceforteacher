import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  Sparkles,
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  Share2,
  Tag,
  X,
  BookOpen,
  Cpu,
  Palette,
  Lightbulb,
  Award,
} from 'lucide-react';
import { CommunityThread, CommunityCategory, User } from '../types';

interface TeacherCommunityViewProps {
  threads: CommunityThread[];
  currentUser: User;
  onUpvoteThread?: (threadId: string) => void;
  onAddReply?: (threadId: string, replyText: string) => void;
  onCreateThread?: (title: string, content: string, category: CommunityCategory, tags: string[]) => void;
}

export const TeacherCommunityView: React.FC<TeacherCommunityViewProps> = ({
  threads,
  currentUser,
  onUpvoteThread,
  onAddReply,
  onCreateThread,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<CommunityThread | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Form state for creating thread
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityCategory>('Classroom Ideas');
  const [newTags, setNewTags] = useState('');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Discussion Boards', icon: '💬' },
    { id: 'Classroom Ideas', label: 'Classroom Ideas', icon: '💡' },
    { id: 'Lesson Planning', label: 'Lesson Planning', icon: '📚' },
    { id: 'Classroom Management', label: 'Classroom Management', icon: '🍎' },
    { id: 'EdTech & AI', label: 'EdTech & AI Tools', icon: '⚡' },
    { id: 'STEM & Science', label: 'STEM & Science Labs', icon: '🔬' },
    { id: 'Reading & Literacy', label: 'Reading & Literacy', icon: '📖' },
    { id: 'Art & Decor', label: 'Art & Room Decor', icon: '🎨' },
    { id: 'Grants & Fundraising', label: 'Grants & Funding', icon: '🏆' },
  ];

  const filteredThreads = threads.filter((th) => {
    const matchesCategory = activeCategory === 'all' || th.category === activeCategory;
    const matchesQuery =
      th.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      th.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      th.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim() || !onAddReply) return;
    onAddReply(selectedThread.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !onCreateThread) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onCreateThread(newTitle.trim(), newContent.trim(), newCategory, tagsArray);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/40 text-amber-300 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            Teacher Community & Peer Collaboration
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ask Questions, Share Strategies & Swap Wisdom
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            A safe, verified space for K-12 and higher-ed educators to discuss classroom management, lesson ideas, AI lesson differentiation, grant deadlines, and supply care.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Start a New Discussion Thread
            </button>
            <span className="text-xs text-blue-200 font-medium">
              🛡️ Only verified educators can mark official best solutions
            </span>
          </div>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search discussion topics, lesson questions, grant tips, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                activeCategory === c.id
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{c.icon} {c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.map((th) => (
          <div
            key={th.id}
            onClick={() => setSelectedThread(th)}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <img
                  src={th.authorAvatar}
                  alt={th.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-slate-900">{th.authorName}</span>
                    {th.authorVerified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                    {th.authorBadge && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {th.authorBadge}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500">{th.authorSchool}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug mt-1 flex items-center gap-2">
                    {th.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    <span>{th.title}</span>
                  </h3>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full shrink-0 border border-blue-100">
                {th.category}
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pl-13">
              {th.content}
            </p>

            {/* Tags & Action Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 pl-13">
              <div className="flex items-center gap-1.5 flex-wrap">
                {th.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 font-bold">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvoteThread?.(th.id);
                  }}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{th.upvotes}</span>
                </button>

                <span className="flex items-center gap-1 text-slate-600">
                  <MessageSquare className="w-4 h-4" />
                  <span>{th.repliesCount || th.replies.length} Replies</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thread Detail Modal */}
      {selectedThread && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedThread.authorAvatar}
                  alt={selectedThread.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedThread.title}</h3>
                  <p className="text-xs text-slate-500">
                    Posted by {selectedThread.authorName} • {selectedThread.authorSchool}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedThread(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedThread.content}
            </p>

            {/* Replies List */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Teacher Answers & Discussion ({selectedThread.replies.length})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {selectedThread.replies.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${
                      rep.isTeacherVerifiedAnswer
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rep.authorAvatar}
                          alt={rep.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-bold text-slate-900">{rep.authorName}</span>
                        {rep.isTeacherVerifiedAnswer && (
                          <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Verified Solution
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rep.authorSchool}</span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleReplySubmit} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Contribute your experience or advice..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Post Answer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create New Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-55 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">New Community Discussion</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topic Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best way to label and rotate math manipulatives?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Board</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CommunityCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold bg-white"
                >
                  {categories.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question / Strategy Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Describe what you are trying to solve or share with colleagues..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Math, Manipulatives, 3rd Grade"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-black bg-blue-900 hover:bg-blue-800 text-white"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
