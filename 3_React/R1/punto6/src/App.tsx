
// Hook de estado para guardar los movimientos
import { useState } from 'react';

// Tipamos los posibles valores de cada celda
type Player = 'X' | 'O' | null;

import './App.css';

function App() {
  // Estado para el Modo Día/Noche. (Inicia en Dark por defecto)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // El tablero de 9 casilleros
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  // ¿De quién es el turno?
  const [isXNext, setIsXNext] = useState<boolean>(true);

  // Lógica para detectar si alguien ganó
  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null; // Nadie ha ganado aún
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null); // Verificamos empate

  // Acción al hacer click en una celda
  const handleClick = (index: number) => {
    // Si la celda está ocupada o ya hay ganador, no hacemos nada
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext); // Cambiamos de turno
  };


  // Clase CSS dinámica según el modo
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app-container ${themeClass}`}>
      {/* Contenedor central limitado a 1200px para pantallas grandes (Requisito Max-Width) */}
      <div className="content-wrapper">
        
      {/* Contenedor del Juego */}
      <div className="tic-tac-toe-container">
        <h3>Ta-Te-Ti</h3>
        
        {/* Mostramos de quién es el turno o quién ganó */}
        <div className="game-status">
          {winner ? (
            <span className="winner-msg">¡Ganador: {winner}!</span>
          ) : isDraw ? (
            <span className="draw-msg">¡Empate!</span>
          ) : (
            <span>Turno de: <strong>{isXNext ? 'X' : 'O'}</strong></span>
          )}
        </div>

        {/* Tablero Grid 3x3 */}
        <div className="board">
          {board.map((cell, index) => (
            <button 
              key={index} 
              className={`cell ${cell ? cell.toLowerCase() : ''}`}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner} // Deshabilitamos si hay ganador o está llena
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Botón para reiniciar, vuelve los estados a valor inicial */}
        <button className="reset-game-btn" onClick={() => { setBoard(Array(9).fill(null)); setIsXNext(true); }}>
          Reiniciar Juego
        </button>
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
