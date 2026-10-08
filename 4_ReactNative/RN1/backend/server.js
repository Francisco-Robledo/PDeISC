const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de conexión a MySQL (XAMPP / WAMP por defecto usa root sin contraseña en localhost:3306)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rn1_db',
  port: Number(process.env.DB_PORT) || 3306
};

// Función para obtener conexión
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Ruta de estado general
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    servicio: 'API Backend RN1 - Login de Usuarios',
    endpoints: {
      login: 'POST /api/login',
      estado: 'GET /api/status'
    }
  });
});

// Ruta para verificar conectividad con MySQL
app.get('/api/status', async (req, res) => {
  try {
    const connection = await getConnection();
    await connection.ping();
    await connection.end();
    return res.json({
      success: true,
      mensaje: 'Conexión a MySQL exitosa',
      database: dbConfig.database,
      host: dbConfig.host
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mensaje: 'No se pudo conectar a MySQL. Asegúrate de iniciar MySQL en XAMPP/WAMP y haber importado database.sql',
      error: error.message
    });
  }
});

// Endpoint principal: Búsqueda y Validación de Usuario
app.post('/api/login', async (req, res) => {
  // Aceptamos email/correo/usuario y password/contrasena
  const { email, correo, usuario, password, contrasena } = req.body;
  const loginIdentifier = email || correo || usuario;
  const loginPassword = password || contrasena;

  if (!loginIdentifier || !loginPassword) {
    return res.status(400).json({
      success: false,
      mensaje: 'Debe ingresar su correo/usuario y su contraseña.'
    });
  }

  let connection;
  try {
    connection = await getConnection();
    
    // Consulta preparada para buscar el usuario
    const sql = `
      SELECT id, nombre, email, rol, telefono, fecha_registro 
      FROM usuarios 
      WHERE (email = ? OR nombre = ?) AND password = ?
      LIMIT 1
    `;
    
    const [rows] = await connection.execute(sql, [loginIdentifier.trim(), loginIdentifier.trim(), loginPassword]);

    if (rows && rows.length > 0) {
      const userFound = rows[0];
      console.log(`[LOGIN ÉXITO] Usuario: ${userFound.nombre} (${userFound.email})`);
      
      return res.json({
        success: true,
        mensaje: `¡Bienvenido al sistema, ${userFound.nombre}!`,
        usuario: {
          id: userFound.id,
          nombre: userFound.nombre,
          email: userFound.email,
          rol: userFound.rol,
          telefono: userFound.telefono,
          fechaRegistro: userFound.fecha_registro
        }
      });
    } else {
      console.log(`[LOGIN FALLIDO] Intento con: ${loginIdentifier}`);
      return res.status(401).json({
        success: false,
        mensaje: 'Correo o contraseña incorrectos. Verifique sus credenciales.'
      });
    }

  } catch (error) {
    console.error('[ERROR BD]', error.message);

    // Fallback didáctico en caso de que MySQL no esté encendido en XAMPP durante pruebas iniciales
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_BAD_DB_ERROR') {
      console.warn('⚠️ AVISO: MySQL no está iniciado o falta la base de datos rn1_db.');

      // Usuarios demo predeterminados idénticos a database.sql
      const usuariosDemo = [
        {
          id: 1,
          nombre: 'Francisco Developer',
          email: 'admin@correo.com',
          password: 'admin123',
          rol: 'Administrador',
          telefono: '+56 9 1122 3344',
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'María González',
          email: 'maria@correo.com',
          password: '123456',
          rol: 'Supervisora',
          telefono: '+56 9 9988 7766',
          fechaRegistro: new Date().toISOString()
        },
        {
          id: 3,
          nombre: 'Carlos Rodríguez',
          email: 'carlos@correo.com',
          password: 'clave123',
          rol: 'Estudiante',
          telefono: '+56 9 5544 3322',
          fechaRegistro: new Date().toISOString()
        }
      ];

      const encontrado = usuariosDemo.find(
        u => (u.email.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
              u.nombre.toLowerCase() === loginIdentifier.trim().toLowerCase()) &&
             u.password === loginPassword
      );

      if (encontrado) {
        return res.json({
          success: true,
          mensaje: `¡Bienvenido al sistema, ${encontrado.nombre}!`,
          usuario: {
            id: encontrado.id,
            nombre: encontrado.nombre,
            email: encontrado.email,
            rol: encontrado.rol,
            telefono: encontrado.telefono,
            fechaRegistro: encontrado.fechaRegistro
          },
          advertencia: 'MySQL en XAMPP no está activo. Se usó autenticación fallback. Inicia MySQL en XAMPP para conectar la BD real.'
        });
      } else {
        return res.status(401).json({
          success: false,
          mensaje: 'Correo o contraseña incorrectos. Verifique sus datos.'
        });
      }
    }

    return res.status(500).json({
      success: false,
      mensaje: 'Error en el servidor o base de datos. Asegúrate de tener XAMPP con MySQL iniciado.',
      error: error.message
    });

  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` Servidor Backend RN1 activo en http://localhost:${PORT}`);
  console.log(` Para dispositivos en red local usa: http://TU_IP:${PORT}`);
  console.log(` Endpoint Login: POST http://localhost:${PORT}/api/login`);
  console.log(`=======================================================`);
});
