import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import { Card, Row, Col, Table, Badge, Button, Form, Alert, Modal } from "react-bootstrap";
import { FaArrowLeft, FaTruck, FaCheck, FaTimes, FaBoxOpen, FaWhatsapp, FaFileUpload } from "react-icons/fa";
import "../scss/OrderDetail.scss";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentProof, setPaymentProof] = useState(null);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/detalle-pedido/${id}/`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error al cargar los detalles del pedido:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const validateStatusChange = (newStatus) => {
    if (!order) return false;

    switch (newStatus) {
      case "pago_confirmado":
        if (order.status !== "pendiente") {
          toast.error("Solo puedes confirmar el pago desde un pedido pendiente.");
          return false;
        }
        return true;
      case "en_preparacion":
        if (order.status !== "pago_confirmado") {
          toast.error("No puedes preparar el pedido sin confirmar el pago primero.");
          return false;
        }
        return true;
      case "enviado":
        if (order.status !== "pago_confirmado" && order.status !== "en_preparacion") {
          toast.error("No puedes enviar sin confirmar el pago o prepararlo primero.");
          return false;
        }
        return true;
      case "entregado":
        if (order.status !== "enviado") {
          toast.error("No puedes marcar como entregado sin enviarlo primero.");
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

  const handleStatusChange = (newStatus) => {
    if (!validateStatusChange(newStatus)) return;

    if (newStatus === "pago_confirmado" && order.status === "pendiente") {
      setNewStatus(newStatus);
      setShowModal(true);
      return;
    }

    updateStatus(newStatus);
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(`/actualizar-estado-pedido/${id}/`, { status: newStatus });
      toast.success("Estado actualizado correctamente.");
      fetchOrderDetails();
    } catch (error) {
      toast.error("Error al actualizar el estado.");
      console.error("Error al actualizar el estado:", error);
    }
  };

  const handleVerifyPayment = async (action) => {
    const formData = new FormData();
    formData.append("action", action);
    if (action === "accept" && paymentProof) {
      formData.append("payment_proof", paymentProof);
    } else if (action === "accept" && !paymentProof) {
      toast.error("Debes subir un comprobante de pago.");
      return;
    }

    try {
      const response = await api.post(`/verificar-pago/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
      fetchOrderDetails();
      setShowModal(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error al verificar el pago");
    }
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const handleContactWhatsApp = () => {
    if (order && order.shipping_info && order.shipping_info.telefono_contacto) {
      const phoneNumber = order.shipping_info.telefono_contacto.replace(/\D/g, "");
      const message = encodeURIComponent(
        `Hola ${order.shipping_info.nombre_receptor}, nos comunicamos de Douceur respecto a tu pedido #${order.id}.`
      );
      window.open(`https://wa.me/+57${phoneNumber}?text=${message}`, "_blank");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Cargando detalles del pedido...</div>;
  }

  if (!order) {
    return <div className="text-center py-5">No se encontró el pedido</div>;
  }

  return (
    <div className="order-detail-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Volver
        </Button>
        <h2>Detalles del Pedido #{order.id}</h2>
        <div className="status-actions">
          <div className="dropdown">
            <Button
              variant="outline-pink"
              className="dropdown-toggle"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Cambiar Estado
            </Button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusChange("pendiente")}
                >
                  <FaBoxOpen className="me-2" /> Pendiente
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusChange("pago_confirmado")}
                >
                  <FaFileUpload className="me-2" /> Pago Confirmado
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusChange("en_preparacion")}
                >
                  <FaBoxOpen className="me-2" /> En Preparación
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusChange("enviado")}
                >
                  <FaTruck className="me-2" /> Enviado
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusChange("entregado")}
                >
                  <FaCheck className="me-2" /> Entregado
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleStatusChange("cancelado")}
                >
                  <FaTimes className="me-2" /> Cancelado
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {order.status === "pendiente" && (
        <Card className="mb-4">
          <Card.Header>Verificar Pago</Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Label>Subir Soporte de Pago</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setPaymentProof(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="success" onClick={() => handleVerifyPayment("accept")} className="me-2 mt-2">
              Aceptar
            </Button>
            <Button variant="danger" onClick={() => handleVerifyPayment("reject")} className="mt-2">
              Rechazar
            </Button>
            {message && <Alert variant={message.includes("Error") ? "danger" : "success"} className="mt-3">{message}</Alert>}
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Productos</h4>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="product-info">
                          {item.producto && item.producto.imagen ? (
                            <img
                              src={
                                `http://localhost:8000${item.producto.imagen}` ||
                                "/placeholder.svg"
                              }
                              alt={item.producto.nombre || "Producto sin nombre"}
                              className="product-thumbnail"
                            />
                          ) : (
                            <img
                              src="/placeholder.svg"
                              alt="Producto sin imagen"
                              className="product-thumbnail"
                            />
                          )}
                          <div>
                            <div className="product-name">{item.producto?.nombre || "Producto no disponible"}</div>
                            <div className="product-id">ID: {item.producto?.id || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td>${parseFloat(item.precio_unitario).toFixed(2)}</td>
                      <td>{item.cantidad}</td>
                      <td>${parseFloat(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end fw-bold">
                      Total:
                    </td>
                    <td className="fw-bold">${parseFloat(order.total_amount).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Información del Pedido</h4>
            </Card.Header>
            <Card.Body>
              <div className="info-group">
                <div className="info-label">Estado:</div>
                <div className="info-value">{getStatusBadge(order.status)}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Fecha:</div>
                <div className="info-value">{formatDate(order.order_date)}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Cliente:</div>
                <div className="info-value">{order.user.nombre_completo}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Correo:</div>
                <div className="info-value">{order.user.correo}</div>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Información de Envío</h4>
              <Button variant="success" size="sm" onClick={handleContactWhatsApp}>
                <FaWhatsapp className="me-1" /> Contactar
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="info-group">
                <div className="info-label">Receptor:</div>
                <div className="info-value">{order.shipping_info?.nombre_receptor || "Sin información"}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Teléfono:</div>
                <div className="info-value">{order.shipping_info?.telefono_contacto || "Sin información"}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Correo:</div>
                <div className="info-value">{order.shipping_info?.correo_electronico || "Sin información"}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Dirección:</div>
                <div className="info-value">{order.shipping_info?.direccion_entrega || "Sin información"}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Horario:</div>
                <div className="info-value">{order.shipping_info?.horario_entrega || "Sin información"}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Subir Soporte de Pago</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setPaymentProof(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleVerifyPayment("accept")}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderDetail;