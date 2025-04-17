import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from '../images/logo2.png';
import { FaShoppingBag, FaUser, FaSearch } from 'react-icons/fa';

const PublicHeader = () => {
  const navigate = useNavigate(); 
  const [catalogoAbierto, setCatalogoAbierto] = useState(false);
  const [masAbierto, setMasAbierto] = useState(false);


  const handleLoginClick = () => {
    navigate('/sign-in');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };
  return (
    <header style={{ 
      backgroundColor: 'white', 
      padding: '1rem 2rem', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }}>
      {/* Logo + Catálogo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 35}}>
        <img 
          src={logo2} 
          alt="Douceur Logo" 
          style={{ width: '75px', height: '85px' }} 
        />

<div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={() => setCatalogoAbierto(!catalogoAbierto)}
            style={{
              fontWeight: 'bold',
              padding: '0.5rem 1.5rem',
              borderRadius: '5px',
              background: '#ffffff',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginLeft: 60
            }}>
            Catálogo 
          </button>
          {catalogoAbierto && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                marginTop: '0.5rem',
                zIndex: 1000,
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
              }}>
              <a
                href="/catalogo/categoria1"
                style={{
                  display: 'block',
                  padding: '0.5rem 1.5rem',
                  textDecoration: 'none',
                  color: '#000',
                  fontWeight: 'bold',  
                  whiteSpace: 'nowrap'                
                }}>
                categoria1
              </a>
              <a
                href="/catalago/categoria2"
                style={{
                  display: 'block',
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                categoria2
              </a>
            </div>
          )}
        </div>
        <a href="/nosotros" style={{  marginLeft: 30, fontWeight: 'bold', padding: '0.5rem', borderRadius: '5px', textDecoration: 'none', 
          color: '#000', cursor: 'pointer' }}>
          Nosotros
        </a>
        <a href="/dudas" style={{ marginLeft: 30, fontWeight: 'bold', padding: '0.5rem', borderRadius: '5px', textDecoration: 'none', 
          color: '#000', cursor: 'pointer' }}>
          Dudas
        </a>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={() => setMasAbierto(!masAbierto)}
            style={{
              fontWeight: 'bold',
              padding: '0.5rem 1.5rem',
              borderRadius: '5px',
              background: '#ffffff',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginLeft: 35
            }}>
            Más 
          </button>
          {masAbierto && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                marginTop: '0.5rem',
                zIndex: 1000,
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
              }}>
              <a
                href="/politica-datos"
                style={{
                  display: 'block',
                  padding: '0.5rem 1.5rem',
                  textDecoration: 'none',
                  color: '#000',
                  fontWeight: 'bold',  
                  whiteSpace: 'nowrap'                
                }}>
                Política de datos
              </a>
              <a
                href="/terminos-y-condiciones"
                style={{
                  display: 'block',
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                Términos y condiciones
              </a>
            </div>
          )}
        </div>

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
              width: '350px',
              outline: 'none',
              marginRight: 140
            }}
          />
          <FaSearch style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            pointerEvents: 'none',
            marginRight: 150
          }} />
        </div>

        {/* Botón de carrito */}
        <button 
          /* onClick={handleCartClick} */
          style={{ 
            backgroundColor: '#ffb9cb', 
            border: 'none', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '5px', 
            color: 'white',
            position: 'relative',
            marginRight: 15
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
            color: 'white',
            marginRight: 30
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
