import React from 'react'
import { NavLink } from 'react-router-dom'
import { CNavGroup, CNavItem } from '@coreui/react'
import _nav from '../../_nav'

const AdminSidebarNav = () => {
  const renderNavItems = (items) => {
    return items.map((item, index) => {
      const { component: Component, icon, name, to, className, items: subItems } = item

      if (subItems) {
        return (
          <CNavGroup
            key={index}
            toggler={
              <>
                {icon}
                {name}
              </>
            }
          >
            {renderNavItems(subItems)}
          </CNavGroup>
        )
      }

      return (
        <CNavItem key={index} className={className}>
          <NavLink to={to}>
            {icon}
            {name}
          </NavLink>
        </CNavItem>
      )
    })
  }

  return <>{renderNavItems(_nav)}</>
}

export default AdminSidebarNav
