import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // Header para clientes
import AdminHeader from '../components/AdminHeader'; // Header para admins
import AdminSidebar from '../components/AdminSidebar'; // Sidebar para admins
import VendedorHeader from '../components/VendedorHeader'; // Header para vendedores
import VendedorSidebar from '../components/VendedorSidebar'; // Sidebar para vendedores
import PublicFooter from '../components/PublicFooter';
import '../pages/scss/AuthenticatedLayout.scss';

const AuthenticatedLayout = () => {
  // Obtener la información del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('usuario')) || {};
  const role = user?.rol || 'cliente'; // Valor por defecto: cliente
  const hasSidebar = role === 'admin' || role === 'vendedor'; // Determinar si hay Sidebar

  // Función para renderizar el Header según el rol
  const renderHeader = () => {
    switch (role) {
      case 'admin':
        return <AdminHeader />;
      case 'vendedor':
        return <VendedorHeader />;
      default:
        return <Header />;
    }
  };

  // Función para renderizar el Sidebar según el rol
  const renderSidebar = () => {
    switch (role) {
      case 'admin':
        return <AdminSidebar />;
      case 'vendedor':
        return <VendedorSidebar />;
      default:
        return null; // No renderiza Sidebar para clientes
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Encabezado dinámico */}
      {renderHeader()}

      {/* Contenedor principal con Sidebar (si aplica) */}
      <div
        className={`app-container ${hasSidebar ? '' : 'no-sidebar'}`} // Añadir clase condicional
        style={{
          flex: 1,
          display: 'flex',
        }}
      >
        {renderSidebar()}
        <main
          className={`app-content ${hasSidebar ? '' : 'no-sidebar'}`} // Añadir clase condicional
          style={{
            flex: 1,
            padding: hasSidebar ? '20px' : '0', // Ajusta padding si hay Sidebar
          }}
        >
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default AuthenticatedLayout;