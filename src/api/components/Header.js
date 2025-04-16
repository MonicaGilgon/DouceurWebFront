// src/api/components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; // Asegúrate de que la ruta sea correcta
import { FaShoppingBag, FaSearch } from 'react-icons/fa'; // Importamos los íconos necesarios
//import '../pages/scss/Header.scss';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para cerrar sesión
    localStorage.removeItem('token'); // Eliminar token de autenticación
    navigate('/sign-in'); // Redirigir al login
    setIsDropdownOpen(false); // Cerrar el dropdown
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header
      style={{
        backgroundColor: '#f8b6d2',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      {/* Logo + Catálogo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/">
          <img
            src={logo}
            alt="Douceur Logo"
            style={{ width: '70px', height: '70px', borderRadius: '50%' }}
          />
        </Link>

        <select style={{ padding: '0.5rem', borderRadius: '5px' }}>
          <option value="">Catálogo</option>
        </select>
      </div>

      {/* Navegación derecha */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Buscador */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar"
            style={{
              padding: '0.5rem 2.5rem 0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#f5f5f5',
              fontSize: '0.9rem',
              width: '200px',
              outline: 'none',
            }}
          />
          <FaSearch
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Botón de carrito */}
        <button
          onClick={handleCartClick}
          style={{
            backgroundColor: '#ffb9cb',
            border: 'none',
            padding: '0.5rem 0.75rem',
            borderRadius: '5px',
            color: 'white',
            position: 'relative',
          }}
        >
          <FaShoppingBag size={20} />
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: 'white',
              color: '#ff83a2',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            3
          </span>
        </button>

        {/* Menú desplegable de usuario */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              backgroundColor: '#ffb9cb',
              border: 'none',
              borderRadius: '5px',
              padding: '0.5rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
            }}
          >
            {/* Ícono de usuario con flecha (como en la imagen) */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '0.5rem' }}
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
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '150px',
              }}
            >
              <Link
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#333',
                  textDecoration: 'none',
                }}
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#333',
                  border: 'none',
                  background: 'none',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;