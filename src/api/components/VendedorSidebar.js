import React from "react";
import "../pages/scss/AdminSidebar.scss";
import { CSidebar, CSidebarBrand, CSidebarNav } from "@coreui/react";
import VendedorSidebarNav from "./VendedorSidebarNav";

const VendedorSidebar = () => {
  return (
    <CSidebar
      unfoldable={false}
      className="app-sidebar"
      visible={true} // Asegura que el sidebar siempre esté visible
    >
      <CSidebarBrand className="sidebar-header"></CSidebarBrand>
      <CSidebarNav>
        <VendedorSidebarNav />
      </CSidebarNav>
    </CSidebar>
  );
};

export default VendedorSidebar;
    ;
