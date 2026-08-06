
// Importamos useState para manejar el valor del contador
import { useState } from 'react';

import './App.css';

function App() {
  // Estado para el Modo Día/Noche. (Inicia en Dark por defecto)
  const [isDarkMode, setIsDarkMode] = useState(true);
  // Inicializamos el contador en 0
  const [count, setCount] = useState(0);

  // Clase CSS dinámica según el modo
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app-container ${themeClass}`}>
      {/* Contenedor central limitado a 1200px para pantallas grandes (Requisito Max-Width) */}
      <div className="content-wrapper">
        
      {/* Componente del contador interactivo */}
      <div className="counter-component">
        <h3>Contador interactivo</h3>
        <div className="counter-display">
          <span className="count-value">{count}</span>
        </div>
        <div className="counter-controls">
          {/* Botones para sumar o restar que actualizan el estado */}
          <button onClick={() => setCount(c => c - 1)} className="btn-decrement">-</button>
          <button onClick={() => setCount(c => c + 1)} className="btn-increment">+</button>
        </div>
      </div>
    
      </div>

      {/* Botón flotante para alternar entre Modo Claro y Oscuro (Abajo a la izquierda) */}
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
