import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('cedent_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  function iniciarSesion(usuario, token) {
    localStorage.setItem('cedent_token', token);
    localStorage.setItem('cedent_usuario', JSON.stringify(usuario));
    setUsuario(usuario);
  }

  function cerrarSesion() {
    localStorage.removeItem('cedent_token');
    localStorage.removeItem('cedent_usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
