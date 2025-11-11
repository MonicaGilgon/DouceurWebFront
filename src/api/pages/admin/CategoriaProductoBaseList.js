import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import esES from "antd/es/locale/es_ES";
import { Layout, Table, Typography, Button, Switch, Space, ConfigProvider } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriaProductoBaseList = () => {
  const [categorias, setCategorias] = useState([]);
  const { Content, Header } = Layout;
  const { Title } = Typography;
  const [loading, setLoading] = useState(true);
  const [estadoDeshabilitado, setEstadoDeshabilitado] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        setCategorias(response.data);

        // Precomputar estado deshabilitado
        const disabledStates = {};
        for (const categoria of response.data) {
          const puedeDesactivar = await puedeDesactivarCategoria(categoria.id);
          disabledStates[categoria.id] = categoria.estado && !puedeDesactivar;
        }
        setEstadoDeshabilitado(disabledStates);
      } catch (error) {
        console.error("Error al cargar las categorías de productos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const puedeDesactivarCategoria = async categoriaId => {
    try {
      const response = await api.get(`productos-por-categoria/${categoriaId}/`);
      const productos = response.data;
      return productos.every(producto => !producto.estado);
    } catch (error) {
      console.error("Error al verificar los productos asociados", error);
      return false;
    }
  };

  const toggleEstado = async (categoriaId, estado) => {
    try {
      if (!estado) {
        const puedeDesactivar = await puedeDesactivarCategoria(categoriaId);
        if (!puedeDesactivar) {
          toast.error("No se puede desactivar esta categoría porque tiene productos activos asociados.");
          return;
        }
      }

      // Actualizar el estado localmente
      setCategorias(prevCategorias =>
        prevCategorias.map(categoria => (categoria.id === categoriaId ? { ...categoria, estado: !estado } : categoria))
      );

      // Actualizar el estado en el servidor
      toast.success(`Categoría ${!estado ? "activada" : "desactivada"} correctamente`);
      await api.patch(
        `cambiar-estado-categoria-producto-base/${categoriaId}/`,
        { estado: !estado },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error al cambiar el estado activo de la categoría", error);
    }
  };

  const columns = [
    {
      title: "#",
      key: "id",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre"
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (text, categoria) => (
        <Switch
          checked={categoria.estado}
          onChange={() => toggleEstado(categoria.id, categoria.estado)}
          disabled={estadoDeshabilitado[categoria.id]}
        />
      )
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, categoria) => (
        <Space>
          <Link to={`/admin/editar-categoria-producto-base/${categoria.id}`}>
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
            <Title level={3} style={{ textAlign: "center", color: "#001529" }}>
              Lista de Categorias de Productos Base
            </Title>
          </div>
        </Header>
        <Content
          style={{
            background: "#fff",
            margin: "20px",
            borderRadius: "10px",
            boxShadow: "box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
          }}
        >
          <div className="categorias-list">
            <div style={{ display: "flex", gap: "50px" }}>
              <Link to="/admin">
                <Button type="default" style={{ marginBottom: "20px", marginTop: "20px" }}>
                  Regresar
                </Button>
              </Link>
              <Link to="/admin/crear-categoria-producto-base">
                <Button
                  type="primary"
                  style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                    backgroundColor: "#FBD5E5",
                    color: "#000"
                  }}
                >
                  Crear Categoría Producto Base
                </Button>
              </Link>
            </div>
            <Table
              columns={columns}
              dataSource={categorias}
              rowKey="id"
              loading={loading}
              bordered
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
                align: "center",
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                showTotal: total => `Total: ${total} categorías`
              }}
              scroll={{ x: "max-content" }}
              locale={{ emptyText: "No hay categorías disponibles" }}
            />
            <ToastContainer />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default CategoriaProductoBaseList;
