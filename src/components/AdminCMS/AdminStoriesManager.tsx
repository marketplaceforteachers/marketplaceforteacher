import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  DollarSign,
  School,
  MapPin,
  Quote,
  Eye,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Image,
  User,
  Heart,
  Award,
  Save,
  X,
} from 'lucide-react';
import { TeacherStory } from '../../types';
import { INITIAL_TEACHER_STORIES } from '../../data/teacherStoriesData';

interface AdminStoriesManagerProps {
  stories: TeacherStory[];
  onAddStory: (newStory: TeacherStory) => void;
  onUpdateStory: (updatedStory: TeacherStory) => void;
  onDeleteStory: (storyId: string) => void;
  onResetStories?: () => void;
  onShowToast?: (message: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=250&auto=format&fit=crop&q=80',
];

const PRESET_CLASSROOM_IMAGES = [
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
];

export const AdminStoriesManager: React.FC<AdminStoriesManagerProps> = ({
  stories = [],
  onAddStory,
  onUpdateStory,
  onDeleteStory,
  onResetStories,
  onShowToast,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [previewStory, setPreviewStory] = useState<TeacherStory | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<TeacherStory>>({
    teacherName: '',
    school: '',
    city: '',
    state: 'OK',
    headline: '',
    story: '',
    avatarUrl: PRESET_AVATARS[0],
    classroomImageUrl: PRESET_CLASSROOM_IMAGES[0],
    totalSavedOrEarned: 2500,
    gradeLevel: 'Elementary School (K-5)',
    quote: '',
    yearJoined: `Educator since ${new Date().getFullYear() - 5}`,
  });

  const resetForm = () => {
    setFormData({
      teacherName: '',
      school: '',
      city: '',
      state: 'OK',
      headline: '',
      story: '',
      avatarUrl: PRESET_AVATARS[0],
      classroomImageUrl: PRESET_CLASSROOM_IMAGES[0],
      totalSavedOrEarned: 2500,
      gradeLevel: 'Elementary School (K-5)',
      quote: '',
      yearJoined: `Educator since ${new Date().getFullYear() - 5}`,
    });
    setIsAddingNew(false);
    setEditingStoryId(null);
  };

  const handleStartEdit = (story: TeacherStory) => {
    setFormData({ ...story });
    setEditingStoryId(story.id);
    setIsAddingNew(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherName?.trim() || !formData.headline?.trim() || !formData.story?.trim()) {
      alert('Please fill out Teacher Name, Headline, and Story narrative.');
      return;
    }

    if (editingStoryId) {
      // Update existing
      const updated: TeacherStory = {
        id: editingStoryId,
        teacherName: formData.teacherName || '',
        school: formData.school || 'Public School District',
        city: formData.city || 'Oklahoma City',
        state: formData.state || 'OK',
        headline: formData.headline || '',
        story: formData.story || '',
        avatarUrl: formData.avatarUrl || PRESET_AVATARS[0],
        classroomImageUrl: formData.classroomImageUrl || PRESET_CLASSROOM_IMAGES[0],
        totalSavedOrEarned: Number(formData.totalSavedOrEarned) || 1000,
        gradeLevel: formData.gradeLevel || 'Classroom Teacher',
        quote: formData.quote || 'Surplus resource exchange empowers students every day.',
        yearJoined: formData.yearJoined || 'Educator since 2020',
      };
      onUpdateStory(updated);
      if (onShowToast) onShowToast(`Teacher story "${updated.teacherName}" updated successfully! 🌟`);
    } else {
      // Add new
      const newStory: TeacherStory = {
        id: `story-${Date.now()}`,
        teacherName: formData.teacherName || '',
        school: formData.school || 'Public School District',
        city: formData.city || 'Oklahoma City',
        state: formData.state || 'OK',
        headline: formData.headline || '',
        story: formData.story || '',
        avatarUrl: formData.avatarUrl || PRESET_AVATARS[0],
        classroomImageUrl: formData.classroomImageUrl || PRESET_CLASSROOM_IMAGES[0],
        totalSavedOrEarned: Number(formData.totalSavedOrEarned) || 1500,
        gradeLevel: formData.gradeLevel || 'Classroom Teacher',
        quote: formData.quote || 'MFT gives educators a direct way to support teachers and classrooms everywhere.',
        yearJoined: formData.yearJoined || 'Educator since 2022',
      };
      onAddStory(newStory);
      if (onShowToast) onShowToast(`New teacher story "${newStory.teacherName}" published to homepage! ✨`);
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              Spotlight CMS
            </span>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Teacher Stories & Impact Spotlights Manager
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish authentic stories of teachers saving money, equipping labs, and recycling supplies for their classrooms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onResetStories && (
            <button
              onClick={() => {
                if (window.confirm('Reset teacher stories to default verified educators?')) {
                  onResetStories();
                  if (onShowToast) onShowToast('Teacher stories reset to default!');
                }
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          )}

          <button
            onClick={() => {
              resetForm();
              setIsAddingNew(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Teacher Story</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal or Panel */}
      {(isAddingNew || editingStoryId) && (
        <form
          onSubmit={handleSaveForm}
          className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-lg space-y-5 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              {editingStoryId ? <Edit3 className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-emerald-600" />}
              <span>{editingStoryId ? 'Edit Teacher Story' : 'Publish New Teacher Story'}</span>
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teacher Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teacher Name & Credentials <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.teacherName || ''}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                placeholder="e.g. Dr. Rachel Cooper, Ed.D. or Sarah Jenkins, M.Ed."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden font-medium"
              />
            </div>

            {/* School Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School / District Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.school || ''}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="e.g. Westmoore High School or Oak Ridge STEM Academy"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden font-medium"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Oklahoma City"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  maxLength={2}
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  placeholder="OK"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden font-mono font-bold"
                />
              </div>
            </div>

            {/* Grade Level / Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grade Level & Subject</label>
              <input
                type="text"
                value={formData.gradeLevel || ''}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                placeholder="e.g. 9th - 12th Grade Biology or 3rd Grade Elementary"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden font-medium"
              />
            </div>

            {/* Impact $ Reinvested / Saved */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Classroom Value Reinvested / Saved ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={formData.totalSavedOrEarned || 0}
                  onChange={(e) => setFormData({ ...formData, totalSavedOrEarned: Number(e.target.value) })}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden font-bold"
                />
              </div>
            </div>

            {/* Year Joined / Tenure */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Educator Tenure / Joined</label>
              <input
                type="text"
                value={formData.yearJoined || ''}
                onChange={(e) => setFormData({ ...formData, yearJoined: e.target.value })}
                placeholder="e.g. Educator since 2018"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Impact Headline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.headline || ''}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. From Storage Closet Clutter to a $3,400 State-of-the-Art Science Lab"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden font-bold"
            />
          </div>

          {/* Full Story Narrative */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Teacher Story Narrative <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.story || ''}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Describe how the educator utilized Marketplace for Teachers to buy, sell, or fund classroom resources..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* Teacher Quote */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Inspiring Quote (Callout Banner)
            </label>
            <input
              type="text"
              value={formData.quote || ''}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="e.g. MFT connects educators who have surplus with classrooms who need it most."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-hidden italic font-medium"
            />
          </div>

          {/* Photo Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Avatar URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Teacher Avatar Photo</label>
              <input
                type="url"
                value={formData.avatarUrl || ''}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold">Presets:</span>
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarUrl: url })}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 cursor-pointer ${
                      formData.avatarUrl === url ? 'border-amber-500 ring-2 ring-amber-300' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Classroom Image URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Classroom / Impact Photo</label>
              <input
                type="url"
                value={formData.classroomImageUrl || ''}
                onChange={(e) => setFormData({ ...formData, classroomImageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
              />
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[10px] text-slate-500 font-bold">Presets:</span>
                {PRESET_CLASSROOM_IMAGES.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, classroomImageUrl: url })}
                    className={`w-10 h-7 rounded-md overflow-hidden border-2 shrink-0 cursor-pointer ${
                      formData.classroomImageUrl === url ? 'border-amber-500 ring-2 ring-amber-300' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt={`Classroom ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingStoryId ? 'Save Story Changes' : 'Publish Story to Homepage'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Stories Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Story Header Image */}
            <div className="relative h-40 bg-slate-900">
              <img
                src={story.classroomImageUrl}
                alt={story.headline}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-amber-300 font-black text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Story #{index + 1}</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <img
                    src={story.avatarUrl}
                    alt={story.teacherName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-amber-400 shadow-md"
                  />
                  <div>
                    <p className="text-xs font-black leading-tight">{story.teacherName}</p>
                    <p className="text-[10px] text-slate-300">{story.school} ({story.city}, {story.state})</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md text-[11px] font-bold border border-emerald-200">
                  <DollarSign className="w-3 h-3 text-emerald-600" />
                  <span>${story.totalSavedOrEarned?.toLocaleString()} Reinvested</span>
                </div>

                <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">
                  "{story.headline}"
                </h4>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {story.story}
                </p>

                {story.quote && (
                  <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 italic border-l-2 border-amber-400 line-clamp-2">
                    "{story.quote}"
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewStory(story)}
                  className="text-slate-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(story)}
                    className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 cursor-pointer"
                    title="Edit Story"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete teacher story for ${story.teacherName}?`)) {
                        onDeleteStory(story.id);
                        if (onShowToast) onShowToast(`Story deleted.`);
                      }
                    }}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete Story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-700 shadow-2xl relative space-y-4">
            <button
              onClick={() => setPreviewStory(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Live Homepage Preview
            </div>

            <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/10">
              <img
                src={previewStory.classroomImageUrl}
                alt={previewStory.headline}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <img
                  src={previewStory.avatarUrl}
                  alt={previewStory.teacherName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <div className="font-bold text-sm text-white">{previewStory.teacherName}</div>
                  <div className="text-xs text-slate-300">{previewStory.school} • {previewStory.city}, {previewStory.state}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>${previewStory.totalSavedOrEarned?.toLocaleString()} Classroom Value Reinvested</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                "{previewStory.headline}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {previewStory.story}
              </p>
              <div className="p-3 bg-amber-400/10 border-l-4 border-amber-400 rounded-r-xl text-xs text-amber-200 italic">
                "{previewStory.quote}"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
