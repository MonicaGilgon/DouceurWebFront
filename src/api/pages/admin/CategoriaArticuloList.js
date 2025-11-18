import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import esES from "antd/es/locale/es_ES";
import { Layout, Table, Typography, Button, Switch, ConfigProvider } from "antd";

const CategoriaArticuloList = () => {
  const { Content, Header } = Layout;
  const { Title } = Typography;
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoDeshabilitado, setEstadoDeshabilitado] = useState({});
  const [articulosAsociados, setArticulosAsociados] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const [categoriasRes, articulosRes] = await Promise.all([
          api.get("/listar-categoria-articulo/"),
          api.get("/listar-categorias-con-articulos/")
        ]);

        setCategorias(categoriasRes.data);

        const disabledStates = {};
        for (const categoria of categoriasRes.data) {
          const articulos = articulosRes.data[categoria.id] || [];
          disabledStates[categoria.id] = articulos.length > 0;
        }
        setEstadoDeshabilitado(disabledStates);
        setArticulosAsociados(articulosRes.data);
      } catch (error) {
        console.error("Error al cargar las categorías", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const puedeDesactivarCategoria = async categoriaId => {
    try {
      const articulos = articulosAsociados[categoriaId] || [];
      return articulos.length === 0;
    } catch (error) {
      console.error("Error al verificar los artículos asociados", error);
      return false;
    }
  };

  const toggleEstado = async (categoriaId, estado) => {
    try {
      if (!estado) {
        const puedeDesactivar = await puedeDesactivarCategoria(categoriaId);
        if (!puedeDesactivar) {
          toast.error("No se puede desactivar esta categoría porque tiene artículos activos asociados.");
          return;
        }
      }

      setCategorias(prevCategorias =>
        prevCategorias.map(categoria => (categoria.id === categoriaId ? { ...categoria, estado: !estado } : categoria))
      );

      toast.success(`Categoría ${!estado ? "activada" : "desactivada"} correctamente`);
      await api.patch(`/cambiar-estado-categoria-articulo/${categoriaId}/`, {
        estado: !estado
      });
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
      key: "estado",
      render: (_, record) => (
        <Switch checked={record.estado} onChange={() => toggleEstado(record.id, record.estado)} disabled={estadoDeshabilitado[record.id]} />
      )
    },
    {
      title: "Artículos Asociados",
      key: "articulos",
      render: (_, record) =>
        articulosAsociados[record.id] && articulosAsociados[record.id].length > 0 ? articulosAsociados[record.id].join(", ") : "Sin artículos"
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Link to={`/admin/editar-categoria-articulo/${record.id}`}>
          <Button type="primary" style={{ backgroundColor: "#FBD5E5", color: "#000" }}>
            Editar
          </Button>
        </Link>
      )
    }
  ];

  return (
    <ConfigProvider locale={esES}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ background: "#fff", padding: "10px 10px", color: "#fff" }}>
          <div>
            <Title level={3} style={{ textAlign: "center", color: "#001529" }}>
              Lista de Categorias Articulo
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
              <Link to="/admin/crear-categoria-articulo">
                <Button
                  type="primary"
                  style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                    backgroundColor: "#FBD5E5",
                    color: "#000"
                  }}
                >
                  Crear Categoria Articulo
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
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
                showTotal: total => `Total: ${total} categorias`
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

export default CategoriaArticuloList;
