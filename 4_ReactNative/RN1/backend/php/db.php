<?php
// backend/php/db.php
// Configuración de conexión a base de datos MySQL (XAMPP / WAMP)

$host = 'localhost';
$db   = 'rn1_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error de conexión con la base de datos MySQL en XAMPP: ' . $e->getMessage()
    ]);
    exit;
}
?>
