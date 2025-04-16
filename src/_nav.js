import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilList,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'
import { AiOutlineAppstoreAdd, AiOutlineProduct } from "react-icons/ai";
import { NavLink } from 'react-router-dom'

const _nav = [
  {
    component: CNavItem,
    name: 'Categorías Artículo',
    to: '/admin/listar-categoria-articulo',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: 'categoria-articulo-nav'
  },
  {
    component: CNavItem,
    name: 'Artículos',
    to: '/admin/listar-articulos',
    icon: <AiOutlineAppstoreAdd className="nav-icon" />,
    className: 'categoria-articulo-nav'
  },
  {
    component: CNavItem,
    name: 'Categorías Producto Base',
    to: '/admin/listar-categoria-producto-base',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: 'categoria-producto-base-nav'
  },
  {
    component: CNavItem,
    name: 'Productos Base',
    to: '/admin/listar-producto-base',
    icon: <AiOutlineProduct className="nav-icon" />,
    className: 'categoria-articulo-nav'
  },
]

export default _nav
