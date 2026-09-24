-- ========================================================
-- TiDB Cloud (Serverless MySQL) Schema para Portfolio R4
-- Francisco Robledo — Full Stack Developer
-- ========================================================

-- Crear base de datos (si aplica)
CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

-- 1. Tabla de Perfil
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

-- 2. Tabla de Habilidades
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  level INT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT '#4285F4'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla de Proyectos
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

-- 4. Tabla de Experiencia y Educación
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

-- 5. Tabla de Logros y Certificaciones
CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  date VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  credential_url VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Mensajes de Contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_status INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Libro de Visitas (Guestbook)
CREATE TABLE IF NOT EXISTS guestbook (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  role_or_company VARCHAR(255),
  avatar_color VARCHAR(50) DEFAULT '#4285F4',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
