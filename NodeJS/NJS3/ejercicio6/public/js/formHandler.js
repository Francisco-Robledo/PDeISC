const validators = {
    nombre: (field) => {
        const value = field.value.trim();

        if (!value) {
            return 'El nombre es obligatorio.';
        }

        if (value.length < 3) {
            return 'El nombre debe tener al menos 3 caracteres.';
        }

        if (value.length > 50) {
            return 'El nombre no puede superar los 50 caracteres.';
        }

        if (!/^[\p{L}\s]+$/u.test(value)) {
            return 'El nombre solo puede contener letras y espacios.';
        }

        return '';
    },
    email: (field) => {
        const value = field.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!value) {
            return 'El correo electronico es obligatorio.';
        }

        if (!emailPattern.test(value)) {
            return 'Ingresa un correo valido, por ejemplo nombre@ejemplo.com.';
        }

        return '';
    },
    edad: (field) => {
        const value = Number(field.value);

        if (!field.value) {
            return 'La edad es obligatoria.';
        }

        if (value < 18) {
            return 'Debes tener al menos 18 anios.';
        }

        if (value > 120) {
            return 'La edad no puede ser mayor a 120.';
        }

        return '';
    },
    pais: (field) => {
        if (!field.value) {
            return 'Selecciona un pais.';
        }

        return '';
    },
    terminos: (field) => {
        if (!field.checked) {
            return 'Debes aceptar los terminos y condiciones.';
        }

        return '';
    },
};

const setFieldState = (field, errorMessage) => {
    const feedback = document.getElementById(`${field.id}Feedback`);

    field.classList.toggle('is-invalid', Boolean(errorMessage));
    field.classList.toggle('is-valid', !errorMessage);

    if (feedback) {
        feedback.textContent = errorMessage;
    }
};

const validateField = (field) => {
    const validator = validators[field.id];

    if (!validator) {
        return true;
    }

    const errorMessage = validator(field);
    setFieldState(field, errorMessage);

    return !errorMessage;
};

const validateGenero = () => {
    const options = document.querySelectorAll('input[name="genero"]');
    const selectedOption = document.querySelector('input[name="genero"]:checked');
    const feedback = document.getElementById('generoFeedback');
    const errorMessage = selectedOption ? '' : 'Selecciona un genero.';

    options.forEach((option) => {
        option.classList.toggle('is-invalid', Boolean(errorMessage));
        option.classList.toggle('is-valid', !errorMessage);
    });

    if (feedback) {
        feedback.textContent = errorMessage;
    }

    return !errorMessage;
};

const validateForm = (formElement) => {
    const fields = formElement.querySelectorAll('#nombre, #email, #edad, #pais, #terminos');
    const fieldsAreValid = [...fields].map(validateField).every(Boolean);
    const generoIsValid = validateGenero();

    return fieldsAreValid && generoIsValid;
};

const clearValidationState = (formElement) => {
    formElement.querySelectorAll('.is-valid, .is-invalid').forEach((field) => {
        field.classList.remove('is-valid', 'is-invalid');
    });

    formElement.querySelectorAll('.invalid-feedback').forEach((feedback) => {
        feedback.textContent = '';
    });
};

export const initFormValidation = (formElement) => {
    const fields = formElement.querySelectorAll('#nombre, #email, #edad, #pais, #terminos');
    const generoOptions = formElement.querySelectorAll('input[name="genero"]');

    fields.forEach((field) => {
        const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';

        field.addEventListener(eventName, () => {
            validateField(field);
        });
    });

    generoOptions.forEach((option) => {
        option.addEventListener('change', validateGenero);
    });
};

export const handleFormSubmit = (event, formElement, containerElement, emptyMessageElement) => {
    // 1. Evitar que la pagina se recargue
    event.preventDefault();

    if (!validateForm(formElement)) {
        return;
    }

    // 2. Extraer los datos de los campos
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const edad = document.getElementById('edad').value;
    const pais = document.getElementById('pais').value;

    // Para los radio buttons, buscamos el que esta checked
    const generoSeleccionado = document.querySelector('input[name="genero"]:checked');
    const genero = generoSeleccionado ? generoSeleccionado.value : '';

    const terminos = document.getElementById('terminos').checked ? 'Si' : 'No';

    // 3. Crear el bloque HTML con los datos
    const userCard = document.createElement('div');
    userCard.className = 'card border-info';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title text-info';
    title.textContent = nombre;

    const list = document.createElement('ul');
    list.className = 'list-group list-group-flush';

    const fields = [
        ['Email', email],
        ['Edad', `${edad} anios`],
        ['Pais', pais],
        ['Genero', genero],
        ['Terminos Aceptados', terminos],
    ];

    fields.forEach(([label, value]) => {
        const item = document.createElement('li');
        item.className = 'list-group-item bg-transparent';

        const strong = document.createElement('strong');
        strong.textContent = `${label}: `;

        item.append(strong, document.createTextNode(value));
        list.appendChild(item);
    });

    cardBody.append(title, list);
    userCard.appendChild(cardBody);

    // 4. Quitar el mensaje de "vacio" si existe
    if (emptyMessageElement && emptyMessageElement.parentNode) {
        emptyMessageElement.remove();
    }

    // 5. Inyectar dinamicamente en el contenedor
    containerElement.appendChild(userCard);

    // 6. Limpiar el formulario para un nuevo ingreso
    formElement.reset();
    clearValidationState(formElement);
};
