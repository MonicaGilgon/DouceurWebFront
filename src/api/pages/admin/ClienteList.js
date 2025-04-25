import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import esES from "antd/es/locale/es_ES";
import {
  Layout,
  Table,
  Typography,
  Button,
  Switch,
  Modal,
  message,
  Space,
  ConfigProvider,
  Divider,
} from "antd";

const ClienteList = () => {
  const { Content, Header } = Layout;
  const { Title } = Typography;
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get(
          "/listar-clientes/"
        );
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar los clientes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
    },
    {
      title: "Correo Electronico",
      dataIndex: "correo",
      key: "correo_electronico",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/editar-cliente/${record.id}`}>
            <Button
              type="primary"
              style={{ backgroundColor: "#FBD5E5", color: "#000" }}
            >
              Editar
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider locale={esES}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{ background: "#fff", padding: "10px 10px", color: "#fff" }}
        >
          <div>
            <Title level={3} style={{ color: "#001529", textAlign: "center" }}>
              Lista de Clientes
            </Title>
          </div>
        </Header>

        <Content
          style={{
            background: "#fff",
            margin: "20px",
            borderRadius: "10px",
            boxShadow: "box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
          }}
        >
          <div className="clientes-list">
            <Table
              columns={columns}
              dataSource={clientes}
              rowKey="id"
              loading={loading}
              bordered
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
                align: "center",
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

export default ClienteList;
