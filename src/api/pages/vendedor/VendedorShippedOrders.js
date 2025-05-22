// VendedorShippedOrders.jsx
import React from "react";
import VendedorOrderList from "./VendedorOrderList";

const VendedorShippedOrders = () => {
    return <VendedorOrderList statusFilter="enviado" />;
};

export default VendedorShippedOrders;