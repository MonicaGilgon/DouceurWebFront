import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

const PublicHeader = () => {
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ 
        backgroundColor: '#f8b6d2', 
        padding: '1rem 2rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Douceur Logo" 
            style={{ width: '50px', height: '50px', marginRight: '1rem', borderRadius: '50%' }} 
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '9.0rem' }}>
          <select style={{ padding: '0.5rem', borderRadius: '5px' }}>
            <option value="">Catálogo</option>
          </select>

          <input 
            type="text" 
            placeholder="Buscar..." 
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', width: '200px' }} 
            disabled 
          />

          <button style={{ backgroundColor: '#fff', border: 'none', fontSize: '1.2rem' }}>
            🛒
          </button>

          <button 
            onClick={handleLoginClick}
            style={{ padding: '0.5rem 1rem', borderRadius: '5px', backgroundColor: '#fff', border: '1px solid #ccc' }}
          >
            Iniciar sesión
          </button>
        </div>
      </header>
    </div>
  );
};

export default PublicHeader;
