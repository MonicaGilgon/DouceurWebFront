import React from 'react';
import logo from '../images/logo.png';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const PublicFooter = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundColor: '#f4a8b9',
        padding: '3rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem', // espacio entre logo e info
          flexWrap: 'wrap', // permite adaptabilidad en pantallas pequeñas
          textAlign: 'left',
        }}
      >
        {/* LOGO */}
        <div>
          <img
            src={logo}
            width="120"
            height="120"
            alt="logo"
            style={{ borderRadius: '50%' }}
          />
        </div>

        {/* INFO DE CONTACTO */}
        <div>
          <h3 style={{ fontWeight: 'bold' }}>Contáctanos</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <FaWhatsapp style={{ marginRight: '0.5rem' }} />
            <span>3124132200</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaInstagram style={{ marginRight: '0.5rem' }} />
            <span>@douceur.nl</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
