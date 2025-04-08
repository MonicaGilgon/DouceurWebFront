import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import PublicLayout from '../layouts/PublicLayout'

const Home = () => {
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  return (
    <PublicLayout>
      {/* ... contenido ... */}
      <div style={{ padding: '1rem' }}>
        <h2>Bienvenido a DOUCEUR</h2>
        {/* Aquí va tu formulario de autenticación */}
      </div>
    </PublicLayout>
    
  );
};

export default Home;
