import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import type { Profile } from '../types/portfolio';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { useConfetti } from '../hooks/useConfetti';
import { GithubIcon, LinkedinIcon } from './BrandIcons';

interface HeroSectionProps {
  profile: Profile;
  scrollToSection: (id: string) => void;
}

const roles = [
  'Estudiante de Informática — Técnica N°5',
  'Soporte Técnico & Mantenimiento de Hardware',
  'Programación en Python & C++',
  'Redes & Simulación Cisco Packet Tracer',
  'Desarrollo Web (React 19 & Node.js)'
];

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, scrollToSection }) => {
  const currentRole = useTypingEffect(roles, 70, 35, 2000);
  const { triggerGoogleConfetti } = useConfetti();

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Google Ambient Colored Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4285F4]/15 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#EA4335]/10 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#FBBC05]/15 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#34A853]/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto w-full text-center">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#1E2023]/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-xs font-semibold mb-6 select-none"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-700 dark:text-slate-300">
            En búsqueda de mi primera experiencia laboral
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">E.E.S.T. N°5 Amancio Williams</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          Hola, soy <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] bg-clip-text text-transparent">Francisco Robledo</span>
          <br />
          <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-700 dark:text-slate-300 mt-2 block h-14 sm:h-16">
            <span>{currentRole}</span>
            <span className="inline-block w-1 h-8 sm:h-10 ml-1.5 bg-[#4285F4] animate-pulse align-middle" />
          </span>
        </motion.h1>

        {/* Bio Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
        >
          {profile.bio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14"
        >
          {/* Explore Projects Button */}
          <button
            onClick={() => scrollToSection('projects')}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-[#4285F4] hover:bg-[#1A73E8] text-white font-semibold rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5"
          >
            <span>Explorar Proyectos</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Contact Button */}
          <button
            onClick={() => scrollToSection('contact')}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-white dark:bg-[#1E2023] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold rounded-full border border-slate-200 dark:border-slate-800 shadow-md shadow-black/5 hover:border-slate-300 dark:hover:border-slate-700 transition-all transform hover:-translate-y-0.5"
          >
            <Mail className="w-4 h-4 text-[#EA4335]" />
            <span>Contactar</span>
          </button>

          {/* Celebrate Button (Easter Egg / Confetti) */}
          <button
            onClick={triggerGoogleConfetti}
            className="flex items-center gap-2 px-5 py-3.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-full border border-slate-200 dark:border-slate-700 transition-all"
            title="Lanzar confeti de Google"
          >
            <Sparkles className="w-4 h-4 text-[#FBBC05]" />
            <span className="hidden sm:inline">¡Celebrar!</span>
          </button>
        </motion.div>

        {/* Social Links Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-16 text-slate-500 dark:text-slate-400"
        >
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/80 dark:bg-[#1E2023]/80 rounded-full border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:scale-110 transition-all shadow-sm"
            aria-label="GitHub de Francisco Robledo"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/80 dark:bg-[#1E2023]/80 rounded-full border border-slate-200 dark:border-slate-800 hover:text-[#0A66C2] hover:scale-110 transition-all shadow-sm"
            aria-label="LinkedIn de Francisco Robledo"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="p-3 bg-white/80 dark:bg-[#1E2023]/80 rounded-full border border-slate-200 dark:border-slate-800 hover:text-[#EA4335] hover:scale-110 transition-all shadow-sm"
            aria-label="Enviar Correo Electrónico"
          >
            <Mail className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Bento Stats Counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          <div className="google-card p-5 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#4285F4] mb-1">
              {profile.years_experience}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Tecnicatura Informática
            </div>
          </div>

          <div className="google-card p-5 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#EA4335] mb-1">
              {profile.projects_completed}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Proyectos & Robótica
            </div>
          </div>

          <div className="google-card p-5 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#34A853] mb-1">
              {profile.satisfaction_rate}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Feria de Ciencias 2024
            </div>
          </div>

          <div className="google-card p-5 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#FBBC05] mb-1">
              {profile.code_commits}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Cisco & Santander
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
