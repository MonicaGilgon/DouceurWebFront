import React from 'react';
import '../pages/scss/AdminSidebar.scss'
import '../pages/scss/AdminHeader.scss'
import { Outlet } from 'react-router-dom';
import VendedorHeader from '../components/VendedorHeader';
import VendedorSidebar from '../components/VendedorSidebar';

const VendedorLayout = () => {
  return (
    <div className="admin-layout">
      <VendedorHeader />

      <div className="app-container">
        <VendedorSidebar />
        <main className="app-content">
          <div className='content-wrapper'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendedorLayout;