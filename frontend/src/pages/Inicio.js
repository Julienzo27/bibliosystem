import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function Inicio() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getResumen()
      .then(setResumen)
      .catch(() => setError('No se pudo conectar con el servidor. Verificá que el backend esté corriendo.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">⏳ Cargando panel de control...</div>;

  if (error) return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Panel de Control</h1>
      </div>
      <div className="alert alert-error">⚠️ {error}</div>
    </div>
  );

  const stats = [
    { label: 'Libros Totales', value: resumen?.total_libros ?? 0, icon: '📚' },
    { label: 'Miembros Activos', value: resumen?.total_usuarios ?? 0, icon: '👥' },
    { label: 'Libros Prestados', value: resumen?.prestamos_activos ?? 0, icon: '📈' },
    { label: 'Vencen Hoy', value: resumen?.vencidos_hoy ?? 0, icon: '⏰' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Panel de Control</h1>
        <p className="page-subtitle">Bienvenido a tu sistema de gestión bibliotecaria</p>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value.toLocaleString('es-AR')}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, marginBottom: 14, color: 'var(--color-primary)' }}>
          Actividad Reciente
        </h2>
        {resumen?.actividad_reciente?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No hay actividad reciente.</div>
          </div>
        ) : (
          resumen?.actividad_reciente?.map((item, i) => (
            <div className="actividad-item" key={item.id}>
              <div>
                <div className="actividad-info">
                  {item.nombre} — <em>"{item.titulo}"</em>
                </div>
                <div className="actividad-tiempo">Registro #{item.id}</div>
              </div>
              <span className={`badge ${item.estado === 'activo' ? 'badge-warning' : 'badge-success'}`}>
                {item.estado === 'activo' ? 'prestado' : 'devuelto'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
