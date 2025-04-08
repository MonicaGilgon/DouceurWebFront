import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { FaInstagram, FaFacebookF, FaPhoneAlt } from 'react-icons/fa';

const PublicHeaderFooter = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <footer style={{ 
        backgroundColor: '#f49cb3', 
        padding: '2rem 1rem', 
        textAlign: 'center', 
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Douceur Logo" 
            style={{ width: '80px', height: '80px', borderRadius: '50%' }} 
          />
          <h3 style={{ marginTop: '1rem', color: '#333' }}>Contáctanos</h3>
          <p style={{ color: '#eee', margin: '0.3rem' }}>
            <FaPhoneAlt style={{ marginRight: '0.5rem' }} />
            +57 311 466 2294
          </p>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button style={{ 
              padding: '0.5rem', 
              border: '1px solid #fff', 
              borderRadius: '5px', 
              backgroundColor: 'transparent', 
              color: '#fff', 
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}>
              <FaInstagram />
            </button>
            <button style={{ 
              padding: '0.5rem', 
              border: '1px solid #fff', 
              borderRadius: '5px', 
              backgroundColor: 'transparent', 
              color: '#fff', 
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}>
              <FaFacebookF />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHeaderFooter;
