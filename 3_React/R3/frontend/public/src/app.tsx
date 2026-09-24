import { useState } from 'react';
import Navbar from './components/Navbar';
import ScrollToTopButton from './components/ScrollToTopButton';
import FloatingThemeButton from './components/FloatingThemeButton';
import RouterApp from './systems/router-system/RouterApp';
import StateApp from './systems/usestate-system/StateApp';

const App = () => {
  const [activeSystem, setActiveSystem] = useState<'router' | 'usestate'>('router');

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
