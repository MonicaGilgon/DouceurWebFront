import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Layout, Table, Typography, Button, Switch, Modal, message, Space, ConfigProvider } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/reset.css";
import esES from "antd/es/locale/es_ES";

const { Content, Header } = Layout;
const { Title } = Typography;

const ProductosBaseList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("listar-producto-base/");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al cargar los productos", error);
        message.error("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleDelete = async id => {
    Modal.confirm({
      title: "¿Estás seguro?",
      content: "Esta acción eliminará el producto base permanentemente.",
      okText: "Sí, eliminar",
      cancelText: "Cancelar",
      okType: "danger",
      onOk: async () => {
        try {
          await api.delete(`eliminar-producto-base/${id}/`);
          setProductos(productos.filter(p => p.id !== id));
          message.success("Producto eliminado correctamente");
        } catch (error) {
          console.error("Error al eliminar el producto", error);
          message.error("Error al eliminar el producto");
        }
      }
    });
  };

  const toggleActivo = async (producto_id, estado) => {
    setProductos(prevProductos => prevProductos.map(producto => (producto.id === producto_id ? { ...producto, estado: !estado } : producto)));
    try {
      await api.patch(`cambiar_estado_producto/${producto_id}/`, { estado: !estado }, { headers: { "Content-Type": "application/json" } });
      message.success(`Producto ${!estado ? "activado" : "desactivado"} correctamente`);
    } catch (error) {
      console.error("Error al cambiar el estado del producto", error);
      message.error("Error al cambiar el estado del producto");
      setProductos(prevProductos => prevProductos.map(producto => (producto.id === producto_id ? { ...producto, estado } : producto)));
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
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre) // Ordenación por nombre
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion"
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      sorter: (a, b) => a.precio - b.precio, // Ordenación por precio
      render: precio => `$${precio.toLocaleString()}` // Formato moneda
    },
    {
      title: "Estado",
      key: "estado",
      render: (_, record) => <Switch checked={record.estado} onChange={() => toggleActivo(record.id, record.estado)} />
    },
    {
      title: "Categoría",
      key: "categoriaProductoBase",
      sorter: (a, b) => (a.categoriaProductoBase?.nombre || "").localeCompare(b.categoriaProductoBase?.nombre || ""), // Ordenación por nombre de categoría
      render: (_, record) => (record.categoriaProductoBase ? record.categoriaProductoBase.nombre : "Sin categoría")
    },
    {
      title: "Artículos",
      key: "articulos",
      render: (_, record) => (
        <span style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {record.articulos.map(articulo => (
            <span
              key={articulo.id}
              style={{
                color: articulo.estado ? "#000" : "#999",
                fontStyle: articulo.estado ? "normal" : "italic",
                backgroundColor: "#f5f5f5",
                padding: "2px 8px",
                borderRadius: "5px",
                fontSize: "0.85em",
                border: "1px solid #ddd"
              }}
            >
              {articulo.nombre}
              {!articulo.estado && " (deshabilitado)"}
            </span>
          ))}
        </span>
      )
    },
    {
      title: "Categorías de Artículo",
      key: "categorias_articulo",
      render: (_, record) => (
        <span style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {record.categorias_articulo && record.categorias_articulo.length > 0 ? (
            record.categorias_articulo.map(cat => (
              <span
                key={cat.id}
                style={{
                  color: cat.estado ? "#000" : "#999",
                  fontStyle: cat.estado ? "normal" : "italic",
                  backgroundColor: "#f5f5f5",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  fontSize: "0.85em",
                  border: "1px solid #ddd"
                }}
              >
                {cat.nombre}
                {!cat.estado && " (deshabilitado)"}
              </span>
            ))
          ) : (
            <span style={{ color: "#999", fontStyle: "italic" }}>Sin categorías</span>
          )}
        </span>
      )
    },

    {
      title: "Imagen",
      key: "imagen",
      render: (_, record) => {
        const imagenPrincipal =
          record.imagen && record.imagen.startsWith("http")
            ? record.imagen
            : record.imagen
            ? `http://localhost:8000${record.imagen}`
            : record.fotos?.[0]?.url || ""; // fallback a primera imagen de Cloudinary

        return imagenPrincipal ? (
          <img
            src={imagenPrincipal}
            alt="Producto"
            style={{ width: "80px", cursor: "pointer" }}
            onClick={() => setModalVisible(true) || setSelectedImage(imagenPrincipal)}
          />
        ) : (
          <span>Sin imagen</span>
        );
      }
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/editar-producto-base/${record.id}`}>
            <Button type="primary" style={{ backgroundColor: "#FBD5E5", color: "#000" }}>
              Editar
            </Button>
          </Link>
          <Button danger onClick={() => handleDelete(record.id)}>
            Eliminar
          </Button>
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
              Lista de Productos Base
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
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", gap: "50px" }}>
              <Link to="/admin">
                <Button type="default" style={{ marginBottom: "20px", marginTop: "20px" }}>
                  Regresar
                </Button>
              </Link>
              <Link to="/admin/crear-producto-base">
                <Button
                  type="primary"
                  style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                    backgroundColor: "#FBD5E5",
                    color: "#000"
                  }}
                >
                  Crear Producto Base
                </Button>
              </Link>
            </div>

            <Table
              dataSource={productos}
              columns={columns}
              loading={loading}
              rowKey="id"
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
                align: "center",
                showTotal: total => `Total: ${total} productos`
              }}
              locale={{ emptyText: "No hay datos" }}
              scroll={{ x: "max-content" }}
            />
          </Space>
        </Content>
        <Modal visible={modalVisible} footer={null} onCancel={() => setModalVisible(false)}>
          <img src={selectedImage} alt="Producto" style={{ width: "100%" }} />
        </Modal>
      </Layout>
    </ConfigProvider>
  );
};

export default ProductosBaseList;
