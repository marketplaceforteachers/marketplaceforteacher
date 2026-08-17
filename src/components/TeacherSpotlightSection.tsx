import React, { useState } from 'react';
import { Sparkles, Quote, DollarSign, School, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { TeacherStory } from '../types';
import { INITIAL_TEACHER_STORIES } from '../data/teacherStoriesData';

interface TeacherSpotlightSectionProps {
  stories?: TeacherStory[];
}

export const TeacherSpotlightSection: React.FC<TeacherSpotlightSectionProps> = ({
  stories = INITIAL_TEACHER_STORIES,
}) => {
  const activeStories = stories && stories.length > 0 ? stories : INITIAL_TEACHER_STORIES;
  const [selectedStoryId, setSelectedStoryId] = useState<string>(activeStories[0]?.id || 'story-1');

  const selectedStory = activeStories.find((s) => s.id === selectedStoryId) || activeStories[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Teacher Stories & Impact Spotlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
              Transforming Classrooms Nationwide
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Real educators sharing how peer surplus recycling and community funding made high-impact learning possible.
            </p>
          </div>

          {/* Teacher Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {activeStories.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStoryId(s.id)}
                className={`p-1.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                  selectedStory?.id === s.id
                    ? 'bg-white/20 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={s.avatarUrl}
                  alt={s.teacherName}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="text-left pr-2 hidden sm:block">
                  <p className="text-[11px] font-extrabold text-white leading-tight">{s.teacherName.split(',')[0]}</p>
                  <p className="text-[9px] text-slate-300">{s.school.split(' ')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Highlighted Story Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white/5 rounded-2xl p-6 border border-white/10">
          {/* Photos side */}
          <div className="lg:col-span-5 relative h-64 lg:h-80 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <img
              src={selectedStory.classroomImageUrl}
              alt={selectedStory.headline}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <img
                  src={selectedStory.avatarUrl}
                  alt={selectedStory.teacherName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <p className="text-xs font-black">{selectedStory.teacherName}</p>
                  <p className="text-[10px] text-slate-300">{selectedStory.school} • {selectedStory.city}, {selectedStory.state}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Impact Stats side */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-black">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>${selectedStory.totalSavedOrEarned.toLocaleString()} Classroom Value Reinvested</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              "{selectedStory.headline}"
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedStory.story}
            </p>

            {/* Educator Quote Callout */}
            <div className="p-3.5 bg-amber-400/10 border-l-4 border-amber-400 rounded-r-xl text-xs text-amber-200 italic font-medium">
              "{selectedStory.quote}"
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{selectedStory.gradeLevel}</span>
              <span className="text-amber-300 font-bold">{selectedStory.yearJoined}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
