# Sistema de Usuarios - R3 (Cátedra: Martín Estanga)

Proyecto integral desarrollado bajo el estándar de calidad **`miojaja`** con **React 19**, **Vite**, **TypeScript** y backend en **Node.js (ESM)** conectado a una base de datos relacional **SQLite normalizada en Tercera Forma Normal (3FN)**.

---

## 📋 Requisitos Cumplidos

| Requisito | Estado | Detalle de Implementación |
| :--- | :---: | :--- |
| **BBDD SQL Relacional** | ✅ | SQLite con claves foráneas explícitas y modo WAL activo. |
| **Normalización 3FN** | ✅ | Tablas independientes `roles` y `users` vinculadas por `role_id` (sin dependencias transitivas). |
| **useState** | ✅ | Control de vistas en el Sistema 2, estados de formularios, modales y filtros de búsqueda. |
| **useEffect** | ✅ | Sincronización de sesión, carga asíncrona de datos desde la API y control de tema. |
| **useForm** | ✅ | `react-hook-form` con validaciones regex estrictas en creación, edición, registro e inicio de sesión. |
| **localStorage** | ✅ | Persistencia de token JWT, datos de usuario activo, tema (`app_theme`) y vista activa (`usestate_view`). |
| **Context API** | ✅ | `AuthContext` (autenticación global) y `ThemeContext` (modo claro/oscuro global). |
| **React Router** | ✅ | Sistema 1 con `Routes`, `Route`, `Navigate`, `NavLink` y rutas protegidas (`ProtectedRoute`). |
| **API + React** | ✅ | Backend Express con endpoints REST (`/api/auth`, `/api/users`, `/api/health`). |
| **fetch / Axios** | ✅ | Cliente `axios` con interceptores de autorización Bearer y helper `apiFetch` (nativo) para estadísticas SQL. |
| **2 Sistemas Paralelos** | ✅ | Sistema 1 (React Router DOM) y Sistema 2 (useState condicional en memoria). |
| **Seguridad & Persistencia**| ✅ | Hashing de contraseñas con `bcrypt` (10 salt rounds), autenticación `JWT` y persistencia en `localStorage`. |
| **Modo Día/Noche** | ✅ | Interruptor nativo accesible desde la cabecera sincronizado con Tailwind CSS (`dark:` classes). |
| **Diseño Responsive** | ✅ | Adaptabilidad completa en móviles y escritorio con límite estricto de `max-width: 1200px` centrado. |
| **Cero `alert()` y `require()`** | ✅ | Reemplazo total por modales accesibles (`ConfirmModal`, `UserFormModal`) y sintaxis moderna ESM (`import/export`). |

---

## 🗄️ Modelo Relacional y Justificación 3FN

### Diagrama de Tablas
```sql
-- 1. Tabla de Roles (Independiente)
CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- 2. Tabla de Usuarios (Relacionada)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password TEXT NOT NULL,
  role_id INTEGER NOT NULL,
  status TEXT DEFAULT 'activo',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);
```

### Justificación de Normalización:
1. **1FN (Primera Forma Normal)**: Cada columna almacena valores atómicos indivisibles; no existen grupos repetitivos.
2. **2FN (Segunda Forma Normal)**: Cumple 1FN y todos los atributos no clave (`name`, `email`, `password`, `status`) dependen funcionalmente de la totalidad de la clave primaria (`id`).
3. **3FN (Tercera Forma Normal)**: Cumple 2FN y no existen dependencias transitivas entre atributos no clave. El nombre del rol no se almacena como texto redundante en `users`, sino que se aísla en la entidad `roles` y se vincula mediante la clave foránea `role_id`.

---

## 🚀 Instrucciones de Ejecución

### Opción Rápida (Ejecución Simultánea)
Desde la raíz del proyecto (`sistema_usuarios_r3`):
```bash
npm start
```
> Ejecuta simultáneamente el backend en el puerto `5000` y el frontend en el puerto `3000` mediante `concurrently`.

### Opción Manual (En terminales separadas)

#### 1. Backend:
```bash
cd backend
npm install
npm start
```
Servidor disponible en: `http://localhost:5000`

#### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
Aplicación disponible en: `http://localhost:3000`

---

## 🔑 Credenciales Precargadas (BBDD SQL)

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sistema.com` | `Admin123!` | Acceso completo, edición y borrado de usuarios |
| **Docente (Admin)** | `martin.estanga@universidad.edu` | `User123!` | Rol administrativo para corrección y pruebas |
| **Usuario** | `alumno@sistema.com` | `User123!` | Acceso de consulta y gestión de perfil |
