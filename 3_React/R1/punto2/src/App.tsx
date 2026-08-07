
// Definimos la estructura de datos para las props de la tarjeta
interface BusinessCardProps {
  nombre: string;
  apellido: string;
  profesion: string;
  imagen: string;
}

// Componente que recibe la información del usuario y la muestra
function BusinessCard({ nombre, apellido, profesion, imagen }: BusinessCardProps) {
  return (
    <div className="business-card">
      <div className="card-image-container">
        <img src={imagen} alt={`${nombre} ${apellido}`} className="card-image" />
      </div>
      <div className="card-info">
        <h3>{nombre} {apellido}</h3>
        <p className="profession">{profesion}</p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import './App.css';

function App() {
  // Estado para el Modo Día/Noche. (Inicia en Dark por defecto)
  const [isDarkMode, setIsDarkMode] = useState(true);


  // Clase CSS dinámica según el modo
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app-container ${themeClass}`}>
      {/* Contenedor central limitado a 1200px para pantallas grandes (Requisito Max-Width) */}
      <div className="content-wrapper">
        
      {/* Renderizamos la tarjeta pasando propiedades (props) */}
      <BusinessCard 
        nombre="Desarrollador" 
        apellido="Pro" 
        profesion="Full Stack React Developer" 
        imagen="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
      />
    
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
