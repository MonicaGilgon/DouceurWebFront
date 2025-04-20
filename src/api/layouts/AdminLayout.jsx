import React from 'react';
import '../pages/scss/AdminSidebar.scss'
import '../pages/scss/AdminHeader.scss'
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />

      <div className="app-container">
        <AdminSidebar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;