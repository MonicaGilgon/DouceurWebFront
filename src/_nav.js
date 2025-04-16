import React from "react";
import CIcon from "@coreui/icons-react";
import { cilList } from "@coreui/icons";
import { CNavItem, CNavTitle } from "@coreui/react";
import { NavLink } from "react-router-dom";

const _nav = [
  {
    component: CNavItem,
    name: "Categorías Artículo",
    to: "/admin/listar-categoria-articulo",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "categoria-articulo-nav",
  },
  {
    component: CNavTitle,
    name: "Clientes",
  },
  {
    component: CNavItem,
    name: "Lista de clientes",
    to: "/admin/listar-clientes",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "clientes-nav",
  },
  {
    component: CNavItem,
    name: "Categorías Producto Base",
    to: "/admin/listar-categoria-producto-base",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "categoria-producto-base-nav",
  },
];

export default _nav;
