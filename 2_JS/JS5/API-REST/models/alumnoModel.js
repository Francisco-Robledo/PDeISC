import { pool } from '../config/database.js';

export class AlumnoModel {
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, nombre, apellido, edad FROM alumnos ORDER BY id DESC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, nombre, apellido, edad FROM alumnos WHERE id = ?',
      [id]
    );
    return rows[0] ?? null;
  }

  static async create({ nombre, apellido, edad }) {
    const [result] = await pool.execute(
      'INSERT INTO alumnos (nombre, apellido, edad) VALUES (?, ?, ?)',
      [nombre, apellido, edad]
    );

    return this.findById(result.insertId);
  }

  static async update(id, { nombre, apellido, edad }) {
    const [result] = await pool.execute(
      'UPDATE alumnos SET nombre = ?, apellido = ?, edad = ? WHERE id = ?',
      [nombre, apellido, edad, id]
    );

    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM alumnos WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }
}
