import { AlumnoService } from '../services/alumnoService.js';

export const getAlumnos = async (req, res, next) => {
  try {
    const alumnos = await AlumnoService.getAll();
    res.status(200).json({ success: true, data: alumnos });
  } catch (error) {
    next(error);
  }
};

export const getAlumnoById = async (req, res, next) => {
  try {
    const alumno = await AlumnoService.getById(req.params.id);
    res.status(200).json({ success: true, data: alumno });
  } catch (error) {
    next(error);
  }
};

export const createAlumno = async (req, res, next) => {
  try {
    const alumno = await AlumnoService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Alumno cargado correctamente.',
      data: alumno
    });
  } catch (error) {
    next(error);
  }
};

export const updateAlumno = async (req, res, next) => {
  try {
    const alumno = await AlumnoService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Alumno actualizado correctamente.',
      data: alumno
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAlumno = async (req, res, next) => {
  try {
    await AlumnoService.delete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Alumno eliminado correctamente.'
    });
  } catch (error) {
    next(error);
  }
};
