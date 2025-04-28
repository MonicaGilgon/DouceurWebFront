import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import logo from "../images/logo.png"
import { FaShoppingBag, FaSearch } from "react-icons/fa"

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

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

  const handleLoginClick = () => {
    navigate("/sign-in")
  }

  const handleCartClick = () => {
    navigate("/cart")
  }

  return (
    <header
      style={{
        backgroundColor: "#f8b6d2",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {/* Logo + Catálogo */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/">
          <img
            src={logo || "/placeholder.svg"}
            alt="Douceur Logo"
            style={{ width: "70px", height: "70px", borderRadius: "50%" }}
          />
        </Link>

        <select style={{ padding: "0.5rem", borderRadius: "5px" }}>
          <option value="">Catálogo</option>
        </select>
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
              width: "200px",
              outline: "none",
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
              }}
            >
              {/* Ícono de usuario con flecha */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "0.5rem" }}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M16 14l4 4"></path>
                <path d="M20 14l-4 4"></path>
              </svg>
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
                  minWidth: "150px",
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
                  Hola, {userName}
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 20px",
                    color: "#333",
                    textDecoration: "none",
                  }}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    padding: "10px 20px",
                    color: "#333",
                    border: "none",
                    background: "none",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Cerrar Sesión
                </button>
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
              color: "white",
              cursor: "pointer",
            }}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
