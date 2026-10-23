import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center space-y-6 max-w-md mx-auto animate-in fade-in duration-300">
      <div className="w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
        <FileQuestion className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Página no encontrada</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          La ruta a la que intentas acceder no existe o ha sido movida.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
      >
        <Home className="w-4 h-4" />
        Volver a la Página Principal
      </Link>
    </div>
  );
};
