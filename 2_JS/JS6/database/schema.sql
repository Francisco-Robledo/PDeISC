-- Esquema equivalente a la inicialización automática de database/connection.js.
-- Puede ejecutarse manualmente desde MySQL Workbench si se prefiere.
CREATE DATABASE IF NOT EXISTS Score
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE Score;

CREATE TABLE IF NOT EXISTS score (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tiempo INT UNSIGNED NOT NULL,
    puntos INT UNSIGNED NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nombre VARCHAR(30) NOT NULL,
    INDEX idx_score_puntos_tiempo (puntos DESC, tiempo ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
