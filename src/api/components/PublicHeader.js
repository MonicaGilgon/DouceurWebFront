import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo2 from "../images/logo2.png";
import { FaShoppingBag, FaUser, FaSearch } from "react-icons/fa";
import "../pages/scss/PublicHeader.scss"; 
const PublicHeader = () => {
  const navigate = useNavigate();
  const [catalogoAbierto, setCatalogoAbierto] = useState(false);
  const [masAbierto, setMasAbierto] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el buscador

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
    navigate("/sign-in");
  };

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
        <button onClick={handleCartClick} className="cart-button">
          <FaShoppingBag size={20} />
          <span className="cart-count">3</span>
        </button>

        {/* Botón de iniciar sesión */}
        <button onClick={handleLoginClick} className="login-button">
          <FaUser />
          <span>Iniciar sesión</span>
        </button>
      </div>
    </header>
  );
};

export default PublicHeader;