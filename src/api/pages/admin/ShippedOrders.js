// ShippedOrders.jsx
import React from "react";
import OrderList from "./OrderList";

const ShippedOrders = () => {
  return <OrderList statusFilter="enviado" />;
};

export default ShippedOrders;
