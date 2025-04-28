import React, { useEffect, useState } from "react";
import "../scss/SwitchConf.scss";
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
  ConfigProvider,
  notification,
} from "antd";

const { Title } = Typography;

const ArticuloList = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { Content, Header } = Layout;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const response = await api.get("/listar-articulos/");
        setArticulos(response.data);
      } catch (err) {
        console.error("Error al cargar los artículos:", err);
        setError("Error al cargar los artículos.");
        notification.error({
          message: "Error",
          description: "Error al cargar los artículos.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticulos();
  }, []);

  const toggleActivo = async (articuloId, estado) => {
    try {
      await api.patch(
        `articulos/cambio_estado/${articuloId}/`,
        { estado: !estado },
        { headers: { "Content-Type": "application/json" } }
      );

      setArticulos((prevArticulos) =>
        prevArticulos.map((articulo) =>
          articulo.id === articuloId
            ? { ...articulo, estado: !estado }
            : articulo
        )
      );

      notification.success({
        message: "Estado actualizado",
        description: `Artículo ${
          !estado ? "activado" : "desactivado"
        } correctamente.`,
      });
    } catch (error) {
      console.error("Error al cambiar el estado del artículo:", error);
      notification.error({
        message: "Error",
        description: "No se pudo actualizar el estado del artículo.",
      });
    }
  };

  const columns = [
    {
      title: "#",
      key: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    {
      title: "Estado",
      key: "estado",
      render: (_, record) => (
        <Switch
          checked={record.estado}
          onChange={() => toggleActivo(record.id, record.estado)}
        />
      ),
    },
    {
      title: "Categoría",
      dataIndex: ["categoriaArticulo", "nombre"],
      key: "categoriaArticulo",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Link to={`/admin/editar-articulo/${record.id}`}>
          <Button
            type="primary"
            style={{ backgroundColor: "#FBD5E5", color: "#000" }}
          >
            Editar
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <ConfigProvider locale={esES}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{ background: "#fff", padding: "10px 10px", color: "#fff" }}
        >
          <Title level={3} style={{ color: "#001529", textAlign: "center" }}>
            Lista de Articulos
          </Title>
        </Header>
        <Content
          style={{
            background: "#fff",
            margin: "20px",
            borderRadius: "10px",
            boxShadow: "box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
          }}
        >
          <div className="articulos-list">
            <div style={{ display: "flex", gap: "50px" }}>
              <Link to="/admin">
                <Button
                  type="default"
                  style={{ marginBottom: "20px", marginTop: "20px" }}
                >
                  Regresar
                </Button>
              </Link>
              <Link to="/admin/crear-articulo">
                <Button
                  type="primary"
                  style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                    backgroundColor: "#FBD5E5",
                    color: "#000",
                  }}
                >
                  Crear Artículo
                </Button>
              </Link>
            </div>

            <Table
              columns={columns}
              dataSource={articulos}
              loading={loading}
              rowKey="id"
              bordered
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                showTotal: (total) => `Total: ${total} artículos`,
              }}
              locale={{ emptyText: "No hay datos" }}
              scroll={{ x: "max-content" }}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default ArticuloList;
