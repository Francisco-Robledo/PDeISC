-- ========================================================
-- Base de Datos: rn1_db
-- Compatible con: XAMPP, WAMP, LAMP (phpMyAdmin o Consola MySQL)
-- ========================================================

CREATE DATABASE IF NOT EXISTS rn1_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rn1_db;

-- Tabla de usuarios
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'Estudiante',
    telefono VARCHAR(20) DEFAULT '+56 9 8765 4321',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de prueba para iniciar sesión
INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES
('Francisco Developer', 'admin@correo.com', 'admin123', 'Administrador', '+56 9 1122 3344'),
('María González', 'maria@correo.com', '123456', 'Supervisora', '+56 9 9988 7766'),
('Carlos Rodríguez', 'carlos@correo.com', 'clave123', 'Estudiante', '+56 9 5544 3322');
