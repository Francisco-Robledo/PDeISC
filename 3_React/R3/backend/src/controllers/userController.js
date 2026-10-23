import bcrypt from 'bcryptjs';
import db from '../config/database.js';

// Obtener todos los usuarios con JOIN sobre roles (3FN)
export function getAllUsers(req, res) {
  try {
    const users = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.created_at, u.updated_at
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      ORDER BY u.id DESC
    `).all();

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al consultar la base de datos SQL.',
      error: error.message
    });
  }
}

// Obtener un usuario por ID
export function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.created_at, u.updated_at
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `).get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en la base de datos.'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al buscar el usuario en la base de datos SQL.',
      error: error.message
    });
  }
}

// Crear usuario desde panel administrativo
export function createUser(req, res) {
  try {
    const { name, email, password, role = 'usuario', status = 'activo' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son campos requeridos.'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Longitud y caracteres permitidos en Nombre
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

    // 2. Formato de Email
    if (cleanEmail.length > 80 || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de correo electrónico no válido.'
      });
    }

    // 3. Complejidad de Contraseña
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

    // 4. Verificación de duplicados
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'El email ya se encuentra registrado.'
      });
    }

    // 5. Lista blanca de roles
    const validRoles = ['admin', 'usuario', 'invitado'];
    const assignedRole = validRoles.includes(role) ? role : 'usuario';
    let roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get(assignedRole);
    if (!roleRow) {
      roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get('usuario');
    }

    const passwordHash = bcrypt.hashSync(cleanPassword, 10);
    const insertStmt = db.prepare(`
      INSERT INTO users (name, email, password, role_id, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      name.trim(),
      email.toLowerCase().trim(),
      passwordHash,
      roleRow.id,
      status
    );

    const newUser = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.created_at
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `).get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente en la base de datos SQL (3FN).',
      user: newUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al crear el usuario en la base de datos.',
      error: error.message
    });
  }
}

// Actualizar usuario
export function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, status, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailConflict = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email.toLowerCase().trim(), id);
      if (emailConflict) {
        return res.status(409).json({
          success: false,
          message: 'El nuevo correo ya está en uso por otro usuario.'
        });
      }
    }

    // Control de Acceso Basado en Roles (RBAC):
    // 1. Invitado: Sin permisos de modificación
    if (req.user.role === 'invitado') {
      return res.status(403).json({
        success: false,
        message: 'Acceso restringido: Las cuentas con rango "invitado" tienen permisos de sólo lectura.'
      });
    }

    // 2. Usuario estándar: Solo puede modificar su propia cuenta
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id, 10)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso restringido: Solo un Administrador puede modificar datos de otros usuarios.'
      });
    }

    // 3. Prevención de escalado de privilegios: Solo admin puede cambiar role_id o status
    let targetRoleId = user.role_id;
    if (req.user.role === 'admin' && role) {
      const roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get(role);
      if (roleRow) targetRoleId = roleRow.id;
    }

    const updatedName = name ? name.trim() : user.name;
    const updatedEmail = email ? email.toLowerCase().trim() : user.email;
    const updatedStatus = (req.user.role === 'admin' && status) ? status : user.status;

    let updateStmt;
    if (password && password.trim().length >= 6) {
      const passwordHash = bcrypt.hashSync(password, 10);
      updateStmt = db.prepare(`
        UPDATE users
        SET name = ?, email = ?, role_id = ?, status = ?, password = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(updatedName, updatedEmail, targetRoleId, updatedStatus, passwordHash, id);
    } else {
      updateStmt = db.prepare(`
        UPDATE users
        SET name = ?, email = ?, role_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(updatedName, updatedEmail, targetRoleId, updatedStatus, id);
    }

    const updatedUser = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.created_at, u.updated_at
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `).get(id);

    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente en la BBDD SQL (3FN).',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario en la base de datos.',
      error: error.message
    });
  }
}

// Eliminar usuario
export function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === parseInt(id, 10)) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta en sesión activa.'
      });
    }

    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    const deleteStmt = db.prepare('DELETE FROM users WHERE id = ?');
    deleteStmt.run(id);

    return res.status(200).json({
      success: true,
      message: `Usuario ${user.name} (${user.email}) eliminado permanentemente de la BBDD SQL.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario en la base de datos.',
      error: error.message
    });
  }
}

// Estadísticas de la BBDD SQL para el Dashboard (con verificación 3FN)
export function getDatabaseStats(req, res) {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const activeUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE status = 'activo'").get().count;
    
    // Conteo de administradores resolviendo clave foránea contra tabla roles
    const adminUsers = db.prepare(`
      SELECT COUNT(*) as count 
      FROM users u 
      INNER JOIN roles r ON u.role_id = r.id 
      WHERE r.name = 'admin'
    `).get().count;

    const rolesCount = db.prepare('SELECT COUNT(*) as count FROM roles').get().count;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        adminUsers,
        rolesCount,
        dbEngine: 'SQLite 3 (Relacional SQL con WAL Mode)',
        normalization: 'Tercera Forma Normal (3FN: roles + users con FK explícita)',
        security: 'bcrypt (10 salt rounds) + JWT Bearer Tokens'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de la base de datos.',
      error: error.message
    });
  }
}
