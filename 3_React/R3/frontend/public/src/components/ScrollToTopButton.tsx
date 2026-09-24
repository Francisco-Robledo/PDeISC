import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el botón cuando el usuario hace scroll hacia abajo más de 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      type="button"
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl border border-indigo-400/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      title="Volver al inicio de la página (Top Scrolling)"
      aria-label="Volver arriba"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}

export default ScrollToTopButton;
