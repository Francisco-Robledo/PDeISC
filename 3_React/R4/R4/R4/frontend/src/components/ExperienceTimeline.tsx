import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import type { Experience } from '../types/portfolio';

interface ExperienceTimelineProps {
  experience: Experience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experience }) => {
  const [filterType, setFilterType] = useState<'all' | 'work' | 'education'>('all');

  const filteredItems = useMemo(() => {
    if (filterType === 'all') return experience;
    return experience.filter((e) => e.type === filterType);
  }, [experience, filterType]);

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Trayectoria & Crecimiento</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Experiencia & <span className="text-[#FBBC05]">Formación</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Un recorrido continuo enfocado en el desarrollo de software de alto impacto y aprendizaje constante.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-14">
        <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-[#1E2023]/80 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          {[
            { id: 'all', label: 'Todo' },
            { id: 'work', label: 'Experiencia Laboral' },
            { id: 'education', label: 'Educación & Títulos' },
          ].map((tab) => {
            const isSelected = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="experienceTabPill"
                    className="absolute inset-0 bg-[#FBBC05] rounded-full shadow-md shadow-amber-500/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-slate-900 font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-12">
        {filteredItems.map((item, idx) => {
          const isWork = item.type === 'work';
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Marker Dot */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-4 border-slate-50 dark:bg-[#121212] flex items-center justify-center group-hover:scale-125 transition-transform"
                style={{ backgroundColor: item.badge_color || '#4285F4' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Timeline Card */}
              <div className="google-card p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                      {isWork ? (
                        <>
                          <Briefcase className="w-3.5 h-3.5 text-[#4285F4]" />
                          <span>Experiencia Profesional</span>
                        </>
                      ) : (
                        <>
                          <GraduationCap className="w-3.5 h-3.5 text-[#FBBC05]" />
                          <span>Formación Académica</span>
                        </>
                      )}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {item.company}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold self-start sm:self-center">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.period}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Highlights List */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    {item.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
