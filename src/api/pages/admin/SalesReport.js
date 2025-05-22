import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "../scss/SalesReport.scss";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const SalesReport = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0], // Un mes atrás
        endDate: new Date().toISOString().split("T")[0], // Hoy
    });

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                `/informe-ventas/?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`
            );
            setReportData(response.data);
        } catch (error) {
            console.error("Error al cargar el informe de ventas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchReportData();
    };

    // Preparar datos para los gráficos
    const salesByDateData = reportData?.sales_by_date
        ? {
            labels: reportData.sales_by_date.map((item) => item.date),
            datasets: [
                {
                    label: "Ventas por día",
                    data: reportData.sales_by_date.map((item) => item.total),
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgb(255, 99, 132)",
                    borderWidth: 1,
                },
            ],
        }
        : null;

    const salesByStatusData = reportData?.sales_by_status
        ? {
            labels: reportData.sales_by_status.map((item) => {
                const status = item.status;
                return status.charAt(0).toUpperCase() + status.slice(1);
            }),
            datasets: [
                {
                    label: "Ventas por estado",
                    data: reportData.sales_by_status.map((item) => item.count),
                    backgroundColor: [
                        "rgba(255, 206, 86, 0.6)", // Pendiente
                        "rgba(54, 162, 235, 0.6)", // Enviado
                        "rgba(75, 192, 192, 0.6)", // Entregado
                        "rgba(255, 99, 132, 0.6)", // Cancelado
                    ],
                    borderColor: [
                        "rgba(255, 206, 86, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        }
        : null;

    return (
        <div className="sales-report-container">
            <Card className="mb-4">
                <Card.Header>
                    <h3>Informe de Ventas</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit} className="mb-4">
                        <Row>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Fecha de inicio</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={dateRange.startDate}
                                        onChange={handleDateChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Fecha de fin</Form.Label>
                                    <Form.Control type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} />
                                </Form.Group>
                            </Col>
                            <Col md={4} className="d-flex align-items-end">
                                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                                    {loading ? "Cargando..." : "Generar Informe"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    {loading ? (
                        <div className="text-center py-5">Cargando informe...</div>
                    ) : reportData ? (
                        <>
                            <Row className="mb-4">
                                <Col md={3}>
                                    <Card className="summary-card">
                                        <Card.Body>
                                            <h5>Total de Pedidos</h5>
                                            <div className="summary-value">{reportData.total_orders}</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="summary-card">
                                        <Card.Body>
                                            <h5>Ventas Totales</h5>
                                            <div className="summary-value">${parseFloat(reportData.total_sales).toFixed(2)}</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="summary-card">
                                        <Card.Body>
                                            <h5>Pedidos Entregados</h5>
                                            <div className="summary-value">{reportData.delivered_orders}</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card className="summary-card">
                                        <Card.Body>
                                            <h5>Ticket Promedio</h5>
                                            <div className="summary-value">
                                                ${reportData.average_order_value ? parseFloat(reportData.average_order_value).toFixed(2) : "0.00"}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={8}>
                                    <Card className="mb-4">
                                        <Card.Header>
                                            <h4>Ventas por Día</h4>
                                        </Card.Header>
                                        <Card.Body>
                                            {salesByDateData ? (
                                                <Bar
                                                    data={salesByDateData}
                                                    options={{
                                                        responsive: true,
                                                        plugins: {
                                                            legend: {
                                                                position: "top",
                                                            },
                                                            title: {
                                                                display: true,
                                                                text: "Ventas por Día",
                                                            },
                                                        },
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-center py-4">No hay datos disponibles</div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="mb-4">
                                        <Card.Header>
                                            <h4>Pedidos por Estado</h4>
                                        </Card.Header>
                                        <Card.Body>
                                            {salesByStatusData ? (
                                                <Pie
                                                    data={salesByStatusData}
                                                    options={{
                                                        responsive: true,
                                                        plugins: {
                                                            legend: {
                                                                position: "bottom",
                                                            },
                                                            title: {
                                                                display: true,
                                                                text: "Pedidos por Estado",
                                                            },
                                                        },
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-center py-4">No hay datos disponibles</div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <div className="text-center py-5">Selecciona un rango de fechas y genera el informe</div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default SalesReport;