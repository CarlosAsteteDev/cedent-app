import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    cerrarSesion();
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">CEDENT</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">Catálogo y tarifario</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
            {usuario?.rol === 'paciente' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/reservar">Reservar cita</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/mis-citas">Mis citas</Link>
                </li>
              </>
            )}
            {usuario?.rol === 'especialista' && (
              <li className="nav-item">
                <Link className="nav-link" to="/agenda">Mi agenda</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {usuario ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled">{usuario.nombre_completo} ({usuario.rol})</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm mt-1" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro">Registrarse</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
