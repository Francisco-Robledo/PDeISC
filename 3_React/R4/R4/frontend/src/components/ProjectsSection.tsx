import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Heart, ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Project } from '../types/portfolio';
import { useConfetti } from '../hooks/useConfetti';
import { GithubIcon } from './BrandIcons';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onLikeProject: (id: number) => void;
}

const categories = ['Todos', 'Full Stack', 'Web App'];

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
  onLikeProject,
}) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const { triggerGoogleConfetti } = useConfetti();

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'Todos') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onLikeProject(id);
    triggerGoogleConfetti();
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Galería de Creaciones</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Proyectos <span className="text-[#4285F4]">Destacados</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Sistemas completos desarrollados desde cero, con arquitecturas seguras, persistencia en base de datos y diseño Google Material 3.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-[#1E2023]/80 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="projectsCategoryPill"
                    className="absolute inset-0 bg-[#4285F4] rounded-full shadow-md shadow-blue-500/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            onClick={() => onSelectProject(project)}
            className="google-card group cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Card Banner with Gradient */}
              <div
                className={`h-48 sm:h-52 bg-gradient-to-br ${
                  project.image_gradient || 'from-blue-600 to-indigo-600'
                } p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01]`}
              >
                {/* Background Pattern decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white_10%,transparent_70%)] opacity-20" />

                <div className="flex items-center justify-between relative z-10">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                    {project.category}
                  </span>

                  {/* Likes button on card */}
                  <button
                    onClick={(e) => handleLike(e, project.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-md text-white text-xs font-bold transition-all active:scale-90"
                    title="Dar me gusta a este proyecto"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
                    <span>{project.likes}</span>
                  </button>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1 group-hover:translate-x-1 transition-transform">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 font-medium">
                    {project.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {project.metrics && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#4285F4]" />
                    <span>{project.metrics}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-xs font-bold text-[#4285F4] flex items-center gap-1 group-hover:gap-1.5 transition-all">
                Ver detalles completos <ArrowUpRight className="w-4 h-4" />
              </span>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="Ver repositorio Git"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {project.demo_url && project.demo_url !== '#' && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Demo en vivo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
