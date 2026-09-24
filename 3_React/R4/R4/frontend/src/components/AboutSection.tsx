import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Wrench, ShieldCheck, FileCode2, Sparkles, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import type { Profile } from '../types/portfolio';

interface AboutSectionProps {
  profile: Profile;
  scrollToSection: (id: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, scrollToSection }) => {
  const [copied, setCopied] = useState(false);

  const cloneCommand = `git clone ${profile.github}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const philosophies = [
    {
      title: 'Hardware & Reparación de PCs',
      description: 'Diagnóstico preciso de componentes, ensamblado desde cero, cambio de pasta térmica, limpieza física y cambio de piezas (RAM, SSD, fuentes).',
      icon: Wrench,
      color: '#4285F4',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Redes & Cisco Packet Tracer',
      description: 'Configuración de routers WiFi, cableado y simulación de topologías de red certificado por Cisco Networking Academy.',
      icon: ShieldCheck,
      color: '#EA4335',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Programación en Python & Software',
      description: 'Lógica algorítmica con Python (Certificado Santander Open Academy), C++ orientado a objetos y desarrollo web moderno con React y Node.js.',
      icon: FileCode2,
      color: '#FBBC05',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'Trabajo en Equipo & Robótica',
      description: 'Representante regional en Feria de Ciencias 2024 y construcción en equipo de robot competitivo para torneo escolar de fútbol robótico.',
      icon: Sparkles,
      color: '#34A853',
      bgColor: 'bg-emerald-500/10'
    }
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
          <User className="w-3.5 h-3.5" />
          <span>Perfil & Formación</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Formación técnica & <span className="text-[#4285F4]">pasión por la tecnología</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Conoce mi trayectoria como estudiante técnico de informática, mis certificaciones y mi enfoque en la resolución práctica de problemas.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Bio Card (Spans 2 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="google-card p-6 sm:p-8 md:col-span-2 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Sobre Mi Formación
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
              Estudiante técnico comprometido, proactivo y en búsqueda de mi primera experiencia laboral.
            </h3>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base mb-6">
              {profile.bio}
            </p>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              A lo largo de mi formación en la <strong>Escuela de Educación Secundaria Técnica N°5 "Amancio Williams"</strong> (Mar del Plata), he combinado conocimientos de hardware y soporte técnico con el desarrollo de proyectos web completos (incluyendo este portafolio <strong>R4</strong> conectado a TiDB Cloud y el sistema de gestión corporativo <strong>R3</strong>).
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4285F4]" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Escuela Técnica N°5 Amancio Williams</span>
            </div>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Contactar para entrevistas &rarr;
            </button>
          </div>
        </motion.div>

        {/* Interactive Terminal / Quick Git Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="google-card p-6 flex flex-col justify-between bg-slate-900 text-slate-100 dark:bg-[#18191B] border-slate-800"
        >
          <div>
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EA4335]" />
                <span className="w-3 h-3 rounded-full bg-[#FBBC05]" />
                <span className="w-3 h-3 rounded-full bg-[#34A853]" />
              </div>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-[#4285F4]" /> bash
              </span>
            </div>

            {/* Terminal Content */}
            <div className="font-mono text-xs space-y-2 mb-6 text-slate-300">
              <p className="text-emerald-400"># Datos técnicos de Francisco</p>
              <div className="p-3 bg-black/40 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="truncate mr-2">$ {cloneCommand}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copiar comando"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-slate-400">$ cat perfil.txt</p>
              <p className="text-blue-400">Escuela: E.E.S.T. N°5 Amancio Williams (7° Año)</p>
              <p className="text-amber-400">Certificados: Cisco Packet Tracer + Python Santander</p>
              <p className="text-emerald-400">Logro: Representante Región 19 Feria de Ciencias</p>
              <p className="text-purple-400">Objetivo: Primera experiencia laboral en IT</p>
            </div>
          </div>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 text-center text-xs font-bold rounded-2xl bg-[#4285F4] hover:bg-[#1A73E8] text-white transition-colors flex items-center justify-center gap-2"
          >
            <span>Ver GitHub (@Francisco-Robledo)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* 4 Pillars Cards */}
        {philosophies.map((p, idx) => {
          const IconComponent = p.icon;
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              className="google-card p-6"
            >
              <div className={`w-12 h-12 rounded-2xl ${p.bgColor} flex items-center justify-center mb-4`}>
                <IconComponent className="w-6 h-6" style={{ color: p.color }} />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {p.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
