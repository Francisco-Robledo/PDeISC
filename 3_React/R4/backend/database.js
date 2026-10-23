const path = require('path');
require('dotenv').config();

const isTiDB = Boolean(process.env.DATABASE_URL || process.env.TIDB_HOST);

let sqliteDb = null;
let mysqlPool = null;

if (isTiDB) {
  console.log('📡 TiDB Cloud / MySQL mode detected via environment variables.');
  const mysql = require('mysql2/promise');

  if (process.env.DATABASE_URL) {
    mysqlPool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 10
    });
  } else {
    mysqlPool = mysql.createPool({
      host: process.env.TIDB_HOST,
      port: Number(process.env.TIDB_PORT) || 4000,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE || 'portfolio',
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 10
    });
  }
} else {
  console.log('📂 Local SQLite mode active (portfolio.db with WAL mode).');
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'portfolio.db');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');
}

// -------------------------------------------------------------
// Initialization & Table Creation
// -------------------------------------------------------------
async function initDatabase() {
  if (isTiDB) {
    await initTiDB();
  } else {
    initSQLite();
  }
}

function initSQLite() {
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      tagline TEXT NOT NULL,
      bio TEXT NOT NULL,
      email TEXT NOT NULL,
      github TEXT NOT NULL,
      linkedin TEXT NOT NULL,
      location TEXT NOT NULL,
      available_for_hire INTEGER DEFAULT 1,
      years_experience TEXT NOT NULL,
      projects_completed INTEGER NOT NULL,
      satisfaction_rate TEXT NOT NULL,
      code_commits TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      level INTEGER NOT NULL,
      icon TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#4285F4'
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      category TEXT NOT NULL,
      tags TEXT NOT NULL,
      demo_url TEXT,
      repo_url TEXT,
      image_gradient TEXT,
      likes INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 1,
      metrics TEXT
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT NOT NULL,
      highlights TEXT NOT NULL,
      type TEXT NOT NULL,
      badge_color TEXT DEFAULT '#4285F4'
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      credential_url TEXT,
      certificate_image TEXT,
      pdf_url TEXT
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_status INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      role_or_company TEXT,
      avatar_color TEXT DEFAULT '#4285F4',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    sqliteDb.prepare('ALTER TABLE achievements ADD COLUMN certificate_image TEXT').run();
  } catch (e) {}
  try {
    sqliteDb.prepare('ALTER TABLE achievements ADD COLUMN pdf_url TEXT').run();
  } catch (e) {}

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS congratulations (
      id INTEGER PRIMARY KEY,
      count INTEGER DEFAULT 38
    );
  `);
  const initCongrat = sqliteDb.prepare('SELECT count FROM congratulations WHERE id = 1').get();
  if (!initCongrat) {
    sqliteDb.prepare('INSERT INTO congratulations (id, count) VALUES (1, 38)').run();
  }

  const existing = sqliteDb.prepare('SELECT * FROM profile WHERE id = 1').get();
  if (!existing) {
    seedSQLite();
  }
}

async function initTiDB() {
  try {
    const conn = await mysqlPool.getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS profile (
          id INT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          tagline TEXT NOT NULL,
          bio TEXT NOT NULL,
          email VARCHAR(255) NOT NULL,
          github VARCHAR(255) NOT NULL,
          linkedin VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          available_for_hire INT DEFAULT 1,
          years_experience VARCHAR(50) NOT NULL,
          projects_completed INT NOT NULL,
          satisfaction_rate VARCHAR(50) NOT NULL,
          code_commits VARCHAR(50) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS skills (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          level INT NOT NULL,
          icon VARCHAR(100) NOT NULL,
          description TEXT,
          color VARCHAR(50) DEFAULT '#4285F4'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          subtitle VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          long_description TEXT,
          category VARCHAR(100) NOT NULL,
          tags TEXT NOT NULL,
          demo_url VARCHAR(500),
          repo_url VARCHAR(500),
          image_gradient VARCHAR(255),
          likes INT DEFAULT 0,
          featured INT DEFAULT 1,
          metrics VARCHAR(255)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS experience (
          id INT AUTO_INCREMENT PRIMARY KEY,
          role VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          period VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          highlights TEXT NOT NULL,
          type VARCHAR(50) NOT NULL,
          badge_color VARCHAR(50) DEFAULT '#4285F4'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS achievements (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          issuer VARCHAR(255) NOT NULL,
          date VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          icon VARCHAR(100) NOT NULL,
          credential_url VARCHAR(500),
          certificate_image VARCHAR(500),
          pdf_url VARCHAR(500)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      try {
        await conn.query('ALTER TABLE achievements ADD COLUMN certificate_image VARCHAR(500)');
      } catch (e) {}
      try {
        await conn.query('ALTER TABLE achievements ADD COLUMN pdf_url VARCHAR(500)');
      } catch (e) {}

      await conn.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255),
          message TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          read_status INT DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS guestbook (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          role_or_company VARCHAR(255),
          avatar_color VARCHAR(50) DEFAULT '#4285F4',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS congratulations (
          id INT PRIMARY KEY,
          count INT DEFAULT 38
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const [congratRows] = await conn.query('SELECT count FROM congratulations WHERE id = 1');
      if (congratRows.length === 0) {
        await conn.query('INSERT INTO congratulations (id, count) VALUES (1, 38)');
      }

      const [rows] = await conn.query('SELECT id FROM profile WHERE id = 1');
      if (rows.length === 0) {
        await seedTiDB(conn);
      }
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('❌ Failed to initialize TiDB Cloud database:', err.message);
  }
}

// -------------------------------------------------------------
// Unified Data Access Layer (Async for Both Engines)
// -------------------------------------------------------------
const dbAdapter = {
  isTiDB,

  async getPortfolio() {
    if (isTiDB) {
      const [profiles] = await mysqlPool.query('SELECT * FROM profile WHERE id = 1');
      const [skills] = await mysqlPool.query('SELECT * FROM skills ORDER BY level DESC');
      const [projects] = await mysqlPool.query('SELECT * FROM projects ORDER BY featured DESC, id ASC');
      const [experience] = await mysqlPool.query('SELECT * FROM experience ORDER BY id ASC');
      const [achievements] = await mysqlPool.query('SELECT * FROM achievements ORDER BY id ASC');
      const [guestbook] = await mysqlPool.query('SELECT * FROM guestbook ORDER BY id DESC LIMIT 20');

      return {
        profile: profiles[0] || null,
        skills,
        projects: projects.map(p => ({ ...p, tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags })),
        experience: experience.map(e => ({ ...e, highlights: typeof e.highlights === 'string' ? JSON.parse(e.highlights) : e.highlights })),
        achievements,
        guestbook,
        congratulations: await this.getCongratulations()
      };
    } else {
      const profile = sqliteDb.prepare('SELECT * FROM profile WHERE id = 1').get();
      const skills = sqliteDb.prepare('SELECT * FROM skills ORDER BY level DESC').all();
      const projects = sqliteDb.prepare('SELECT * FROM projects ORDER BY featured DESC, id ASC').all();
      const experience = sqliteDb.prepare('SELECT * FROM experience ORDER BY id ASC').all();
      const achievements = sqliteDb.prepare('SELECT * FROM achievements ORDER BY id ASC').all();
      const guestbook = sqliteDb.prepare('SELECT * FROM guestbook ORDER BY id DESC LIMIT 20').all();

      return {
        profile,
        skills,
        projects: projects.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') })),
        experience: experience.map(e => ({ ...e, highlights: JSON.parse(e.highlights || '[]') })),
        achievements,
        guestbook,
        congratulations: await this.getCongratulations()
      };
    }
  },

  async getCongratulations() {
    if (isTiDB) {
      const [rows] = await mysqlPool.query('SELECT count FROM congratulations WHERE id = 1');
      return rows[0] ? rows[0].count : 38;
    } else {
      const row = sqliteDb.prepare('SELECT count FROM congratulations WHERE id = 1').get();
      return row ? row.count : 38;
    }
  },

  async addCongratulations() {
    if (isTiDB) {
      await mysqlPool.query('UPDATE congratulations SET count = count + 1 WHERE id = 1');
      const [rows] = await mysqlPool.query('SELECT count FROM congratulations WHERE id = 1');
      return rows[0] ? rows[0].count : 39;
    } else {
      sqliteDb.prepare('UPDATE congratulations SET count = count + 1 WHERE id = 1').run();
      const row = sqliteDb.prepare('SELECT count FROM congratulations WHERE id = 1').get();
      return row ? row.count : 39;
    }
  },

  async getProjects() {
    if (isTiDB) {
      const [projects] = await mysqlPool.query('SELECT * FROM projects ORDER BY featured DESC, id ASC');
      return projects.map(p => ({ ...p, tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags }));
    } else {
      const projects = sqliteDb.prepare('SELECT * FROM projects ORDER BY featured DESC, id ASC').all();
      return projects.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') }));
    }
  },

  async likeProject(id) {
    if (isTiDB) {
      await mysqlPool.query('UPDATE projects SET likes = likes + 1 WHERE id = ?', [id]);
      const [rows] = await mysqlPool.query('SELECT id, likes FROM projects WHERE id = ?', [id]);
      return rows[0] || null;
    } else {
      sqliteDb.prepare('UPDATE projects SET likes = likes + 1 WHERE id = ?').run(id);
      return sqliteDb.prepare('SELECT id, likes FROM projects WHERE id = ?').get(id);
    }
  },

  async createContactMessage(name, email, subject, message) {
    if (isTiDB) {
      const [result] = await mysqlPool.query(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message]
      );
      return { id: result.insertId };
    } else {
      const info = sqliteDb.prepare(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
      ).run(name, email, subject, message);
      return { id: info.lastInsertRowid };
    }
  },

  async getContactMessages() {
    if (isTiDB) {
      const [rows] = await mysqlPool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
      return rows;
    } else {
      return sqliteDb.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    }
  },

  async getGuestbookEntries() {
    if (isTiDB) {
      const [rows] = await mysqlPool.query('SELECT * FROM guestbook ORDER BY id DESC LIMIT 50');
      return rows;
    } else {
      return sqliteDb.prepare('SELECT * FROM guestbook ORDER BY id DESC LIMIT 50').all();
    }
  },

  async addGuestbookEntry(name, message, role_or_company, avatar_color) {
    if (isTiDB) {
      const [res] = await mysqlPool.query(
        'INSERT INTO guestbook (name, message, role_or_company, avatar_color) VALUES (?, ?, ?, ?)',
        [name, message, role_or_company, avatar_color]
      );
      const [rows] = await mysqlPool.query('SELECT * FROM guestbook WHERE id = ?', [res.insertId]);
      return rows[0];
    } else {
      const info = sqliteDb.prepare(
        'INSERT INTO guestbook (name, message, role_or_company, avatar_color) VALUES (?, ?, ?, ?)'
      ).run(name, message, role_or_company, avatar_color);
      return sqliteDb.prepare('SELECT * FROM guestbook WHERE id = ?').get(info.lastInsertRowid);
    }
  }
};

// -------------------------------------------------------------
// Seeding Data Helpers
// -------------------------------------------------------------
const seedConstants = {
  profile: [
    1,
    'Francisco Robledo',
    'Estudiante de Informática & Soporte Técnico',
    'Estudiante de 7° año de la Tecnicatura en Informática Personal y Profesional (E.E.S.T. N°5 Amancio Williams, Mar del Plata).',
    'Estudiante de informática con fuerte interés en hardware, redes y tecnología. Me caracterizo por aprender rápido, trabajar en equipo y buscar soluciones prácticas. Con experiencia práctica en armado y reparación de PCs/notebooks, instalación de sistemas operativos, configuración de redes y routers, robótica de competición y desarrollo con Python, C++, React y Node.js. Busco mi primera experiencia laboral para desarrollar mis habilidades y aportar valor.',
    'franciscorobledo0012@gmail.com',
    'https://github.com/Francisco-Robledo',
    'https://github.com/Francisco-Robledo',
    'Mar del Plata, Argentina',
    1,
    '7° Año',
    6,
    'Región 19',
    '2 Certif.'
  ],
  skills: [
    ['Armar y Reparar PCs / Notebooks', 'hardware', 95, 'Boxes', 'Diagnóstico de componentes, ensamblado desde cero y solución de fallas físicas', '#4285F4'],
    ['Mantenimiento & Limpieza Integral', 'hardware', 95, 'Cpu', 'Formateo, aplicación de pasta térmica, limpieza de polvo y ventilación', '#34A853'],
    ['Cambio y Upgrade de Piezas', 'hardware', 92, 'Server', 'Instalación de memorias RAM, discos SSD/HDD, fuentes de alimentación y placas', '#FBBC05'],
    ['Instalación de Windows, Linux & Drivers', 'hardware', 95, 'ShieldCheck', 'Instalación limpia de sistemas operativos, configuración de controladores y optimización', '#EA4335'],
    ['Configuración de Routers & WiFi', 'networks', 88, 'Globe', 'Configuración de modems/routers hogareños, seguridad WPA3, DHCP y cableado', '#4285F4'],
    ['Cisco Packet Tracer & Topologías', 'networks', 88, 'Zap', 'Simulación de topologías de red, direccionamiento IPv4 y switches (Certificado Cisco)', '#3178C6'],
    ['Python (Santander Open Academy)', 'software', 85, 'FileCode2', 'Lógica de programación, scripts, estructuras de datos y automatización (Certificado)', '#38BDF8'],
    ['C++ & Programación Orientada a Objetos', 'software', 82, 'FileCode2', 'Desarrollo con clases, punteros, herencia y estructuras algorítmicas', '#00599C'],
    ['React 19 & JavaScript Moderno', 'software', 85, 'Atom', 'Desarrollo de interfaces de usuario interactivas SPA y custom hooks reactivos', '#61DAFB'],
    ['Node.js & Express REST APIs', 'software', 80, 'Server', 'Servidores backend y endpoints REST para aplicaciones web', '#34A853'],
    ['TiDB Cloud (MySQL Serverless) & SQLite', 'database', 85, 'Database', 'Bases de datos relacionales, consultas SQL, persistencia en la nube', '#336791'],
    ['Robótica de Competición', 'hardware', 85, 'Sparkles', 'Armado mecánico y conexionado eléctrico de robot para fútbol robótico', '#EA4335'],
    ['Trabajo en Equipo & Comunicación', 'soft', 95, 'Palette', 'Coordinación efectiva en proyectos interdisciplinarios y competencias', '#FBBC05'],
    ['Aprendizaje Rápido & Proactividad', 'soft', 95, 'Zap', 'Capacidad inmediata de asimilación de nuevas tecnologías y herramientas', '#34A853']
  ],
  projects: [
    [
      'R4: Material You Portfolio SPA',
      'Portafolio Web interactivo con React 19, TiDB Cloud y animaciones',
      'Aplicación web Single Page diseñada con la estética de Google Material Design 3, atajo omnibox (Ctrl+K), animaciones fluidas con Framer Motion y base de datos distribuida en TiDB Cloud Serverless.',
      'Proyecto integrador R4 desarrollado con las mejores prácticas de la web moderna. Conecta el frontend React 19 a una base de datos MySQL Serverless en TiDB Cloud (AWS sa-east-1) para almacenar mensajes de contacto, libro de firmas y contadores reactivos.',
      'Full Stack',
      JSON.stringify(['React 19', 'TypeScript', 'TiDB Cloud', 'Node.js', 'Framer Motion', 'Tailwind CSS']),
      '#',
      'https://github.com/Francisco-Robledo',
      'from-blue-600 via-indigo-600 to-purple-600',
      12,
      1,
      'Google Material You • TiDB Cloud MySQL'
    ],
    [
      'R3: Sistema de Gestión y Administración de Usuarios',
      'Plataforma Corporativa con Control de Roles, Auditoría y Filtros',
      'Panel administrativo para la gestión integral de usuarios, asignación de roles y permisos, auditoría de eventos y estadísticas con filtros reactivos en tiempo real.',
      'Desarrollado con arquitectura modular y componentes reactivos. Permite realizar altas, bajas, modificaciones (CRUD), búsqueda instantánea con filtros por departamento y estado, y persistencia en base de datos.',
      'Web App',
      JSON.stringify(['React', 'JavaScript', 'Node.js', 'Express', 'MySQL / SQLite', 'CSS3']),
      'https://github.com/Francisco-Robledo',
      'https://github.com/Francisco-Robledo',
      'from-emerald-500 via-teal-600 to-cyan-700',
      9,
      1,
      'CRUD Dinámico • Gestión de Usuarios'
    ],
    [
      'PDeISC: Proyectos de Software y Sistemas (React + Node + JS)',
      'Repositorio Oficial de Desarrollo de Sistemas Computacionales',
      'Conjunto de aplicaciones y módulos desarrollados para la Tecnicatura en Informática que abarcan JavaScript moderno, interfaces con React y servicios con Node.js.',
      'Repositorio alojado en GitHub (@Francisco-Robledo/PDeISC) que reúne módulos de programación: manipulación del DOM, consumo de APIs REST, componentes React y backend en Node.js.',
      'Desarrollo Web',
      JSON.stringify(['JavaScript', 'React', 'Node.js', 'Express', 'DOM API']),
      'https://github.com/Francisco-Robledo/PDeISC',
      'https://github.com/Francisco-Robledo/PDeISC',
      'from-amber-500 via-orange-500 to-rose-600',
      15,
      1,
      'Repositorio GitHub Oficial'
    ],
    [
      'Robot para Competencia de Fútbol Robótico',
      'Montaje Mecánico, Electrónica y Calibración en Equipo',
      'Construcción y puesta a punto de un robot competitivo para el torneo escolar de fútbol robótico de la Escuela Técnica N°5 Amancio Williams.',
      'Proyecto multidisciplinario de hardware y robótica. El equipo diseñó el chasis, conexionó motores DC, controladores de potencia, alimentación por baterías y ajuste de tracción para competir en la cancha robótica.',
      'Robótica & Hardware',
      JSON.stringify(['Robótica', 'Hardware', 'Electrónica', 'C++', 'Trabajo en Equipo']),
      'https://github.com/Francisco-Robledo',
      'https://github.com/Francisco-Robledo',
      'from-violet-600 via-purple-600 to-pink-600',
      21,
      1,
      'Robot de Competición • E.E.S.T. N°5'
    ],
    [
      'TP CEmpleado: Modelado de Software OOP en C++',
      'Paradigma de Programación Orientada a Objetos',
      'Aplicación en C++ para el modelado empresarial de personal, aplicando principios de encapsulamiento, herencia, estructuras de datos y cálculo de salarios.',
      'Proyecto en C++ que implementa clases CEmpleado, validación de datos, métodos de cálculo y gestión de datos en memoria para el Taller de Programación.',
      'Algoritmos & C++',
      JSON.stringify(['C++', 'POO', 'Algoritmos', 'Estructuras de Datos']),
      'https://github.com/Francisco-Robledo/TPN-18-OOP-03--CEmpleado',
      'https://github.com/Francisco-Robledo/TPN-18-OOP-03--CEmpleado',
      'from-sky-600 via-blue-700 to-slate-800',
      8,
      0,
      'C++ Orientado a Objetos'
    ],
    [
      'Simulación de Redes en Cisco Packet Tracer',
      'Diseño de Topologías LAN/WLAN y Ruteo de Paquetes',
      'Esquemas y laboratorios de infraestructura de redes con direccionamiento IP, configuración de routers y switches avalados por Cisco Networking Academy.',
      'Proyecto práctico de telecomunicaciones que comprende diseño de topologías, segmentación en subredes, configuración de servicios DHCP/DNS básicos y diagnóstico de conectividad con ping y traceroute.',
      'Redes & Cisco',
      JSON.stringify(['Cisco Packet Tracer', 'Redes', 'IPv4', 'Routers', 'Switches']),
      'https://github.com/Francisco-Robledo',
      'https://github.com/Francisco-Robledo',
      'from-teal-600 via-emerald-600 to-green-700',
      14,
      0,
      'Certificado Cisco Networking Academy'
    ]
  ],
  experience: [
    [
      'Estudiante de Informática Personal y Profesional (7° Año)',
      'E.E.S.T. N°5 "Amancio Williams" (Mar del Plata)',
      '2019 - Presente',
      'Formación técnica integral con foco en hardware de PCs, sistemas operativos, redes informáticas, programación, bases de datos y robótica.',
      JSON.stringify([
        'Representante de la Región 19 en la Feria de Ciencias 2024 con proyecto tecnológico.',
        'Participación en competencia de fútbol robótico con robot construido y ensamblado en equipo.',
        'Laboratorios prácticos en diagnóstico y reparación de computadoras, redes LAN y desarrollo de software.'
      ]),
      'education',
      '#4285F4'
    ],
    [
      'Mantenimiento de Hardware y Soporte Técnico',
      'Servicio Técnico Independiente & Prácticas Formativas',
      '2023 - Presente',
      'Armado, reparación y puesta a punto de computadoras personales, notebooks y conectividad de redes.',
      JSON.stringify([
        'Armado de PCs a medida y actualización de piezas (memorias RAM, discos SSD/HDD, fuentes y placas).',
        'Mantenimiento preventivo y correctivo: limpieza de polvo, cambio de pasta térmica y formateo.',
        'Instalación de sistemas operativos Windows/Linux, configuración de drivers y software esencial.',
        'Configuración de routers WiFi hogareños, cableado de red y solución de problemas de conectividad.'
      ]),
      'work',
      '#34A853'
    ]
  ],
  achievements: [
    [
      'Representante de la Región 19 — Feria de Ciencias 2024',
      'Feria de Educación, Arte, Ciencia y Tecnología',
      '2024',
      'Distinción y representación oficial de la Región 19 con proyecto de investigación y desarrollo tecnológico presentado ante jurados evaluadores.',
      'Award',
      'https://github.com/Francisco-Robledo',
      null,
      null
    ],
    [
      'Introducción a Cisco Packet Tracer',
      'Cisco Networking Academy',
      '2024',
      'Certificado oficial otorgado por Cisco Networking Academy (Directora Lynn Bloomer) por completar con éxito el programa. Cert ID: 2ae3a921-aaf6-4599-bf65-c73fd3064690.',
      'CheckCircle2',
      'https://www.netacad.com/',
      '/certificates/cisco_packet_tracer.png',
      '/certificates/cisco_packet_tracer.pdf'
    ],
    [
      'Certificación en Python (Santander Open Academy)',
      'Santander | Open Academy',
      '24 de julio de 2025',
      'Certificado de finalización de curso especializado en Python (8 Horas, 2 Módulos con Autoevaluación aprobada). Número de serie: OA-2025-0724001472589.',
      'ShieldCheck',
      'https://app.santanderopenacademy.com/',
      '/certificates/santander_python.png',
      '/certificates/santander_python.pdf'
    ],
    [
      'Competencia de Fútbol Robótico',
      'E.E.S.T. N°5 Amancio Williams',
      '2024',
      'Participación destacada en competencia de robótica con robot de fútbol diseñado, construido y puesto a prueba en equipo.',
      'Sparkles',
      'https://github.com/Francisco-Robledo',
      null,
      null
    ]
  ],
  guestbook: []
};

function seedSQLite() {
  console.log('Seeding SQLite database with rich data for Francisco Robledo...');
  sqliteDb.prepare(`
    INSERT INTO profile (
      id, name, title, tagline, bio, email, github, linkedin, location,
      available_for_hire, years_experience, projects_completed, satisfaction_rate, code_commits
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(...seedConstants.profile);

  const insSkill = sqliteDb.prepare(`INSERT INTO skills (name, category, level, icon, description, color) VALUES (?, ?, ?, ?, ?, ?)`);
  for (const s of seedConstants.skills) insSkill.run(...s);

  const insProj = sqliteDb.prepare(`INSERT INTO projects (title, subtitle, description, long_description, category, tags, demo_url, repo_url, image_gradient, likes, featured, metrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const p of seedConstants.projects) insProj.run(...p);

  const insExp = sqliteDb.prepare(`INSERT INTO experience (role, company, period, description, highlights, type, badge_color) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  for (const e of seedConstants.experience) insExp.run(...e);

  const insAch = sqliteDb.prepare(`INSERT INTO achievements (title, issuer, date, description, icon, credential_url, certificate_image, pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const a of seedConstants.achievements) insAch.run(...a);

  const insG = sqliteDb.prepare(`INSERT INTO guestbook (name, message, role_or_company, avatar_color) VALUES (?, ?, ?, ?)`);
  for (const g of seedConstants.guestbook) insG.run(...g);
}

async function seedTiDB(conn) {
  console.log('⚡ Seeding TiDB Cloud database with initial portfolio data...');
  await conn.query(`
    INSERT INTO profile (
      id, name, title, tagline, bio, email, github, linkedin, location,
      available_for_hire, years_experience, projects_completed, satisfaction_rate, code_commits
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, seedConstants.profile);

  for (const s of seedConstants.skills) {
    await conn.query(`INSERT INTO skills (name, category, level, icon, description, color) VALUES (?, ?, ?, ?, ?, ?)`, s);
  }

  for (const p of seedConstants.projects) {
    await conn.query(`INSERT INTO projects (title, subtitle, description, long_description, category, tags, demo_url, repo_url, image_gradient, likes, featured, metrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, p);
  }

  for (const e of seedConstants.experience) {
    await conn.query(`INSERT INTO experience (role, company, period, description, highlights, type, badge_color) VALUES (?, ?, ?, ?, ?, ?, ?)`, e);
  }

  for (const a of seedConstants.achievements) {
    await conn.query(`INSERT INTO achievements (title, issuer, date, description, icon, credential_url, certificate_image, pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, a);
  }

  for (const g of seedConstants.guestbook) {
    await conn.query(`INSERT INTO guestbook (name, message, role_or_company, avatar_color) VALUES (?, ?, ?, ?)`, g);
  }

  console.log('✅ TiDB Cloud database successfully initialized & seeded!');
}

module.exports = {
  dbAdapter,
  initDatabase
};
