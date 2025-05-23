import React from "react";
import { NavLink } from "react-router-dom";
import { CNavGroup, CNavItem } from "@coreui/react";
import _navVendedor from "../../_navVendedor";

const VendedorSidebarNav = () => {
  // Lista de rutas permitidas para el vendedor
  const allowedRoutes = [
    "/vendedor",
    "/vendedor/listar-clientes",
    "/vendedor/pedidos",
    "/vendedor/pedidos/pendientes",
    "/vendedor/pedidos/enviados",
    "/vendedor/pedidos/entregados",
  ];

  // Función para verificar si una ruta está permitida
  const isRouteAllowed = (route) => {
    return allowedRoutes.includes(route);
  };

  // Función recursiva para renderizar los elementos del menú
  const renderNavItems = (items) => {
    return items
      .filter((item) => {
        // Si el elemento tiene subelementos, filtramos recursivamente
        if (item.items) {
          item.items = renderNavItems(item.items);
          return item.items.length > 0; // Solo mostramos el grupo si tiene subelementos permitidos
        }
        if (!item.to) {
          return true; // Si no tiene 'to', lo mostramos (puede ser un título o grupo)
        }
        // Si es un elemento simple, verificamos si está permitido
        return isRouteAllowed(item.to);
      })
      .map((item, index) => {
        const {
          component: Component,
          icon,
          name,
          to,
          className,
          items: subItems,
        } = item;

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
          );
        }

        return (
          <Component key={index} className={className}>
            <NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")}>
              {icon}
              {name}
            </NavLink>
          </Component>
        );
      });
  };

  return <>{renderNavItems(_navVendedor)}</>;
};

export default VendedorSidebarNav;