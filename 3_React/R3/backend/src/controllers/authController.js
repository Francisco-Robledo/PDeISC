import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';

// Registro de usuario en BBDD SQL normalizada (3FN)
export function register(req, res) {
  try {
    const { name, email, password, role = 'usuario' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos (nombre, correo y contraseña) son obligatorios.'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Control de longitud y filtro de caracteres en Nombre
    if (cleanName.length < 3 || cleanName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'El nombre debe tener entre 3 y 50 caracteres.'
      });
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s]+$/.test(cleanName)) {
      return res.status(400).json({
        success: false,
        message: 'El nombre solo puede contener letras y espacios.'
      });
    }

    // 2. Control de formato y longitud de Correo
    if (cleanEmail.length > 80 || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'El formato de correo electrónico no es válido.'
      });
    }

    // 3. Complejidad y longitud de Contraseña
    if (cleanPassword.length < 8 || cleanPassword.length > 64) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe contener entre 8 y 64 caracteres.'
      });
    }
    const hasUpper = /[A-Z]/.test(cleanPassword);
    const hasLower = /[a-z]/.test(cleanPassword);
    const hasNumber = /\d/.test(cleanPassword);
    const hasSpecial = /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(cleanPassword);
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo especial.'
      });
    }

    // Bloqueo de contraseñas comunes
    const forbidden = ['password', '123456', 'admin123', 'qwerty'];
    if (forbidden.some(w => cleanPassword.toLowerCase().includes(w))) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña contiene secuencias obvias o inseguras no permitidas.'
      });
    }

    // 4. Verificación de duplicados en BBDD SQL
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico ya se encuentra registrado en el sistema.'
      });
    }

    // 5. Validación de lista blanca de Roles (3FN)
    const validRoles = ['admin', 'usuario', 'invitado'];
    const assignedRole = validRoles.includes(role) ? role : 'usuario';
    let roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get(assignedRole);
    if (!roleRow) {
      roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get('usuario');
    }

    // Hash de la contraseña con bcrypt (10 rondas de salt)
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(cleanPassword, saltRounds);

    const insertStmt = db.prepare(`
      INSERT INTO users (name, email, password, role_id, status)
      VALUES (?, ?, ?, ?, 'activo')
    `);

    const result = insertStmt.run(
      name.trim(),
      email.toLowerCase().trim(),
      passwordHash,
      roleRow.id
    );

    // Consulta con JOIN para recuperar el usuario con el nombre de su rol
    const newUser = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.created_at
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `).get(result.lastInsertRowid);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente en la BBDD SQL (3FN).',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al registrar el usuario.',
      error: error.message
    });
  }
}

// Inicio de sesión (Login)
export function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Debe ingresar su correo electrónico y contraseña.'
      });
    }

    // Consulta con JOIN para obtener los datos del usuario y rol asociado
    const user = db.prepare(`
      SELECT u.id, u.name, u.email, u.password, u.status, u.role_id, r.name as role
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `).get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas: usuario o contraseña incorrectos.'
      });
    }

    // Comprobación de contraseña hasheada mediante bcrypt
    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas: usuario o contraseña incorrectos.'
      });
    }

    if (user.status !== 'activo') {
      return res.status(403).json({
        success: false,
        message: 'Su cuenta está inactiva. Contacte al administrador.'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor durante el inicio de sesión.',
      error: error.message
    });
  }
}

// Obtener datos del usuario autenticado actual (Me)
export function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user
  });
}
