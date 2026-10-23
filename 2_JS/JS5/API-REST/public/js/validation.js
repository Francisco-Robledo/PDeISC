const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;

const rules = {
  nombre: (value) => {
    if (!value) return 'El nombre es obligatorio.';
    if (value.length < 2 || value.length > 60) return 'Debe tener entre 2 y 60 caracteres.';
    if (!namePattern.test(value)) return 'Solo se permiten letras y espacios.';
    return '';
  },
  apellido: (value) => {
    if (!value) return 'El apellido es obligatorio.';
    if (value.length < 2 || value.length > 60) return 'Debe tener entre 2 y 60 caracteres.';
    if (!namePattern.test(value)) return 'Solo se permiten letras y espacios.';
    return '';
  },
  edad: (value) => {
    const edad = Number(value);
    if (!value) return 'La edad es obligatoria.';
    if (!Number.isInteger(edad)) return 'La edad debe ser un numero entero.';
    if (edad < 3 || edad > 120) return 'La edad debe estar entre 3 y 120.';
    return '';
  }
};

export const validateField = (field) => {
  const message = rules[field.name](field.value.trim());
  const feedback = field.closest('form').querySelector(`#${field.id}Feedback`) || document.getElementById(`${field.name}Feedback`);

  field.classList.toggle('is-invalid', Boolean(message));
  field.classList.toggle('is-valid', !message && field.value.trim() !== '');
  feedback.textContent = message;

  return !message;
};

export const validateForm = (form) => {
  const fields = [...form.elements].filter((element) => rules[element.name]);
  return fields.every(validateField);
};

export const clearValidation = (form) => {
  [...form.elements].forEach((element) => {
    element.classList.remove('is-valid', 'is-invalid');
  });
};
