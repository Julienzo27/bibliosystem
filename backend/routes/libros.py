"""
Rutas de libros.
Cubre: HU02 (registro de libro), HU05 (consulta de disponibles), HU07 (filtrado)
"""
from flask import Blueprint, request, jsonify
from database import get_db

libros_bp = Blueprint('libros', __name__)


@libros_bp.route('/', methods=['GET'])
def get_libros():
    """
    HU05 - Consulta de libros disponibles.
    HU07 - Filtrado por categoría o autor.
    Parámetros opcionales: ?disponible=1, ?categoria=..., ?autor=..., ?buscar=...
    """
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM libros WHERE 1=1"
    params = []

    # Filtro de disponibilidad (HU05)
    disponible = request.args.get('disponible')
    if disponible is not None:
        query += " AND disponible = ?"
        params.append(int(disponible))

    # Filtro por categoría (HU07)
    categoria = request.args.get('categoria')
    if categoria:
        query += " AND categoria LIKE ?"
        params.append(f"%{categoria}%")

    # Filtro por autor (HU07)
    autor = request.args.get('autor')
    if autor:
        query += " AND autor LIKE ?"
        params.append(f"%{autor}%")

    # Búsqueda general por título (HU07)
    buscar = request.args.get('buscar')
    if buscar:
        query += " AND (titulo LIKE ? OR autor LIKE ? OR categoria LIKE ?)"
        params.extend([f"%{buscar}%", f"%{buscar}%", f"%{buscar}%"])

    query += " ORDER BY titulo ASC"
    cursor.execute(query, params)
    libros = [dict(row) for row in cursor.fetchall()]
    conn.close()

    if not libros:
        return jsonify({'libros': [], 'mensaje': 'No se encontraron libros con los filtros aplicados.'}), 200

    return jsonify({'libros': libros, 'total': len(libros)}), 200


@libros_bp.route('/<int:libro_id>', methods=['GET'])
def get_libro(libro_id):
    """Obtiene un libro por ID."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM libros WHERE id = ?", (libro_id,))
    libro = cursor.fetchone()
    conn.close()

    if not libro:
        return jsonify({'error': 'Libro no encontrado.'}), 404

    return jsonify(dict(libro)), 200


@libros_bp.route('/', methods=['POST'])
def crear_libro():
    """
    HU02 - Registro de libro.
    Valida que no exista un libro con el mismo ISBN.
    """
    data = request.get_json()

    # Validar campos obligatorios
    campos_requeridos = ['titulo', 'autor']
    for campo in campos_requeridos:
        if not data.get(campo, '').strip():
            return jsonify({'error': f'El campo "{campo}" es obligatorio.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    # HU02 - Criterio: si el libro ya existe (mismo ISBN), mostrar error
    isbn = data.get('isbn', '').strip()
    if isbn:
        cursor.execute("SELECT id FROM libros WHERE isbn = ?", (isbn,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Ya existe un libro con ese ISBN en el sistema.'}), 409

    cursor.execute(
        "INSERT INTO libros (titulo, autor, editorial, categoria, isbn, disponible) VALUES (?, ?, ?, ?, ?, 1)",
        (
            data['titulo'].strip(),
            data['autor'].strip(),
            data.get('editorial', '').strip(),
            data.get('categoria', '').strip(),
            isbn or None,
        )
    )
    conn.commit()
    libro_id = cursor.lastrowid
    conn.close()

    return jsonify({'mensaje': 'Libro registrado correctamente.', 'id': libro_id}), 201


@libros_bp.route('/categorias', methods=['GET'])
def get_categorias():
    """Retorna las categorías únicas disponibles (para filtros en frontend)."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT categoria FROM libros WHERE categoria != '' ORDER BY categoria")
    categorias = [row['categoria'] for row in cursor.fetchall()]
    conn.close()
    return jsonify({'categorias': categorias}), 200
