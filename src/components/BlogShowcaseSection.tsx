import React from 'react';
import { Newspaper, ArrowRight, Clock, Sparkles, BookOpen } from 'lucide-react';
import { EducatorArticle } from '../types';

interface BlogShowcaseSectionProps {
  articles: EducatorArticle[];
  onSelectArticle: (article: EducatorArticle) => void;
  onViewAllArticles: () => void;
}

export const BlogShowcaseSection: React.FC<BlogShowcaseSectionProps> = ({
  articles,
  onSelectArticle,
  onViewAllArticles,
}) => {
  // Only show published articles, limit to top 3 for homepage showcase
  const publishedArticles = articles
    .filter((a) => a.status === 'published' || !a.status)
    .slice(0, 3);

  if (publishedArticles.length === 0) return null;

  return (
    <section id="blog-showcase-section" className="py-10 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" />
                Educator Blog & Community News
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Classroom Guides, Grants & Tax Insights
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Practical classroom tax tips, STEM lab budget hacks, and upcoming educator grants curated by certified teachers.
            </p>
          </div>

          <button
            onClick={onViewAllArticles}
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Column Article Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/20 shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                {/* Author & Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={article.authorAvatar}
                      alt={article.author}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{article.author}</p>
                      <p className="text-[10px] text-slate-500 truncate">{article.authorTitle || 'Educator'}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
