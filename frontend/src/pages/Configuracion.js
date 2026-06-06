import React, { useState } from 'react';
import { api } from '../api';

function FormUsuario() {
  const [form, setForm] = useState({ nombre: '', apellido: '', dni: '', email: '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });
    try {
      const res = await api.crearUsuario(form);
      setMensaje({ texto: `✅ ${res.mensaje}`, tipo: 'success' });
      setForm({ nombre: '', apellido: '', dni: '', email: '' });
    } catch (err) {
      setMensaje({ texto: `⚠️ ${err.message}`, tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--color-primary)', marginBottom: 4 }}>
        Registrar Usuario
      </h2>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 18 }}>HU01 — Como bibliotecario quiero registrar usuarios para poder gestionar préstamos.</p>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo === 'error' ? 'error' : 'success'}`}>{mensaje.texto}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Nombre *</label>
          <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Juan" />
        </div>
        <div className="form-group">
          <label className="form-label">Apellido *</label>
          <input className="form-input" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Ej: Pérez" />
        </div>
        <div className="form-group">
          <label className="form-label">DNI *</label>
          <input className="form-input" name="dni" value={form.dni} onChange={handleChange} placeholder="Ej: 34430261" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Ej: juan@email.com" />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={cargando} style={{ marginTop: 4 }}>
        {cargando ? 'Registrando...' : '+ Registrar Usuario'}
      </button>
    </div>
  );
}

function FormLibro() {
  const [form, setForm] = useState({ titulo: '', autor: '', editorial: '', categoria: '', isbn: '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });
    try {
      const res = await api.crearLibro(form);
      setMensaje({ texto: `✅ ${res.mensaje}`, tipo: 'success' });
      setForm({ titulo: '', autor: '', editorial: '', categoria: '', isbn: '' });
    } catch (err) {
      setMensaje({ texto: `⚠️ ${err.message}`, tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: 'var(--color-primary)', marginBottom: 4 }}>
        Registrar Libro
      </h2>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 18 }}>HU02 — Como bibliotecario quiero registrar libros para administrar el catálogo.</p>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo === 'error' ? 'error' : 'success'}`}>{mensaje.texto}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Título *</label>
          <input className="form-input" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ej: Cien años de soledad" />
        </div>
        <div className="form-group">
          <label className="form-label">Autor *</label>
          <input className="form-input" name="autor" value={form.autor} onChange={handleChange} placeholder="Ej: Gabriel García Márquez" />
        </div>
        <div className="form-group">
          <label className="form-label">Editorial</label>
          <input className="form-input" name="editorial" value={form.editorial} onChange={handleChange} placeholder="Ej: Sudamericana" />
        </div>
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <input className="form-input" name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ej: Novela" />
        </div>
        <div className="form-group">
          <label className="form-label">ISBN</label>
          <input className="form-input" name="isbn" value={form.isbn} onChange={handleChange} placeholder="Ej: 978-987-01-0001-1" />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={cargando} style={{ marginTop: 4 }}>
        {cargando ? 'Registrando...' : '+ Registrar Libro'}
      </button>
    </div>
  );
}

export default function Configuracion() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Registrá nuevos usuarios y libros en el sistema.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <FormUsuario />
        <FormLibro />
      </div>
    </div>
  );
}
