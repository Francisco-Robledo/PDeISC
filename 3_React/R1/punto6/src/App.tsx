import { useState } from 'react';
import TaTeTi from './components/TaTeTi';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app-container ${themeClass}`}>
      <div className="content-wrapper">
        <TaTeTi />
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
