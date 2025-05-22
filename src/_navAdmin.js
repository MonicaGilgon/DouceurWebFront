import CIcon from "@coreui/icons-react";
import { CNavItem, CNavTitle } from "@coreui/react";
import { AiOutlineAppstoreAdd, AiOutlineShoppingCart } from "react-icons/ai";
import { cilCart, cilClipboard, cilList, cilUserPlus, cilMoney, cilNotes } from "@coreui/icons";
import { FaBoxOpen, FaTruck, FaClipboardCheck } from "react-icons/fa";

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
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
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
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Lista de clientes",
    to: "/admin/listar-clientes",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    className: "listar-clientes-nav",
  },
  // Nueva sección de Ventas
  {
    component: CNavTitle,
    name: "VENTAS",
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Todos los Pedidos",
    to: "/admin/pedidos",
    icon: <AiOutlineShoppingCart className="nav-icon" />,
    className: "pedidos-nav",
  },
  {
    component: CNavItem,
    name: "Pedidos Pendientes",
    to: "/admin/pedidos/pendientes",
    icon: <FaBoxOpen className="nav-icon" />,
    className: "pedidos-pendientes-nav",
  },
  {
    component: CNavItem,
    name: "Pedidos en Envío",
    to: "/admin/pedidos/enviados",
    icon: <FaTruck className="nav-icon" />,
    className: "pedidos-enviados-nav",
  },
  {
    component: CNavItem,
    name: "Pedidos Entregados",
    to: "/admin/pedidos/entregados",
    icon: <FaClipboardCheck className="nav-icon" />,
    className: "pedidos-entregados-nav",
  },
  {
    component: CNavItem,
    name: "Informes de Ventas",
    to: "/admin/informes-ventas",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    className: "informes-ventas-nav",
  },
];
export default _navAdmin;
