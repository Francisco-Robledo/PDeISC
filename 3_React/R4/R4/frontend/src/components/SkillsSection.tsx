import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  Atom, 
  FileCode2, 
  Palette, 
  Globe, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Flame, 
  GitBranch, 
  Zap, 
  Boxes, 
  Cloud
} from 'lucide-react';
import type { Skill } from '../types/portfolio';

interface SkillsSectionProps {
  skills: Skill[];
}

const iconMap: Record<string, React.ElementType> = {
  Atom,
  FileCode2,
  Palette,
  Sparkles,
  Globe,
  Server,
  ShieldCheck,
  Cpu,
  Database,
  Flame,
  GitBranch,
  Zap,
  Boxes,
  Cloud
};

const categories = [
  { id: 'all', label: 'Todas las Habilidades' },
  { id: 'hardware', label: 'Hardware & PCs' },
  { id: 'networks', label: 'Redes & Cisco' },
  { id: 'software', label: 'Programación & Web' },
  { id: 'database', label: 'Bases de Datos' },
  { id: 'soft', label: 'Habilidades Personales' },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
      const matchesSearch = 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, activeCategory, searchQuery]);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arsenal Tecnológico</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Habilidades & <span className="text-[#34A853]">Tecnologías</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Dominio comprobado en herramientas del ecosistema moderno de desarrollo web con enfoque en rendimiento, tipado y diseño reactivo.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 dark:bg-[#1E2023]/80 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto max-w-full">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="skillsCategoryPill"
                    className="absolute inset-0 bg-[#34A853] rounded-full shadow-md shadow-emerald-500/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por tecnología..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white/80 dark:bg-[#1E2023]/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill, index) => {
          const IconComponent = iconMap[skill.icon] || Sparkles;
          return (
            <motion.div
              key={skill.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className="google-card p-5 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-2xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${skill.color}15` }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: skill.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  {/* Level percentage pill */}
                  <span
                    className="px-2 py-0.5 text-xs font-bold rounded-full"
                    style={{ backgroundColor: `${skill.color}15`, color: skill.color }}
                  >
                    {skill.level}%
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {skill.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="py-16 text-center text-slate-400 text-sm">
          No se encontraron habilidades que coincidan con "<span className="font-semibold">{searchQuery}</span>".
        </div>
      )}
    </section>
  );
};
