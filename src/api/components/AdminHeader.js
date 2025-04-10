import React from 'react';
import logo from '../images/logo.png';

const AdminHeader = ({ username = 'Administrador' }) => {
  return (
    <header style={{
      backgroundColor: '#f8b6d2',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Douceur Logo" 
            style={{ width: '50px', height: '50px', marginRight: '1rem', borderRadius: '50%' }} 
          />
        </div>
      <h2 style={{ margin: 0 }}>Panel de administración (acomodar según corresponda el froted)</h2>
      <div>{username}</div>
    </header>
  );
};

export default AdminHeader;
