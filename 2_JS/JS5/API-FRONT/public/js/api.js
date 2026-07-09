let apiBaseUrl = '';

const parseJson = async (response) => {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || 'No se pudo obtener la informacion solicitada.');
  }

  return payload;
};

export const loadConfig = async () => {
  const response = await fetch('/config');
  const payload = await parseJson(response);
  apiBaseUrl = payload.data.apiBaseUrl;
  return apiBaseUrl;
};

export const getAlumnos = async () => {
  const response = await fetch(`${apiBaseUrl}/alumnos`);
  return parseJson(response);
};

export const updateAlumno = async (id, alumno) => {
  const response = await fetch(`${apiBaseUrl}/alumnos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alumno)
  });

  return parseJson(response);
};

export const deleteAlumno = async (id) => {
  const response = await fetch(`${apiBaseUrl}/alumnos/${id}`, {
    method: 'DELETE'
  });

  return parseJson(response);
};
