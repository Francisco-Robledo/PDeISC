import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Configuración de optimización y claves foráneas explícitas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDatabase() {
  // Verificamos si existe la tabla con esquema anterior para migrar a 3FN
  const tableInfo = db.prepare("PRAGMA table_info(users)").all();
  const hasRoleId = tableInfo.some(col => col.name === 'role_id');

  if (tableInfo.length > 0 && !hasRoleId) {
    // Si la tabla existía con columna de texto directo, la recreamos para cumplir estrictamente 3FN
    db.exec(`DROP TABLE IF EXISTS users; DROP TABLE IF EXISTS roles;`);
  }

  // Creación de esquemas relacionales normalizados en Tercera Forma Normal (3FN)
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      status TEXT DEFAULT 'activo',
      google_id TEXT,
      avatar TEXT,
      auth_provider TEXT DEFAULT 'local',
      provider_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
    );
  `);

  // Asegurar columnas de OAuth (Google, Facebook, X, Discord) si la tabla ya existía
  const currentCols = db.prepare("PRAGMA table_info(users)").all();
  if (!currentCols.some(col => col.name === 'google_id')) {
    db.exec("ALTER TABLE users ADD COLUMN google_id TEXT;");
  }
  if (!currentCols.some(col => col.name === 'avatar')) {
    db.exec("ALTER TABLE users ADD COLUMN avatar TEXT;");
  }
  if (!currentCols.some(col => col.name === 'auth_provider')) {
    db.exec("ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'local';");
  }
  if (!currentCols.some(col => col.name === 'provider_id')) {
    db.exec("ALTER TABLE users ADD COLUMN provider_id TEXT;");
  }

  // Normalizar registros existentes
  db.exec(`
    UPDATE users SET auth_provider = 'google' WHERE google_id IS NOT NULL AND (auth_provider IS NULL OR auth_provider = 'local');
    UPDATE users SET auth_provider = 'local' WHERE auth_provider IS NULL;
  `);

  // Insertar roles relacionales si no existen
  const checkRoles = db.prepare('SELECT COUNT(*) as count FROM roles').get();
  if (checkRoles.count === 0) {
    const insertRole = db.prepare('INSERT INTO roles (name) VALUES (?)');
    insertRole.run('admin');
    insertRole.run('usuario');
    insertRole.run('invitado');
  }

  // Insertar usuarios semilla si la tabla está vacía
  const checkUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (checkUsers.count === 0) {
    console.log('🌱 Inicializando datos semilla en BBDD SQL normalizada (3FN)...');
    
    const getRoleId = db.prepare('SELECT id FROM roles WHERE name = ?');
    const adminRoleId = getRoleId.get('admin').id;
    const userRoleId = getRoleId.get('usuario').id;

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password, role_id, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Hashing de contraseñas con bcrypt (10 rondas de salting)
    const adminHash = bcrypt.hashSync('Admin123!', 10);
    const userHash = bcrypt.hashSync('User123!', 10);

    insertUser.run('Administrador General', 'admin@sistema.com', adminHash, adminRoleId, 'activo');
    insertUser.run('Martín Estanga (Docente)', 'martin.estanga@universidad.edu', userHash, adminRoleId, 'activo');
    insertUser.run('Franco Alumno', 'alumno@sistema.com', userHash, userRoleId, 'activo');
    insertUser.run('Lucía Gómez', 'lucia.gomez@empresa.com', userHash, userRoleId, 'inactivo');

    console.log('✅ Esquema 3FN y usuarios semilla creados con éxito.');
  }
}

initDatabase();

export default db;
