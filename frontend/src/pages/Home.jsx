import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { usuario } = useAuth();

  return (
    <div className="container text-center py-5">
      <h1 className="mb-3">Bienvenido a CEDENT</h1>
      <p className="lead mb-4">Reserva tus citas odontológicas y paga en línea de forma sencilla.</p>
      <div className="d-flex justify-content-center gap-2">
        <Link className="btn btn-primary" to="/catalogo">Ver catálogo de servicios</Link>
        {!usuario && <Link className="btn btn-outline-primary" to="/registro">Crear cuenta</Link>}
      </div>
    </div>
  );
}
