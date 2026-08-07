
// Importamos useState para la lista y el campo de texto
import { useState } from 'react';

// Estructura de una tarea individual
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

import './App.css';

function App() {
  // Estado para el Modo Día/Noche. (Inicia en Dark por defecto)
  const [isDarkMode, setIsDarkMode] = useState(true);

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


  // Clase CSS dinámica según el modo
  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`app-container ${themeClass}`}>
      {/* Contenedor central limitado a 1200px para pantallas grandes (Requisito Max-Width) */}
      <div className="content-wrapper">
        
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
            <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
              
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
