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

const ArticuloEdit = () => {
  const { articuloId } = useParams()
  const navigate = useNavigate()
  const [articulo, setArticulo] = useState({
    nombre: '',
    categoriaArticulo: '',
  })
  const [categorias, setCategoriasArticuloActivas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticulo = async () => {
      try {
        const response = await api.get(`editar-articulo/${articuloId}/`)
        console.log('Datos del artículo:', response.data)
        setArticulo(response.data)
      } catch (error) {
        console.error('Error al cargar el artículo:', error)
        setError('Error al cargar el artículo')
        toast.error('Error al cargar el artículo')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategorias = async () => {
      try {
        const response = await api.get('listar-categoria-articulo/')
        const categoriasActivas = response.data.filter(c => c.estado === true);
        setCategoriasArticuloActivas(categoriasActivas);
      } catch (err) {
        console.error('Error al cargar las categorías:', err)
        setError('Error al cargar las categorías de artículo')
        toast.error('Error al cargar las categorías de artículo')
      }
    }

    fetchArticulo()
    fetchCategorias()
  }, [articuloId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setArticulo((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validación del formulario
    if (!articulo.nombre) {
      toast.error('El nombre no puede estar vacío.')
      return
    }

    const formData = {
      nombre: articulo.nombre,
      categoriaArticulo: articulo.categoriaArticulo,
    }

    console.log('Datos a enviar:', formData)

    try {
      toast.success('Artículo editado correctamente.')
      await api.put(`editar-articulo/${articuloId}/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': articulo.csrf_token,
        },
      })
      navigate('/admin/listar-articulos')
    } catch (error) {
      console.error('Error al editar el artículo', error)
      toast.error('Error al editar el artículo.')
    }
  }

  const handleCancel = () => {
    navigate('/admin/listar-articulos')
  }

  if (loading) {
    return <CircularProgress />
  }

  return (
    <div className="create-vendedor">
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Editar Artículo
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Nombre"
          name="nombre"
          value={articulo.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Categoría</InputLabel>
          <Select
            name="categoriaArticulo"
            value={articulo.categoriaArticulo}
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

export default ArticuloEdit
