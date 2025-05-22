// VendedorDeliveredOrders.jsx
import React from "react";
import VendedorOrderList from "./VendedorOrderList";

const VendedorDeliveredOrders = () => {
    return <VendedorOrderList statusFilter="entregado" />;
};

export default VendedorDeliveredOrders;