"""
Rutas de usuarios.
Cubre: HU01 (registro de usuario)
"""
from flask import Blueprint, request, jsonify
from database import get_db

usuarios_bp = Blueprint('usuarios', __name__)


@usuarios_bp.route('/', methods=['GET'])
def get_usuarios():
    """Lista todos los usuarios registrados."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios ORDER BY apellido, nombre")
    usuarios = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({'usuarios': usuarios, 'total': len(usuarios)}), 200


@usuarios_bp.route('/<int:usuario_id>', methods=['GET'])
def get_usuario(usuario_id):
    """Obtiene un usuario por ID."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE id = ?", (usuario_id,))
    usuario = cursor.fetchone()
    conn.close()

    if not usuario:
        return jsonify({'error': 'Usuario no encontrado.'}), 404

    return jsonify(dict(usuario)), 200


@usuarios_bp.route('/', methods=['POST'])
def crear_usuario():
    """
    HU01 - Registro de usuario.
    Valida campos obligatorios y unicidad de DNI.
    """
    data = request.get_json()

    # HU01 - Criterio: validar campos obligatorios
    campos_requeridos = ['nombre', 'apellido', 'dni']
    for campo in campos_requeridos:
        if not data.get(campo, '').strip():
            return jsonify({'error': f'El campo "{campo}" es obligatorio.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Verificar que el DNI no esté registrado
    cursor.execute("SELECT id FROM usuarios WHERE dni = ?", (data['dni'].strip(),))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Ya existe un usuario con ese DNI.'}), 409

    cursor.execute(
        "INSERT INTO usuarios (nombre, apellido, dni, email) VALUES (?, ?, ?, ?)",
        (
            data['nombre'].strip(),
            data['apellido'].strip(),
            data['dni'].strip(),
            data.get('email', '').strip() or None,
        )
    )
    conn.commit()
    usuario_id = cursor.lastrowid
    conn.close()

    return jsonify({'mensaje': 'Usuario registrado correctamente.', 'id': usuario_id}), 201
