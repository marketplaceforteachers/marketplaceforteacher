import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Heart,
  Share2,
  Tag,
  Search,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
} from 'lucide-react';
import { EducatorArticle } from '../types';
import { INITIAL_ARTICLES } from '../data/articlesData';

interface MarketplaceNewsViewProps {
  articles?: EducatorArticle[];
  onSelectArticleTag?: (tag: string) => void;
}

export const MarketplaceNewsView: React.FC<MarketplaceNewsViewProps> = ({
  articles = INITIAL_ARTICLES,
  onSelectArticleTag,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<EducatorArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['all', 'Teaching Tips', 'Classroom Ideas', 'Grants & Funding', 'Product Reviews'];

  const filteredArticles = articles.filter((art) => {
    const matchesCat = activeCategory === 'all' || art.category === activeCategory;
    const matchesQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesQuery;
  });

  const handleShare = (art: EducatorArticle) => {
    navigator.clipboard.writeText(`https://marketplaceforteachers.com/news/${art.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600/50 text-amber-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            Marketplace News & Educator Insights
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Classroom Budgeting Guides, Grants & Practical Teaching Hacks
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Written by practicing Master Teachers, CPAs, and literacy specialists to help you maximize your budget, maintain STEM apparatus, and navigate classroom grants.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by topic, tax deduction, STEM, grants, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full md:w-auto py-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                activeCategory === c
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c === 'all' ? 'All Articles' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer group"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={art.featuredImage}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20">
                {art.category}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                  <span>{art.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={art.authorAvatar}
                    alt={art.author}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-[11px] block">{art.author}</span>
                  </div>
                </div>

                <span className="text-blue-900 font-bold flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 pb-2">
                <img
                  src={selectedArticle.authorAvatar}
                  alt={selectedArticle.author}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <span className="font-bold text-slate-900 block">{selectedArticle.author}</span>
                  <span className="text-[10px]">{selectedArticle.authorTitle} • {selectedArticle.date}</span>
                </div>
              </div>

              <img
                src={selectedArticle.featuredImage}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover rounded-xl border border-slate-200"
              />
            </div>

            {/* Content Body */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {selectedArticle.content}
            </div>

            {/* Tags & Share */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedArticle.tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      if (onSelectArticleTag) {
                        onSelectArticleTag(t);
                      } else {
                        setSearchQuery(t);
                        setSelectedArticle(null);
                      }
                    }}
                    className="bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-700 px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    #{t}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleShare(selectedArticle)}
                className="py-2 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedLink ? 'Link Copied!' : 'Share Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
