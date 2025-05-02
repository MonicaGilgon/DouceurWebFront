"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import logo2 from "../images/logo2.png"
import { FaShoppingBag, FaUser, FaSearch, FaUserCog, FaSignOutAlt } from "react-icons/fa"

const PublicHeader = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [masAbierto, setMasAbierto] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState(JSON.parse(localStorage.getItem("usuario")).nombre)
  const [userRole, setUserRole] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Función para verificar el estado de autenticación
  const checkAuth = () => {
    const token = localStorage.getItem("access_token")
    if (token) {
      setIsAuthenticated(true)

      // Intentar obtener el nombre del usuario si está almacenado
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const user = JSON.parse(userData)
          setUserName(user.nombre_completo || user.correo || "Usuario")
          setUserRole(user.rol || "")
        } catch (e) {
          console.error("Error al parsear datos de usuario", e)
        }
      }
    } else {
      setIsAuthenticated(false)
    }
  }

  // Verificar autenticación cuando el componente se monta
  useEffect(() => {
    checkAuth()
  }, [])

  // Verificar autenticación cuando cambia la ruta
  useEffect(() => {
    checkAuth()
  }, [location.pathname])

  // Escuchar el evento personalizado de cambio de autenticación
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener("auth-change", handleAuthChange)

    // Verificar periódicamente el estado de autenticación (como respaldo)
    const interval = setInterval(checkAuth, 2000)

    return () => {
      window.removeEventListener("auth-change", handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  const handleLoginClick = () => {
    navigate("/sign-in")
  }

  const handleLogout = () => {
    // Eliminar tokens y datos de usuario
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")

    // Disparar evento de cambio de autenticación
    window.dispatchEvent(new Event("auth-change"))

    setIsAuthenticated(false)
    navigate("/") // Redirigir a la página de inicio
    setIsDropdownOpen(false) // Cerrar el dropdown
  }

  const handleProfileClick = () => {
    navigate("/profile")
    setIsDropdownOpen(false)
  }

  const handleCartClick = () => {
    navigate("/cart")
  }

  return (
    <header
      style={{
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {/* Logo + Catálogo */}
      <div style={{ alignItems: "center", gap: "1rem", marginLeft: 35 }}>
        <a href="/">
          <img src={logo2 || "/placeholder.svg"} alt="Douceur Logo" style={{ width: "75px", height: "85px" }} />
        </a>
        <a
          //href="/catalogo"
          style={{
            marginLeft: 30,
            fontWeight: "bold",
            padding: "0.5rem",
            borderRadius: "5px",
            textDecoration: "none",
            color: "#000",
            cursor: "pointer",
          }}
        >
          Catálogo
        </a>

        <a
          href="/nosotros"
          style={{
            marginLeft: 30,
            fontWeight: "bold",
            padding: "0.5rem",
            borderRadius: "5px",
            textDecoration: "none",
            color: "#000",
            cursor: "pointer",
          }}
        >
          Nosotros
        </a>
        <a
          href="/dudas"
          style={{
            marginLeft: 30,
            fontWeight: "bold",
            padding: "0.5rem",
            borderRadius: "5px",
            textDecoration: "none",
            color: "#000",
            cursor: "pointer",
          }}
        >
          Dudas
        </a>

        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setMasAbierto(!masAbierto)}
            style={{
              fontWeight: "bold",
              padding: "0.5rem 1.5rem",
              borderRadius: "5px",
              background: "#ffffff",
              color: "#000",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginLeft: 35,
            }}
          >
            Más
          </button>
          {masAbierto && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginTop: "0.5rem",
                zIndex: 1000,
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <a
                href="/politica-datos"
                style={{
                  display: "block",
                  padding: "0.5rem 1.5rem",
                  textDecoration: "none",
                  color: "#000",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                Política de datos
              </a>
              <a
                href="/terminos-y-condiciones"
                style={{
                  display: "block",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                  color: "#000",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                Términos y condiciones
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Navegación derecha */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Buscador */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Buscar"
            style={{
              padding: "0.5rem 2.5rem 0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#f5f5f5",
              fontSize: "0.9rem",
              width: "350px",
              outline: "none",
              marginRight: 140,
            }}
          />
          <FaSearch
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#999",
              pointerEvents: "none",
              marginRight: 150,
            }}
          />
        </div>

        {/* Botón de carrito */}
        <button
          onClick={handleCartClick}
          style={{
            backgroundColor: "#ffb9cb",
            border: "none",
            padding: "0.5rem 0.75rem",
            borderRadius: "5px",
            color: "white",
            position: "relative",
            marginRight: 15,
          }}
        >
          <FaShoppingBag size={20} />
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              backgroundColor: "white",
              color: "#ff83a2",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            3
          </span>
        </button>

        {/* Mostrar botón de inicio de sesión o menú de usuario según el estado de autenticación */}
        {isAuthenticated ? (
          <div style={{ position: "relative", marginRight: 30 }}>
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
                cursor: "pointer",
              }}
            >
              <FaUser style={{ marginRight: "0.5rem" }} />
              <div>Mi cuenta</div>
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
                  marginTop: "5px",
                }}
              >
                <div
                  style={{
                    padding: "10px 20px",
                    borderBottom: "1px solid #e0e0e0",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {userRole && (
                    <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "5px" }}>
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </div>
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
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <FaSignOutAlt style={{ marginRight: "10px" }} />
                  Cerrar Sesión
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLoginClick}
            style={{
              backgroundColor: "#ffb9cb",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 0.75rem",
              display: "flex",
              alignItems: "center",
              color: "white",
              marginRight: 30,
            }}
          >
            <FaUser style={{ marginRight: "0.5rem" }} />
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  )
}

export default PublicHeader
