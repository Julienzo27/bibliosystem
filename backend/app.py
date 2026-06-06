from flask import Flask
from flask_cors import CORS
from database import init_db
from routes.libros import libros_bp
from routes.usuarios import usuarios_bp
from routes.prestamos import prestamos_bp

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(libros_bp, url_prefix='/api/libros')
app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')
app.register_blueprint(prestamos_bp, url_prefix='/api/prestamos')

@app.route('/')
def index():
    return {'mensaje': 'BiblioSystem API funcionando', 'version': '1.0'}

if __name__ == '__main__':
    init_db()
    print("Base de datos inicializada.")
    print("Servidor corriendo en http://localhost:5000")
    app.run(debug=True, port=5000)
