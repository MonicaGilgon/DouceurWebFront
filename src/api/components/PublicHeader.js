import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { FaShoppingBag, FaUser, FaSearch } from 'react-icons/fa';

const PublicHeader = () => {
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
    navigate('/sign-in');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header style={{ 
      backgroundColor: '#f8b6d2', 
      padding: '1rem 2rem', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }}>
      {/* Logo + Catálogo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img 
          src={logo} 
          alt="Douceur Logo" 
          style={{ width: '70px', height: '70px', borderRadius: '50%' }} 
        />

        <select style={{ padding: '0.5rem', borderRadius: '5px' }}>
          <option value="">Catálogo</option>
        </select>
      </div>

      {/* Navegación derecha */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        
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
          <FaSearch style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            pointerEvents: 'none',
          }} />
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
            position: 'relative'
          }}
        >
          <FaShoppingBag size={20} />
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: 'white',
            color: '#ff83a2',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}>
            3
          </span>
        </button>

        {/* Botón de iniciar sesión */}
        <button 
          onClick={handleLoginClick}
          style={{ 
            backgroundColor: '#ffb9cb', 
            border: 'none', 
            borderRadius: '5px', 
            padding: '0.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            color: 'white'
          }}
        >
          <FaUser style={{ marginRight: '0.5rem' }} />
          Iniciar sesión
        </button>
      </div>
    </header>
  );
};

export default PublicHeader;
