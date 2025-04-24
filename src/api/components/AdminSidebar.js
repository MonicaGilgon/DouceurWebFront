import React from "react";
import "../pages/scss/AdminSidebar.scss";
import { CSidebar, CSidebarBrand, CSidebarNav } from "@coreui/react";
import AdminSidebarNav from "./AdminSidebarNav";

const AdminSidebar = () => {
  return (
    <CSidebar
      unfoldable={false}
      className="app-sidebar"
      visible={true} // Asegura que el sidebar siempre esté visible
    >
      <CSidebarBrand className="sidebar-header"></CSidebarBrand>
      <CSidebarNav>
        <AdminSidebarNav />
      </CSidebarNav>
    </CSidebar>
  );
};

export default AdminSidebar;
