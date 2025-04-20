import React from 'react';
import '../pages/scss/AdminHeader.scss'
import logo from '../images/logo2.png';
import { FaUser } from 'react-icons/fa';

const handleLoginClick = () => {
  
  //navigate('/sign-in'); #debería redireccionar al cierre de sesión
};
const AdminHeader = ({ username = 'Administrador' }) => {
  return (
    <header className='admin-header'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Douceur Logo" 
            style={{ width: '50px', height: '50px', marginRight: '1rem' }} 
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
          color: 'white',
          fontWeight: 'bold',
                  }}
                >
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  <div>{username}</div>
                </button>      
    </header>
  );
};

export default AdminHeader;
