import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import ModalReserva from '../components/ModalReserva';

// Emojis por categoría para los covers de los libros
const COVERS = {
  'Autoayuda': '🧠', 'Novela': '📖', 'Historia': '🏛️',
  'Fantasía': '🧙', 'Psicología': '🧬', 'Arte': '🎨',
  'Ciencia': '🔬', 'Poesía': '✍️',
};

function LibroCard({ libro, onSolicitar }) {
  const emoji = COVERS[libro.categoria] || '📚';
  return (
    <div className="libro-card">
      <div className="libro-cover">{emoji}</div>
      <div className="libro-info">
        <div className="libro-titulo">{libro.titulo}</div>
        <div className="libro-autor">{libro.autor}</div>
        <div className="libro-categoria">{libro.categoria}</div>
        <div style={{ marginTop: 6 }}>
          <span className={`badge ${libro.disponible ? 'badge-success' : 'badge-danger'}`}>
            {libro.disponible ? '✔ Disponible' : '✖ Prestado'}
          </span>
        </div>
      </div>
      <div className="libro-card-footer">
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={!libro.disponible}
          onClick={() => onSolicitar(libro)}
        >
          {libro.disponible ? 'Solicitar' : 'No disponible'}
        </button>
      </div>
    </div>
  );
}

export default function Explorador() {
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const cargarLibros = useCallback(() => {
    setLoading(true);
    const params = {};
    if (buscar) params.buscar = buscar;
    if (categoriaFiltro) params.categoria = categoriaFiltro;
    if (soloDisponibles) params.disponible = 1;

    api.getLibros(params)
      .then(data => setLibros(data.libros || []))
      .catch(() => setError('Error al cargar el catálogo.'))
      .finally(() => setLoading(false));
  }, [buscar, categoriaFiltro, soloDisponibles]);

  useEffect(() => {
    api.getCategorias().then(data => setCategorias(data.categorias || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(cargarLibros, 300); // debounce búsqueda
    return () => clearTimeout(timer);
  }, [cargarLibros]);

  const handlePrestamoExitoso = () => {
    setLibroSeleccionado(null);
    setMensaje('✅ Préstamo registrado correctamente.');
    cargarLibros();
    setTimeout(() => setMensaje(''), 4000);
  };

  // Índice alfabético
  const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Catálogo de Libros</h1>
        <p className="page-subtitle">Los más buscados.</p>
      </div>

      {/* Índice alfabético */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 20, fontSize: 13, color: 'var(--color-primary)', fontWeight: 700 }}>
        {letras.map((l, i) => (
          <span key={l}>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => setBuscar(l)}
              title={`Filtrar por "${l}"`}
            >
              {l}
            </span>
            {i < letras.length - 1 && <span style={{ color: 'var(--color-border)', margin: '0 2px' }}>-</span>}
          </span>
        ))}
      </div>

      {/* Filtros — HU07 */}
      <div className="filtros-bar">
        <input
          className="form-input"
          placeholder="🔍 Buscar por título, autor o categoría..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
        />
        <select
          className="form-select"
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={e => setSoloDisponibles(e.target.checked)}
          />
          Solo disponibles
        </label>
        {(buscar || categoriaFiltro || soloDisponibles) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setBuscar(''); setCategoriaFiltro(''); setSoloDisponibles(false); }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">⏳ Cargando catálogo...</div>
      ) : libros.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">No se encontraron libros con los filtros aplicados.</div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 14 }}>
            {libros.length} libro{libros.length !== 1 ? 's' : ''} encontrado{libros.length !== 1 ? 's' : ''}
          </div>
          <div className="libros-grid">
            {libros.map(libro => (
              <LibroCard key={libro.id} libro={libro} onSolicitar={setLibroSeleccionado} />
            ))}
          </div>
        </>
      )}

      {libroSeleccionado && (
        <ModalReserva
          libro={libroSeleccionado}
          onClose={() => setLibroSeleccionado(null)}
          onExito={handlePrestamoExitoso}
        />
      )}
    </div>
  );
}
