import React from 'react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'auto', 
      }}
    >
      <PublicHeader />
      <div
        className="public-content"
        style={{
          flex: 'none', 
        }}
      >
        <Outlet />
      </div>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;