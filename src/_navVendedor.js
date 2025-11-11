import React from "react";
import CIcon from "@coreui/icons-react";
import { CNavItem, CNavTitle } from "@coreui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { cilList, cilClipboard, cilMoney } from "@coreui/icons";
import { FaBoxOpen, FaTruck, FaClipboardCheck } from "react-icons/fa";

const _navVendedor = [
  {
    component: CNavTitle,
    name: "CLIENTES",
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: "Lista de clientes",
    to: "/vendedor/listar-clientes",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "listar-clientes-nav"
  },
  {
    component: CNavTitle,
    name: "VENTAS",
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: "Todos los Pedidos",
    to: "/vendedor/pedidos",
    icon: <AiOutlineShoppingCart className="nav-icon" />,
    className: "pedidos-nav"
  },
  {
    component: CNavItem,
    name: "Pedidos Pendientes",
    to: "/vendedor/pedidos/pendientes",
    icon: <FaBoxOpen className="nav-icon" />,
    className: "pedidos-pendientes-nav"
  },
  {
    component: CNavItem,
    name: "Pedidos en Envío",
    to: "/vendedor/pedidos/enviados",
    icon: <FaTruck className="nav-icon" />,
    className: "pedidos-enviados-nav"
  },
  {
    component: CNavItem,
    name: "Pedidos Entregados",
    to: "/vendedor/pedidos/entregados",
    icon: <FaClipboardCheck className="nav-icon" />,
    className: "pedidos-entregados-nav"
  }
];
export default _navVendedor;
