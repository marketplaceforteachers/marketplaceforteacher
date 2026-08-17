import React, { useState } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Tag,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Share2,
  HelpCircle,
  Layers,
  Power,
  Sliders,
  Check,
  Globe,
  FileText
} from 'lucide-react';
import { EducatorArticle, SiteSettings } from '../../types';

interface AdminBlogManagerProps {
  articles: EducatorArticle[];
  onUpdateArticles: (articles: EducatorArticle[]) => void;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onSelectArticle?: (article: EducatorArticle) => void;
  onNavigateToView?: (view: string) => void;
}

const CATEGORIES: Array<EducatorArticle['category']> = [
  'Teaching Tips',
  'Classroom Ideas',
  'Grants & Funding',
  'Product Reviews',
  'Seasonal Guides',
  'District Purchasing',
  'STEM Innovations',
];

const PRESET_IMAGES = [
  { label: 'Books & Literacy', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1000&auto=format&fit=crop&q=80' },
  { label: 'STEM & Robotics Lab', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Teacher Grants & Taxes', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Classroom Decor & Desks', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Elementary Math & Art', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=80' },
  { label: 'High School Lab Equipment', url: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=1000&auto=format&fit=crop&q=80' },
];

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({
  articles,
  onUpdateArticles,
  siteSettings,
  onUpdateSiteSettings,
  onSelectArticle,
  onNavigateToView,
}) => {
  const isBlogEnabled = siteSettings.featureModules?.enableBlog ?? true;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [editingArticle, setEditingArticle] = useState<EducatorArticle | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<EducatorArticle | null>(null);
  const [editorTab, setEditorTab] = useState<'content' | 'seo' | 'preview'>('content');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Toggle Blog Module On/Off globally
  const handleToggleBlogModule = () => {
    const nextState = !isBlogEnabled;
    const updatedModules = {
      ...(siteSettings.featureModules || {
        enableBlog: true,
        enableWishlists: true,
        enableFundraising: true,
        enableDistrictMap: true,
        enableBundles: true,
        enableCommunityForum: true,
        enableSchoolDirectory: true,
        enableRewardsClub: true,
        enableInspirationGallery: true,
        enableBuyerProtectionPage: true,
        enableDirectMessaging: true,
        enableProductReviews: true,
        enablePriceOffers: true,
        enableGuestCheckout: true,
        enableSchoolEmailVerification: true,
        enableTopAnnouncementBar: true,
      }),
      enableBlog: nextState,
    };

    onUpdateSiteSettings({
      ...siteSettings,
      featureModules: updatedModules,
    });
  };

  // Filtered articles list
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && (art.status === 'published' || !art.status)) ||
      (statusFilter === 'draft' && art.status === 'draft');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate metrics
  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.status === 'published' || !a.status).length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const totalLikes = articles.reduce((acc, a) => acc + (a.likes || 0), 0);
  const totalViews = articles.reduce((acc, a) => acc + (a.viewsCount || (a.likes || 1) * 14 + 48), 0);

  // Initialize new blank article
  const handleStartCreate = () => {
    const newArt: EducatorArticle = {
      id: `art-${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      category: 'Teaching Tips',
      author: 'Admin Editorial Team',
      authorTitle: 'National Board Certified Educator',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '4 min read',
      featuredImage: PRESET_IMAGES[0].url,
      tags: ['Educator Tips', 'Classroom Ideas'],
      likes: 0,
      viewsCount: 0,
      status: 'published',
      featured: false,
      content: `### Main Headline

Write your classroom article content here. You can use markdown styling, bullet points, and callouts.

#### Key Highlights for Teachers:
* Practical classroom application
* Budget-friendly strategies
* Verification and compliance notes
`,
      seoDescription: '',
      seoKeywords: ['teacher tips', 'classroom supplies'],
    };
    setEditingArticle(newArt);
    setIsCreatingNew(true);
    setEditorTab('content');
  };

  const handleEdit = (article: EducatorArticle) => {
    setEditingArticle({ ...article });
    setIsCreatingNew(false);
    setEditorTab('content');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog article?')) {
      const updated = articles.filter((a) => a.id !== id);
      onUpdateArticles(updated);
    }
  };

  const handleDuplicate = (article: EducatorArticle) => {
    const duplicated: EducatorArticle = {
      ...article,
      id: `art-${Date.now()}`,
      title: `${article.title} (Copy)`,
      slug: `${article.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      likes: 0,
      viewsCount: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    onUpdateArticles([duplicated, ...articles]);
  };

  const handleToggleStatus = (article: EducatorArticle) => {
    const nextStatus = (article.status === 'published' || !article.status) ? 'draft' : 'published';
    const updated = articles.map((a) =>
      a.id === article.id ? { ...a, status: nextStatus } : a
    );
    onUpdateArticles(updated);
  };

  const handleSaveArticle = () => {
    if (!editingArticle) return;
    if (!editingArticle.title.trim()) {
      alert('Please enter an article title.');
      return;
    }

    // Ensure slug is clean
    const cleanSlug = (editingArticle.slug || editingArticle.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const finalArticle: EducatorArticle = {
      ...editingArticle,
      slug: cleanSlug || `post-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };

    if (isCreatingNew) {
      onUpdateArticles([finalArticle, ...articles]);
    } else {
      onUpdateArticles(articles.map((a) => (a.id === finalArticle.id ? finalArticle : a)));
    }

    setEditingArticle(null);
    setIsCreatingNew(false);
  };

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(`https://marketplaceforteachers.com/?view=news&article=${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div id="admin-blog-manager" className="space-y-6">
      {/* Master Toggle Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isBlogEnabled 
          ? 'bg-gradient-to-r from-emerald-900/40 via-slate-900 to-slate-900 border-emerald-500/30' 
          : 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isBlogEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Educator Blog & Community Insights CMS</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isBlogEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {isBlogEnabled ? 'Module Active (ON)' : 'Module Disabled (OFF)'}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Publish high-ranking SEO educator guides, classroom tax deduction tips, grant deadlines, and teaching innovations. Turn this module on or off instantly across the entire website navigation and homepage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="toggle-blog-master-switch"
              onClick={handleToggleBlogModule}
              className={`px-5 py-3 rounded-xl font-black text-sm flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                isBlogEnabled
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
              }`}
            >
              <Power className="w-4 h-4" />
              {isBlogEnabled ? 'Turn Blog OFF' : 'Turn Blog ON'}
            </button>

            {isBlogEnabled && onNavigateToView && (
              <button
                onClick={() => onNavigateToView('news')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                title="View live blog on frontend"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                View Live Blog
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Articles</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{totalArticles}</p>
          <span className="text-[11px] text-slate-400">{publishedCount} published • {draftCount} drafts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Published Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{publishedCount}</p>
          <span className="text-[11px] text-slate-400">Live on public frontend</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Estimated Views</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-indigo-400 mt-2">{totalViews.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Organic educator traffic</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Educator Likes</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{totalLikes.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Teacher engagement</span>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tags, authors..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Categories ({articles.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({articles.filter((a) => a.category === cat).length})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-0.5 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({articles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'published' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            id="admin-create-new-blog-post-btn"
            onClick={handleStartCreate}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Write New Blog Post
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Article Title & Excerpt</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Author</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Engagement</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-bold text-slate-400">No blog articles match your criteria.</p>
                    <p className="text-xs mt-1">Try resetting your search query or create a new blog post.</p>
                    <button
                      onClick={handleStartCreate}
                      className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create Article
                    </button>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => {
                  const isPublished = article.status === 'published' || !article.status;
                  return (
                    <tr key={article.id} className="hover:bg-slate-800/50 transition-colors">
                      {/* Title & Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3.5">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0 mt-0.5"
                          />
                          <div className="min-w-0 max-w-md">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white text-sm hover:text-blue-400 transition-colors line-clamp-1">
                                {article.title || 'Untitled Article'}
                              </h3>
                              {article.featured && (
                                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-1.5 py-0.5 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">{article.excerpt}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {article.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.readTime}
                              </span>
                              <button
                                onClick={() => handleCopySlug(article.slug)}
                                className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors font-mono cursor-pointer"
                                title="Copy public URL"
                              >
                                {copiedSlug === article.slug ? (
                                  <span className="text-emerald-400 flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Copied!
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-0.5">
                                    <Copy className="w-3 h-3" /> /{article.slug}
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="bg-slate-800 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          {article.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={article.authorAvatar}
                            alt={article.author}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{article.author}</p>
                            <p className="text-[10px] text-slate-500">{article.authorTitle || 'Educator'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(article)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isPublished
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Published
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Draft
                            </>
                          )}
                        </button>
                      </td>

                      {/* Engagement */}
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-3 text-xs">
                          <span className="text-slate-300 font-semibold flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            {(article.viewsCount || (article.likes || 1) * 14 + 48).toLocaleString()}
                          </span>
                          <span className="text-slate-300 font-semibold flex items-center gap-1" title="Likes">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            {article.likes || 0}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewArticle(article)}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Preview Article"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(article)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate Article"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Article Editor Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isCreatingNew ? 'Create New Educator Blog Article' : `Edit: ${editingArticle.title || 'Untitled'}`}
                  </h3>
                  <p className="text-xs text-slate-400">Rich Markdown & SEO formatted for US educator search rankings</p>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs font-bold">
                <button
                  onClick={() => setEditorTab('content')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    editorTab === 'content' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Content Editor
                </button>
                <button
                  onClick={() => setEditorTab('seo')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    editorTab === 'seo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SEO & Meta
                </button>
                <button
                  onClick={() => setEditorTab('preview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    editorTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {editorTab === 'content' && (
                <>
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="font-bold text-slate-300">Article Title *</label>
                      <input
                        type="text"
                        value={editingArticle.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingArticle({
                            ...editingArticle,
                            title: val,
                            slug: isCreatingNew
                              ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                              : editingArticle.slug,
                          });
                        }}
                        placeholder="e.g. 10 High-Impact STEM Lab Hacks on a $200 Classroom Budget"
                        className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Category *</label>
                      <select
                        value={editingArticle.category}
                        onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Slug & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="font-bold text-slate-300">URL Slug (SEO friendly identifier)</label>
                      <div className="flex items-center">
                        <span className="bg-slate-800 text-slate-400 px-3 py-2 rounded-l-xl border border-r-0 border-slate-700 font-mono text-[11px]">
                          /news/
                        </span>
                        <input
                          type="text"
                          value={editingArticle.slug}
                          onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-3 py-2 rounded-r-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Publish Status</label>
                      <select
                        value={editingArticle.status || 'published'}
                        onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="published">🟢 Published (Live on Website)</option>
                        <option value="draft">🟡 Draft (Hidden from Public)</option>
                      </select>
                    </div>
                  </div>

                  {/* Author Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Author Name</label>
                      <input
                        type="text"
                        value={editingArticle.author}
                        onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Author Title / Role</label>
                      <input
                        type="text"
                        value={editingArticle.authorTitle || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, authorTitle: e.target.value })}
                        placeholder="e.g. 5th Grade Lead STEM Educator"
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Estimated Read Time</label>
                      <input
                        type="text"
                        value={editingArticle.readTime}
                        onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Featured Image & Presets */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-300">Featured Banner Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingArticle.featuredImage}
                        onChange={(e) => setEditingArticle({ ...editingArticle, featuredImage: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs"
                      />
                      {editingArticle.featuredImage && (
                        <img
                          src={editingArticle.featuredImage}
                          alt="preview"
                          className="w-12 h-9 object-cover rounded-lg border border-slate-700"
                        />
                      )}
                    </div>
                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 font-semibold">Quick Presets:</span>
                      {PRESET_IMAGES.map((img) => (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => setEditingArticle({ ...editingArticle, featuredImage: img.url })}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Excerpt / Summary */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Short Summary / Excerpt * (1-2 sentences)</label>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt}
                      onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                      placeholder="Brief overview of the article shown on cards and search results..."
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Full Article Markdown Content */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-300">Article Content (Markdown supported)</label>
                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingArticle({
                              ...editingArticle,
                              content: `${editingArticle.content}\n\n### New Section Header\n`,
                            })
                          }
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold"
                        >
                          + H3 Header
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingArticle({
                              ...editingArticle,
                              content: `${editingArticle.content}\n* Bullet point 1\n* Bullet point 2\n`,
                            })
                          }
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold"
                        >
                          + Bullets
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingArticle({
                              ...editingArticle,
                              content: `${editingArticle.content}\n> **Teacher Tip:** Important classroom takeaway note here.\n`,
                            })
                          }
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold"
                        >
                          + Tip Box
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={10}
                      value={editingArticle.content}
                      onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3.5 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={editingArticle.tags?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Taxes, STEM, Grants, Phonics, Classroom Management"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </>
              )}

              {/* SEO & Meta Tab */}
              {editorTab === 'seo' && (
                <div className="space-y-5">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="font-black text-white text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Google Search Engine Preview
                    </h4>
                    <div className="bg-white p-4 rounded-xl text-slate-900 space-y-1">
                      <p className="text-xs text-blue-700 font-bold">
                        https://marketplaceforteachers.com › news › {editingArticle.slug || 'article-slug'}
                      </p>
                      <p className="text-base text-blue-900 font-bold hover:underline cursor-pointer">
                        {editingArticle.title || 'Your Article Title'} | Marketplace For Teachers™
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {editingArticle.seoDescription || editingArticle.excerpt || 'Article summary description...'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Custom SEO Meta Description (Recommended 150-160 chars)</label>
                    <textarea
                      rows={3}
                      value={editingArticle.seoDescription || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, seoDescription: e.target.value })}
                      placeholder="Classroom-focused description that appears in Google search snippets..."
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl text-xs"
                    />
                    <span className="text-[11px] text-slate-400">
                      {(editingArticle.seoDescription || '').length} / 160 characters
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">SEO Target Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={editingArticle.seoKeywords?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          seoKeywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                        })
                      }
                      placeholder="classroom expense deduction, teacher tax guide 2026, STEM supplies discount"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Live Preview Tab */}
              {editorTab === 'preview' && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {editingArticle.category}
                    </span>
                    <span className="text-slate-400 text-xs">• {editingArticle.readTime}</span>
                  </div>

                  <h1 className="text-2xl font-black text-white">{editingArticle.title || 'Untitled Article'}</h1>

                  <div className="flex items-center gap-3 py-3 border-y border-slate-800">
                    <img
                      src={editingArticle.authorAvatar}
                      alt={editingArticle.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <p className="font-bold text-white text-sm">{editingArticle.author}</p>
                      <p className="text-xs text-slate-400">{editingArticle.authorTitle} • {editingArticle.date}</p>
                    </div>
                  </div>

                  {editingArticle.featuredImage && (
                    <img
                      src={editingArticle.featuredImage}
                      alt={editingArticle.title}
                      className="w-full h-64 object-cover rounded-xl border border-slate-800"
                    />
                  )}

                  <p className="text-sm font-semibold text-slate-300 italic bg-slate-900 p-4 rounded-xl border-l-4 border-blue-500">
                    {editingArticle.excerpt}
                  </p>

                  <div className="prose prose-invert max-w-none text-slate-300 text-xs whitespace-pre-wrap leading-relaxed">
                    {editingArticle.content}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setEditingArticle(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (editingArticle) {
                      setEditingArticle({ ...editingArticle, status: 'draft' });
                      setTimeout(handleSaveArticle, 50);
                    }
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handleSaveArticle}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-black text-xs cursor-pointer transition-colors shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Publish & Save Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Quick Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Article Live Preview</span>
              <button
                onClick={() => setPreviewArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <img
                src={previewArticle.featuredImage}
                alt={previewArticle.title}
                className="w-full h-56 object-cover rounded-xl"
              />
              <span className="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-lg text-xs font-bold inline-block">
                {previewArticle.category}
              </span>
              <h2 className="text-2xl font-black text-white">{previewArticle.title}</h2>
              <div className="flex items-center gap-3 py-2 border-y border-slate-800 text-xs">
                <img
                  src={previewArticle.authorAvatar}
                  alt={previewArticle.author}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-bold text-white">{previewArticle.author}</p>
                  <p className="text-slate-500">{previewArticle.date} • {previewArticle.readTime}</p>
                </div>
              </div>
              <p className="text-xs italic text-slate-300 bg-slate-950 p-3 rounded-lg">{previewArticle.excerpt}</p>
              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {previewArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
