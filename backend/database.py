import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'bibliosystem.db')

def get_db():
    """Retorna una conexión a la base de datos con row_factory para acceder por nombre de columna."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Crea las tablas si no existen e inserta datos de ejemplo."""
    conn = get_db()
    cursor = conn.cursor()

    # Tabla usuarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            dni TEXT NOT NULL UNIQUE,
            email TEXT,
            fecha_registro TEXT DEFAULT (date('now'))
        )
    ''')

    # Tabla libros
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS libros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            autor TEXT NOT NULL,
            editorial TEXT,
            categoria TEXT,
            isbn TEXT UNIQUE,
            disponible INTEGER DEFAULT 1
        )
    ''')

    # Tabla prestamos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prestamos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            libro_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            fecha_prestamo TEXT DEFAULT (date('now')),
            fecha_vencimiento TEXT,
            fecha_devolucion TEXT,
            estado TEXT DEFAULT 'activo',
            FOREIGN KEY (libro_id) REFERENCES libros(id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    ''')

    # Datos de ejemplo si las tablas están vacías
    cursor.execute("SELECT COUNT(*) FROM usuarios")
    if cursor.fetchone()[0] == 0:
        cursor.executemany(
            "INSERT INTO usuarios (nombre, apellido, dni, email) VALUES (?, ?, ?, ?)",
            [
                ("Juan", "Pérez", "12345678", "juan@email.com"),
                ("María", "Gómez", "23456789", "maria@email.com"),
                ("Carlos", "Ruiz", "34567890", "carlos@email.com"),
                ("Lucía", "Fernández", "45678901", "lucia@email.com"),
            ]
        )

    cursor.execute("SELECT COUNT(*) FROM libros")
    if cursor.fetchone()[0] == 0:
        cursor.executemany(
            "INSERT INTO libros (titulo, autor, editorial, categoria, isbn, disponible) VALUES (?, ?, ?, ?, ?, ?)",
            [
                ("Frena tu cabeza", "Marina Mammoliti", "Grijalbo", "Autoayuda", "978-987-01-0001-1", 1),
                ("Podría quedarme acá", "Oriana Sabatini", "Montena", "Novela", "978-987-01-0002-2", 1),
                ("76", "Felipe Pigna", "Planeta", "Historia", "978-987-01-0003-3", 1),
                ("El misterio del último Stradivarius", "Alejandro G. Roemmers", "Planeta", "Novela", "978-987-01-0004-4", 1),
                ("Harry Potter y la cámara de los secretos", "J.K. Rowling", "Salamandra", "Fantasía", "978-987-01-0005-5", 1),
                ("Matar a un ruiseñor", "Harper Lee", "Salamandra", "Novela", "978-987-01-0006-6", 1),
                ("Orgullo y Prejuicio", "Jane Austen", "Alianza", "Novela", "978-987-01-0007-7", 1),
                ("Viaje a la Patagonia Austral", "Francisco Moreno", "Emecé", "Historia", "978-987-01-0008-8", 1),
                ("Introducción al Psicoanálisis", "Sigmund Freud", "Alianza", "Psicología", "978-987-01-0009-9", 1),
                ("Bauhaus, 100 años de la Bauhaus", "Frank Whitford", "Destino", "Arte", "978-987-01-0010-0", 1),
            ]
        )

    conn.commit()
    conn.close()
