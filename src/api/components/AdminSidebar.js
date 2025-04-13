import React from 'react'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react'
import AdminSidebarNav from './AdminSidebarNav'

const AdminSidebar = () => {
  return (
    <CSidebar unfoldable className="bg-light">
      <CSidebarBrand className="d-none d-md-flex p-3 fw-bold">
      </CSidebarBrand>
      <CSidebarNav>
        <AdminSidebarNav />
      </CSidebarNav>
      <CSidebarToggler />
    </CSidebar>
  )
}

export default AdminSidebar
