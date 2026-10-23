import { deleteAlumno, getAlumnos, loadConfig, updateAlumno } from './api.js';
import { formatTotal, renderAlumnosTable } from './table.js';
import { initTheme } from './theme.js';

const tableBody = document.getElementById('alumnosTableBody');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const totalBadge = document.getElementById('totalBadge');
const apiUrl = document.getElementById('apiUrl');
const lastUpdate = document.getElementById('lastUpdate');
const statusText = document.getElementById('statusText');
const toastElement = document.getElementById('feedbackToast');
const toast = new bootstrap.Toast(toastElement);
const scrollTopButton = document.getElementById('scrollTopButton');
const editForm = document.getElementById('editForm');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const confirmEditButton = document.getElementById('confirmEditButton');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const deleteModalText = document.getElementById('deleteModalText');
const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;
let alumnosCache = [];
let alumnoToDelete = null;

const showToast = (title, message) => {
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastBody').textContent = message;
  toast.show();
};

const setLoading = (isLoading) => {
  loadingState.classList.toggle('d-none', !isLoading);
};

const updateStatus = (message) => {
  statusText.textContent = message;
  lastUpdate.textContent = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(new Date());
};

const loadAlumnos = async () => {
  try {
    setLoading(true);
    const response = await getAlumnos();
    const alumnos = response.data;
    alumnosCache = alumnos;
    renderAlumnosTable(tableBody, alumnos);
    totalBadge.textContent = formatTotal(alumnos.length);
    emptyState.classList.toggle('d-none', alumnos.length > 0);
    updateStatus('Datos actualizados correctamente');
  } catch (error) {
    tableBody.innerHTML = '';
    totalBadge.textContent = formatTotal(0);
    emptyState.classList.add('d-none');
    updateStatus('No se pudo conectar con la API');
    showToast('Error de conexión', error.message);
  } finally {
    setLoading(false);
  }
};

const setFieldError = (field, message) => {
  const feedback = document.getElementById(`${field.id}Feedback`);
  field.classList.toggle('is-invalid', Boolean(message));
  field.classList.toggle('is-valid', !message && field.value.trim() !== '');
  feedback.textContent = message;
};

const validateEditField = (field) => {
  const value = field.value.trim();
  let message = '';

  if (!value) message = 'Este campo es obligatorio.';
  if (!message && ['editNombre', 'editApellido'].includes(field.id) && (value.length < 2 || value.length > 60)) {
    message = 'Debe tener entre 2 y 60 caracteres.';
  }
  if (!message && ['editNombre', 'editApellido'].includes(field.id) && !namePattern.test(value)) {
    message = 'Solo se permiten letras y espacios.';
  }
  if (!message && field.id === 'editEdad') {
    const edad = Number(value);
    if (!Number.isInteger(edad) || edad < 3 || edad > 120) {
      message = 'La edad debe ser un entero entre 3 y 120.';
    }
  }

  setFieldError(field, message);
  return !message;
};

const validateEditForm = () => {
  const fields = [editForm.elements.nombre, editForm.elements.apellido, editForm.elements.edad];
  return fields.every(validateEditField);
};

const clearEditValidation = () => {
  [editForm.elements.nombre, editForm.elements.apellido, editForm.elements.edad].forEach((field) => {
    field.classList.remove('is-invalid', 'is-valid');
  });
};

editForm.addEventListener('input', (event) => {
  if (event.target.name && event.target.name !== 'id') validateEditField(event.target);
});

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateEditForm()) return;

  const formData = new FormData(editForm);
  const id = formData.get('id');
  const alumno = Object.fromEntries(formData.entries());
  delete alumno.id;

  try {
    confirmEditButton.disabled = true;
    confirmEditButton.textContent = 'Actualizando...';
    const response = await updateAlumno(id, alumno);
    editModal.hide();
    showToast('Edición confirmada', response.message);
    await loadAlumnos();
  } catch (error) {
    showToast('No se pudo editar', error.message);
  } finally {
    confirmEditButton.disabled = false;
    confirmEditButton.textContent = 'Confirmar edición';
  }
});

tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const alumno = alumnosCache.find((item) => item.id === Number(button.dataset.id));
  if (!alumno) return;

  if (button.dataset.action === 'edit') {
    editForm.elements.id.value = alumno.id;
    editForm.elements.nombre.value = alumno.nombre;
    editForm.elements.apellido.value = alumno.apellido;
    editForm.elements.edad.value = alumno.edad;
    clearEditValidation();
    editModal.show();
  }

  if (button.dataset.action === 'delete') {
    alumnoToDelete = alumno;
    deleteModalText.textContent = `Vas a borrar a ${alumno.nombre} ${alumno.apellido}. Esta acción no se puede deshacer.`;
    deleteModal.show();
  }
});

confirmDeleteButton.addEventListener('click', async () => {
  if (!alumnoToDelete) return;

  try {
    confirmDeleteButton.disabled = true;
    confirmDeleteButton.textContent = 'Borrando...';
    const response = await deleteAlumno(alumnoToDelete.id);
    deleteModal.hide();
    showToast('Alumno eliminado', response.message);
    alumnoToDelete = null;
    await loadAlumnos();
  } catch (error) {
    showToast('No se pudo borrar', error.message);
  } finally {
    confirmDeleteButton.disabled = false;
    confirmDeleteButton.textContent = 'Borrar alumno';
  }
});

document.querySelectorAll('.navbar-collapse .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const navbarCollapse = document.getElementById('mainNavbar');
    if (navbarCollapse.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
    }
  });
});

window.addEventListener('scroll', () => {
  scrollTopButton.classList.toggle('is-visible', window.scrollY > 250);
});

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

initTheme(document.getElementById('themeToggle'));

loadConfig()
  .then((configuredApiUrl) => {
    apiUrl.textContent = configuredApiUrl;
    return loadAlumnos();
  })
  .catch((error) => {
    updateStatus('No se pudo leer la configuracion');
    showToast('Configuración no disponible', error.message);
  });
