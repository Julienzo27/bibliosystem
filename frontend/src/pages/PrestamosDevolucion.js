import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

function getBadgeEstado(prestamo) {
  const hoy = new Date();
  const venc = new Date(prestamo.fecha_vencimiento);
  const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return { label: 'Vencido', clase: 'badge-danger', extra: 'Vence hoy' };
  if (diffDias <= 3) return { label: 'Por vencer', clase: 'badge-warning', extra: `Vence en ${diffDias} días` };
  return { label: 'Activo', clase: 'badge-success', extra: `${diffDias} días restantes` };
}

function formatFecha(f) {
  if (!f) return '—';
  const [y, m, d] = f.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * PrestamosDevolucion — cubre HU03, HU04, HU06, HU08
 */
export default function PrestamosDevolucion() {
  const [tab, setTab] = useState('activos');
  const [activos, setActivos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idDevolucion, setIdDevolucion] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [devolviendo, setDevolviendo] = useState(false);

  // Modal nuevo préstamo
  const [showNuevo, setShowNuevo] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [nuevoUsuarioId, setNuevoUsuarioId] = useState('');
  const [nuevoLibroId, setNuevoLibroId] = useState('');
  const [creando, setCreando] = useState(false);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [a, h, r] = await Promise.all([
        api.getPrestamosActivos(),
        api.getHistorial(),
        api.getResumen(),
      ]);
      setActivos(a.prestamos || []);
      setHistorial(h.prestamos || []);
      setResumen(r);
    } catch {
      mostrarMensaje('Error al cargar datos. Verificá que el backend esté corriendo.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  useEffect(() => {
    if (showNuevo) {
      api.getUsuarios().then(d => setUsuarios(d.usuarios || []));
      api.getLibros({ disponible: 1 }).then(d => setLibros(d.libros || []));
    }
  }, [showNuevo]);

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4500);
  };

  // HU04 — Registrar devolución
  const handleDevolucion = async () => {
    const id = parseInt(idDevolucion.replace('PR-', '').trim());
    if (!id) {
      mostrarMensaje('Ingresá un ID de préstamo válido (ej: 3 o PR-00003).', 'error');
      return;
    }
    setDevolviendo(true);
    try {
      const res = await api.registrarDevolucion(id);
      mostrarMensaje(`✅ ${res.mensaje} Fecha: ${formatFecha(res.fecha_devolucion)}`);
      setIdDevolucion('');
      cargarDatos();
    } catch (err) {
      mostrarMensaje(`⚠️ ${err.message}`, 'error');
    } finally {
      setDevolviendo(false);
    }
  };

  // HU04 — Devolver directamente desde la tabla
  const handleDevolverDirecto = async (id) => {
    setDevolviendo(true);
    try {
      const res = await api.registrarDevolucion(id);
      mostrarMensaje(`✅ ${res.mensaje}`);
      cargarDatos();
    } catch (err) {
      mostrarMensaje(`⚠️ ${err.message}`, 'error');
    } finally {
      setDevolviendo(false);
    }
  };

  // HU03 — Nuevo préstamo desde el panel
  const handleNuevoPrestamo = async () => {
    if (!nuevoUsuarioId || !nuevoLibroId) {
      mostrarMensaje('Seleccioná un usuario y un libro.', 'error');
      return;
    }
    setCreando(true);
    try {
      const res = await api.crearPrestamo({ libro_id: parseInt(nuevoLibroId), usuario_id: parseInt(nuevoUsuarioId) });
      mostrarMensaje(`✅ ${res.mensaje} Vence: ${formatFecha(res.fecha_vencimiento)}`);
      setShowNuevo(false);
      setNuevoUsuarioId('');
      setNuevoLibroId('');
      cargarDatos();
    } catch (err) {
      mostrarMensaje(`⚠️ ${err.message}`, 'error');
    } finally {
      setCreando(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Préstamos y Devoluciones</h1>
        <p className="page-subtitle">Gestioná los préstamos activos y registrá devoluciones.</p>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo === 'error' ? 'error' : 'success'}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Tabs — HU06 / HU08 */}
      <div className="tabs">
        <button className={`tab ${tab === 'activos' ? 'active' : ''}`} onClick={() => setTab('activos')}>
          📋 Préstamos Activos
        </button>
        <button className={`tab ${tab === 'historial' ? 'active' : ''}`} onClick={() => setTab('historial')}>
          🕐 Historial de Préstamos
        </button>
      </div>

      {/* Tabla de préstamos activos — HU06 */}
      {tab === 'activos' && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--color-primary)' }}>
                Préstamos Activos
              </h2>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Libros actualmente prestados.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowNuevo(true)}>
              + Nuevo Préstamo
            </button>
          </div>

          {loading ? (
            <div className="loading">⏳ Cargando préstamos...</div>
          ) : activos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-text">No hay préstamos activos en este momento.</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID Préstamo</th>
                    <th>Libro</th>
                    <th>Usuario</th>
                    <th>DNI</th>
                    <th>Fecha Préstamo</th>
                    <th>Fecha Vencimiento</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {activos.map(p => {
                    const badge = getBadgeEstado(p);
                    return (
                      <tr key={p.id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                            PR-{String(p.id).padStart(5, '0')}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{p.titulo}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{p.autor}</div>
                        </td>
                        <td>{p.nombre} {p.apellido}</td>
                        <td style={{ fontFamily: 'monospace' }}>{p.dni}</td>
                        <td>{formatFecha(p.fecha_prestamo)}</td>
                        <td>
                          <div>{formatFecha(p.fecha_vencimiento)}</div>
                          <div style={{ fontSize: 11, color: badge.clase === 'badge-danger' ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                            ({badge.extra})
                          </div>
                        </td>
                        <td><span className={`badge ${badge.clase}`}>{badge.label}</span></td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleDevolverDirecto(p.id)}
                            disabled={devolviendo}
                          >
                            Devolver
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Historial — HU08 */}
      {tab === 'historial' && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--color-primary)', marginBottom: 14 }}>
            Historial de Préstamos
          </h2>
          {loading ? (
            <div className="loading">⏳ Cargando historial...</div>
          ) : historial.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">No hay registros históricos de préstamos.</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Libro</th><th>Usuario</th>
                    <th>Fecha Préstamo</th><th>Fecha Devolución</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                        PR-{String(p.id).padStart(5, '0')}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.titulo}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{p.autor}</div>
                      </td>
                      <td>{p.nombre} {p.apellido}</td>
                      <td>{formatFecha(p.fecha_prestamo)}</td>
                      <td>{formatFecha(p.fecha_devolucion)}</td>
                      <td>
                        <span className={`badge ${p.estado === 'activo' ? 'badge-warning' : 'badge-success'}`}>
                          {p.estado === 'activo' ? 'Activo' : 'Devuelto'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Sección devolución + resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Registrar Devolución — HU04 */}
        <div className="card">
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: 'var(--color-primary)', marginBottom: 6 }}>
            Registrar Devolución
          </h3>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 14 }}>
            Ingresá el ID del préstamo para registrar la devolución.
          </p>
          <div className="form-group">
            <label className="form-label">ID del Préstamo *</label>
            <input
              className="form-input"
              placeholder="Ej: PR-00025 o solo 25"
              value={idDevolucion}
              onChange={e => setIdDevolucion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDevolucion()}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleDevolucion}
            disabled={devolviendo || !idDevolucion}
            style={{ width: '100%' }}
          >
            {devolviendo ? 'Registrando...' : '🔄 Registrar Devolución'}
          </button>
        </div>

        {/* Resumen */}
        <div className="card">
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, color: 'var(--color-primary)', marginBottom: 14 }}>
            Resumen
          </h3>
          <div className="resumen-grid">
            <div className="resumen-card">
              <div className="resumen-value">{resumen?.prestamos_activos ?? 0}</div>
              <div className="resumen-label">📋 Préstamos Activos</div>
            </div>
            <div className="resumen-card">
              <div className="resumen-value" style={{ color: 'var(--color-warning)' }}>
                {activos.filter(p => getBadgeEstado(p).label === 'Por vencer').length}
              </div>
              <div className="resumen-label">⏰ Por Vencer</div>
            </div>
            <div className="resumen-card">
              <div className="resumen-value" style={{ color: 'var(--color-danger)' }}>
                {resumen?.vencidos_hoy ?? 0}
              </div>
              <div className="resumen-label">⚠️ Vencidos</div>
            </div>
            <div className="resumen-card">
              <div className="resumen-value" style={{ color: 'var(--color-success)' }}>
                {activos.filter(p => getBadgeEstado(p).label === 'Activo').length}
              </div>
              <div className="resumen-label">✅ En Tiempo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal nuevo préstamo — HU03 */}
      {showNuevo && (
        <div className="modal-overlay" onClick={() => setShowNuevo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nuevo Préstamo</h2>
              <button className="modal-close" onClick={() => setShowNuevo(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Usuario *</label>
              <select className="form-select" value={nuevoUsuarioId} onChange={e => setNuevoUsuarioId(e.target.value)}>
                <option value="">— Seleccioná un usuario —</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.apellido}, {u.nombre} — DNI: {u.dni}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Libro disponible *</label>
              <select className="form-select" value={nuevoLibroId} onChange={e => setNuevoLibroId(e.target.value)}>
                <option value="">— Seleccioná un libro —</option>
                {libros.map(l => (
                  <option key={l.id} value={l.id}>{l.titulo} — {l.autor}</option>
                ))}
              </select>
            </div>

            {libros.length === 0 && (
              <div className="alert alert-error">No hay libros disponibles para prestar.</div>
            )}

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNuevo(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleNuevoPrestamo} disabled={creando}>
                {creando ? 'Registrando...' : '✅ Confirmar Préstamo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
