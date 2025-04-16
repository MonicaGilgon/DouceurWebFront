
import React, { useEffect, useState } from 'react'
import api from '../../../api/axios';
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
} from 'antd'
import { Link } from 'react-router-dom'
import 'antd/dist/reset.css'
import esES from 'antd/es/locale/es_ES'

const { Content, Header } = Layout
const { Title } = Typography

const ProductosBaseList = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get('listar-producto-base/')
        setProductos(response.data)
      } catch (error) {
        console.error('Error al cargar los productos', error)
        message.error('Error al cargar los productos')
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [])

  const handleImageClick = (imagen) => {
    setSelectedImage(`http://localhost:8000${imagen}`)
    setModalVisible(true)
  }

  const toggleActivo = async (producto_id, estado) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === producto_id ? { ...producto, estado: !estado } : producto,
      ),
    )
    try {
      await api.patch(
        `cambiar_estado_producto/${producto_id}/`,
        { estado: !estado },
        { headers: { 'Content-Type': 'application/json' } },
      )
      message.success(`Producto ${!estado ? 'activado' : 'desactivado'} correctamente`)
    } catch (error) {
      console.error('Error al cambiar el estado del producto', error)
      message.error('Error al cambiar el estado del producto')
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id === producto_id ? { ...producto, estado } : producto,
        ),
      )
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre), // Ordenación por nombre
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      sorter: (a, b) => a.precio - b.precio, // Ordenación por precio
      render: (precio) => `$${precio.toLocaleString()}`, // Formato moneda
    },
    {
      title: 'Estado',
      key: 'estado',
      render: (_, record) => (
        <Switch checked={record.estado} onChange={() => toggleActivo(record.id, record.estado)} />
      ),
    },
    {
      title: 'Categoría',
      key: 'categoriaProductoBase',
      sorter: (a, b) =>
        (a.categoriaProductoBase?.nombre || '').localeCompare(
          b.categoriaProductoBase?.nombre || '',
        ), // Ordenación por nombre de categoría
      render: (_, record) =>
        record.categoriaProductoBase ? record.categoriaProductoBase.nombre : 'Sin categoría',
    },
    {
      title: 'Artículos',
      key: 'articulos',
      render: (_, record) => record.articulos.map((articulo) => articulo.nombre).join(', '),
    },
    {
      title: 'Imagen',
      key: 'imagen',
      render: (_, record) => (
        <img
          src={`http://localhost:8000${record.imagen}`}
          alt="Producto"
          style={{ width: '80px', cursor: 'pointer' }}
          onClick={() => handleImageClick(record.imagen)}
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Link to={`/admin/editar-producto-base/${record.id}`}>
          <Button type="primary">Editar</Button>
        </Link>
      ),
    },
  ]

  return (
    <ConfigProvider locale={esES}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#001529', padding: '10px 20px', color: '#fff' }}>
          <div>
            <Title level={3} style={{ color: '#fff' }}>
              Lista de Productos Base
            </Title>
          </div>
        </Header>
        <Content style={{ margin: '20px', background: '#fff', padding: '20px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: '50px' }}>
              <Link to="/admin">
                <Button type="default">Regresar</Button>
              </Link>
              <Link to="/admin/crear-producto-base">
                <Button type="primary">Crear Producto Base</Button>
              </Link>
            </div>

            <Table
              dataSource={productos}
              columns={columns}
              loading={loading}
              rowKey="id"
              bordered
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30'],
              }}
              scroll={{ x: 'max-content' }}
            />
          </Space>
        </Content>
        <Modal visible={modalVisible} footer={null} onCancel={() => setModalVisible(false)}>
          <img src={selectedImage} alt="Producto" style={{ width: '100%' }} />
        </Modal>
      </Layout>
    </ConfigProvider>
  )
}

export default ProductosBaseList
