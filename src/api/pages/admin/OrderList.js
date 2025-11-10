import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import { FaEye, FaTruck, FaCheck, FaTimes, FaBoxOpen, FaFileUpload } from "react-icons/fa";
import { Badge, Card, Table, Form, InputGroup, Dropdown, Modal, Button } from "react-bootstrap";
import { createPortal } from "react-dom";
import "../scss/OrderList.scss";
import { useNavigate } from "react-router-dom";

const OrderList = ({ statusFilter = null, role = "admin" }) => {
    const [orders, setOrders] = useState([]);
    const [ setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [ordersPerPage] = useState(10);
    const toggleRefs = useRef({});
    const [menuState, setMenuState] = useState({ visible: false, orderId: null, top: 0, left: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            let endpoint = `/listar-pedidos/?page=${currentPage}`;
            if (statusFilter) {
                endpoint += `&status=${statusFilter}`;
            }
            if (searchTerm) {
                endpoint += `&search=${encodeURIComponent(searchTerm)}`;
            }
            const response = await api.get(endpoint);
            // Espera un objeto paginado: { results, total, pages, current_page }
            setOrders(response.data.results || []);
            setTotalPages(response.data.pages || 1);
            setTotalOrders(response.data.total || 0);
        } catch (error) {
            console.error("Error al cargar los pedidos:", error);
            setOrders([]);
            setTotalPages(1);
            setTotalOrders(0);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, currentPage, searchTerm]);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line
    }, [fetchOrders]);

    const validateStatusChange = (orderId, newStatus) => {
        const order = orders.find((o) => o.id === orderId);
        if (!order) return false;

        switch (newStatus) {
            case "pago_confirmado":
                if (order.status === "pendiente") {
                    return true; // Requiere redirigir a OrderDetail
                }
                toast.error("Solo puedes confirmar el pago desde un pedido pendiente.");
                return false;
            case "enviado":
                if (order.status !== "pago_confirmado" && order.status !== "en_preparacion") {
                    toast.error("No puedes enviar sin confirmar el pago o prepararlo primero.");
                    return false;
                }
                return true;
            case "cancelado":
                if (order.status === "entregado") {
                    toast.error("No puedes cancelar un pedido ya entregado.");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const order = orders.find((o) => o.id === orderId);
        if (!validateStatusChange(orderId, newStatus)) return;

        if (newStatus === "pago_confirmado") {
            setSelectedOrder(order);
            setNewStatus(newStatus);
            setShowModal(true); // Mostrar modal para advertencia
            return;
        }

        try {
            await api.patch(`/actualizar-estado-pedido/${orderId}/`, { status: newStatus });
            toast.success("Estado actualizado correctamente.");
            setMenuState({ ...menuState, visible: false });
            fetchOrders();
        } catch (error) {
            toast.error("Error al actualizar el estado.");
            console.error("Error al actualizar el estado:", error);
        }
    };

    const handleModalConfirm = () => {
        if (selectedOrder && newStatus) {
            navigate(`/${role}/pedidos/${selectedOrder.id}`);
        }
        setShowModal(false);
    };

    const handleModalCancel = () => {
        setShowModal(false);
        setSelectedOrder(null);
        setNewStatus(null);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pendiente": return <Badge bg="warning">Pendiente</Badge>;
            case "pago_confirmado": return <Badge bg="info">Pago Confirmado</Badge>;
            case "en_preparacion": return <Badge bg="secondary">En Preparación</Badge>;
            case "enviado": return <Badge bg="primary">Enviado</Badge>;
            case "entregado": return <Badge bg="success">Entregado</Badge>;
            case "cancelado": return <Badge bg="danger">Cancelado</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    // No se filtra en frontend, ya que la API ya lo hace
    const currentOrders = orders;

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString("es-ES", options);
    };

    const getRowNumber = (index) => {
        return (currentPage - 1) * ordersPerPage + index + 1;
    };


    const handleToggle = (orderId, isOpen) => {
        if (isOpen) {
            const toggleElement = toggleRefs.current[orderId];
            if (toggleElement) {
                const rect = toggleElement.getBoundingClientRect();
                setMenuState({
                    visible: true,
                    orderId: orderId,
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                });
            }
        } else {
            setMenuState({ visible: false, orderId: null, top: 0, left: 0 });
        }
    };

    return (
        <div className="order-list-container p-4">
            <Card style={{ minHeight: "600px" }}>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>
                            {statusFilter
                                ? `Pedidos ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}s`
                                : "Todos los Pedidos"}
                        </h3>
                        <InputGroup className="search-container">
                            <Form.Control
                                placeholder="Buscar por ID, cliente, correo o dirección..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </InputGroup>
                    </div>
                </Card.Header>
                <Card.Body>
                    {currentOrders.length === 0 ? (
                        <div className="text-center py-4">No se encontraron pedidos</div>
                    ) : (
                        <>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Correo</th>
                                        <th>Dirección</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map((order, index) => (
                                        <tr key={order.id}>
                                            <td>{getRowNumber(index)}</td>
                                            <td>{formatDate(order.order_date)}</td>
                                            <td>{order.usuario_nombre}</td>
                                            <td>{order.usuario_correo}</td>
                                            <td>{order.direccion_entrega}</td>
                                            <td>${parseFloat(order.total_amount).toLocaleString("es-CO", { minimumFractionDigits: 2 })}</td>
                                            <td>{getStatusBadge(order.status)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link
                                                        to={`/${role}/pedidos/${order.id}`}
                                                        className="btn btn-sm btn-info me-1"
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                    <Dropdown drop="down" onToggle={(isOpen) => handleToggle(order.id, isOpen)}>
                                                        <Dropdown.Toggle
                                                            variant="outline-secondary"
                                                            className="btn-outline-pink"
                                                            size="sm"
                                                            id={`dropdown-${order.id}`}
                                                            ref={(el) => (toggleRefs.current[order.id] = el)}
                                                        >
                                                            Cambiar Estado
                                                        </Dropdown.Toggle>
                                                        {menuState.visible && menuState.orderId === order.id && createPortal(
                                                            <div
                                                                className="dropdown-menu show"
                                                                style={{
                                                                    position: "fixed",
                                                                    top: menuState.top,
                                                                    left: menuState.left,
                                                                    zIndex: 2000,
                                                                }}
                                                            >
                                                                <div className="dropdown-item" onClick={() => handleStatusChange(order.id, "pendiente")}>\
                                                                    <FaBoxOpen className="me-2" /> Pendiente
                                                                </div>
                                                                <div className="dropdown-item" onClick={() => handleStatusChange(order.id, "pago_confirmado")}>\
                                                                    <FaFileUpload className="me-2" /> Pago Confirmado
                                                                </div>
                                                                <div className="dropdown-item" onClick={() => handleStatusChange(order.id, "en_preparacion")}>\
                                                                    <FaBoxOpen className="me-2" /> En Preparación
                                                                </div>
                                                                <div className="dropdown-item" onClick={() => handleStatusChange(order.id, "enviado")}>\
                                                                    <FaTruck className="me-2" /> Enviado
                                                                </div>
                                                                <div className="dropdown-item" onClick={() => handleStatusChange(order.id, "entregado")}>\
                                                                    <FaCheck className="me-2" /> Entregado
                                                                </div>
                                                                <div className="dropdown-item" onClick={() => handleStatusChange(order.id, "cancelado")}>\
                                                                    <FaTimes className="me-2" /> Cancelado
                                                                </div>
                                                            </div>,
                                                            document.body
                                                        )}
                                                    </Dropdown>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {totalPages > 1 && (
                                <div className="pagination-container d-flex justify-content-center mt-4">
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
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
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                                Siguiente
                                            </button>
                                        </li>
                                    </ul>
                                    <span className="ms-3 align-self-center">Total: {totalOrders}</span>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Modal de advertencia para "Pago Confirmado" */}
            <Modal show={showModal} onHide={handleModalCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Advertencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    No puedes confirmar el pago sin cargar el comprobante. ¿Deseas ir a la página de detalles para subirlo?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalCancel}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleModalConfirm}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderList;