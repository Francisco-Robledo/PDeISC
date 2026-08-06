import { useState } from 'react';
import './SimpleForm.css';

export default function SimpleForm() {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmittedName(name.trim());
      setName('');
    }
  };

  return (
    <div className="simple-form-container">
      <h3>Identificación</h3>
      {!submittedName ? (
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
        <div className="welcome-message">
          <div className="success-icon">✓</div>
          <h4>¡Bienvenido, {submittedName}!</h4>
          <button onClick={() => setSubmittedName('')} className="reset-btn">Volver</button>
        </div>
      )}
    </div>
  );
}
