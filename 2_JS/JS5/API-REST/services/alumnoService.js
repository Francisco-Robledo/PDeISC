import { AlumnoModel } from '../models/alumnoModel.js';

const normalizeText = (value) => value.trim().replace(/\s+/g, ' ');

export class AlumnoService {
  static async getAll() {
    return AlumnoModel.findAll();
  }

  static async getById(id) {
    const alumno = await AlumnoModel.findById(Number(id));

    if (!alumno) {
      const error = new Error('No se encontro un alumno con el id indicado.');
      error.statusCode = 404;
      throw error;
    }

    return alumno;
  }

  static async create(data) {
    const alumno = {
      nombre: normalizeText(data.nombre),
      apellido: normalizeText(data.apellido),
      edad: Number(data.edad)
    };

    return AlumnoModel.create(alumno);
  }

  static async update(id, data) {
    const alumno = {
      nombre: normalizeText(data.nombre),
      apellido: normalizeText(data.apellido),
      edad: Number(data.edad)
    };

    const updatedAlumno = await AlumnoModel.update(Number(id), alumno);

    if (!updatedAlumno) {
      const error = new Error('No se encontro un alumno para actualizar.');
      error.statusCode = 404;
      throw error;
    }

    return updatedAlumno;
  }

  static async delete(id) {
    const wasDeleted = await AlumnoModel.delete(Number(id));

    if (!wasDeleted) {
      const error = new Error('No se encontro un alumno para eliminar.');
      error.statusCode = 404;
      throw error;
    }

    return wasDeleted;
  }
}
