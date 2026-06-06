import React, { useState, useEffect } from 'react';
import { api } from '../api';

/**
 * ModalReserva — HU03: Registro de préstamo.
 * Permite al bibliotecario seleccionar un usuario y confirmar el préstamo de un libro disponible.
 */
export default function ModalReserva({ libro, onClose, onExito }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getUsuarios().then(data => setUsuarios(data.usuarios || []));
  }, []);

  const handleConfirmar = async () => {
    if (!usuarioId) {
      setError('Seleccioná un usuario para continuar.');
      return;
    }
    setCargando(true);
    setError('');
    try {
      await api.crearPrestamo({ libro_id: libro.id, usuario_id: parseInt(usuarioId) });
      onExito();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Reservar Libro</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Info del libro */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 48 }}>📚</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 16 }}>{libro.titulo}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{libro.autor}</div>
            {libro.editorial && <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Editorial {libro.editorial}</div>}
            {libro.categoria && <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Categoría: {libro.categoria}</div>}
            <div style={{ marginTop: 8 }}>
              <span className="badge badge-success">✔ Disponible — Puede reservarse</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
            Datos de la persona que solicita el libro
          </p>

          <div className="form-group">
            <label className="form-label">Seleccionar Usuario *</label>
            <select
              className="form-select"
              value={usuarioId}
              onChange={e => setUsuarioId(e.target.value)}
            >
              <option value="">— Seleccioná un usuario —</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                  {u.apellido}, {u.nombre} — DNI: {u.dni}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones (Opcional)</label>
            <textarea
              className="form-input"
              rows={3}
              style={{ resize: 'vertical' }}
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              placeholder="Alguna nota adicional..."
            />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={cargando}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleConfirmar} disabled={cargando}>
            {cargando ? 'Registrando...' : 'Confirmar reserva'}
          </button>
        </div>
      </div>
    </div>
  );
}
