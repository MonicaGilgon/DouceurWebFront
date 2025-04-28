import React from "react";
import { NavLink } from "react-router-dom";
import { CNavGroup, CNavItem } from "@coreui/react";
import _navVendedor from "../../_navVendedor"; // Asegúrate de que la ruta sea correcta

const VendedorSidebarNav = () => {
  // Lista de rutas permitidas para el vendedor
  const allowedRoutes = [
    "/vendedor",
    "/vendedor/listar-clientes",
    // Agrega aquí más rutas permitidas para el vendedor
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
          <CNavItem key={index} className={className}>
            <NavLink to={to}>
              {icon}
              {name}
            </NavLink>
          </CNavItem>
        );
      });
  };

  return <>{renderNavItems(_navVendedor)}</>;
};

export default VendedorSidebarNav;
