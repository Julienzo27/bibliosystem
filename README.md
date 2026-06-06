# 📚 BiblioSystem

Sistema de Gestión Bibliotecaria desarrollado como Trabajo Práctico Integrador para la materia **Ingeniería de Software**.

---

## 🗂️ Descripción

BiblioSystem permite gestionar el catálogo de libros de una biblioteca, registrar préstamos y devoluciones, y consultar el estado de circulación del material bibliográfico.

---

## ⚙️ Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3 + Flask + SQLite |
| Frontend | React 18 + React Router |
| Base de datos | SQLite (archivo local, sin servidor) |
| Control de versiones | Git / GitHub |

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- Python 3.8 o superior
- Node.js 18 o superior
- npm

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/bibliosystem.git
cd bibliosystem
```

---

### 2. Iniciar el Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

El servidor quedará corriendo en: **http://localhost:5000**

La base de datos `bibliosystem.db` se crea automáticamente con datos de ejemplo en el primer arranque.

---

### 3. Iniciar el Frontend (React)

En otra terminal:

```bash
cd frontend
npm install
npm start
```

La aplicación abrirá en: **http://localhost:3000**

---

## 📋 Funcionalidades implementadas

| Historia de Usuario | Funcionalidad | Pantalla |
|---|---|---|
| HU01 | Registro de usuarios | Configuración |
| HU02 | Registro de libros al catálogo | Configuración |
| **HU03** | **Registro de préstamos** | Explorador / Préstamo-Devolución |
| **HU04** | **Registro de devoluciones** | Préstamo-Devolución |
| **HU05** | **Consulta de libros disponibles** | Explorador |
| HU06 | Ver préstamos activos | Préstamo-Devolución |
| HU07 | Filtrado por categoría y autor | Explorador |
| HU08 | Historial de préstamos | Préstamo-Devolución |

Las funcionalidades en **negrita** son las tres funcionalidades principales trazadas como requisito del TP.

---

## 🔗 Endpoints de la API

### Libros
| Método | Endpoint | Descripción | HU |
|--------|----------|-------------|-----|
| GET | `/api/libros/` | Listar libros (acepta filtros) | HU05, HU07 |
| GET | `/api/libros/?disponible=1` | Solo libros disponibles | HU05 |
| GET | `/api/libros/?buscar=texto` | Buscar por título/autor/categoría | HU07 |
| GET | `/api/libros/?categoria=Novela` | Filtrar por categoría | HU07 |
| POST | `/api/libros/` | Registrar nuevo libro | HU02 |
| GET | `/api/libros/categorias` | Listar categorías únicas | HU07 |

### Usuarios
| Método | Endpoint | Descripción | HU |
|--------|----------|-------------|-----|
| GET | `/api/usuarios/` | Listar todos los usuarios | — |
| POST | `/api/usuarios/` | Registrar nuevo usuario | HU01 |

### Préstamos
| Método | Endpoint | Descripción | HU |
|--------|----------|-------------|-----|
| GET | `/api/prestamos/activos` | Ver préstamos activos | HU06 |
| GET | `/api/prestamos/historial` | Ver historial completo | HU08 |
| GET | `/api/prestamos/resumen` | Estadísticas del panel | — |
| POST | `/api/prestamos/` | Registrar nuevo préstamo | HU03 |
| PUT | `/api/prestamos/:id/devolver` | Registrar devolución | HU04 |

---

## 🗃️ Estructura del proyecto

```
bibliosystem/
├── backend/
│   ├── app.py              # Punto de entrada Flask
│   ├── database.py         # Inicialización y conexión SQLite
│   ├── requirements.txt
│   └── routes/
│       ├── libros.py       # HU02, HU05, HU07
│       ├── usuarios.py     # HU01
│       └── prestamos.py    # HU03, HU04, HU06, HU08
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js          # Router y Navbar
│       ├── App.css         # Estilos globales
│       ├── api.js          # Servicio de llamadas a la API
│       ├── pages/
│       │   ├── Inicio.js           # Dashboard / Panel de control
│       │   ├── Explorador.js       # Catálogo (HU05, HU07)
│       │   ├── PrestamosDevolucion.js  # HU03, HU04, HU06, HU08
│       │   └── Configuracion.js    # HU01, HU02
│       └── components/
│           └── ModalReserva.js     # Modal de préstamo (HU03)
├── README.md
└── IA_LOG.md
```

---

## 👥 Integrantes del equipo

| Nombre | Rol |
|--------|-----|
| (completar) | Product Owner |
| (completar) | Scrum Master |
| (completar) | Desarrollador/a |
| (completar) | Desarrollador/a |
| (completar) | Desarrollador/a |

---

## 📄 Metodología

Se utilizó **Scrum** con dos sprints:
- **Sprint 1:** Análisis, diseño e historias de usuario
- **Sprint 2:** Implementación, pruebas y documentación

Tablero de tareas: [Ver en Trello](https://trello.com/invite/b/69f94a670f2d11f6b577fc97/ATTId2d48543fe7d649f8ca276730121d14d07A5806C/tp-ingenieria-de-software-sistema-bibliotecario)

---

## 🤖 Uso de IA

Ver [IA_LOG.md](./IA_LOG.md) para el registro detallado del uso de herramientas de inteligencia artificial durante el desarrollo.
