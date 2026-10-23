import { useState } from 'react';

type Player = 'X' | 'O' | null;

export default function TaTeTi() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);

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
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  return (
    <div className="tic-tac-toe-container">
      <h3>Ta-Te-Ti</h3>
      
      <div className="game-status">
        {winner ? (
          <span className="winner-msg">¡Ganador: {winner}!</span>
        ) : isDraw ? (
          <span className="draw-msg">¡Empate!</span>
        ) : (
          <span>Turno de: <strong>{isXNext ? 'X' : 'O'}</strong></span>
        )}
      </div>

      <div className="board">
        {board.map((cell, index) => (
          <button 
            key={index} 
            className={`cell ${cell ? cell.toLowerCase() : ''}`}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner}
          >
            {cell}
          </button>
        ))}
      </div>

      <button className="reset-game-btn" onClick={() => { setBoard(Array(9).fill(null)); setIsXNext(true); }}>
        Reiniciar Juego
      </button>
    </div>
  );
}
