// Referencias a los elementos del DOM
const form = document.getElementById('user-form');
const inputNombre = document.getElementById('nombre');
const inputEmail = document.getElementById('email');
const errorNombre = document.getElementById('error-nombre');
const errorEmail = document.getElementById('error-email');
const btnSubmit = document.getElementById('btn-submit');
const btnClear = document.getElementById('btn-clear');
const responseContainer = document.getElementById('response-container');
const apiIdResult = document.getElementById('api-id-result');
const themeToggleBtn = document.getElementById('theme-toggle');
const scrollTopBtn = document.getElementById('scroll-top');

// Expresiones regulares para validación
// Permite solo letras (incluyendo acentos y ñ) y espacios.
const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; 
// Validación estándar para correos electrónicos.
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

// Validar Nombre
function validarNombre() {
  const valor = inputNombre.value.trim();
  if (valor.length < 3) {
    errorNombre.textContent = 'El nombre debe tener al menos 3 caracteres.';
    return false;
  }
  if (!regexNombre.test(valor)) {
    errorNombre.textContent = 'El nombre no permite números ni símbolos.';
    return false;
  }
  errorNombre.textContent = '';
  return true;
}

// Validar Email
function validarEmail() {
  const valor = inputEmail.value.trim();
  if (!regexEmail.test(valor)) {
    errorEmail.textContent = 'Ingrese un formato de correo válido.';
    return false;
  }
  errorEmail.textContent = '';
  return true;
}

// Restaurar botón de enviar si se modifican los datos
function restaurarBoton() {
  btnSubmit.disabled = false;
}

// Listeners para los inputs (validan en tiempo real y reactivan el botón)
inputNombre.addEventListener('input', () => {
  validarNombre();
  restaurarBoton();
});

inputEmail.addEventListener('input', () => {
  validarEmail();
  restaurarBoton();
});

// Evento de Envío del Formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evitar la recarga de página

  const esNombreValido = validarNombre();
  const esEmailValido = validarEmail();

  // No enviar si hay datos inválidos
  if (!esNombreValido || !esEmailValido) return;

  const datosPost = {
    nombre: inputNombre.value.trim(),
    email: inputEmail.value.trim()
  };

  try {
    // Usar axios.post() para mandar los datos a la API pública
    const response = await axios.post('https://jsonplaceholder.typicode.com/users', datosPost);
    
    // Mostrar en pantalla el ID recibido
    apiIdResult.textContent = `ID Asignado: ${response.data.id}`;
    responseContainer.classList.remove('hidden');

    // Desactivar el botón de enviar después de enviar correctamente
    btnSubmit.disabled = true;

  } catch (error) {
    console.error('// Error al enviar los datos:', error);
    alert('Ocurrió un error al conectar con la API.');
  }
});

// Evento de Limpiar Formulario
btnClear.addEventListener('click', () => {
  form.reset();
  errorNombre.textContent = '';
  errorEmail.textContent = '';
  responseContainer.classList.add('hidden');
  apiIdResult.textContent = '';
  // Al limpiar, volver a activar el botón de envío
  restaurarBoton(); 
});

// Funcionalidad: Modo Día / Noche
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    themeToggleBtn.textContent = '☀️ Modo Claro';
  } else {
    themeToggleBtn.textContent = '🌙 Modo Oscuro';
  }
});

// Funcionalidad: Botón Flotante (Scroll to Top)
window.addEventListener('scroll', () => {
  // Mostrar el botón solo cuando el usuario baje un poco (ej: 200px)
  if (window.scrollY > 200) {
    scrollTopBtn.classList.remove('hidden');
  } else {
    scrollTopBtn.classList.add('hidden');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
