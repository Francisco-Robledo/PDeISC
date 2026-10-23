import { createAlumno, deleteAlumno, getAlumnos, updateAlumno } from './api.js';
import { clearValidation, validateField, validateForm } from './validation.js';
import { initTheme } from './theme.js';

const form = document.getElementById('alumnoForm');
const editForm = document.getElementById('editForm');
const submitButton = document.getElementById('submitButton');
const clearButton = document.getElementById('clearButton');
const tableBody = document.getElementById('alumnosTableBody');
const emptyState = document.getElementById('emptyState');
const toastElement = document.getElementById('feedbackToast');
const toast = new bootstrap.Toast(toastElement);
const scrollTopButton = document.getElementById('scrollTopButton');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const confirmEditButton = document.getElementById('confirmEditButton');
const deleteModalText = document.getElementById('deleteModalText');
let alumnosCache = [];
let alumnoToDelete = null;

const showToast = (title, message) => {
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastBody').textContent = message;
  toast.show();
};

const setLoading = (isLoading) => {
  submitButton.disabled = isLoading;
  clearButton.disabled = isLoading || !hasFormContent();
  submitButton.textContent = isLoading ? 'Guardando...' : 'Guardar alumno';
};

const hasFormContent = () => {
  return [...form.elements]
    .filter((element) => ['nombre', 'apellido', 'edad'].includes(element.name))
    .some((element) => element.value.trim() !== '');
};

const updateClearButtonState = () => {
  clearButton.disabled = !hasFormContent() || submitButton.disabled;
};

const renderAlumnos = (alumnos) => {
  alumnosCache = alumnos;
  tableBody.innerHTML = alumnos.map((alumno) => `
    <tr>
      <th scope="row">${alumno.id}</th>
      <td>${alumno.nombre}</td>
      <td>${alumno.apellido}</td>
      <td>${alumno.edad}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-outline-primary" type="button" data-action="edit" data-id="${alumno.id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete" data-id="${alumno.id}">Borrar</button>
        </div>
      </td>
    </tr>
  `).join('');

  emptyState.classList.toggle('d-none', alumnos.length > 0);
};

const loadAlumnos = async () => {
  try {
    const response = await getAlumnos();
    renderAlumnos(response.data);
  } catch (error) {
    showToast('Error', error.message);
  }
};

form.addEventListener('input', (event) => {
  if (event.target.name) validateField(event.target);
  updateClearButtonState();
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    clearValidation(form);
    updateClearButtonState();
  }, 0);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateForm(form)) return;

  const formData = new FormData(form);
  const alumno = Object.fromEntries(formData.entries());

  try {
    setLoading(true);
    const response = await createAlumno(alumno);
    showToast('Alumno guardado', response.message);
    form.reset();
    clearValidation(form);
    updateClearButtonState();
    await loadAlumnos();
  } catch (error) {
    error.details.forEach((detail) => {
      const field = form.elements[detail.field];
      const feedback = document.getElementById(`${detail.field}Feedback`);
      if (field && feedback) {
        field.classList.add('is-invalid');
        feedback.textContent = detail.message;
      }
    });
    showToast('Revisá el formulario', error.message);
  } finally {
    setLoading(false);
  }
});

editForm.addEventListener('input', (event) => {
  if (event.target.name && event.target.name !== 'id') validateField(event.target);
});

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateForm(editForm)) return;

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
    clearValidation(editForm);
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
loadAlumnos();
