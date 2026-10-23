const API_URL = '/api/alumnos';

const parseJson = async (response) => {
  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload.message || 'No se pudo completar la operacion.');
    error.details = payload.errors || [];
    throw error;
  }

  return payload;
};

export const getAlumnos = async () => {
  const response = await fetch(API_URL);
  return parseJson(response);
};

export const createAlumno = async (alumno) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alumno)
  });

  return parseJson(response);
};

export const updateAlumno = async (id, alumno) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alumno)
  });

  return parseJson(response);
};

export const deleteAlumno = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  return parseJson(response);
};
