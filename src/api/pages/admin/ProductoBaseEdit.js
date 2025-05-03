import React, { useEffect, useState } from 'react'
import api from "../../../api/axios";
import { useParams, useNavigate } from 'react-router-dom'
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProductoBaseEdit = () => {
  const { productoId } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    estado: true,
    categoriaProductoBase: '',
    articulos: [],
    imagen: '',
  })
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!productoId) {
      console.error('Producto ID no está disponible')
      return
    }
    const fetchProducto = async () => {
      try {
        const response = await api.get(
          `editar-producto-base/${productoId}/`,
        )
        setProducto(response.data)
      } catch (error) {
        console.error('Error al cargar el producto:', error)
        setError('Error al cargar el producto')
        toast.error('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategorias = async () => {
      try {
        const response = await api.get('categoria-producto-base/')
        setCategorias(response.data)
      } catch (err) {
        console.error('Error al cargar las categorías:', err)
        setError('Error al cargar las categorías de productos')
        toast.error('Error al cargar las categorías de productos')
      }
    }


    fetchProducto()
    fetchCategorias()
  }, [productoId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProducto((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validación del formulario
    if (!producto.nombre) {
      toast.error('El nombre no puede estar vacío.')
      return
    }
    if (!producto.precio || producto.precio <= 0) {
      toast.error('El precio debe ser mayor a 0.')
      return
    }

    const formData = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      estado: producto.estado,
      categoriaProductoBase: producto.categoriaProductoBase,
      imagen: producto.imagen, // Si se quiere permitir cambiar la imagen, esto debería manejarse adecuadamente
    }

    console.log('Datos a enviar:', formData)

    try {
      //toast.success('Producto editado correctamente.');
      await api.post(`editar-producto-base/${productoId}/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          // Si es necesario incluir un token CSRF, agregarlo aquí
        },
      })
      navigate('/admin/productos-base') // Redirigir a la lista de productos base después de la edición
    } catch (error) {
      console.error('Error al editar el producto', error)
      toast.error('Error al editar el producto.')
    }
  }

  const handleCancel = () => {
    navigate('/admin/productos-base') // Redirigir a la lista de productos base si se cancela
  }

  if (loading) {
    return <CircularProgress />
  }

  return (
    <div className="create-vendedor">
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Editar Producto Base
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Nombre"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={producto.descripcion}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Precio"
          name="precio"
          type="number"
          value={producto.precio}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Categoría</InputLabel>
          <Select
            name="categoriaProductoBase"
            value={producto.categoriaProductoBase}
            onChange={handleChange}
            label="Categoría"
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label=""
          name="imagen"
          type="file"
          onChange={(e) => setProducto({ ...producto, imagen: e.target.files[0] })}
          fullWidth
          margin="normal"
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
          Guardar Cambios
        </Button>
        <Button type="default" onClick={() => navigate(-1)} style={{ width: '38%' }}>
            Cancelar
          </Button>
        </div>
        <ToastContainer />
      </form>
    </div>
  )
}

export default ProductoBaseEdit
