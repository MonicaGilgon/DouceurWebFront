import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { Card, Row, Col, Table, Badge, Button } from "react-bootstrap";
import {
  FaArrowLeft,
  FaTruck,
  FaCheck,
  FaTimes,
  FaBoxOpen,
  FaWhatsapp,
} from "react-icons/fa";
import "../scss/OrderDetail.scss";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/actualizar-estado-pedido/${id}/`, {
        status: newStatus,
      });
      // Actualizar los detalles del pedido
      fetchOrderDetails();
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const handleContactWhatsApp = () => {
    if (order && order.shipping_info && order.shipping_info.telefono_contacto) {
      const phoneNumber = order.shipping_info.telefono_contacto.replace(
        /\D/g,
        ""
      );
      const message = encodeURIComponent(
        `Hola ${order.shipping_info.nombre_receptor}, nos comunicamos de Douceur respecto a tu pedido #${order.id}.`
      );
      window.open(`https://wa.me/+57${phoneNumber}?text=${message}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">Cargando detalles del pedido...</div>
    );
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
              variant="outline-primary"
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
                          {item.producto.imagen && (
                            <img
                              src={
                                `http://localhost:8000${item.producto.imagen}` ||
                                "/placeholder.svg"
                              }
                              alt={item.producto.nombre}
                              className="product-thumbnail"
                            />
                          )}
                          <div>
                            <div className="product-name">
                              {item.producto.nombre}
                            </div>
                            <div className="product-id">
                              ID: {item.producto.id}
                            </div>
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
                    <td className="fw-bold">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
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
              <Button
                variant="success"
                size="sm"
                onClick={handleContactWhatsApp}
              >
                <FaWhatsapp className="me-1" /> Contactar
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="info-group">
                <div className="info-label">Receptor:</div>
                <div className="info-value">
                  {order.shipping_info.nombre_receptor}
                </div>
              </div>
              <div className="info-group">
                <div className="info-label">Teléfono:</div>
                <div className="info-value">
                  {order.shipping_info.telefono_contacto}
                </div>
              </div>
              <div className="info-group">
                <div className="info-label">Correo:</div>
                <div className="info-value">
                  {order.shipping_info.correo_electronico}
                </div>
              </div>
              <div className="info-group">
                <div className="info-label">Dirección:</div>
                <div className="info-value">
                  {order.shipping_info.direccion_entrega}
                </div>
              </div>
              <div className="info-group">
                <div className="info-label">Horario:</div>
                <div className="info-value">
                  {order.shipping_info.horario_entrega}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetail;
