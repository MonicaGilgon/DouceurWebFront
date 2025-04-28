import React from "react";
import CIcon from "@coreui/icons-react";
import { CNavItem, CNavTitle } from "@coreui/react";
import { AiOutlineAppstoreAdd, AiOutlineProduct } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { cilCart, cilList, cilUserPlus } from "@coreui/icons";

const _navAdmin = [
  {
    component: CNavTitle,
    name: "PRODUCTOS",
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Categorías Producto Base",
    to: "/admin/listar-categoria-producto-base",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "categoria-producto-base-nav",
  },
  {
    component: CNavItem,
    name: "Productos Base",
    to: "/admin/listar-producto-base",
    icon: <AiOutlineAppstoreAdd className="nav-icon" />,
    className: "categoria-articulo-nav",
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
    name: "Artículos",
    to: "/admin/listar-articulos",
    icon: <AiOutlineAppstoreAdd className="nav-icon" />,
    className: "categoria-articulo-nav",
  },
  {
    component: CNavTitle,
    name: "VENDEDORES",
  },
  {
    component: CNavItem,
    name: "Lista de vendedores",
    to: "/admin/listar-vendedores",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "listar-clientes-nav",
  },
  {
    component: CNavItem,
    name: "Añadir vendedor",
    to: "/admin/crear-vendedor",
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    className: "listar-clientes-nav",
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
];
export default _navAdmin;
