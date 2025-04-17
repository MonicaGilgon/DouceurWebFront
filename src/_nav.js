import React from 'react'
import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react'
import { AiOutlineAppstoreAdd, AiOutlineProduct } from "react-icons/ai";
import { NavLink } from 'react-router-dom'
import { cilList } from '@coreui/icons';

const _nav = [
  {
    
    component: CNavTitle,
    name: "PRODUCTOS",
  },
  {
    component: CNavItem,
    name: 'Categorías Producto Base',
    to: '/admin/listar-categoria-producto-base',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "categoria-producto-base-nav",
  },
  {
    component: CNavItem,
    name: 'Productos Base',
    to: '/admin/listar-producto-base',
    icon: <AiOutlineProduct className="nav-icon" />,
    className: 'categoria-articulo-nav'
  },
  {
    component: CNavItem,
    name: "Categorías Artículo",
    to: "/admin/listar-categoria-articulo",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "categoria-articulo-nav",
  },
  {
    component: CNavItem,
    name: 'Artículos',
    to: '/admin/listar-articulos',
    icon: <AiOutlineAppstoreAdd className="nav-icon" />,
    className: 'categoria-articulo-nav'
  },
  {
    component: CNavTitle,
    name: "CLIENTES",
  },
  {
    component: CNavItem,
    name: "Lista de clientes",
    to: "/admin/listar-clientes",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "listar-clientes-nav",
  },
]
export default _nav;
