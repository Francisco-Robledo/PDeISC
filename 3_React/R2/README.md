# R2ANTI — Aplicación de Lista de Tareas (Task Manager)

Aplicación web moderna, completa, responsive y de alto rendimiento para la gestión de tareas, desarrollada utilizando **React 19**, **Vite**, **React Router DOM** y **TypeScript**.

Este proyecto ha sido desarrollado bajo los requerimientos técnicos y estándares de calidad definidos en el **PROMPT MAESTRO**, garantizando completitud funcional, usabilidad, modo claro y oscuro, validación estricta de formularios y exportación de datos a archivos descargables.

---

## 🎯 Objetivo del Proyecto

Brindar una solución integral de organización personal y profesional donde el usuario puede:
1. **Visualizar y filtrar tareas** en la vista principal con estadísticas en tiempo real.
2. **Consultar el detalle completo** de cada tarea mediante rutas dinámicas (`/task/:id`).
3. **Crear nuevas tareas** mediante un formulario controlado con validaciones en tiempo real (`/create`).
4. **Exportar y descargar** la información completa de sus tareas en archivos de formato `.json` o `.csv` para respaldo local.
5. **Alternar entre Modo Claro y Modo Oscuro** con persistencia en `localStorage`.

---

## 🛠️ Tecnologías Utilizadas

- **Core Framework**: React 19
- **Build Tool**: Vite
- **Navegación / Rutas**: React Router DOM (v7)
- **Lenguaje**: TypeScript
- **Estilos & UI**: TailwindCSS v4 + Variables CSS personalizadas
- **Iconografía**: Lucide React
- **Almacenamiento & Persistencia**: Estado de React + `localStorage`

---

## 🔍 Benchmarking y Decisiones de Diseño (PROMPT MAESTRO)

1. **Organización de la Interfaz**: Basada en patrones UX de herramientas líderes como Todoist y Notion Tasks. La pantalla de Inicio reúne estadísticas de progreso, barra de búsqueda en tiempo real, filtros por estado (Todas / Pendientes / Completadas) y categorías.
2. **Navegación Fluida**: Implementación de rutas SPA declarativas sin recargas completas de página.
3. **Validación de Formularios**: Los campos obligatorios validan su longitud mínima sin recurrir a llamadas agresivas de `alert()`. Los errores se muestran contextualmente debajo de cada control.
4. **Archivo Descargable**: Se incorporó un módulo utilitario que permite generar y descargar instantáneamente un respaldo en formato JSON o CSV con todas las tareas almacenadas en el estado.

---

## 📁 Estructura del Proyecto

```
R2ANTI/
├── index.html                  # HTML5 base con metas SEO y viewport responsive
├── package.json                # Configuración de dependencias y scripts de ejecución
├── vite.config.ts              # Configuración del bundler Vite y plugins
├── src/
│   ├── main.tsx                # Punto de entrada principal
│   ├── App.tsx                 # Configuración de rutas (React Router) y providers
│   ├── index.css               # Estilos globales y tokens para Modo Claro/Oscuro
│   ├── types/
│   │   └── task.ts             # Interfaces TypeScript (Task, Priority, Category, FilterOptions)
│   ├── context/
│   │   ├── TaskContext.tsx     # Estado global de tareas, CRUD y persistencia
│   │   └── ThemeContext.tsx    # Gestión y alternancia de tema (Light / Dark)
│   ├── components/
│   │   ├── Navbar.tsx          # Encabezado responsive con navegación y exportar
│   │   ├── TaskCard.tsx        # Tarjeta de tarea con badge de estado, prioridad y acciones
│   │   ├── TaskFilter.tsx      # Búsqueda en vivo y selectores de filtrado/orden
│   │   ├── TaskStats.tsx       # Barra de progreso y métricas de completitud
│   │   ├── Toast.tsx           # Notificaciones flotantes de feedback
│   │   └── ConfirmModal.tsx    # Modal de confirmación para eliminación segura
│   ├── pages/
│   │   ├── HomePage.tsx        # Página de inicio con lista de tareas, filtros y métricas
│   │   ├── DetailPage.tsx      # Página de detalle con información completa por ID
│   │   ├── CreateTaskPage.tsx  # Página de creación con formulario validado
│   │   └── NotFoundPage.tsx    # Vista 404 para rutas inexistentes
│   ├── data/
│   │   └── initialTasks.ts     # Datos de muestra iniciales
│   └── utils/
│       └── exportUtils.ts      # Descargar tareas a archivo JSON/CSV
└── README.md                   # Documentación técnica del proyecto
```

---

## 💻 Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior

---

## 🚀 Instalación y Ejecución

1. **Clonar o acceder al directorio del proyecto**:
   ```bash
   cd "C:\Users\franc\OneDrive\Escritorio\R2ANTI"
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre tu navegador en la URL mostrada en consola (por defecto `http://localhost:5173`).

4. **Compilar para producción** (Opcional):
   ```bash
   npm run build
   ```

---

## 📌 Páginas y Funcionalidades Principales

### 1. Página de Inicio (`/`)
- Muestra el listado de tareas con título, descripción corta, categoría, prioridad y fecha.
- Cada tarjeta contiene un enlace dinámico hacia la **Página de Detalle**.
- Barra de progreso de completitud (% completadas vs pendientes).
- Búsqueda reactiva por texto en títulos o descripciones.
- Filtros por estado (Todas / Pendientes / Completadas), por categoría y ordenamiento (más recientes, prioridad, título).
- Botón directo **"Crear Nueva Tarea"**.

### 2. Página de Detalle (`/task/:id`)
- Muestra la información completa de una tarea específica.
- Título principal, descripción corta y descripción extendida formateada.
- Fecha de creación exacta y fecha de vencimiento (si aplica).
- Badge de prioridad (Alta / Media / Baja) y categoría.
- Botón interactivo para cambiar el estado (Completa ↔ Incompleta) con actualización instantánea.
- Botón de eliminación con **Modal de Confirmación**.
- Botón para copiar enlace directo de la tarea al portapapeles.

### 3. Página de Creación (`/create`)
- Formulario reactivo para registrar una nueva tarea.
- Campos: Título (obligatorio), Descripción Corta (opcional), Descripción Completa (obligatoria), Prioridad, Categoría, Fecha Límite e Indicador de estado inicial.
- Mensajes de error contextuales al intentar enviar información inválida.
- Al guardar exitosamente, agrega la tarea al estado global y redirige a la vista de detalle.

### 4. Archivo Descargable (Exportación de Datos)
- Desde la barra de navegación o el drawer móvil, el usuario puede hacer clic en **"Descargar"** para obtener un archivo `tareas_r2anti.json` o `tareas_r2anti.csv` con los datos del sistema.
