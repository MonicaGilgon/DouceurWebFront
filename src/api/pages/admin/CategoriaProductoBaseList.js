import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import esES from "antd/es/locale/es_ES";
import { Layout, Table, Typography, Button, Switch, Space, ConfigProvider, Popover } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriaProductoBaseList = () => {
  const [categorias, setCategorias] = useState([]);
  const { Content, Header } = Layout;
  const { Title } = Typography;
  const [loading, setLoading] = useState(true);
  const [estadoDeshabilitado, setEstadoDeshabilitado] = useState({});
  const [productosAsociados, setProductosAsociados] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const [categoriasRes, productosRes] = await Promise.all([
          api.get("listar-categoria-producto-base/"),
          api.get("productos-por-todas-las-categorias/")
        ]);

        setCategorias(categoriasRes.data);
        setProductosAsociados(productosRes.data || {});

        // Precomputar estado deshabilitado (informativo, no bloquea el toggle)
        const disabledStates = {};
        for (const categoria of categoriasRes.data) {
          const productos = productosRes.data[categoria.id] || [];
          // marcamos true si la categoría tiene al menos un producto activo
          const tieneProductosActivos = productos.some(p => p.estado);
          disabledStates[categoria.id] = tieneProductosActivos;
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

  const toggleEstado = async (categoriaId, estado) => {
    const nuevoEstado = !estado;
    try {
      // Llamada a la API para activar/desactivar los productos en cascada.
      // El backend recibirá el nuevo estado y actualizará los productos.
      await api.patch(`actualizar-estado-productos-por-categoria/${categoriaId}/`, { estado: nuevoEstado });

      // Actualizar el estado local de los productos para reflejar el cambio en la UI
      setProductosAsociados(prev => ({
        ...prev,
        [categoriaId]: (prev[categoriaId] || []).map(p => ({ ...p, estado: nuevoEstado }))
      }));

      // También actualizamos el estado deshabilitado para el popover.
      // Si el nuevo estado es 'false' (desactivado), el popover ya no debe aparecer.
      setEstadoDeshabilitado(prev => ({ ...prev, [categoriaId]: nuevoEstado }));

      // Actualizar el estado localmente
      setCategorias(prevCategorias =>
        prevCategorias.map(categoria => (categoria.id === categoriaId ? { ...categoria, estado: nuevoEstado } : categoria))
      );
      // Actualizar el estado de la categoría en el servidor
      await api.patch(`cambiar-estado-categoria-producto-base/${categoriaId}/`, { estado: nuevoEstado });
      toast.success(`Categoría y sus productos ${nuevoEstado ? "activados" : "desactivados"} correctamente`);
    } catch (error) {
      console.error("Error al cambiar el estado activo de la categoría", error);
      toast.error("Error al cambiar el estado de la categoría");
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
      render: (text, categoria) => {
        const isDisabled = estadoDeshabilitado[categoria.id];
        const productos = productosAsociados[categoria.id] || [];

        const content = (
          <div style={{ maxWidth: 300 }}>
            <p style={{ marginBottom: 8 }}>Al desactivar esta categoría, se desactivarán los siguientes productos asociados:</p>
            {productos.length > 0 ? (
              <div style={{ maxHeight: 160, overflowY: "auto" }}>
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  {productos.map((p, i) => {
                    const label = typeof p === "string" ? p : p.nombre || p.title || `Producto ${i + 1}`;
                    return (
                      <li key={i} style={{ fontSize: 12 }}>
                        {label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        );

        const switchEl = <Switch checked={categoria.estado} onChange={() => toggleEstado(categoria.id, categoria.estado)} />;

        return categoria.estado && isDisabled ? (
          <Popover content={content} trigger="hover" placement="right">
            {switchEl}
          </Popover>
        ) : (
          switchEl
        );
      }
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
