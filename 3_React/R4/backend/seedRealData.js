const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const realData = {
  profile: {
    id: 1,
    name: 'Francisco Robledo',
    title: 'Estudiante de Informática & Soporte Técnico',
    tagline: 'Estudiante de 7° año de la Tecnicatura en Informática Personal y Profesional (E.E.S.T. N°5 Amancio Williams, Mar del Plata).',
    bio: 'Estudiante de informática con fuerte interés en hardware, redes y tecnología. Me caracterizo por aprender rápido, trabajar en equipo y buscar soluciones prácticas. Con experiencia práctica en armado y reparación de PCs/notebooks, instalación de sistemas operativos, configuración de redes y routers, robótica de competición y desarrollo con Python, C++, React y Node.js. Busco mi primera experiencia laboral para desarrollar mis habilidades y aportar valor.',
    email: 'franciscorobledo0012@gmail.com',
    github: 'https://github.com/Francisco-Robledo',
    linkedin: 'https://github.com/Francisco-Robledo',
    location: 'Mar del Plata, Argentina',
    available_for_hire: 1,
    years_experience: '7° Año',
    projects_completed: 6,
    satisfaction_rate: 'Región 19',
    code_commits: '2 Certif.'
  },
  skills: [
    // Hardware y Mantenimiento
    ['Armar y Reparar PCs / Notebooks', 'hardware', 95, 'Boxes', 'Diagnóstico de componentes, ensamblado desde cero y solución de fallas físicas', '#4285F4'],
    ['Mantenimiento & Limpieza Integral', 'hardware', 95, 'Cpu', 'Formateo, aplicación de pasta térmica, limpieza de polvo y ventilación', '#34A853'],
    ['Cambio y Upgrade de Piezas', 'hardware', 92, 'Server', 'Instalación de memorias RAM, discos SSD/HDD, fuentes de alimentación y placas', '#FBBC05'],
    ['Instalación de Windows, Linux & Drivers', 'hardware', 95, 'ShieldCheck', 'Instalación limpia de sistemas operativos, configuración de controladores y optimización', '#EA4335'],

    // Redes
    ['Configuración de Routers & WiFi', 'networks', 88, 'Globe', 'Configuración de modems/routers hogareños, seguridad WPA3, DHCP y cableado', '#4285F4'],
    ['Cisco Packet Tracer & Topologías', 'networks', 88, 'Zap', 'Simulación de topologías de red, direccionamiento IPv4 y switches (Certificado Cisco)', '#3178C6'],

    // Programación & Software
    ['Python (Santander Open Academy)', 'software', 85, 'FileCode2', 'Lógica de programación, scripts, estructuras de datos y automatización (Certificado)', '#38BDF8'],
    ['C++ & Programación Orientada a Objetos', 'software', 82, 'FileCode2', 'Desarrollo con clases, punteros, herencia y estructuras algorítmicas', '#00599C'],
    ['React 19 & JavaScript Moderno', 'software', 85, 'Atom', 'Desarrollo de interfaces de usuario interactivas SPA y custom hooks reactivos', '#61DAFB'],
    ['Node.js & Express REST APIs', 'software', 80, 'Server', 'Servidores backend y endpoints REST para aplicaciones web', '#34A853'],
    ['TiDB Cloud (MySQL Serverless) & SQLite', 'database', 85, 'Database', 'Bases de datos relacionales, consultas SQL, persistencia en la nube', '#336791'],
    ['Robótica de Competición', 'hardware', 85, 'Sparkles', 'Armado mecánico y conexionado eléctrico de robot para fútbol robótico', '#EA4335'],

    // Habilidades Personales
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
  ]
};

async function seed() {
  console.log('🔄 Re-seeding database with 100% REAL and AUTHENTIC data for Francisco Robledo...');

  // 1. Update TiDB Cloud
  if (process.env.DATABASE_URL) {
    console.log('📡 Updating TiDB Cloud...');
    const conn = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    });

    try {
      // Ensure columns exist
      try {
        await conn.query('ALTER TABLE achievements ADD COLUMN certificate_image VARCHAR(500)');
      } catch (e) {}
      try {
        await conn.query('ALTER TABLE achievements ADD COLUMN pdf_url VARCHAR(500)');
      } catch (e) {}

      // Clear tables
      await conn.query('DELETE FROM profile');
      await conn.query('DELETE FROM skills');
      await conn.query('DELETE FROM projects');
      await conn.query('DELETE FROM experience');
      await conn.query('DELETE FROM achievements');
      await conn.query('DELETE FROM guestbook'); // Clear fake guestbook testimonials

      // Insert profile
      await conn.query(`
        INSERT INTO profile (
          id, name, title, tagline, bio, email, github, linkedin, location,
          available_for_hire, years_experience, projects_completed, satisfaction_rate, code_commits
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        realData.profile.id,
        realData.profile.name,
        realData.profile.title,
        realData.profile.tagline,
        realData.profile.bio,
        realData.profile.email,
        realData.profile.github,
        realData.profile.linkedin,
        realData.profile.location,
        realData.profile.available_for_hire,
        realData.profile.years_experience,
        realData.profile.projects_completed,
        realData.profile.satisfaction_rate,
        realData.profile.code_commits
      ]);

      // Insert skills
      for (const s of realData.skills) {
        await conn.query(`INSERT INTO skills (name, category, level, icon, description, color) VALUES (?, ?, ?, ?, ?, ?)`, s);
      }

      // Insert projects
      for (const p of realData.projects) {
        await conn.query(`INSERT INTO projects (title, subtitle, description, long_description, category, tags, demo_url, repo_url, image_gradient, likes, featured, metrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, p);
      }

      // Insert experience
      for (const e of realData.experience) {
        await conn.query(`INSERT INTO experience (role, company, period, description, highlights, type, badge_color) VALUES (?, ?, ?, ?, ?, ?, ?)`, e);
      }

      // Insert achievements
      for (const a of realData.achievements) {
        await conn.query(`INSERT INTO achievements (title, issuer, date, description, icon, credential_url, certificate_image, pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, a);
      }

      await conn.query(`
        CREATE TABLE IF NOT EXISTS congratulations (
          id INT PRIMARY KEY,
          count INT DEFAULT 38
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      const [cRows] = await conn.query('SELECT count FROM congratulations WHERE id = 1');
      if (cRows.length === 0) {
        await conn.query('INSERT INTO congratulations (id, count) VALUES (1, 38)');
      }

      console.log('✅ TiDB Cloud updated successfully with real data!');
    } finally {
      await conn.end();
    }
  }

  // 2. Update local SQLite
  console.log('📂 Updating local SQLite portfolio.db...');
  const dbPath = path.join(__dirname, 'portfolio.db');
  const db = new Database(dbPath);

  try {
    db.prepare('ALTER TABLE achievements ADD COLUMN certificate_image TEXT').run();
  } catch (e) {}
  try {
    db.prepare('ALTER TABLE achievements ADD COLUMN pdf_url TEXT').run();
  } catch (e) {}

  db.exec(`
    DELETE FROM profile;
    DELETE FROM skills;
    DELETE FROM projects;
    DELETE FROM experience;
    DELETE FROM achievements;
    DELETE FROM guestbook;
  `);

  db.prepare(`
    INSERT INTO profile (
      id, name, title, tagline, bio, email, github, linkedin, location,
      available_for_hire, years_experience, projects_completed, satisfaction_rate, code_commits
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    realData.profile.id,
    realData.profile.name,
    realData.profile.title,
    realData.profile.tagline,
    realData.profile.bio,
    realData.profile.email,
    realData.profile.github,
    realData.profile.linkedin,
    realData.profile.location,
    realData.profile.available_for_hire,
    realData.profile.years_experience,
    realData.profile.projects_completed,
    realData.profile.satisfaction_rate,
    realData.profile.code_commits
  );

  const insSkill = db.prepare(`INSERT INTO skills (name, category, level, icon, description, color) VALUES (?, ?, ?, ?, ?, ?)`);
  for (const s of realData.skills) insSkill.run(...s);

  const insProj = db.prepare(`INSERT INTO projects (title, subtitle, description, long_description, category, tags, demo_url, repo_url, image_gradient, likes, featured, metrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const p of realData.projects) insProj.run(...p);

  const insExp = db.prepare(`INSERT INTO experience (role, company, period, description, highlights, type, badge_color) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  for (const e of realData.experience) insExp.run(...e);

  const insAch = db.prepare(`INSERT INTO achievements (title, issuer, date, description, icon, credential_url, certificate_image, pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const a of realData.achievements) insAch.run(...a);

  db.exec(`
    CREATE TABLE IF NOT EXISTS congratulations (
      id INTEGER PRIMARY KEY,
      count INTEGER DEFAULT 38
    );
  `);
  const cRow = db.prepare('SELECT count FROM congratulations WHERE id = 1').get();
  if (!cRow) {
    db.prepare('INSERT INTO congratulations (id, count) VALUES (1, 38)').run();
  }

  console.log('✅ Local SQLite updated successfully!');
}

seed().catch(console.error);
