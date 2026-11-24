import React, { useState } from 'react';
import { COURSES } from '../data';
import { Course, UserProgress } from '../types';
import { Search, Star, BookOpen, Clock, Users, ArrowRight, Check, Sparkles, Code2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveCoursesProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

export default function InteractiveCourses({ progress, onUpdateProgress }: InteractiveCoursesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);

  const categories = ['All', 'Prompting', 'Python', 'JavaScript', 'Design', 'Business'];

  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = (courseId: string) => {
    if (progress.registeredCourses.includes(courseId)) return;
    
    const updatedCourses = [...progress.registeredCourses, courseId];
    // Award 50 XP for starting a new path
    onUpdateProgress({
      registeredCourses: updatedCourses,
      xp: progress.xp + 50,
      level: Math.floor((progress.xp + 50) / 300) + 1
    });
  };

  return (
    <div id="interactive-courses-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Search and Category Filter Section with High-End Glass Backing */}
      <div className="mb-12 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/15 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-brand-secondary uppercase tracking-widest mb-2">
            <GraduationCap className="w-4 h-4 text-brand-accent animate-pulse" />
            <span>EXPERT-CURATED WORKSPACES</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">Interactive Training Blueprints</h1>
          <p className="text-sm text-white/60 font-sans mt-1.5 max-w-xl leading-relaxed">
            Choose a path, unlock secure sandboxes, and compile functional code blocks live. Earn gold certifications recognized worldwide.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0 z-10">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search AI models, python, UI/UX..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all font-sans placeholder-white/30"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider font-display transition-all cursor-pointer ${
              activeCategory === category
                ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg shadow-brand-primary/20 scale-[1.02]'
                : 'bg-white/5 text-white/65 border border-white/10 hover:border-brand-primary/30 hover:bg-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid with Spring-Loaded Hover Elevations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => {
          const isEnrolled = progress.registeredCourses.includes(course.id);
          const isExpanded = expandedCourseId === course.id;
          const isHovered = hoveredCourseId === course.id;

          return (
            <div
              key={course.id}
              onMouseEnter={() => setHoveredCourseId(course.id)}
              onMouseLeave={() => setHoveredCourseId(null)}
              className="bg-white/[0.03] rounded-3xl border border-white/10 transition-all duration-300 overflow-hidden flex flex-col relative group"
              style={{
                transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0px) scale(1)',
                boxShadow: isHovered ? '0 25px 50px -12px rgba(123, 47, 247, 0.15)' : 'none',
                borderColor: isHovered ? 'rgba(123, 47, 247, 0.3)' : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Card Header Image with Glowing Accent Overlays */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Decorative radial lens flare */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                
                <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-[9px] font-bold font-mono text-brand-secondary border border-brand-secondary/20 uppercase tracking-widest">
                  {course.category}
                </span>

                {/* Floating Level Indicator Badge */}
                <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-lg bg-brand-primary text-white text-[9px] font-mono font-bold tracking-wider">
                  {course.difficulty}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col space-y-4">
                
                {/* Meta Row */}
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white/50">
                  <span className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span className="text-white font-display">{course.rating}</span>
                    <span>(2.4k reviews)</span>
                  </span>
                  <span className="text-brand-accent-secondary">CERTIFICATION LEVEL</span>
                </div>

                <h3 className="font-display font-black text-xl text-white leading-tight group-hover:text-brand-secondary transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  {course.description}
                </p>

                {/* Info Pills */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-[10px] font-mono text-white/60 font-bold bg-white/5 rounded-xl px-2">
                  <div className="flex items-center space-x-1 justify-center">
                    <Clock className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 justify-center border-x border-white/10">
                    <Users className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center space-x-1 justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                    <span>{course.curriculum.length} units</span>
                  </div>
                </div>

                {/* Curriculum Dropdown Trigger with Lucide Icon Rotation */}
                <button
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className="w-full py-1 text-center text-xs font-bold text-brand-secondary hover:text-brand-accent transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>{isExpanded ? 'Hide Course Curriculum' : 'View Core Curriculum Units'}</span>
                </button>

                {/* Expanded Curriculum List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2 border-t border-white/10 space-y-2 text-xs font-sans text-white/60 overflow-hidden"
                    >
                      <p className="font-mono font-bold text-[9px] tracking-widest text-white/40 uppercase">Interactive Chapters Required:</p>
                      {course.curriculum.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2 bg-white/5 p-2 rounded-lg border border-white/5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="font-medium text-white/80 text-[11px]">{item}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Card Footer Button with interactive status changes */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => handleEnroll(course.id)}
                  className={`w-full py-3.5 rounded-2xl font-display font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isEnrolled
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold shadow-sm cursor-default'
                      : 'bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white hover:opacity-95 shadow-lg shadow-brand-primary/20 hover:scale-[1.01]'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>Workspace Loaded & Ready</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                      <span>Unlock Interactive Path (+50 XP)</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
