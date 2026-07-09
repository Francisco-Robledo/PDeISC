import { body, param, validationResult } from 'express-validator';

const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;

export const validateAlumno = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2, max: 60 }).withMessage('El nombre debe tener entre 2 y 60 caracteres.')
    .matches(namePattern).withMessage('El nombre solo puede contener letras y espacios.')
    .escape(),
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio.')
    .isLength({ min: 2, max: 60 }).withMessage('El apellido debe tener entre 2 y 60 caracteres.')
    .matches(namePattern).withMessage('El apellido solo puede contener letras y espacios.')
    .escape(),
  body('edad')
    .notEmpty().withMessage('La edad es obligatoria.')
    .isInt({ min: 3, max: 120 }).withMessage('La edad debe ser un numero entero entre 3 y 120.'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Hay datos invalidos en el formulario.',
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    return next();
  }
];

export const validateAlumnoId = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un numero entero positivo.'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'El identificador recibido no es valido.',
        errors: errors.array().map((error) => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    return next();
  }
];
