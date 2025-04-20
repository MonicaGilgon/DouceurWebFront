import React from 'react';
import logo2 from '../images/logo2.png';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const PublicFooter = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundColor: 'rgb(253, 199, 231)',
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
          <a href="/">
            <img
              src={logo2}
              width="110"
              height="120"
              alt="logo"
            />
          </a>
        </div>

        {/* INFO DE CONTACTO */}
        <div>
          <h3 style={{ fontWeight: 'Bold' }}>Contáctanos</h3>
          <a href="https://wa.me/573124132200" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 18, fontWeight: 'Bold', display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
            <FaWhatsapp style={{ marginRight: '0.5rem' }} />
            <span>3124132200</span>
          </a>
          <a href="https://www.instagram.com/douceur.nl/" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 18, fontWeight: 'Bold', display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <FaInstagram style={{ marginRight: '0.5rem' }} />
            <span>@douceur.nl</span>
          </a>          
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
