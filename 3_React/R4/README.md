# 🌐 Francisco Robledo — Material You Portfolio (R4)

> **Portfolio Web de Una Sola Página (Single Page Application)** desarrollado con la estética y filosofía visual de **Google Material You (Material Design 3)**, animaciones dinámicas con Framer Motion, hooks modernos de React 19 y base de datos distribuida en la nube con **TiDB Cloud (Serverless MySQL en AWS sa-east-1)**.

![Google Material You Aesthetic](https://img.shields.io/badge/Design-Google%20Material%20You-4285F4?style=for-the-badge&logo=google)
![React 19](https://img.shields.io/badge/Frontend-React%2019%20+%20TypeScript-3178C6?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-EA4335?style=for-the-badge&logo=framer)
![TiDB Cloud](https://img.shields.io/badge/Database-TiDB%20Cloud%20(Serverless%20MySQL)-336791?style=for-the-badge&logo=mysql)
![Node.js & Express](https://img.shields.io/badge/Backend-Express.js-34A853?style=for-the-badge&logo=express)

---

## 👨‍💻 Perfil Real del Desarrollador

- **Nombre:** Francisco Robledo
- **Ubicación:** Williams Morris 9472, Mar del Plata, Argentina
- **Teléfono:** [223-506-9385](tel:2235069385) • [WhatsApp](https://wa.me/5492235069385)
- **Correo Electrónico:** [franciscorobledo0012@gmail.com](mailto:franciscorobledo0012@gmail.com)
- **GitHub:** [@Francisco-Robledo](https://github.com/Francisco-Robledo)
- **Educación:** Estudiante de 6° año de la Tecnicatura en Informática Personal y Profesional — Escuela de Educación Secundaria Técnica N°5 "Amancio Williams" (Mar del Plata).
- **Objetivo:** En búsqueda activa de mi primera experiencia laboral o pasantías técnicas en IT, soporte de hardware, redes o desarrollo.

---

## 🏆 Logros y Certificaciones Reales

1. **Representante de la Región 19 — Feria de Ciencias 2024:**
   - Distinción y representación oficial en la Feria de Educación, Arte, Ciencia y Tecnología con proyecto tecnológico.
2. **Introducción a Cisco Packet Tracer (Cisco Networking Academy):**
   - Certificado oficial de finalización. ID de Certificación: `2ae3a921-aaf6-4599-bf65-c73fd3064690` (Directora: Lynn Bloomer).
3. **Certificación en Python (Santander Open Academy):**
   - Certificado oficial emitido el 24 de julio de 2025 (8 Horas, 2 Módulos con Autoevaluación aprobada). Número de serie: `OA-2025-0724001472589`.
4. **Competencia de Fútbol Robótico:**
   - Participación y armado de robot de competencia escolar en equipo de la Escuela Técnica N°5.

---

## 🚀 Proyectos Reales Mostrados

1. **R4: Material You Portfolio SPA (Google Design 3)**
   - Portafolio web interactivo con React 19, TypeScript, atajo omnibox (`Ctrl+K`), animaciones de Framer Motion y base de datos distribuida en TiDB Cloud Serverless.
2. **R3: Sistema de Gestión y Administración de Usuarios**
   - Panel corporativo con control de roles, auditoría y filtros reactivos en tiempo real.
3. **PDeISC: Proyectos de Software y Sistemas (React + Node.js + JS)**
   - Repositorio formativo alojado en GitHub con módulos de frontend React, backend Node.js y manipulación del DOM.
4. **Robot para Competencia de Fútbol Robótico**
   - Diseño mecánico, montaje de electrónica y calibración de hardware en equipo para torneo escolar.
5. **TP CEmpleado: Modelado de Software OOP en C++**
   - Aplicación orientada a objetos en C++ con clases, encapsulamiento, herencia y cálculo salarial.
6. **Simulación de Redes en Cisco Packet Tracer**
   - Topologías de red, direccionamiento IPv4 y conmutación avalado por Cisco Networking Academy.

---

## 🗄️ Base de Datos en TiDB Cloud (Serverless MySQL)

El backend de este proyecto está configurado con **TiDB Cloud en AWS São Paulo (`sa-east-1`)**:
- **Almacenamiento en la nube:** Mensajes del formulario de contacto y firmas en el libro de visitas se guardan directamente en el clúster de TiDB Cloud.
- **Fallback a SQLite Local:** Si no hay conexión o no se configuran variables de entorno, el backend conmuta automáticamente a SQLite local (`portfolio.db`) con modo WAL.

---

## 📁 Estructura del Proyecto

```text
R4/
├── frontend/                     # Aplicación SPA en React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/           # Componentes modulares con estética Google
│   │   │   ├── Navbar.tsx        # Menú flotante con píldora activa y atajo Ctrl+K
│   │   │   ├── SpotlightSearch.tsx # Buscador omnibox (Ctrl + K)
│   │   │   ├── HeroSection.tsx   # Portada con datos reales, typewriter y bento stats
│   │   │   ├── AboutSection.tsx  # Bento Grid con perfil técnico y terminal interactiva
│   │   │   ├── SkillsSection.tsx # Habilidades por categorías (Hardware, Redes, Software)
│   │   │   ├── ProjectsSection.tsx # Proyectos reales con likes en vivo
│   │   │   ├── ProjectModal.tsx  # Modal detallado con arquitectura
│   │   │   ├── ExperienceTimeline.tsx # Trayectoria técnica y formación en E.E.S.T. N°5
│   │   │   ├── AchievementsSection.tsx # Certificaciones Cisco, Santander y Feria de Ciencias
│   │   │   ├── GuestbookSection.tsx # Libro de visitas en tiempo real con TiDB
│   │   │   ├── ContactSection.tsx # Formulario con teléfono, WhatsApp y guardado en TiDB
│   │   │   ├── Footer.tsx        # Pie de página y atajos
│   │   │   └── BrandIcons.tsx    # Iconos SVG vectoriales
│   │   ├── hooks/                # Custom hooks (useTheme, useScrollSpy, etc.)
│   │   ├── types/                # Modelos e interfaces de TypeScript
│   │   ├── utils/                # Cliente API y seedData de respaldo
│   │   ├── App.tsx               # Orquestador principal
│   │   ├── index.css             # Directivas de Tailwind y utilidades Google
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── backend/                      # Servidor API REST con TiDB Cloud / SQLite
│   ├── database.js               # Conector híbrido MySQL TiDB / SQLite
│   ├── server.js                 # Endpoints REST (portfolio, contact, guestbook, likes)
│   ├── seedRealData.js           # Script de migración con datos 100% auténticos
│   ├── .env                      # Cadena de conexión a TiDB Cloud
│   ├── tidb_schema.sql           # Script SQL para TiDB Cloud
│   └── package.json
└── README.md
```

---

## 🚀 Ejecución en Entorno Local

1. **Iniciar el Servidor Backend (Puerto 5001):**
   ```bash
   cd backend
   npm start
   ```

2. **Iniciar el Frontend (Puerto 3000):**
   ```bash
   cd frontend
   npm run dev
   ```

Abre en tu navegador: **`http://localhost:3000`**

---

## 📤 Subir a GitHub

```bash
cd C:\Users\franc\OneDrive\Escritorio\R4

git init
git add .
git commit -m "feat: portfolio R4 single-page con datos reales, certificados y TiDB Cloud"
git remote add origin https://github.com/Francisco-Robledo/R4-Material-Portfolio.git
git branch -M main
git push -u origin main
```
