-- ========================================================
-- Schema de Base de Datos para Portfolio R4 de Francisco Robledo
-- Compatible con SQLite, PostgreSQL, Supabase, Neon y Render
-- ========================================================

-- 1. Tabla de Perfil
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY,
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

-- 2. Tabla de Habilidades
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#4285F4'
);

-- 3. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
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

-- 4. Tabla de Experiencia y Educación
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL,
  type TEXT NOT NULL,
  badge_color TEXT DEFAULT '#4285F4'
);

-- 5. Tabla de Logros y Certificaciones
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  credential_url TEXT
);

-- 6. Mensajes de Contacto Recibidos
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_status INTEGER DEFAULT 0
);

-- 7. Libro de Visitas y Recomendaciones
CREATE TABLE IF NOT EXISTS guestbook (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  role_or_company TEXT,
  avatar_color TEXT DEFAULT '#4285F4',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
