import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import ReservarCita from './pages/ReservarCita';
import Pago from './pages/Pago';
import Comprobante from './pages/Comprobante';
import MisCitas from './pages/MisCitas';
import DashboardAgenda from './pages/DashboardAgenda';
import ResultadosClinicos from './pages/ResultadosClinicos';
import Contacto from './pages/Contacto';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/contacto" element={<Contacto />} />

        <Route path="/reservar" element={
          <ProtectedRoute roles={['paciente']}><ReservarCita /></ProtectedRoute>
        } />
        <Route path="/mis-citas" element={
          <ProtectedRoute roles={['paciente']}><MisCitas /></ProtectedRoute>
        } />
        <Route path="/pago/:citaId" element={
          <ProtectedRoute roles={['paciente']}><Pago /></ProtectedRoute>
        } />
        <Route path="/comprobante/:citaId" element={
          <ProtectedRoute><Comprobante /></ProtectedRoute>
        } />
        <Route path="/agenda" element={
          <ProtectedRoute roles={['especialista']}><DashboardAgenda /></ProtectedRoute>
        } />
        <Route path="/resultados/:citaId" element={
          <ProtectedRoute roles={['paciente', 'especialista']}><ResultadosClinicos /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}
