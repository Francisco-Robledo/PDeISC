import type { PortfolioData } from '../types/portfolio';

export const fallbackPortfolioData: PortfolioData = {
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
    { id: 1, name: 'Armar y Reparar PCs / Notebooks', category: 'hardware' as any, level: 95, icon: 'Boxes', description: 'Diagnóstico de componentes, ensamblado desde cero y solución de fallas físicas', color: '#4285F4' },
    { id: 2, name: 'Mantenimiento & Limpieza Integral', category: 'hardware' as any, level: 95, icon: 'Cpu', description: 'Formateo, aplicación de pasta térmica, limpieza de polvo y ventilación', color: '#34A853' },
    { id: 3, name: 'Cambio y Upgrade de Piezas', category: 'hardware' as any, level: 92, icon: 'Server', description: 'Instalación de memorias RAM, discos SSD/HDD, fuentes de alimentación y placas', color: '#FBBC05' },
    { id: 4, name: 'Instalación de Windows, Linux & Drivers', category: 'hardware' as any, level: 95, icon: 'ShieldCheck', description: 'Instalación limpia de sistemas operativos, configuración de controladores y optimización', color: '#EA4335' },

    // Redes
    { id: 5, name: 'Configuración de Routers & WiFi', category: 'networks' as any, level: 88, icon: 'Globe', description: 'Configuración de modems/routers hogareños, seguridad WPA3, DHCP y cableado', color: '#4285F4' },
    { id: 6, name: 'Cisco Packet Tracer & Topologías', category: 'networks' as any, level: 88, icon: 'Zap', description: 'Simulación de topologías de red, direccionamiento IPv4 y switches (Certificado Cisco)', color: '#3178C6' },

    // Programación & Software
    { id: 7, name: 'Python (Santander Open Academy)', category: 'software' as any, level: 85, icon: 'FileCode2', description: 'Lógica de programación, scripts, estructuras de datos y automatización (Certificado)', color: '#38BDF8' },
    { id: 8, name: 'C++ & Programación Orientada a Objetos', category: 'software' as any, level: 82, icon: 'FileCode2', description: 'Desarrollo con clases, punteros, herencia y estructuras algorítmicas', color: '#00599C' },
    { id: 9, name: 'React 19 & JavaScript Moderno', category: 'software' as any, level: 85, icon: 'Atom', description: 'Desarrollo de interfaces de usuario interactivas SPA y custom hooks reactivos', color: '#61DAFB' },
    { id: 10, name: 'Node.js & Express REST APIs', category: 'software' as any, level: 80, icon: 'Server', description: 'Servidores backend y endpoints REST para aplicaciones web', color: '#34A853' },
    { id: 11, name: 'TiDB Cloud (MySQL Serverless) & SQLite', category: 'database', level: 85, icon: 'Database', description: 'Bases de datos relacionales, consultas SQL, persistencia en la nube', color: '#336791' },
    { id: 12, name: 'Robótica de Competición', category: 'hardware' as any, level: 85, icon: 'Sparkles', description: 'Armado mecánico y conexionado eléctrico de robot para fútbol robótico', color: '#EA4335' },

    // Habilidades Personales
    { id: 13, name: 'Trabajo en Equipo & Comunicación', category: 'soft' as any, level: 95, icon: 'Palette', description: 'Coordinación efectiva en proyectos interdisciplinarios y competencias', color: '#FBBC05' },
    { id: 14, name: 'Aprendizaje Rápido & Proactividad', category: 'soft' as any, level: 95, icon: 'Zap', description: 'Capacidad inmediata de asimilación de nuevas tecnologías y herramientas', color: '#34A853' }
  ],
  projects: [
    {
      id: 1,
      title: 'R4: Material You Portfolio SPA',
      subtitle: 'Portafolio Web interactivo con React 19, TiDB Cloud y animaciones',
      description: 'Aplicación web Single Page diseñada con la estética de Google Material Design 3, atajo omnibox (Ctrl+K), animaciones fluidas con Framer Motion y base de datos distribuida en TiDB Cloud Serverless.',
      long_description: 'Proyecto integrador R4 desarrollado con las mejores prácticas de la web moderna. Conecta el frontend React 19 a una base de datos MySQL Serverless en TiDB Cloud (AWS sa-east-1) para almacenar mensajes de contacto, libro de firmas y contadores reactivos.',
      category: 'Full Stack',
      tags: ['React 19', 'TypeScript', 'TiDB Cloud', 'Node.js', 'Framer Motion', 'Tailwind CSS'],
      demo_url: '#',
      repo_url: 'https://github.com/Francisco-Robledo',
      image_gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      likes: 12,
      featured: 1,
      metrics: 'Google Material You • TiDB Cloud MySQL'
    },
    {
      id: 2,
      title: 'R3: Sistema de Gestión y Administración de Usuarios',
      subtitle: 'Plataforma Corporativa con Control de Roles, Auditoría y Filtros',
      description: 'Panel administrativo para la gestión integral de usuarios, asignación de roles y permisos, auditoría de eventos y estadísticas con filtros reactivos en tiempo real.',
      long_description: 'Desarrollado con arquitectura modular y componentes reactivos. Permite realizar altas, bajas, modificaciones (CRUD), búsqueda instantánea con filtros por departamento y estado, y persistencia en base de datos.',
      category: 'Web App',
      tags: ['React', 'JavaScript', 'Node.js', 'Express', 'MySQL / SQLite', 'CSS3'],
      demo_url: 'https://github.com/Francisco-Robledo',
      repo_url: 'https://github.com/Francisco-Robledo',
      image_gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
      likes: 9,
      featured: 1,
      metrics: 'CRUD Dinámico • Gestión de Usuarios'
    },
    {
      id: 3,
      title: 'PDeISC: Proyectos de Software y Sistemas (React + Node + JS)',
      subtitle: 'Repositorio Oficial de Desarrollo de Sistemas Computacionales',
      description: 'Conjunto de aplicaciones y módulos desarrollados para la Tecnicatura en Informática que abarcan JavaScript moderno, interfaces con React y servicios con Node.js.',
      long_description: 'Repositorio alojado en GitHub (@Francisco-Robledo/PDeISC) que reúne módulos de programación: manipulación del DOM, consumo de APIs REST, componentes React y backend en Node.js.',
      category: 'Desarrollo Web',
      tags: ['JavaScript', 'React', 'Node.js', 'Express', 'DOM API'],
      demo_url: 'https://github.com/Francisco-Robledo/PDeISC',
      repo_url: 'https://github.com/Francisco-Robledo/PDeISC',
      image_gradient: 'from-amber-500 via-orange-500 to-rose-600',
      likes: 15,
      featured: 1,
      metrics: 'Repositorio GitHub Oficial'
    },
    {
      id: 4,
      title: 'Robot para Competencia de Fútbol Robótico',
      subtitle: 'Montaje Mecánico, Electrónica y Calibración en Equipo',
      description: 'Construcción y puesta a punto de un robot competitivo para el torneo escolar de fútbol robótico de la Escuela Técnica N°5 Amancio Williams.',
      long_description: 'Proyecto multidisciplinario de hardware y robótica. El equipo diseñó el chasis, conexionó motores DC, controladores de potencia, alimentación por baterías y ajuste de tracción para competir en la cancha robótica.',
      category: 'Robótica & Hardware',
      tags: ['Robótica', 'Hardware', 'Electrónica', 'C++', 'Trabajo en Equipo'],
      demo_url: 'https://github.com/Francisco-Robledo',
      repo_url: 'https://github.com/Francisco-Robledo',
      image_gradient: 'from-violet-600 via-purple-600 to-pink-600',
      likes: 21,
      featured: 1,
      metrics: 'Robot de Competición • E.E.S.T. N°5'
    },
    {
      id: 5,
      title: 'TP CEmpleado: Modelado de Software OOP en C++',
      subtitle: 'Paradigma de Programación Orientada a Objetos',
      description: 'Aplicación en C++ para el modelado empresarial de personal, aplicando principios de encapsulamiento, herencia, estructuras de datos y cálculo de salarios.',
      long_description: 'Proyecto en C++ que implementa clases CEmpleado, validación de datos, métodos de cálculo y gestión de datos en memoria para el Taller de Programación.',
      category: 'Algoritmos & C++',
      tags: ['C++', 'POO', 'Algoritmos', 'Estructuras de Datos'],
      demo_url: 'https://github.com/Francisco-Robledo/TPN-18-OOP-03--CEmpleado',
      repo_url: 'https://github.com/Francisco-Robledo/TPN-18-OOP-03--CEmpleado',
      image_gradient: 'from-sky-600 via-blue-700 to-slate-800',
      likes: 8,
      featured: 0,
      metrics: 'C++ Orientado a Objetos'
    },
    {
      id: 6,
      title: 'Simulación de Redes en Cisco Packet Tracer',
      subtitle: 'Diseño de Topologías LAN/WLAN y Ruteo de Paquetes',
      description: 'Esquemas y laboratorios de infraestructura de redes con direccionamiento IP, configuración de routers y switches avalados por Cisco Networking Academy.',
      long_description: 'Proyecto práctico de telecomunicaciones que comprende diseño de topologías, segmentación en subredes, configuración de servicios DHCP/DNS básicos y diagnóstico de conectividad con ping y traceroute.',
      category: 'Redes & Cisco',
      tags: ['Cisco Packet Tracer', 'Redes', 'IPv4', 'Routers', 'Switches'],
      demo_url: 'https://github.com/Francisco-Robledo',
      repo_url: 'https://github.com/Francisco-Robledo',
      image_gradient: 'from-teal-600 via-emerald-600 to-green-700',
      likes: 14,
      featured: 0,
      metrics: 'Certificado Cisco Networking Academy'
    }
  ],
  experience: [
    {
      id: 1,
      role: 'Estudiante de Informática Personal y Profesional (7° Año)',
      company: 'E.E.S.T. N°5 "Amancio Williams" (Mar del Plata)',
      period: '2019 - Presente',
      description: 'Formación técnica integral con foco en hardware de PCs, sistemas operativos, redes informáticas, programación, bases de datos y robótica.',
      highlights: [
        'Representante de la Región 19 en la Feria de Ciencias 2024 con proyecto tecnológico.',
        'Participación en competencia de fútbol robótico con robot construido y ensamblado en equipo.',
        'Laboratorios prácticos en diagnóstico y reparación de computadoras, redes LAN y desarrollo de software.'
      ],
      type: 'education',
      badge_color: '#4285F4'
    },
    {
      id: 2,
      role: 'Mantenimiento de Hardware y Soporte Técnico',
      company: 'Servicio Técnico Independiente & Prácticas Formativas',
      period: '2023 - Presente',
      description: 'Armado, reparación y puesta a punto de computadoras personales, notebooks y conectividad de redes.',
      highlights: [
        'Armado de PCs a medida y actualización de piezas (memorias RAM, discos SSD/HDD, fuentes y placas).',
        'Mantenimiento preventivo y correctivo: limpieza de polvo, cambio de pasta térmica y formateo.',
        'Instalación de sistemas operativos Windows/Linux, configuración de drivers y software esencial.',
        'Configuración de routers WiFi hogareños, cableado de red y solución de problemas de conectividad.'
      ],
      type: 'work',
      badge_color: '#34A853'
    }
  ],
  achievements: [
    {
      id: 1,
      title: 'Representante de la Región 19 — Feria de Ciencias 2024',
      issuer: 'Feria de Educación, Arte, Ciencia y Tecnología',
      date: '2024',
      description: 'Distinción y representación oficial de la Región 19 con proyecto de investigación y desarrollo tecnológico presentado ante jurados evaluadores.',
      icon: 'Award',
      credential_url: 'https://github.com/Francisco-Robledo'
    },
    {
      id: 2,
      title: 'Introducción a Cisco Packet Tracer',
      issuer: 'Cisco Networking Academy',
      date: '2024',
      description: 'Certificado oficial otorgado por Cisco Networking Academy (Directora Lynn Bloomer) por completar con éxito el programa. Cert ID: 2ae3a921-aaf6-4599-bf65-c73fd3064690.',
      icon: 'CheckCircle2',
      credential_url: 'https://www.netacad.com/',
      certificate_image: '/certificates/cisco_packet_tracer.png',
      pdf_url: '/certificates/cisco_packet_tracer.pdf'
    },
    {
      id: 3,
      title: 'Certificación en Python (Santander Open Academy)',
      issuer: 'Santander | Open Academy',
      date: '24 de julio de 2025',
      description: 'Certificado de finalización de curso especializado en Python (8 Horas, 2 Módulos con Autoevaluación aprobada). Número de serie: OA-2025-0724001472589.',
      icon: 'ShieldCheck',
      credential_url: 'https://app.santanderopenacademy.com/',
      certificate_image: '/certificates/santander_python.png',
      pdf_url: '/certificates/santander_python.pdf'
    },
    {
      id: 4,
      title: 'Competencia de Fútbol Robótico',
      issuer: 'E.E.S.T. N°5 Amancio Williams',
      date: '2024',
      description: 'Participación destacada en competencia de robótica con robot de fútbol diseñado, construido y puesto a prueba en equipo.',
      icon: 'Sparkles',
      credential_url: 'https://github.com/Francisco-Robledo'
    }
  ],
  guestbook: [],
  congratulations: 38
};
