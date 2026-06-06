import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Explorador from './pages/Explorador';
import PrestamosDevolucion from './pages/PrestamosDevolucion';
import Configuracion from './pages/Configuracion';
import './App.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">📚</span>
        <span className="navbar-title">BiblioSystem</span>
      </div>
      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🏠 Inicio
        </NavLink>
        <NavLink to="/explorador" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          📖 Explorar
        </NavLink>
        <NavLink to="/prestamos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🔄 Préstamo/Devolución
        </NavLink>
        <NavLink to="/configuracion" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          ⚙️ Configuración
        </NavLink>
      </nav>
      <div className="navbar-user">
        Bienvenido Administrador <span className="user-avatar">👤</span>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/explorador" element={<Explorador />} />
            <Route path="/prestamos" element={<PrestamosDevolucion />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </main>
        <footer className="footer">
          BiblioSystem © 2026 | Sistema de Gestión Bibliotecario
        </footer>
      </div>
    </Router>
  );
}

export default App;
