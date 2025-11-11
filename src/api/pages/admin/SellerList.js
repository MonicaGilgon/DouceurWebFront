import React, { useState, useEffect } from "react";
import "../scss/SwitchConf.scss";
import api from "../../../api/axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import esES from "antd/es/locale/es_ES";
import { Layout, Table, Typography, Button, Switch, Space, ConfigProvider } from "antd";

const SellerList = () => {
  const { Content, Header } = Layout;
  const { Title } = Typography;
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const response = await api.get("/listar-vendedores/");
        setVendedores(response.data);
      } catch (error) {
        console.error("Error al cargar los vendedores", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, []);

  const columns = [
    {
      title: "#",
      key: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: "Cedula",
      dataIndex: "document_number",
      key: "cedula"
    },
    {
      title: "Nombre",
      dataIndex: "nombre_completo",
      key: "nombre_completo"
    },
    {
      title: "Correo Electronico",
      dataIndex: "correo",
      key: "correo_electronico"
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono"
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion"
    },
    {
      title: "Activo",
      dataIndex: "activo",
      key: "activo",
      render: (_, record) => (
        <Switch
          checked={record.estado}
          onChange={async checked => {
            try {
              await api.patch(`/cambiar-estado-vendedor/${record.id}/`, {
                estado: checked
              });
              setVendedores(prevVendedores =>
                prevVendedores.map(vendedor => (vendedor.id === record.id ? { ...vendedor, estado: checked } : vendedor))
              );
              toast.success("Estado actualizado correctamente");
            } catch (error) {
              console.error("Error al actualizar el estado", error);
              toast.error("Error al actualizar el estado");
            }
          }}
        />
      )
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/editar-vendedor/${record.id}`}>
            <Button type="primary" style={{ backgroundColor: "#FBD5E5", color: "#000" }}>
              Editar
            </Button>
          </Link>
        </Space>
      )
    }
  ];

  return (
    <ConfigProvider locale={esES}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ background: "#fff", padding: "10px 10px", color: "#fff" }}>
          <div>
            <Title level={3} style={{ textAlign: "center" }}>
              Lista de Vendedores
            </Title>
          </div>
        </Header>

        <Content
          style={{
            background: "#fff",
            margin: "20px",
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;"
          }}
        >
          <div className="clientes-list">
            <Table
              columns={columns}
              dataSource={vendedores}
              rowKey="id"
              loading={loading}
              bordered
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
                align: "center",
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
                showTotal: total => `Total: ${total} vendedores`
              }}
              locale={{ emptyText: "No hay datos" }}
              scroll={{ x: "max-content" }} // Desplazamiento horizontal
            />
            <ToastContainer />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default SellerList;
