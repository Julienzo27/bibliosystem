// Servicio centralizado para llamadas a la API de BiblioSystem
const BASE_URL = 'http://localhost:5000/api';

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error en el servidor.');
  }
  return data;
}

export const api = {
  // Libros
  getLibros: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/libros/${query ? '?' + query : ''}`);
  },
  getCategorias: () => request('/libros/categorias'),
  crearLibro: (data) => request('/libros/', { method: 'POST', body: JSON.stringify(data) }),

  // Usuarios
  getUsuarios: () => request('/usuarios/'),
  crearUsuario: (data) => request('/usuarios/', { method: 'POST', body: JSON.stringify(data) }),

  // Préstamos
  getPrestamosActivos: () => request('/prestamos/activos'),
  getHistorial: () => request('/prestamos/historial'),
  getResumen: () => request('/prestamos/resumen'),
  crearPrestamo: (data) => request('/prestamos/', { method: 'POST', body: JSON.stringify(data) }),
  registrarDevolucion: (id) => request(`/prestamos/${id}/devolver`, { method: 'PUT' }),
};
