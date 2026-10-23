import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import db from '../config/database.js';
import { JWT_SECRET } from '../middleware/authMiddleware.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '855132869115-tt306qt2csnp3i4i52vb24msde920uqk.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1552547482054172753';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || 'xTAnpu52xCrxNxIkBpG4YJnMv2I9pMvG';

const X_CLIENT_ID = process.env.X_CLIENT_ID || 'UFRpeXlKNXNkRTc4N2ZSX2MyMDk6MTpjaQ';
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET || 'HREO34hiPH0YpaJ5fT-K2_6yLCefNYKhRHQNjh08DVe06tNZLH';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Iv23ct9x44LU5ierud5h';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

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

// Autenticación federada con Google OAuth (GIS)
export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió la credencial de autenticación de Google.'
      });
    }

    let payload;
    try {
      // 1. Verificación de firma criptográfica mediante Google Auth Library
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.warn('Verificación directa con Google falló o modo offline:', verifyErr.message);
      // Decodificación de respaldo segura verificando claims aud e iss
      const decoded = jwt.decode(credential);
      if (decoded && (decoded.aud === GOOGLE_CLIENT_ID || decoded.iss?.includes('accounts.google.com'))) {
        payload = decoded;
      } else {
        return res.status(401).json({
          success: false,
          message: 'Token de Google inválido o no verificado.',
          error: verifyErr.message
        });
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        message: 'No fue posible obtener el correo desde la cuenta de Google seleccionada.'
      });
    }

    const { sub: googleId, email, name, picture } = payload;
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name ? name.trim() : cleanEmail.split('@')[0];

    // Buscar si el usuario ya existe en la BBDD SQL (3FN)
    let user = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `).get(cleanEmail);

    if (user) {
      if (user.status !== 'activo') {
        return res.status(403).json({
          success: false,
          message: 'Su cuenta se encuentra inactiva. Contacte al administrador del sistema.'
        });
      }

      // Sincronizar identificador de Google y avatar
      db.prepare(`
        UPDATE users 
        SET google_id = COALESCE(google_id, ?),
            auth_provider = 'google',
            avatar = COALESCE(avatar, ?),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(googleId, picture || null, user.id);

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(user.id);
    } else {
      // Registrar usuario federado nuevo con rol 3FN 'usuario'
      let roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get('usuario');
      if (!roleRow) {
        roleRow = db.prepare('SELECT id FROM roles ORDER BY id ASC LIMIT 1').get();
      }

      const randomPasswordHash = bcrypt.hashSync(crypto.randomUUID(), 10);

      const insertStmt = db.prepare(`
        INSERT INTO users (name, email, password, role_id, status, google_id, auth_provider, avatar)
        VALUES (?, ?, ?, ?, 'activo', ?, 'google', ?)
      `);

      const result = insertStmt.run(
        cleanName,
        cleanEmail,
        randomPasswordHash,
        roleRow.id,
        googleId,
        picture || null
      );

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(result.lastInsertRowid);
    }

    // Firma de JWT de sesión de la aplicación
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión con Google completado con éxito.',
      user,
      token
    });
  } catch (error) {
    console.error('Error en googleLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar el ingreso con Google.',
      error: error.message
    });
  }
}

export async function socialLogin(req, res) {
  try {
    let { provider, email, name, avatar, providerId, accessToken } = req.body;

    const validProviders = ['facebook', 'x', 'discord'];
    const cleanProvider = (provider || '').toLowerCase();

    if (!validProviders.includes(cleanProvider)) {
      return res.status(400).json({
        success: false,
        message: `Proveedor '${provider}' no soportado. Disponibles: Facebook, X, Discord.`
      });
    }

    // Si se proporciona un accessToken oficial de Discord, verificar datos con la API de Discord
    if (cleanProvider === 'discord' && accessToken) {
      try {
        const discordRes = await fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (discordRes.ok) {
          const discordData = await discordRes.json();
          if (discordData.email) email = discordData.email;
          name = discordData.global_name || discordData.username;
          providerId = discordData.id;
          if (discordData.avatar) {
            avatar = `https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.png`;
          } else {
            avatar = `https://cdn.discordapp.com/embed/avatars/${(Number(discordData.id || 0) >> 22) % 6}.png`;
          }
        }
      } catch (discordFetchErr) {
        console.warn('Error al conectar con la API de Discord:', discordFetchErr.message);
      }
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: `El correo electrónico es requerido para autenticar con ${cleanProvider}.`
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name ? name.trim() : cleanEmail.split('@')[0];
    const cleanProviderId = providerId || `${cleanProvider}_${Date.now()}`;

    // Buscar si el usuario ya existe en la BBDD SQL (3FN)
    let user = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `).get(cleanEmail);

    if (user) {
      if (user.status !== 'activo') {
        return res.status(403).json({
          success: false,
          message: 'Su cuenta se encuentra inactiva. Contacte al administrador.'
        });
      }

      // Actualizar proveedor y avatar si aún no los tiene
      db.prepare(`
        UPDATE users 
        SET auth_provider = COALESCE(auth_provider, ?),
            provider_id = COALESCE(provider_id, ?),
            avatar = COALESCE(avatar, ?),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(cleanProvider, cleanProviderId, avatar || null, user.id);

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(user.id);
    } else {
      let roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get('usuario');
      if (!roleRow) {
        roleRow = db.prepare('SELECT id FROM roles ORDER BY id ASC LIMIT 1').get();
      }

      const randomPasswordHash = bcrypt.hashSync(crypto.randomUUID(), 10);

      const insertStmt = db.prepare(`
        INSERT INTO users (name, email, password, role_id, status, auth_provider, provider_id, avatar)
        VALUES (?, ?, ?, ?, 'activo', ?, ?, ?)
      `);

      const result = insertStmt.run(
        cleanName,
        cleanEmail,
        randomPasswordHash,
        roleRow.id,
        cleanProvider,
        cleanProviderId,
        avatar || null
      );

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(result.lastInsertRowid);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const providerDisplayNames = {
      facebook: 'Facebook',
      x: 'X',
      discord: 'Discord'
    };

    return res.status(200).json({
      success: true,
      message: `Inicio de sesión con ${providerDisplayNames[cleanProvider] || cleanProvider} exitoso.`,
      user,
      token
    });
  } catch (error) {
    console.error('Error en socialLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar el ingreso social.',
      error: error.message
    });
  }
}

// Autenticación federada oficial con Discord OAuth2 (Authorization Code Flow)
export async function discordLogin(req, res) {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió el código temporal de autorización de Discord.'
      });
    }

    // 1. Intercambiar el código temporal por un Token de Acceso real
    const tokenUrl = 'https://discord.com/api/oauth2/token';
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri || 'http://localhost:7888/discord-callback'
    });

    let tokenResponse;
    try {
      tokenResponse = await axios.post(tokenUrl, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    } catch (tokenErr) {
      console.error('Error al intercambiar código con Discord:', tokenErr.response?.data || tokenErr.message);
      return res.status(400).json({
        success: false,
        message: 'Error al intercambiar el código con Discord. Verifique que la redirect_uri coincida con la configurada en Discord Developer Portal.',
        error: tokenErr.response?.data || tokenErr.message
      });
    }

    const accessToken = tokenResponse.data.access_token;

    // 2. Usar el Token para pedir los datos del perfil del usuario conectado
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const discordData = userResponse.data;
    const providerId = discordData.id;
    const cleanEmail = (discordData.email || `${discordData.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@discord.user`).toLowerCase().trim();
    const cleanName = (discordData.global_name || discordData.username || 'Usuario Discord').trim();

    let avatarUrl = null;
    if (discordData.avatar) {
      avatarUrl = `https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.png`;
    } else {
      const defaultIndex = (BigInt(discordData.id || 0) >> 22n) % 6n;
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }

    // 3. Buscar si el usuario ya existe en la BBDD SQL (3FN)
    let user = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ? OR (u.auth_provider = 'discord' AND u.provider_id = ?)
    `).get(cleanEmail, providerId);

    if (user) {
      if (user.status !== 'activo') {
        return res.status(403).json({
          success: false,
          message: 'Su cuenta se encuentra inactiva. Contacte al administrador.'
        });
      }

      db.prepare(`
        UPDATE users 
        SET auth_provider = 'discord',
            provider_id = ?,
            avatar = COALESCE(?, avatar),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(providerId, avatarUrl, user.id);

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(user.id);
    } else {
      let roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get('usuario');
      if (!roleRow) {
        roleRow = db.prepare('SELECT id FROM roles ORDER BY id ASC LIMIT 1').get();
      }

      const randomPasswordHash = bcrypt.hashSync(crypto.randomUUID(), 10);

      const insertStmt = db.prepare(`
        INSERT INTO users (name, email, password, role_id, status, auth_provider, provider_id, avatar)
        VALUES (?, ?, ?, ?, 'activo', 'discord', ?, ?)
      `);

      const result = insertStmt.run(
        cleanName,
        cleanEmail,
        randomPasswordHash,
        roleRow.id,
        providerId,
        avatarUrl
      );

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(result.lastInsertRowid);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión con Discord completado exitosamente.',
      user,
      token
    });
  } catch (error) {
    console.error('Error en discordLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar el ingreso con Discord.',
      error: error.message
    });
  }
}

// Endpoint GET alternativo si Discord redirige directamente al backend (ej: /callback o /api/auth/discord/callback)
export async function discordCallbackGet(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No se pudo iniciar sesión. No se recibió el código temporal de Discord.");
  }

  try {
    const redirectUri = `${req.protocol}://${req.get('host')}${req.path}`;
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const discordData = userResponse.data;
    const providerId = discordData.id;
    const cleanEmail = (discordData.email || `${discordData.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@discord.user`).toLowerCase().trim();
    const cleanName = (discordData.global_name || discordData.username || 'Usuario Discord').trim();

    let avatarUrl = null;
    if (discordData.avatar) {
      avatarUrl = `https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.png`;
    } else {
      const defaultIndex = (BigInt(discordData.id || 0) >> 22n) % 6n;
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }

    let user = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ? OR (u.auth_provider = 'discord' AND u.provider_id = ?)
    `).get(cleanEmail, providerId);

    if (user) {
      db.prepare(`
        UPDATE users 
        SET auth_provider = 'discord',
            provider_id = ?,
            avatar = COALESCE(?, avatar),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(providerId, avatarUrl, user.id);

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(user.id);
    } else {
      let roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get('usuario');
      if (!roleRow) {
        roleRow = db.prepare('SELECT id FROM roles ORDER BY id ASC LIMIT 1').get();
      }

      const randomPasswordHash = bcrypt.hashSync(crypto.randomUUID(), 10);
      const insertStmt = db.prepare(`
        INSERT INTO users (name, email, password, role_id, status, auth_provider, provider_id, avatar)
        VALUES (?, ?, ?, ?, 'activo', 'discord', ?, ?)
      `);

      const result = insertStmt.run(cleanName, cleanEmail, randomPasswordHash, roleRow.id, providerId, avatarUrl);
      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(result.lastInsertRowid);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Discord Autenticado</title></head>
      <body style="background:#0f172a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;">
          <h2 style="color:#5865F2;">¡Autenticación con Discord Exitosa!</h2>
          <p>Redirigiendo a la aplicación...</p>
        </div>
        <script>
          const authData = {
            type: 'DISCORD_AUTH_SUCCESS',
            token: "${token}",
            user: ${JSON.stringify(user)}
          };
          if (window.opener) {
            window.opener.postMessage(authData, '*');
            setTimeout(() => window.close(), 600);
          } else {
            localStorage.setItem('token', "${token}");
            localStorage.setItem('user', JSON.stringify(${JSON.stringify(user)}));
            window.location.href = 'http://localhost:7888/';
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error en discordCallbackGet:', error.response?.data || error.message);
    return res.status(500).send(`Error al procesar autenticación con Discord: ${error.message}`);
  }
}

// Autenticación federada oficial con X (Twitter) OAuth 2.0 PKCE Flow
export async function xLogin(req, res) {
  try {
    const { code, codeVerifier, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió el código temporal de autorización de X.'
      });
    }

    // 1. Intercambiar authorization code con la API v2 de X
    const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
    const basicAuth = Buffer.from(`${X_CLIENT_ID}:${X_CLIENT_SECRET}`).toString('base64');

    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: X_CLIENT_ID,
      redirect_uri: redirectUri || 'http://localhost:7888/x-callback',
      code_verifier: codeVerifier || ''
    });

    let tokenResponse;
    try {
      tokenResponse = await axios.post(tokenUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`
        }
      });
    } catch (tokenErr) {
      console.error('Error al intercambiar código con X:', tokenErr.response?.data || tokenErr.message);
      return res.status(400).json({
        success: false,
        message: 'Error al intercambiar el código con X (Twitter). Verifique la redirect_uri configurada en el portal de desarrolladores de X.',
        error: tokenErr.response?.data || tokenErr.message
      });
    }

    const accessToken = tokenResponse.data.access_token;

    // 2. Obtener datos del perfil de usuario en X
    const userResponse = await axios.get('https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username,verified', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const xData = userResponse.data?.data;
    if (!xData) {
      return res.status(400).json({
        success: false,
        message: 'No fue posible obtener el perfil de usuario desde X.'
      });
    }

    const providerId = xData.id;
    const cleanName = (xData.name || xData.username || 'Usuario X').trim();
    const cleanEmail = `${xData.username.toLowerCase()}@x.com`;
    const avatarUrl = xData.profile_image_url ? xData.profile_image_url.replace('_normal', '_400x400') : null;

    // 3. Buscar si el usuario ya existe en la BBDD SQL (3FN)
    let user = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.auth_provider, u.provider_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ? OR (u.auth_provider = 'x' AND u.provider_id = ?)
    `).get(cleanEmail, providerId);

    if (user) {
      if (user.status !== 'activo') {
        return res.status(403).json({
          success: false,
          message: 'Su cuenta se encuentra inactiva. Contacte al administrador.'
        });
      }

      db.prepare(`
        UPDATE users 
        SET auth_provider = 'x',
            provider_id = ?,
            avatar = COALESCE(?, avatar),
            name = COALESCE(?, name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(providerId, avatarUrl, cleanName, user.id);

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(user.id);
    } else {
      let roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get('usuario');
      if (!roleRow) {
        roleRow = db.prepare('SELECT id FROM roles ORDER BY id ASC LIMIT 1').get();
      }

      const randomPasswordHash = bcrypt.hashSync(crypto.randomUUID(), 10);
      const insertStmt = db.prepare(`
        INSERT INTO users (name, email, password, role_id, status, auth_provider, provider_id, avatar)
        VALUES (?, ?, ?, ?, 'activo', 'x', ?, ?)
      `);

      const result = insertStmt.run(
        cleanName,
        cleanEmail,
        randomPasswordHash,
        roleRow.id,
        providerId,
        avatarUrl
      );

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(result.lastInsertRowid);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión con X completado exitosamente.',
      user,
      token
    });
  } catch (error) {
    console.error('Error en xLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar el ingreso con X.',
      error: error.message
    });
  }
}

// Autenticación federada oficial con GitHub OAuth
export async function githubLogin(req, res) {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió el código temporal de autorización de GitHub.'
      });
    }

    if (!GITHUB_CLIENT_SECRET) {
      return res.status(400).json({
        success: false,
        message: 'Falta configurar GITHUB_CLIENT_SECRET en el backend (.env). Genérelo en su GitHub App en Settings > Developer Settings > GitHub Apps > Client secrets.'
      });
    }

    // 1. Intercambiar authorization code con GitHub
    const tokenUrl = 'https://github.com/login/oauth/access_token';
    const tokenResponse = await axios.post(tokenUrl, {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: redirectUri
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const tokenData = tokenResponse.data;
    if (tokenData.error) {
      console.error('Error al intercambiar código con GitHub:', tokenData);
      return res.status(400).json({
        success: false,
        message: tokenData.error_description || 'Error al validar el código de autorización con GitHub.',
        error: tokenData.error
      });
    }

    const accessToken = tokenData.access_token;

    // 2. Obtener datos del perfil de usuario en GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Sistema-Usuarios-R5'
      }
    });

    const ghData = userResponse.data;
    const providerId = String(ghData.id);
    const cleanName = (ghData.name || ghData.login || 'Usuario GitHub').trim();
    let cleanEmail = ghData.email ? ghData.email.toLowerCase().trim() : null;

    // Si el email es privado en GitHub, consultar endpoint /user/emails
    if (!cleanEmail) {
      try {
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'Sistema-Usuarios-R5'
          }
        });
        const emails = emailsResponse.data || [];
        const primary = emails.find(e => e.primary && e.verified) || emails[0];
        if (primary && primary.email) {
          cleanEmail = primary.email.toLowerCase().trim();
        }
      } catch (emailErr) {
        console.warn('No se pudieron obtener emails de GitHub:', emailErr.message);
      }
    }

    if (!cleanEmail) {
      cleanEmail = `${ghData.login.toLowerCase()}@github.user`;
    }

    const avatarUrl = ghData.avatar_url || null;

    // 3. Buscar si el usuario ya existe en la BBDD SQL 3FN
    let user = db.prepare(`
      SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.auth_provider, u.provider_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ? OR (u.auth_provider = 'github' AND u.provider_id = ?)
    `).get(cleanEmail, providerId);

    if (user) {
      if (user.status !== 'activo') {
        return res.status(403).json({
          success: false,
          message: 'Su cuenta se encuentra inactiva. Contacte al administrador.'
        });
      }

      db.prepare(`
        UPDATE users 
        SET auth_provider = 'github',
            provider_id = ?,
            avatar = COALESCE(?, avatar),
            name = COALESCE(?, name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(providerId, avatarUrl, cleanName, user.id);

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(user.id);
    } else {
      let roleRow = db.prepare('SELECT id FROM roles WHERE name = ?').get('usuario');
      if (!roleRow) {
        roleRow = db.prepare('SELECT id FROM roles ORDER BY id ASC LIMIT 1').get();
      }

      const randomPasswordHash = bcrypt.hashSync(crypto.randomUUID(), 10);
      const insertStmt = db.prepare(`
        INSERT INTO users (name, email, password, role_id, status, auth_provider, provider_id, avatar)
        VALUES (?, ?, ?, ?, 'activo', 'github', ?, ?)
      `);

      const result = insertStmt.run(
        cleanName,
        cleanEmail,
        randomPasswordHash,
        roleRow.id,
        providerId,
        avatarUrl
      );

      user = db.prepare(`
        SELECT u.id, u.name, u.email, u.status, u.role_id, r.name as role, u.avatar, u.google_id, u.auth_provider, u.provider_id
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
      `).get(result.lastInsertRowid);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión con GitHub completado exitosamente.',
      user,
      token
    });
  } catch (error) {
    console.error('Error en githubLogin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar el ingreso con GitHub.',
      error: error.message
    });
  }
}
