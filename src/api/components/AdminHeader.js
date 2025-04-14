import React from 'react';
import logo from '../images/logo.png';
import { FaUser } from 'react-icons/fa';

const handleLoginClick = () => {
  
  //navigate('/sign-in'); #debería redireccionar al cierre de sesión
};
const AdminHeader = ({ username = 'Administrador' }) => {
  return (
    <header style={{
      backgroundColor: '#f8b6d2',
      height: '80px',
      padding: '0rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Douceur Logo" 
            style={{ width: '50px', height: '50px', marginRight: '1rem', borderRadius: '50%' }} 
          />
        </div>
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
                  <div>{username}</div>
                </button>      
    </header>
  );
};

export default AdminHeader;
