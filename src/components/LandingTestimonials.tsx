import React from 'react';
import { Star, ArrowRight, Users, Clock, GraduationCap } from 'lucide-react';
import { COURSES } from '../data';
import { motion } from 'motion/react';
import PremiumTestimonialsSlider from './PremiumTestimonialsSlider';

interface LandingTestimonialsProps {
  onEnrollCourse: (courseId: string) => void;
}

export default function LandingTestimonials({ onEnrollCourse }: LandingTestimonialsProps) {
  const popularCourses = COURSES.slice(0, 3);

  return (
    <div className="bg-[#050816] text-white">
      
      {/* FEATURED BLUEPRINTS / ACADEMICS SECTION */}
      <section id="courses" className="max-w-7xl mx-auto px-6 py-12 lg:px-12 lg:py-16 relative overflow-hidden">
        {/* Subtle Ambient Background Blue/Purple Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3 relative z-10">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[#00D4FF] text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
            <GraduationCap className="w-4 h-4 text-[#00D4FF]" />
            <span>FEATURED ACADEMICS</span>
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Popular Learning Track Blueprints
          </h2>
          <p className="text-sm sm:text-base text-[#C9D4E8] font-sans font-medium leading-relaxed">
            Join thousands of active scholars building functional systems with real-time prompt controllers and array pipelines.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
          {popularCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-[#0B1220]/80 border border-white/10 hover:border-[#00D4FF]/40 shadow-2xl backdrop-blur-2xl transition-all duration-300 rounded-[24px] overflow-hidden flex flex-col justify-between group relative"
            >
              {/* Subtle Blue/Purple Glow Effect on Card Hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* Header Image */}
                <div className="h-44 sm:h-48 overflow-hidden relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/30 to-transparent" />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#050816]/80 backdrop-blur-md text-[10px] font-bold font-mono text-[#00D4FF] border border-[#00D4FF]/30 uppercase tracking-wider shadow-md">
                    {course.category}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-4 relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase">
                    <span className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                      <span className="text-white font-bold">{course.rating} Rating</span>
                    </span>
                    <span className="text-[#00D4FF] font-bold">{course.difficulty}</span>
                  </div>

                  <h3 className="font-display font-black text-lg text-white leading-tight group-hover:text-[#00D4FF] transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#C9D4E8] font-sans leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 py-3 border-t border-white/10 text-[10px] font-mono font-bold text-[#C9D4E8]">
                    <div className="flex items-center space-x-1.5 justify-center bg-white/[0.03] py-2 rounded-xl border border-white/5">
                      <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 justify-center bg-white/[0.03] py-2 rounded-xl border border-white/5">
                      <Users className="w-3.5 h-3.5 text-[#00D4FF]" />
                      <span>{course.students} Scholars</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 relative z-10">
                <button
                  onClick={() => onEnrollCourse(course.id)}
                  className="w-full py-3.5 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-[#7B3EFF] via-[#00D9FF] to-[#00FFC8] hover:opacity-90 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer group-hover:scale-[1.01]"
                >
                  <span className="font-mono uppercase font-black tracking-wider text-slate-950">Launch Course Sandbox</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* STUDENT SUCCESS STORIES SLIDER */}
      <PremiumTestimonialsSlider />

    </div>
  );
}
