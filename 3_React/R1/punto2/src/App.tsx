import { useState } from 'react';
import TarjetaPresentacion from './components/TarjetaPresentacion';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app-container ${themeClass}`}>
      <div className="content-wrapper">
        <TarjetaPresentacion 
          nombre="Desarrollador" 
          apellido="Pro" 
          profesion="Full Stack React Developer" 
          imagen="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
        />
      </div>

      <button 
        className="theme-toggle-btn"
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}

export default App;
