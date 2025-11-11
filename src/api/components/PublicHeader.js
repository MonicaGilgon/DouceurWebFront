"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo2 from "../images/logo2.png";
import { FaShoppingBag, FaUser, FaSearch, FaBars, FaTimes, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import "../pages/scss/PublicHeader.scss";

const PublicHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { clearCart, cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [userName, setUserName] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("usuario"));
      return user?.nombre || "Usuario";
    } catch {
      return "Usuario";
    }
  });

  // Función para verificar el estado de autenticación
  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
      const userData = localStorage.getItem("usuario");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserName(user.nombre || user.correo || "Usuario");
          setUserRole(user.rol || "");
        } catch (e) {
          console.error("Error al parsear datos de usuario", e);
        }
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener("auth-change", handleAuthChange);
    const interval = setInterval(checkAuth, 2000);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/sign-in");
  };

  const handleLogout = () => {
    const userData = localStorage.getItem("usuario");
    const user = userData ? JSON.parse(userData) : {};
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("usuario");
    if (user.id) {
      localStorage.removeItem(`cartItems_${user.id}`);
    }
    clearCart();
    window.dispatchEvent(new Event("auth-change"));
    setIsAuthenticated(false);
    navigate("/");
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  // Cierra el menú al navegar
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="public-header">
      <div className="header-left">
        <a href="/">
          <img src={logo2 || "/placeholder.svg"} alt="Douceur Logo" className="header-logo" />
        </a>
        <nav className={`header-nav ${mobileMenuOpen ? "open" : ""}`}>
          <a href="/catalogo">Catálogo</a>
          <a href="/nosotros">Nosotros</a>
          <a href="/dudas">Dudas</a>
          <a href="/mas">Más</a>
        </nav>
        <button className="menu-toggle" onClick={() => setMobileMenuOpen(prev => !prev)} aria-label="Abrir menú">
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Desktop: barra de búsqueda y botones separados */}
      <div className="header-center">
        <form className="search-bar">
          <input type="text" placeholder="Buscar" />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </div>
      <div className="header-right">
        <button className="cart-btn" onClick={handleCartClick}>
          <FaShoppingBag />
          {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
        </button>
        {isAuthenticated ? (
          <div className="user-dropdown-container">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="user-btn">
              <FaUser style={{ marginRight: "0.5rem" }} />
              <span>Mi cuenta</span>
            </button>
            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  {userRole && <div className="user-role">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>}
                  {userName}
                </div>
                <div className="user-dropdown-item" onClick={handleProfileClick}>
                  <FaUserCog style={{ marginRight: "10px" }} />
                  Mi Perfil
                </div>
                <div className="user-dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt style={{ marginRight: "10px" }} />
                  Cerrar Sesión
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={handleLoginClick}>
            <FaUser style={{ marginRight: "0.5rem" }} />
            Iniciar sesión
          </button>
        )}
      </div>

      {/* Mobile: barra de búsqueda y botones juntos */}
      <div className="header-actions">
        <form className="search-bar">
          <input type="text" placeholder="Buscar" />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
        <div className="header-right">
          <button className="cart-btn" onClick={handleCartClick}>
            <FaShoppingBag />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </button>
          {isAuthenticated ? (
            <div className="user-dropdown-container">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="user-btn">
                <FaUser style={{ marginRight: "0.5rem" }} />
                <span>Mi cuenta</span>
              </button>
              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    {userRole && <div className="user-role">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>}
                    {userName}
                  </div>
                  <div className="user-dropdown-item" onClick={handleProfileClick}>
                    <FaUserCog style={{ marginRight: "10px" }} />
                    Mi Perfil
                  </div>
                  <div className="user-dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt style={{ marginRight: "10px" }} />
                    Cerrar Sesión
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={handleLoginClick}>
              <FaUser style={{ marginRight: "0.5rem" }} />
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
