# 🤖 Registro de uso de Inteligencia Artificial

Este archivo documenta el uso de herramientas de IA durante el desarrollo de BiblioSystem,
en cumplimiento con los requisitos del Trabajo Práctico Integrador de Ingeniería de Software.

---

## Herramientas utilizadas

| Herramienta | Etapa del proyecto | Tipo de uso |
|---|---|---|
| Claude (Anthropic) | Selección del sistema | Exploración de ideas y análisis de riesgos |
| Claude (Anthropic) | Metodología | Comparación de metodologías ágiles |
| Claude (Anthropic) | Historias de usuario | Borrador y revisión de criterios de aceptación |
| Claude (Anthropic) | Diseño | Generación de mockups (wireframes) |
| Claude (Anthropic) | Codificación | Generación de estructura y código base |

---

## Detalle por etapa

### 1. Selección del sistema

**Asistencia recibida:** Se le pidió a Claude que listara posibles sistemas de software adecuados para el TP, con sus ventajas y limitaciones técnicas.

**Resultado:** La IA propuso varios sistemas incluyendo gestión de turnos, biblioteca, gimnasio y veterinaria. El equipo eligió el sistema bibliotecario por su claridad conceptual y modelo de datos bien definido.

**Ajuste del equipo:** La decisión final fue tomada por el equipo con fundamentación propia en la justificación del documento.

---

### 2. Historias de usuario

**Asistencia recibida:** Se utilizó Claude para generar un borrador de las 8 historias de usuario a partir de la descripción del sistema, y para proponer criterios de aceptación en formato Gherkin (Given/When/Then).

**Resultado:** La IA generó una primera versión de todas las historias. El equipo las revisó, reformuló algunas en lenguaje más natural y ajustó los criterios según la lógica real del sistema.

**Ajuste del equipo:** Se modificó la redacción de HU04 y HU08, y se agregaron casos negativos que la IA no había contemplado inicialmente.

---

### 3. Diseño (mockups)

**Asistencia recibida:** Se usó Claude para generar los mockups de las pantallas principales del sistema (Panel de Control, Catálogo, Reserva, Préstamos/Devoluciones) como código HTML/React interactivo.

**Resultado:** La IA generó interfaces funcionales y visualmente coherentes con la paleta de colores elegida (burdeos y crema).

**Ajuste del equipo:** Se modificó la pantalla de catálogo para incluir el índice alfabético y el checkbox de "solo disponibles". Se ajustó el layout del resumen en la pantalla de préstamos.

---

### 4. Codificación

**Asistencia recibida:** Se utilizó Claude para generar la estructura completa del proyecto (backend Flask + frontend React), incluyendo:

| Componente | Asistencia | Ajuste del equipo |
|---|---|---|
| `database.py` | Generación completa del esquema SQLite y datos de ejemplo | Se revisó que los tipos de datos fueran correctos para SQLite |
| `routes/libros.py` | Borrador de endpoints GET y POST | Se verificó la lógica del filtro combinado (buscar + categoría) |
| `routes/prestamos.py` | Borrador de endpoints HU03 y HU04 | Se ajustó el cálculo de `fecha_vencimiento` y los estados |
| `routes/usuarios.py` | Generación completa | Sin ajustes significativos |
| `Explorador.js` | Borrador con filtros y grid de libros | Se ajustó el debounce de búsqueda y la lógica de limpieza de filtros |
| `PrestamosDevolucion.js` | Borrador con tabs y tabla | Se corrigió el cálculo de días restantes para zonas horarias locales |
| `App.css` | Generación completa de estilos | Se ajustaron los breakpoints responsive |

---

## Análisis crítico

### ¿Qué funcionó bien?

- La IA fue muy útil para generar **código boilerplate** (configuración, estructura de carpetas, CSS base) que de otro modo habría llevado mucho tiempo.
- Los **endpoints REST** generados respetaban las convenciones y cubrían los casos de error de manera correcta.
- Los **criterios de aceptación** generados en formato Gherkin fueron una buena base de partida.

### ¿Qué falló o requirió corrección?

- La IA generó inicialmente los mockups sin considerar que React no soporta `localStorage` en ciertos entornos, lo que requirió ajustar el manejo de estado.
- Los criterios de aceptación iniciales no contemplaban todos los casos negativos (por ejemplo, qué pasa si se intenta devolver un préstamo ya devuelto).
- El CSS generado usaba algunas propiedades que no son compatibles con versiones antiguas de navegadores; fue necesario revisar manualmente.

### Reflexión sobre el rol de la IA en el proceso

La IA funcionó como un **asistente de programación** que acelera las etapas mecánicas del desarrollo (estructura, boilerplate, CSS, documentación). Sin embargo, la **toma de decisiones de diseño**, la **validación de la lógica de negocio** y la **integración de los componentes** requirieron criterio profesional del equipo.

El mayor riesgo del uso de IA sin revisión es aceptar código que "parece correcto" sin verificar que cumple exactamente con los requisitos definidos en las historias de usuario. El equipo aprendió a usar la IA como un punto de partida, no como una solución final.

---

*Documento generado para el TP Integrador de Ingeniería de Software — 2026*
