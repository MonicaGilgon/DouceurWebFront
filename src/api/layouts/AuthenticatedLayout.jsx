// src/api/layouts/AuthenticatedLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // Tu Header ajustado
import PublicFooter from '../components/PublicFooter'; // Importamos el mismo footer que usa PublicLayout

const AuthenticatedLayout = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Encabezado */}
      <Header />

      {/* Contenido principal (renderiza las páginas hijas como Profile) */}
      <div
        className="authenticated-content"
        style={{
          flex: 1, // Esto empuja el footer al final, igual que en PublicLayout
        }}
      >
        <Outlet />
      </div>

      {/* Footer (el mismo que usa PublicLayout) */}
      <PublicFooter />
    </div>
  );
};

export default AuthenticatedLayout;