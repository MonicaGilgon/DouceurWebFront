import React, { useEffect, useState } from "react";
import "../scss/EditView.scss";
import api from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductoBaseEdit = () => {
  const { productoId } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    estado: true,
    categoriaProductoBase: "",
    articulos: [],
    imagen: "",
  });
  const [categoriasProductoActivas, setCategoriasProductoActivas] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productoId) {
      console.error("Producto ID no está disponible");
      return;
    }
    const fetchProducto = async () => {
      try {
        const response = await api.get(`editar-producto-base/${productoId}/`);
        setProducto(response.data);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setError("Error al cargar el producto");
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        const categoriasActivas = response.data.filter(
          (c) => c.estado === true
        );
        setCategoriasProductoActivas(categoriasActivas);
      } catch (err) {
        console.error("Error al cargar las categorías:", err);
        setError("Error al cargar las categorías de productos");
        toast.error("Error al cargar las categorías de productos");
      }
    };

    fetchProducto();
    fetchCategorias();
  }, [productoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación del formulario
    if (!producto.nombre) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (!producto.precio || producto.precio <= 0) {
      toast.error("El precio debe ser mayor a 0.");
      return;
    }
    const formData = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      estado: producto.estado,
      categoriaProductoBase: producto.categoriaProductoBase,
      articulos: producto.articulos.map((articulo) => articulo.id),
      imagen: producto.imagen, // Si se quiere permitir cambiar la imagen, esto debería manejarse adecuadamente
    };

    try {
      const response = await api.put(
        `editar-producto-base/${productoId}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            // Agrega el token CSRF si es necesario
          },
        }
      );

      // Mostrar mensaje de éxito
      toast.success(response.data.message || "Producto editado correctamente.");

      // Redirigir después del éxito
      navigate("/admin/listar-producto-base");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMsg =
          error.response.data.error || "Error al editar el producto.";
        toast.error(errorMsg);
      } else {
        toast.error("Error al conectar con el servidor.");
      }
      console.error("Error al editar el producto", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin/listar-producto-base"); // Redirigir a la lista de productos base si se cancela
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form">
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
            {categoriasProductoActivas.map((categoria) => (
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
          onChange={(e) =>
            setProducto({ ...producto, imagen: e.target.files[0] })
          }
          fullWidth
          margin="normal"
        />
        <div className="form-buttons">
          <Button
            type="default"
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="save-button"
          >
            Guardar Cambios
          </Button>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
};

export default ProductoBaseEdit;
