import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSidebar } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMenu } from '@coreui/icons';
import { AppSidebarNav } from './AppSidebarNav';
import navigation from '../../_nav';
import '../pages/scss/AdminSidebar.scss';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const toggleSidebar = () => {
    dispatch({ type: 'set', sidebarShow: !sidebarShow });
  };

  return (
    <>
      {/* Ícono de menú para mostrar/ocultar el sidebar */}
      <CIcon 
        icon={cilMenu} 
        className="toggle-sidebar-icon" 
        onClick={toggleSidebar} 
      />
      
      <CSidebar
        className={`app-sidebar ${sidebarShow ? 'visible' : 'hidden'}`}
        colorScheme="dark"
        position="fixed"
        visible={sidebarShow}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', sidebarShow: visible });
        }}
      >
        {/* Removido CSidebarToggler */}
        <AppSidebarNav items={navigation} />
      </CSidebar>
    </>
  );
};

export default React.memo(AppSidebar);
