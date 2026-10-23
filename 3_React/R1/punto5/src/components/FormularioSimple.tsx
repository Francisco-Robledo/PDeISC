import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  age: string;
}

export default function FormularioSimple() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', age: '' });
  const [submittedName, setSubmittedName] = useState('');

  const isNameValid = formData.name.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name);
  const isEmailValid = formData.email.trim() !== '' && /^\S+@\S+\.\S+$/.test(formData.email);
  const ageNum = parseInt(formData.age, 10);
  const isAgeValid = formData.age !== '' && !isNaN(ageNum) && ageNum >= 18 && ageNum <= 100;

  const errors = {
    name: !isNameValid ? 'El nombre es requerido, mínimo 3 letras y solo texto.' : '',
    email: !isEmailValid ? 'Debe ser un correo electrónico válido.' : '',
    age: !isAgeValid ? 'La edad debe ser un número entre 18 y 100.' : ''
  };

  const isValid = isNameValid && isEmailValid && isAgeValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setSubmittedName(formData.name.trim());
      
      try {
        await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (err) {
        console.error('Error guardando los datos:', err);
      }
      
      setFormData({ name: '', email: '', age: '' });
    }
  };

  return (
    <div className="simple-form-container">
      <h3>Identificación</h3>
      {!submittedName ? (
        <form onSubmit={handleSubmit} className="simple-form" noValidate>
          <div className="input-group">
            <label htmlFor="name">Nombre de usuario</label>
            <input 
              id="name"
              name="name"
              type="text" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input 
              id="email"
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej. juan@correo.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="age">Edad</label>
            <input 
              id="age"
              name="age"
              type="number" 
              value={formData.age}
              onChange={handleChange}
              placeholder="Ej. 25"
              className={errors.age ? 'input-error' : ''}
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={!isValid}
            style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
          >
            Enviar y Guardar
          </button>
        </form>
      ) : (
        <div className="welcome-message">
          <div className="success-icon">✓</div>
          <h4>¡Bienvenido, {submittedName}!</h4>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Tus datos han sido guardados en el archivo registro.json en el proyecto.</p>
          <button onClick={() => setSubmittedName('')} className="reset-btn">Volver</button>
        </div>
      )}
    </div>
  );
}
