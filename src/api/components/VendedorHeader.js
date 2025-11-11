"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/scss/AdminHeader.scss";
import logo from "../images/logo2.png";
import { FaUser, FaSignOutAlt, FaUserCog } from "react-icons/fa";

const VendedorHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(JSON.parse(localStorage.getItem("usuario")).nombre);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  // Cargar información del usuario al montar el componente
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.nombre_completo || user.correo || "Usuario");
        setUserRole(user.rol || "");
      } catch (e) {
        console.error("Error al parsear datos de usuario", e);
      }
    }
  }, []);

  const handleLogout = () => {
    // Eliminar tokens y datos de usuario
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    // Disparar evento de cambio de autenticación
    window.dispatchEvent(new Event("auth-change"));

    // Redirigir al login
    navigate("/sign-in");
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  return (
    <header className="admin-header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo || "/placeholder.svg"} alt="Douceur Logo" style={{ width: "50px", height: "50px", marginRight: "1rem" }} />
      </div>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            backgroundColor: "#ffb9cb",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 0.75rem",
            display: "flex",
            alignItems: "center",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          <FaUser style={{ marginRight: "0.5rem" }} />
          <div>Vendedor</div>
        </button>

        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
              minWidth: "200px",
              marginTop: "5px"
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                borderBottom: "1px solid #e0e0e0",
                fontWeight: "bold",
                color: "#333"
              }}
            >
              {userRole && (
                <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "5px" }}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
              )}
              {userName}
            </div>
            <div
              onClick={handleProfileClick}
              style={{
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#333",
                transition: "background-color 0.3s"
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <FaUserCog style={{ marginRight: "10px" }} />
              Mi Perfil
            </div>
            <div
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "#ff6b6b",
                transition: "background-color 0.3s"
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <FaSignOutAlt style={{ marginRight: "10px" }} />
              Cerrar Sesión
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default VendedorHeader;
