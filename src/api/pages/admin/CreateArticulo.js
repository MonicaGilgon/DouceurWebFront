import React, { useState, useEffect } from 'react'
import api from '../../../api/axios';
import { useNavigate } from 'react-router-dom'
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const CreateArticulo = () => {
  const [nombre, setNombre] = useState('')
  const [categoriaArticulo, setCategoriaArticulo] = useState('')
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/listar-categoria-articulo/')
        const categoriasActivas = response.data.filter((categoria) => categoria.estado === true)
        setCategorias(categoriasActivas)
      } catch (err) {
        console.error('Error al cargar las categorías de artículo:', err)
        setError('Error al cargar las categorías de artículo')
        toast.error('Error al cargar las categorías de artículo')
      }
    }

    fetchCategorias()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      toast.success('Artículo creado correctamente.')
      await api.post('/crear-articulo/', {
        nombre,
        categoriaArticulo,
      })
      navigate('/admin/listar-articulos')
    } catch (err) {
      setError(err.response ? err.response.data : { message: 'Error al crear el artículo.' })
      toast.error(err.response ? err.response.data.message : 'Error al crear el artículo.')
    }
  }

  const handleCancel = () => {
    navigate('/admin/listar-articulos')
  }

  return (
    <div className="create-vendedor">
      {error && <div className="error">{error.message}</div>}
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Crear Artículo
        </Typography>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoriaArticulo}
            onChange={(e) => setCategoriaArticulo(e.target.value)}
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
          <Button type="submit" variant="contained" color="primary" style={{ marginRight: '8px' }}>
            Crear Artículo
          </Button>
          <Button type="default" onClick={() => navigate(-1)} style={{ width: '38%' }}>
            Cancelar
          </Button>
        </div>
      </form>
      <ToastContainer /> {/* Agregar el contenedor de toast */}
    </div>
  )
}

export default CreateArticulo
