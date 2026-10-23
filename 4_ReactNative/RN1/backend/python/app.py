from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # Permite peticiones desde React Native / Expo

# Configuración de base de datos MySQL (XAMPP / WAMP)
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'rn1_db',
    'port': 3306
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'status': 'online',
        'servicio': 'API Python Flask - Login de Usuarios',
        'endpoint': 'POST /api/login'
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or request.form.to_dict()
    
    email = data.get('email') or data.get('correo') or data.get('usuario')
    password = data.get('password') or data.get('contrasena')
    
    if not email or not password:
        return jsonify({
            'success': False,
            'mensaje': 'Debe ingresar correo/usuario y contraseña.'
        }), 400
        
    connection = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT id, nombre, email, rol, telefono, fecha_registro 
            FROM usuarios 
            WHERE (email = %s OR nombre = %s) AND password = %s
            LIMIT 1
        """
        cursor.execute(query, (email.strip(), email.strip(), password))
        usuario = cursor.fetchone()
        
        if usuario:
            # Formatear fecha para serialización JSON
            if usuario.get('fecha_registro'):
                usuario['fecha_registro'] = str(usuario['fecha_registro'])
                
            return jsonify({
                'success': True,
                'mensaje': f"¡Bienvenido al sistema, {usuario['nombre']}!",
                'usuario': {
                    'id': usuario['id'],
                    'nombre': usuario['nombre'],
                    'email': usuario['email'],
                    'rol': usuario['rol'],
                    'telefono': usuario['telefono'],
                    'fechaRegistro': usuario['fecha_registro']
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'mensaje': 'Correo o contraseña incorrectos. Verifique sus credenciales.'
            }), 401
            
    except Error as e:
        return jsonify({
            'success': False,
            'mensaje': 'Error de conexión con la base de datos MySQL.',
            'error': str(e)
        }), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    # Escucha en 0.0.0.0 para ser alcanzable desde dispositivos móviles en la red local
    app.run(host='0.0.0.0', port=5000, debug=True)
