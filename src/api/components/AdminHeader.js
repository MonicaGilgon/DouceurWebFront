import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../pages/scss/AdminHeader.scss';
import logo from '../images/logo2.png';
import { FaUser } from 'react-icons/fa';

const AdminHeader = ({ username = 'Administrador' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const navigate = useNavigate();

  const handleLogout = () => {
  
    localStorage.removeItem('token'); 
    navigate('/sign-in'); 
    setIsDropdownOpen(false); 
  };

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={logo}
          alt="Douceur Logo"
          style={{ width: '50px', height: '50px', marginRight: '1rem' }}
        />
      </div>

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
            fontWeight: 'bold',
          }}
        >
          <FaUser style={{ marginRight: '0.5rem' }} />
          <div>{username}</div>
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
    </header>
  );
};

export default AdminHeader;