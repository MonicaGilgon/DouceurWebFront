
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingBag, FaUser, FaSearch } from "react-icons/fa";
import logo2 from "../images/logo2.png";
import "../pages/scss/PublicHeader.scss";
const PublicHeader = () => {
  const navigate = useNavigate();
  const [catalogoAbierto, setCatalogoAbierto] = useState(false);
  const [masAbierto, setMasAbierto] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const catalogoRef = useRef(null);
  const masRef = useRef(null);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catalogoRef.current && !catalogoRef.current.contains(event.target)) {
        setCatalogoAbierto(false);
      }
      if (masRef.current && !masRef.current.contains(event.target)) {
        setMasAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleCartClick = () => {

    navigate("/cart");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirigir a una página de búsqueda con el query
      navigate(`/search?q=${searchQuery}`);
    }
  };


  return (
    <header className="public-header">
      {/* Logo + Navegación izquierda */}
      <div className="header-left">
        <a href="/">

          <img src={logo2} alt="Douceur Logo" className="logo" />
        </a>
        <nav className="nav-links">
          <div className="dropdown" ref={catalogoRef}>
            <button
              onClick={() => setCatalogoAbierto(!catalogoAbierto)}
              className="nav-button"
            >
              Catálogo
            </button>
            {catalogoAbierto && (
              <div className="dropdown-menu">
                <a href="/catalogo/categoria1" className="dropdown-item">
                  categoria1
                </a>
                <a href="/catalogo/categoria2" className="dropdown-item">
                  categoria2
                </a>
              </div>
            )}
          </div>
          <a href="/nosotros" className="nav-link">
            Nosotros
          </a>
          <a href="/dudas" className="nav-link">
            Dudas
          </a>
          <div className="dropdown" ref={masRef}>
            <button
              onClick={() => setMasAbierto(!masAbierto)}
              className="nav-button"

            >
              Más
            </button>
            {masAbierto && (
              <div className="dropdown-menu">
                <a href="/politica-datos" className="dropdown-item">
                  Política de datos
                </a>
                <a href="/terminos-y-condiciones" className="dropdown-item">
                  Términos y condiciones
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Navegación derecha */}
      <div className="header-right">
        {/* Buscador */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
        </form>

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
          <span className="cart-count">3</span>
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
              }}
            >
              <FaUser style={{ marginRight: "0.5rem" }} />
              Mi Cuenta
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


export default PublicHeader;

