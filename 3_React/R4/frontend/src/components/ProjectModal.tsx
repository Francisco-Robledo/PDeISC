import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Heart, Sparkles } from 'lucide-react';
import type { Project } from '../types/portfolio';
import { useConfetti } from '../hooks/useConfetti';
import { GithubIcon } from './BrandIcons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onLike: (id: number) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onLike }) => {
  const { triggerGoogleConfetti } = useConfetti();

  if (!project) return null;

  const handleLike = () => {
    onLike(project.id);
    triggerGoogleConfetti();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md">
        {/* Backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#1E2023] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header Gradient */}
          <div className={`h-36 sm:h-44 bg-gradient-to-r ${project.image_gradient || 'from-blue-600 to-indigo-600'} p-6 sm:p-8 flex flex-col justify-between relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold self-start">
              {project.category}
            </span>

            <div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                {project.subtitle}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Metrics chip */}
            {project.metrics && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 rounded-2xl text-blue-700 dark:text-blue-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-[#4285F4]" />
                <span>{project.metrics}</span>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Descripción & Arquitectura
              </h4>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {project.long_description || project.description}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Stack Tecnológico
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/80 dark:border-slate-700/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions / Links */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full border border-red-200 dark:border-red-900/60 text-xs font-bold transition-transform active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{project.likes} Me gusta</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>Ver Código Git</span>
                  </a>
                )}
                {project.demo_url && project.demo_url !== '#' && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#4285F4] hover:bg-[#1A73E8] text-white rounded-full text-xs font-bold shadow-md shadow-blue-500/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Demo en Vivo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
