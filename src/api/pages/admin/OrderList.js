import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { FaEye, FaTruck, FaCheck, FaTimes, FaBoxOpen } from "react-icons/fa";
import { Badge, Card, Table, Form, InputGroup } from "react-bootstrap";
import "../scss/OrderList.scss";

const OrderList = ({ statusFilter = null }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            let endpoint = "/listar-pedidos/";
            if (statusFilter) {
                endpoint = `/listar-pedidos/?status=${statusFilter}`;
            }
            const response = await api.get(endpoint);
            console.log(response.data)
            setOrders(response.data);
        } catch (error) {
            console.error("Error al cargar los pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    console.log(orders)

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/actualizar-estado-pedido/${orderId}/`, {
                status: newStatus,
            });
            // Actualizar la lista de pedidos
            fetchOrders();
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pendiente":
                return <Badge bg="warning">Pendiente</Badge>;
            case "enviado":
                return <Badge bg="primary">Enviado</Badge>;
            case "entregado":
                return <Badge bg="success">Entregado</Badge>;
            case "cancelado":
                return <Badge bg="danger">Cancelado</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    // Filtrar pedidos por término de búsqueda
    const filteredOrders = orders.filter(
        (order) =>
            order.id.toString().includes(searchTerm) ||
            order.user.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shipping_info.nombre_receptor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString("es-ES", options);
    };

    if (loading) {
        return <div className="text-center py-5">Cargando pedidos...</div>;
    }

    return (
        <div className="order-list-container">
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>
                            {statusFilter
                                ? `Pedidos ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}s`
                                : "Todos los Pedidos"}
                        </h3>
                        <InputGroup className="search-container">
                            <Form.Control
                                placeholder="Buscar por ID, cliente o receptor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                </Card.Header>
                <Card.Body>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-4">No se encontraron pedidos</div>
                    ) : (
                        <>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Receptor</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{formatDate(order.order_date)}</td>
                                            <td>{order.user.nombre_completo}</td>
                                            <td>{order.shipping_info.nombre_receptor}</td>
                                            <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                                            <td>{getStatusBadge(order.status)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link to={`/admin/pedidos/${order.id}`} className="btn btn-sm btn-info me-1">
                                                        <FaEye />
                                                    </Link>
                                                    <div className="dropdown d-inline-block">
                                                        <button
                                                            className="btn btn-sm btn-secondary dropdown-toggle"
                                                            type="button"
                                                            id={`dropdownMenuButton-${order.id}`}
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            Estado
                                                        </button>
                                                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${order.id}`}>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusChange(order.id, "pendiente")}
                                                                >
                                                                    <FaBoxOpen className="me-2" /> Pendiente
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusChange(order.id, "enviado")}
                                                                >
                                                                    <FaTruck className="me-2" /> Enviado
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusChange(order.id, "entregado")}
                                                                >
                                                                    <FaCheck className="me-2" /> Entregado
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusChange(order.id, "cancelado")}
                                                                >
                                                                    <FaTimes className="me-2" /> Cancelado
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="pagination-container d-flex justify-content-center mt-4">
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                                Anterior
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                                Siguiente
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default OrderList;