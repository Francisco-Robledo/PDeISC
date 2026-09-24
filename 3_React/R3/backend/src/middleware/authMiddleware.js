import jwt from 'jsonwebtoken';
import db from '../config/database.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_r3_estanga_2026';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: Token de sesión no proporcionado.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Formato de token inválido. Debe ser: Bearer <token>'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Consulta con INNER JOIN para resolver el rol desde la tabla normalizada roles (3FN)
    const user = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `).get(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'El usuario asociado al token ya no existe.'
      });
    }

    if (user.status !== 'activo') {
      return res.status(403).json({
        success: false,
        message: 'La cuenta de usuario se encuentra suspendida o inactiva.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado. Inicie sesión nuevamente.',
      error: error.message
    });
  }
}

// Middleware para Control de Acceso Basado en Roles (RBAC)
export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado: Se requiere inicio de sesión previo.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso restringido: Esta acción requiere rango (${allowedRoles.join(', ')}). Tu rango actual es "${req.user.role}".`
      });
    }

    next();
  };
}

export default verifyToken;
