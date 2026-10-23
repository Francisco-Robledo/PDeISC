import pool from '../database/connection.js';

export const crearScore = async ({ nombre, puntos, tiempo }) => {
    const [result] = await pool.execute(
        'INSERT INTO score (nombre, puntos, tiempo) VALUES (?, ?, ?)',
        [nombre, puntos, tiempo]
    );

    return result.insertId;
};

export const obtenerTopScores = async () => {
    const [rows] = await pool.execute(`
        SELECT nombre, puntos, tiempo, fecha
        FROM score
        ORDER BY puntos DESC, tiempo ASC, fecha ASC
        LIMIT 10
    `);

    return rows;
};
