import React from "react";
import CIcon from "@coreui/icons-react";
import { CNavItem, CNavTitle } from "@coreui/react";
import { AiOutlineAppstoreAdd, AiOutlineProduct } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { cilCart, cilList, cilUserPlus, cilClipboard } from "@coreui/icons";

const _navVendedor = [
  {
    component: CNavTitle,
    name: "CLIENTES",
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Lista de clientes",
    to: "/vendedor/listar-clientes",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "listar-clientes-nav",
  },
];
export default _navVendedor;
