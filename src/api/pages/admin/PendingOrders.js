// PendingOrders.jsx
import React from "react";
import OrderList from "./OrderList";

const PendingOrders = () => {
    return <OrderList statusFilter="pendiente" />;
};

export default PendingOrders;



