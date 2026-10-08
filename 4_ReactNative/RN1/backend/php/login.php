<?php
// backend/php/login.php
// Endpoint de autenticación para React Native Expo

// Cabeceras CORS para permitir peticiones desde React Native / Expo Web / Móvil
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de petición preflight OPTIONS de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

// Leer el cuerpo de la petición (JSON enviado desde React Native fetch / axios)
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

// Fallback por si enviaron datos por form-urlencoded o $_POST estándar
if (!$data) {
    $data = $_POST;
}

$email = $data['email'] ?? $data['correo'] ?? $data['usuario'] ?? null;
$password = $data['password'] ?? $data['contrasena'] ?? null;

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Debe ingresar correo/usuario y contraseña.'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, nombre, email, rol, telefono, fecha_registro FROM usuarios WHERE (email = :email OR nombre = :nombre) AND password = :password LIMIT 1");
    $stmt->execute([
        'email' => trim($email),
        'nombre' => trim($email),
        'password' => $password
    ]);

    $usuario = $stmt->fetch();

    if ($usuario) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'mensaje' => '¡Bienvenido al sistema, ' . $usuario['nombre'] . '!',
            'usuario' => [
                'id' => (int)$usuario['id'],
                'nombre' => $usuario['nombre'],
                'email' => $usuario['email'],
                'rol' => $usuario['rol'],
                'telefono' => $usuario['telefono'],
                'fechaRegistro' => $usuario['fecha_registro']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'mensaje' => 'Correo o contraseña incorrectos.'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error en la consulta a la base de datos: ' . $e->getMessage()
    ]);
}
?>
