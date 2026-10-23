import { useState } from 'react';
import Navbar from './components/Navbar';
import ScrollToTopButton from './components/ScrollToTopButton';
import FloatingThemeButton from './components/FloatingThemeButton';
import RouterApp from './systems/router-system/RouterApp';
import StateApp from './systems/usestate-system/StateApp';
import DiscordCallback from './components/DiscordCallback';
import XCallback from './components/XCallback';
import GitHubCallback from './components/GitHubCallback';

const App = () => {
  const [activeSystem, setActiveSystem] = useState<'router' | 'usestate'>('router');

  // Interceptar retornos de OAuth (GitHub, X, Discord, callback)
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.includes('github-callback')) {
    return <GitHubCallback />;
  }
  if (currentPath.includes('x-callback')) {
    return <XCallback />;
  }
  if (currentPath.includes('discord-callback') || currentPath.endsWith('/callback') || currentPath === '/callback') {
    return <DiscordCallback />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Barra de navegación superior */}
      <Navbar
        activeSystem={activeSystem}
        onSwitchSystem={setActiveSystem}
      />

      {/* Contenedor principal limitado a max-width: 1200px */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeSystem === 'router' ? <RouterApp /> : <StateApp />}
      </main>

      {/* Botón flotante de Modo Claro/Oscuro abajo a la izquierda */}
      <FloatingThemeButton />

      {/* Botón flotante de Top Scrolling abajo a la derecha */}
      <ScrollToTopButton />
    </div>
  );
};

export default App;
