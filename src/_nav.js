import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilClipboard,
  cilList,
  cilPeople,
  cilUserFollow,
  cilCart,  

} from '@coreui/icons'
import { AiOutlineAppstoreAdd, AiOutlineProduct } from "react-icons/ai";
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
//import './scss/AppSidebar.scss';

const _nav = [  
  {
    component: CNavTitle,
    name: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CIcon icon={cilCart} className="nav-icon" />
        <span style={{ marginLeft: '8px' }} className="nav-text">Productos</span>
      </div>
    ),
  },
  
  {
    component: CNavItem,
    name: 'Categorías Producto Base',
    to: '/admin/categoria-producto-base',
    icon: <CIcon icon={cilList} className="nav-icon"/>, 
    className: 'categoria-articulo-nav'
  },
]

export default _nav
