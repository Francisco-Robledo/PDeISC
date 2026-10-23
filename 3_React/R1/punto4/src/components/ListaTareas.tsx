import { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function ListaTareas() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

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

  return (
    <div className="todo-list">
      <h3>Lista de Tareas</h3>
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
        {tasks.length === 0 && <p className="empty-msg">No hay tareas pendientes.</p>}
      </ul>
    </div>
  );
}
