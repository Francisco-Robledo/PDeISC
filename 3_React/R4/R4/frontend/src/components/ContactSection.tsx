import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Copy, Check, ExternalLink, Sparkles, Briefcase } from 'lucide-react';
import type { Profile } from '../types/portfolio';
import { GithubIcon } from './BrandIcons';

interface ContactSectionProps {
  profile: Profile;
  onSubmitContact?: (data: { name: string; email: string; subject?: string; message: string }) => Promise<any>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('2235069385');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Contacto Directo</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hablemos & <span className="text-[#4285F4]">Conectemos</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          ¿Tienes una oportunidad laboral, entrevista o consulta técnica? Comunícate directamente por el canal que prefieras.
        </p>
      </div>

      {/* Direct Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp & Teléfono */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="google-card p-6 sm:p-7 flex flex-col justify-between group hover:border-[#34A853]/40"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-[#34A853] mb-5 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              WhatsApp Directo
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Respuesta Rápida
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Para contacto directo e inmediato sobre entrevistas, propuestas laborales o coordinación de reuniones.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between mb-6">
              <span className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
                223-506-9385
              </span>
              <button
                onClick={handleCopyPhone}
                className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                title="Copiar teléfono"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <a
              href="https://wa.me/5492235069385?text=Hola%20Francisco,%20vi%20tu%20portfolio%20web"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#34A853] hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chatear por WhatsApp</span>
            </a>
          </div>
        </motion.div>

        {/* Correo Electrónico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="google-card p-6 sm:p-7 flex flex-col justify-between group hover:border-[#4285F4]/40"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-[#4285F4] mb-5 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Correo Electrónico
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Contacto Formal
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Para el envío de ofertas de trabajo formales, documentos técnicos o solicitudes de información.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between mb-6">
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mr-2">
                {profile.email}
              </span>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors shrink-0"
                title="Copiar email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={handleCopyEmail}
              className="w-full py-3 px-4 bg-[#4285F4] hover:bg-[#1A73E8] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Copiado al portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Dirección de Correo</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Disponibilidad & GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="google-card p-6 sm:p-7 flex flex-col justify-between group hover:border-[#FBBC05]/40"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-[#FBBC05] mb-5 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              Perfil Profesional
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Disponibilidad Inmediata
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Estudiante de 7° año de la Tecnicatura en Informática Personal y Profesional (E.E.S.T. N°5 "Amancio Williams").
            </p>

            {/* Availability Status Badge */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  En búsqueda activa
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Soporte técnico, hardware, diagnóstico de fallas, redes informáticas y desarrollo junior.
              </p>
            </div>
          </div>

          <div>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-black dark:bg-[#1E2023] dark:hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Ver GitHub (@Francisco-Robledo)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FBBC05]" />
          <span>Disponibilidad horaria flexible</span>
        </div>
        <span>•</span>
        <span>Modalidad presencial en Mar del Plata o remota</span>
        <span>•</span>
        <span>Respuesta garantizada en menos de 24 horas</span>
      </motion.div>
    </section>
  );
};
