// DeliveredOrders.jsx
import React from "react";
import OrderList from "./OrderList";

const DeliveredOrders = () => {
    return <OrderList statusFilter="entregado" />;
};

export default DeliveredOrders;