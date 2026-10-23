import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const databaseName = process.env.DB_NAME || 'Score';

// Los identificadores SQL no admiten placeholders. Solo permitimos nombres
// convencionales para impedir que una variable de entorno altere la consulta.
if (!/^[A-Za-z0-9_]+$/.test(databaseName)) {
    throw new Error('DB_NAME solo puede contener letras, números y guiones bajos.');
}

const connectionOptions = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
};

const pool = mysql.createPool({
    ...connectionOptions,
    database: databaseName
});

/**
 * Crea la base y su tabla antes de aceptar peticiones.
 */
export const inicializarBaseDeDatos = async () => {
    const bootstrapConnection = await mysql.createConnection(connectionOptions);

    try {
        await bootstrapConnection.query(
            `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`
             CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
    } finally {
        await bootstrapConnection.end();
    }

    await pool.query(`
        CREATE TABLE IF NOT EXISTS score (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            tiempo INT UNSIGNED NOT NULL,
            puntos INT UNSIGNED NOT NULL,
            fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            nombre VARCHAR(30) NOT NULL,
            INDEX idx_score_puntos_tiempo (puntos DESC, tiempo ASC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log(`[MySQL] Base de datos ${databaseName} y tabla score listas.`);
};

export default pool;
