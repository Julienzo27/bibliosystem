"""
Rutas de préstamos.
Cubre: HU03 (registro de préstamo), HU04 (devolución), HU06 (préstamos activos), HU08 (historial)
"""
from flask import Blueprint, request, jsonify
from database import get_db
from datetime import date, timedelta

prestamos_bp = Blueprint('prestamos', __name__)

DIAS_PRESTAMO = 14  # Plazo estándar de préstamo en días


@prestamos_bp.route('/activos', methods=['GET'])
def get_prestamos_activos():
    """
    HU06 - Ver préstamos activos.
    Retorna todos los préstamos con estado 'activo' con info de libro y usuario.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT p.id, p.fecha_prestamo, p.fecha_vencimiento, p.estado,
               l.titulo, l.autor,
               u.nombre, u.apellido, u.dni
        FROM prestamos p
        JOIN libros l ON p.libro_id = l.id
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.estado = 'activo'
        ORDER BY p.fecha_vencimiento ASC
    ''')
    prestamos = [dict(row) for row in cursor.fetchall()]
    conn.close()

    if not prestamos:
        return jsonify({'prestamos': [], 'mensaje': 'No hay préstamos activos.'}), 200

    return jsonify({'prestamos': prestamos, 'total': len(prestamos)}), 200


@prestamos_bp.route('/historial', methods=['GET'])
def get_historial():
    """
    HU08 - Historial de préstamos.
    Retorna todos los préstamos (activos y devueltos).
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT p.id, p.fecha_prestamo, p.fecha_vencimiento, p.fecha_devolucion, p.estado,
               l.titulo, l.autor,
               u.nombre, u.apellido, u.dni
        FROM prestamos p
        JOIN libros l ON p.libro_id = l.id
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.fecha_prestamo DESC
    ''')
    prestamos = [dict(row) for row in cursor.fetchall()]
    conn.close()

    if not prestamos:
        return jsonify({'prestamos': [], 'mensaje': 'No hay registros históricos de préstamos.'}), 200

    return jsonify({'prestamos': prestamos, 'total': len(prestamos)}), 200


@prestamos_bp.route('/', methods=['POST'])
def crear_prestamo():
    """
    HU03 - Registro de préstamo.
    Valida que el libro esté disponible antes de registrar.
    """
    data = request.get_json()

    if not data.get('libro_id') or not data.get('usuario_id'):
        return jsonify({'error': 'Se requieren libro_id y usuario_id.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Verificar que el libro existe
    cursor.execute("SELECT * FROM libros WHERE id = ?", (data['libro_id'],))
    libro = cursor.fetchone()
    if not libro:
        conn.close()
        return jsonify({'error': 'Libro no encontrado.'}), 404

    # HU03 - Criterio: si el libro ya está prestado, mostrar error
    if not libro['disponible']:
        conn.close()
        return jsonify({'error': 'El libro no está disponible. Ya se encuentra prestado.'}), 409

    # Verificar que el usuario existe
    cursor.execute("SELECT id FROM usuarios WHERE id = ?", (data['usuario_id'],))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Usuario no encontrado.'}), 404

    # Calcular fechas
    fecha_prestamo = date.today().isoformat()
    fecha_vencimiento = (date.today() + timedelta(days=DIAS_PRESTAMO)).isoformat()

    # Registrar préstamo
    cursor.execute(
        "INSERT INTO prestamos (libro_id, usuario_id, fecha_prestamo, fecha_vencimiento, estado) VALUES (?, ?, ?, ?, 'activo')",
        (data['libro_id'], data['usuario_id'], fecha_prestamo, fecha_vencimiento)
    )

    # Marcar libro como no disponible
    cursor.execute("UPDATE libros SET disponible = 0 WHERE id = ?", (data['libro_id'],))

    conn.commit()
    prestamo_id = cursor.lastrowid
    conn.close()

    return jsonify({
        'mensaje': 'Préstamo registrado correctamente.',
        'id': prestamo_id,
        'fecha_vencimiento': fecha_vencimiento
    }), 201


@prestamos_bp.route('/<int:prestamo_id>/devolver', methods=['PUT'])
def registrar_devolucion(prestamo_id):
    """
    HU04 - Registro de devolución.
    Valida que el préstamo exista y esté activo.
    """
    conn = get_db()
    cursor = conn.cursor()

    # Verificar que el préstamo existe y está activo
    cursor.execute("SELECT * FROM prestamos WHERE id = ?", (prestamo_id,))
    prestamo = cursor.fetchone()

    if not prestamo:
        conn.close()
        return jsonify({'error': 'Préstamo no encontrado.'}), 404

    # HU04 - Criterio: si no hay préstamo activo, mostrar error
    if prestamo['estado'] != 'activo':
        conn.close()
        return jsonify({'error': 'Este préstamo ya fue devuelto anteriormente.'}), 409

    fecha_devolucion = date.today().isoformat()

    # Actualizar estado del préstamo
    cursor.execute(
        "UPDATE prestamos SET estado = 'devuelto', fecha_devolucion = ? WHERE id = ?",
        (fecha_devolucion, prestamo_id)
    )

    # HU04 - Criterio: actualizar disponibilidad del libro
    cursor.execute("UPDATE libros SET disponible = 1 WHERE id = ?", (prestamo['libro_id'],))

    conn.commit()
    conn.close()

    return jsonify({
        'mensaje': 'Devolución registrada correctamente.',
        'fecha_devolucion': fecha_devolucion
    }), 200


@prestamos_bp.route('/resumen', methods=['GET'])
def get_resumen():
    """Retorna estadísticas generales para el panel de control."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM libros")
    total_libros = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as total FROM usuarios")
    total_usuarios = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as total FROM prestamos WHERE estado = 'activo'")
    prestamos_activos = cursor.fetchone()['total']

    cursor.execute(
        "SELECT COUNT(*) as total FROM prestamos WHERE estado = 'activo' AND fecha_vencimiento < date('now')"
    )
    vencidos = cursor.fetchone()['total']

    cursor.execute('''
        SELECT p.id, p.fecha_prestamo, p.estado,
               l.titulo, u.nombre, u.apellido
        FROM prestamos p
        JOIN libros l ON p.libro_id = l.id
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.id DESC LIMIT 6
    ''')
    actividad_reciente = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return jsonify({
        'total_libros': total_libros,
        'total_usuarios': total_usuarios,
        'prestamos_activos': prestamos_activos,
        'vencidos_hoy': vencidos,
        'actividad_reciente': actividad_reciente
    }), 200
