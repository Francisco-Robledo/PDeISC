const fs = require('fs');
const path = require('path');

const root = 'C:\\\\Users\\\\Alumnos\\\\Desktop\\\\3_React\\\\R1';

const commonCSS = `
/* Contenedor principal con transición de tema */
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
  margin: 0;
  transition: background-color 0.3s, color 0.3s;
}

/* Tema Oscuro (Noche) */
.dark-theme {
  background-color: #1a1a1a;
  color: white;
  --card-bg: #2a2a2a;
  --card-border: #444;
  --accent: #c084fc;
  --accent-hover: rgba(192, 132, 252, 0.2);
  --text-muted: #9ca3af;
  --input-bg: #1f2028;
}

/* Tema Claro (Día) */
.light-theme {
  background-color: #f3f4f6;
  color: #111827;
  --card-bg: #ffffff;
  --card-border: #d1d5db;
  --accent: #9333ea;
  --accent-hover: rgba(147, 51, 234, 0.1);
  --text-muted: #6b7280;
  --input-bg: #f9fafb;
}

/* Restricción de ancho a 1200px máximo */
.content-wrapper {
  max-width: 1200px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

/* Botón flotante Día/Noche obligatorio abajo a la izquierda */
.theme-toggle-btn {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  background-color: var(--card-bg);
  color: var(--accent);
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: transform 0.2s, background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border: 2px solid var(--accent);
}
.theme-toggle-btn:hover {
  transform: scale(1.1);
}

/* Reset global */
body { margin: 0; }
`;

const components = {
  punto1: {
    title: "Punto 1 - Hola Mundo",
    jsx: `
      {/* Componente principal centrado */}
      <div className="hola-mundo">
        <h2>¡Hola, Mundo!</h2>
        <p>Mi primer componente en React.</p>
      </div>
    `,
    css: `
.hola-mundo {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 80px 40px;
  width: 100%;
  max-width: 1000px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease;
}
.hola-mundo:hover { transform: translateY(-5px); }
.hola-mundo h2 { color: var(--accent); margin-bottom: 24px; font-size: 64px; }
.hola-mundo p { font-size: 24px; color: var(--text-muted); }

@media (max-width: 768px) {
  .hola-mundo { padding: 40px 20px; }
  .hola-mundo h2 { font-size: 40px; }
  .hola-mundo p { font-size: 18px; }
}
    `
  },
  punto2: {
    title: "Punto 2 - Tarjeta de Presentación",
    jsx: `
      {/* Renderizamos la tarjeta pasando propiedades (props) */}
      <BusinessCard 
        nombre="Desarrollador" 
        apellido="Pro" 
        profesion="Full Stack React Developer" 
        imagen="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
      />
    `,
    extraCode: `
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
        <img src={imagen} alt={\`\${nombre} \${apellido}\`} className="card-image" />
      </div>
      <div className="card-info">
        <h3>{nombre} {apellido}</h3>
        <p className="profession">{profesion}</p>
      </div>
    </div>
  );
}
`,
    css: `
.business-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1);
  display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 40px;
  padding: 60px; width: 100%; max-width: 800px; transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.business-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px -5px var(--accent-hover); }
.card-image-container { width: 200px; height: 200px; border-radius: 50%; overflow: hidden; border: 5px solid var(--accent); flex-shrink: 0; }
.card-image { width: 100%; height: 100%; object-fit: cover; }
.card-info { display: flex; flex-direction: column; align-items: flex-start; }
.card-info h3 { margin: 0; font-size: 48px; }
.profession { color: var(--text-muted); font-size: 20px; margin-top: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }

@media (max-width: 768px) {
  .business-card { flex-direction: column; padding: 40px 20px; gap: 24px; text-align: center; }
  .card-info { align-items: center; }
  .card-info h3 { font-size: 32px; }
  .profession { font-size: 16px; }
  .card-image-container { width: 150px; height: 150px; }
}
    `
  },
  punto3: {
    title: "Punto 3 - Contador",
    extraCode: `
// Importamos useState para manejar el valor del contador
import { useState } from 'react';
`,
    state: `  // Inicializamos el contador en 0
  const [count, setCount] = useState(0);`,
    jsx: `
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
    `,
    css: `
.counter-component {
  background: var(--card-bg); border: 1px solid var(--card-border); padding: 60px;
  border-radius: 20px; box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1); display: flex;
  flex-direction: column; align-items: center; gap: 40px; width: 100%; max-width: 600px;
}
.counter-component h3 { margin: 0; font-size: 32px; }
.counter-display {
  background: var(--input-bg); width: 250px; height: 250px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; border: 4px solid var(--accent);
}
.count-value { font-size: 96px; font-weight: bold; color: var(--accent); }
.counter-controls { display: flex; gap: 32px; }
.counter-controls button {
  width: 100px; height: 100px; border-radius: 16px; border: none; font-size: 48px;
  cursor: pointer; background: var(--accent); color: #fff; transition: filter 0.2s, transform 0.1s;
}
.counter-controls button:hover { filter: brightness(1.1); }
.counter-controls button:active { transform: scale(0.95); }
.btn-decrement { background: var(--text-muted) !important; }
    `
  },
  punto4: {
    title: "Punto 4 - Lista de Tareas",
    extraCode: `
// Importamos useState para la lista y el campo de texto
import { useState } from 'react';

// Estructura de una tarea individual
interface Task {
  id: number;
  text: string;
  completed: boolean;
}
`,
    state: `
  // Estado para almacenar todas las tareas
  const [tasks, setTasks] = useState<Task[]>([]);
  // Estado para el campo de texto
  const [inputValue, setInputValue] = useState('');

  // Nuevos estados para edición y eliminación
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Función para agregar una nueva tarea a la lista
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return; // Evitar tareas vacías
    const newTask: Task = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInputValue(''); // Limpiamos el input
  };

  // Función para marcar/desmarcar una tarea como completada
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditValue(task.text);
    setDeletingId(null);
  };

  const saveEdit = (id: number) => {
    if (!editValue.trim()) return;
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editValue.trim() } : task
    ));
    setEditingId(null);
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setEditingId(null);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    setDeletingId(null);
  };
`,
    jsx: `
      {/* Contenedor principal de la lista */}
      <div className="todo-list">
        <h3>Lista de Tareas</h3>
        {/* Formulario para atrapar el enter */}
        <form onSubmit={addTask} className="todo-form">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nueva tarea..."
            className="todo-input"
          />
          <button type="submit" className="todo-add-btn">Agregar</button>
        </form>
        <ul className="todo-items">
          {/* Recorremos el arreglo de tareas y las renderizamos */}
          {tasks.map(task => (
            <li key={task.id} className={\`todo-item \${task.completed ? 'completed' : ''}\`}>
              
              {deletingId === task.id ? (
                <div className="delete-confirm">
                  <span>¿Seguro que deseas eliminar?</span>
                  <div className="action-btns">
                    <button onClick={() => deleteTask(task.id)} className="btn-confirm">Sí</button>
                    <button onClick={() => setDeletingId(null)} className="btn-cancel">No</button>
                  </div>
                </div>
              ) : editingId === task.id ? (
                <div className="edit-mode">
                  <input 
                    type="text" 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    className="todo-input edit-input"
                    autoFocus
                  />
                  <div className="action-btns">
                    <button onClick={() => saveEdit(task.id)} className="btn-confirm">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="btn-cancel">Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <label className="task-label">
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className="task-text">{task.text}</span>
                  </label>
                  <div className="task-actions">
                    <button onClick={() => startEdit(task)} title="Editar" className="icon-btn">✏️</button>
                    <button onClick={() => confirmDelete(task.id)} title="Eliminar" className="icon-btn">🗑️</button>
                  </div>
                </>
              )}
            </li>
          ))}
          {/* Mensaje por si no hay tareas */}
          {tasks.length === 0 && <p className="empty-msg">No hay tareas pendientes.</p>}
        </ul>
      </div>
    `,
    css: `
.todo-list {
  background: var(--card-bg); border: 1px solid var(--card-border); padding: 48px;
  border-radius: 16px; width: 100%; max-width: 800px; box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1);
}
.todo-list h3 { margin: 0 0 32px 0; text-align: center; font-size: 36px; }
.todo-form { display: flex; gap: 16px; margin-bottom: 32px; }
.todo-input {
  flex-grow: 1; padding: 20px 24px; border-radius: 12px; font-size: 18px;
  border: 2px solid var(--card-border); background: var(--input-bg); color: inherit; outline: none;
}
.todo-input:focus { border-color: var(--accent); }
.todo-add-btn {
  padding: 20px 32px; border-radius: 12px; border: none; font-size: 18px;
  background: var(--accent); color: white; cursor: pointer; font-weight: bold;
}
.todo-items { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
.todo-item { background: var(--input-bg); padding: 20px 24px; border-radius: 12px; font-size: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; min-height: 40px; }
.task-label { display: flex; align-items: center; gap: 16px; cursor: pointer; margin: 0; flex-grow: 1; word-break: break-word; }
.todo-item input[type="checkbox"] { width: 24px; height: 24px; cursor: pointer; flex-shrink: 0; }
.todo-item.completed .task-text { text-decoration: line-through; color: var(--text-muted); }
.task-actions { display: flex; gap: 8px; flex-shrink: 0; }
.icon-btn { background: none; border: none; font-size: 24px; cursor: pointer; transition: transform 0.2s; padding: 4px; border-radius: 8px; }
.icon-btn:hover { background: var(--card-border); transform: scale(1.1); }
.delete-confirm, .edit-mode { display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.action-btns { display: flex; gap: 8px; }
.btn-confirm { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; }
.btn-cancel { background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; }
.edit-input { padding: 12px; font-size: 18px; flex-grow: 1; }
.empty-msg { text-align: center; color: var(--text-muted); font-style: italic; font-size: 18px; }

@media (max-width: 768px) {
  .todo-list { padding: 32px 20px; }
  .todo-list h3 { font-size: 28px; }
  .todo-form { flex-direction: column; }
  .todo-input { font-size: 16px; padding: 16px; }
  .todo-add-btn { font-size: 16px; padding: 16px; width: 100%; }
  .todo-item { padding: 16px; font-size: 16px; flex-direction: column; align-items: stretch; }
  .task-label { align-items: flex-start; }
  .todo-item input[type="checkbox"] { width: 20px; height: 20px; margin-top: 2px; }
  .task-actions { align-self: flex-end; }
  .delete-confirm, .edit-mode { flex-direction: column; align-items: stretch; }
  .action-btns { justify-content: space-between; }
  .action-btns button { flex: 1; }
}
    `
  },
  punto5: {
    title: "Punto 5 - Formulario Simple",
    extraCode: `
// Importamos useState para manejar los inputs
import { useState } from 'react';
`,
    state: `
  // Estado para capturar el nombre actual en el input
  const [name, setName] = useState('');
  // Estado para guardar el nombre una vez que se hizo submit
  const [submittedName, setSubmittedName] = useState('');

  // Validamos y guardamos el dato
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmittedName(name.trim());
      setName('');
    }
  };
`,
    jsx: `
      {/* Contenedor del formulario */}
      <div className="simple-form-container">
        <h3>Identificación</h3>
        {!submittedName ? (
          // Formulario visible si aún no se envió el nombre
          <form onSubmit={handleSubmit} className="simple-form">
            <div className="input-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input 
                id="username"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>
            <button type="submit" className="submit-btn">Enviar</button>
          </form>
        ) : (
          // Mensaje de éxito si ya se envió (sin usar alert)
          <div className="welcome-message">
            <div className="success-icon">✓</div>
            <h4>¡Bienvenido, {submittedName}!</h4>
            <button onClick={() => setSubmittedName('')} className="reset-btn">Volver</button>
          </div>
        )}
      </div>
    `,
    css: `
.simple-form-container {
  background: var(--card-bg); border: 1px solid var(--card-border); padding: 64px;
  border-radius: 20px; width: 100%; max-width: 600px; box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1);
}
.simple-form-container h3 { margin: 0 0 32px 0; text-align: center; font-size: 36px; }
.simple-form { display: flex; flex-direction: column; gap: 32px; }
.input-group { display: flex; flex-direction: column; gap: 12px; }
.input-group label { font-size: 18px; font-weight: bold; color: var(--text-muted); }
.input-group input {
  padding: 20px; border-radius: 12px; border: 2px solid var(--card-border);
  background: var(--input-bg); color: inherit; outline: none; font-size: 18px;
}
.input-group input:focus { border-color: var(--accent); }
.submit-btn, .reset-btn {
  padding: 20px; border-radius: 12px; border: none; font-size: 20px;
  background: var(--accent); color: white; cursor: pointer; font-weight: bold;
}
.welcome-message { display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; }
.success-icon {
  width: 100px; height: 100px; border-radius: 50%; background: var(--accent-hover);
  color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 48px;
}
.welcome-message h4 { margin: 0; font-size: 40px; }

@media (max-width: 768px) {
  .simple-form-container { padding: 32px 24px; }
  .simple-form-container h3 { font-size: 28px; }
  .input-group label { font-size: 16px; }
  .input-group input { padding: 16px; font-size: 16px; }
  .submit-btn, .reset-btn { padding: 16px; font-size: 18px; }
  .success-icon { width: 80px; height: 80px; font-size: 40px; }
  .welcome-message h4 { font-size: 28px; }
}
    `
  },
  punto6: {
    title: "Punto 6 - Ta Te Ti",
    extraCode: `
// Hook de estado para guardar los movimientos
import { useState } from 'react';

// Tipamos los posibles valores de cada celda
type Player = 'X' | 'O' | null;
`,
    state: `
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
`,
    jsx: `
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
              className={\`cell \${cell ? cell.toLowerCase() : ''}\`}
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
    `,
    css: `
.tic-tac-toe-container {
  background: var(--card-bg); border: 1px solid var(--card-border); padding: 48px;
  border-radius: 24px; box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1);
  display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 800px;
}
.tic-tac-toe-container h3 { margin: 0 0 32px 0; font-size: 48px; }
.game-status { margin-bottom: 32px; font-size: 28px; height: 32px; }
.winner-msg { color: var(--accent); font-weight: bold; }
.draw-msg { color: #ff758c; font-weight: bold; }
.board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; }
.cell {
  width: 150px; height: 150px; background: var(--input-bg); border: 4px solid var(--card-border);
  border-radius: 16px; font-size: 72px; font-weight: bold; color: inherit;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;
}
.cell:not(:disabled):hover { background: var(--accent-hover); border-color: var(--accent); transform: scale(1.05); }
.cell.x { color: var(--accent); }
.cell.o { color: #ff758c; }
.reset-game-btn {
  padding: 20px 40px; border-radius: 12px; border: none;
  background: var(--accent); color: white; cursor: pointer; font-weight: bold; font-size: 24px;
}

@media (max-width: 768px) {
  .tic-tac-toe-container { padding: 32px 16px; }
  .tic-tac-toe-container h3 { font-size: 36px; }
  .cell { width: 90px; height: 90px; font-size: 48px; border-radius: 12px; }
  .board { gap: 10px; margin-bottom: 24px; }
}
    `
  }
};

const mainTsxContent = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;

for (const key in components) {
  const comp = components[key];
  const isPunto1 = key === 'punto1';
  const importHooks = comp.extraCode?.includes('useState') ? '' : `import { useState } from 'react';\n`;
  
  const appTsxContent = `${comp.extraCode || ''}
${importHooks}import './App.css';

function App() {
  // Estado para el Modo Día/Noche. (Inicia en Dark por defecto)
  const [isDarkMode, setIsDarkMode] = useState(true);
${comp.state || ''}

  // Clase CSS dinámica según el modo
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={\`app-container \${themeClass}\`}>
      {/* Contenedor central limitado a 1200px para pantallas grandes (Requisito Max-Width) */}
      <div className="content-wrapper">
        ${comp.jsx}
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
`;

  const appCssContent = `${commonCSS}\n${comp.css}`;

  const readmeContent = `# ${comp.title}

Este proyecto es una entrega práctica utilizando React y Vite.
Se han cumplido todas las normativas exigidas:

- **Estructura limpia:** Solo archivos necesarios (\`src/main.tsx\`, \`src/App.tsx\`, \`index.html\`). No se han eliminado archivos críticos para evitar errores.
- **Max-Width 1200px:** El contenido respeta el tamaño máximo establecido.
- **Modo Día/Noche:** Se implementó un botón flotante abajo a la izquierda para cambiar manualmente el tema visual.
- **UX/UI:** Diseño moderno, responsivo y agradable, con transiciones.
- **Buenas Prácticas:** 
  - Código documentado mediante comentarios simples (\`//\`).
  - Prolijo, indentado y modular.
  - Cero usos de \`alert\`, \`require\` o métodos get innecesarios.

## Instalación y Uso
1. Abre una terminal en esta carpeta.
2. Ejecuta \`npm install\` para descargar los módulos (node_modules).
3. Ejecuta \`npm run dev\` para iniciar el servidor de desarrollo en tu navegador.
`;

  const dirPath = path.join(root, key);
  fs.writeFileSync(path.join(dirPath, 'src', 'App.tsx'), appTsxContent);
  fs.writeFileSync(path.join(dirPath, 'src', 'App.css'), appCssContent);
  fs.writeFileSync(path.join(dirPath, 'src', 'main.tsx'), mainTsxContent);
  fs.writeFileSync(path.join(dirPath, 'README.md'), readmeContent);
}

console.log('Todos los archivos inyectados con éxito!');
