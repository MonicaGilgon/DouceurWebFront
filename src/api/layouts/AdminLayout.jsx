import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <AdminHeader />
  
        <div style={{ display: 'flex', flex: 1 }}>
          <AdminSidebar />
          <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
            <Outlet />
          </main>
        </div>
      </div>
    );
  };
  
  export default AdminLayout;