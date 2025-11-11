"use client";

import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const VendedorRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      // Verificar si el usuario está autenticado
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      // Verificar el rol del usuario
      try {
        const userData = localStorage.getItem("usuario");
        if (!userData) {
          setIsAuthorized(false);
          return;
        }

        const user = JSON.parse(userData);
        const userRole = user.rol || "";

        // Permitir acceso a vendedores y administradores (los administradores suelen tener acceso a todo)
        if (userRole.toLowerCase() === "vendedor" || userRole.toLowerCase() === "admin") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error al verificar el rol del usuario:", error);
        setIsAuthorized(false);
      }
    };

    checkAuth();

    // Verificar periódicamente la autenticación
    const interval = setInterval(checkAuth, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Mostrar un indicador de carga mientras se verifica la autorización
  if (isAuthorized === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Verificando permisos...</p>
      </div>
    );
  }

  // Redirigir a la página de inicio si no está autorizado
  if (!isAuthorized) {
    return <Navigate to="/access-denied" replace />;
  }

  // Renderizar las rutas protegidas si está autorizado
  return <Outlet />;
};

export default VendedorRoute;
