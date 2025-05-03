import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "react-toastify/dist/ReactToastify.css";
import "../scss/EditView.scss";

const ProductBaseEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    estado: true,
    categoriaProductoBase: "",
    articulos: [],
  });
  const [categorias, setCategorias] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productoRes, categoriasRes, articulosRes] = await Promise.all([
          api.get(`/editar-producto-base/${productId}/`),
          api.get(`/listar-categorias-producto-base/`),
          api.get(`/listar-articulos/`),
        ]);

        setProduct({
          ...productoRes.data,
          categoriaProductoBase: productoRes.data.categoriaProductoBase?.id || "",
          articulos: productoRes.data.articulos?.map((a) => a.id) || [],
        });

        if (productoRes.data.imagen) {
          setImagenPreview(productoRes.data.imagen);
        }

        setCategorias(categoriasRes.data);
        setArticulos(articulosRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos del producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setProduct((prev) => ({ ...prev, estado: e.target.checked }));
  };

  const handleArticulosChange = (e) => {
    setProduct((prev) => ({ ...prev, articulos: e.target.value }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenArchivo(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar si todos los campos obligatorios están completos
    if (!product.nombre.trim() || !product.descripcion.trim() || !product.precio) {
      toast.error("Todos los campos obligatorios deben ser llenados.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("nombre", product.nombre);
      formData.append("descripcion", product.descripcion);
      formData.append("precio", product.precio);
      formData.append("estado", product.estado);
      formData.append("categoriaProductoBase", product.categoriaProductoBase);
      product.articulos.forEach((art) => formData.append("articulos", art));
      if (imagenArchivo) {
        formData.append("imagen", imagenArchivo);
      }
  
      const response = await api.put(`/editar-producto-base/${productId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        toast.success("Producto editado con éxito.");
        navigate("/admin/listar-producto-base"); // Cambié la ruta de redirección a la correcta
      }
    } catch (error) {
      console.error("Error al editar el producto:", error);
      toast.error("Error al editar el producto.");
    }
  };
  

  if (loading) return <CircularProgress />;

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form">
        <Typography variant="h4" gutterBottom>
          Editar Producto Base
        </Typography>

        <TextField
          name="nombre"
          label="Nombre"
          value={product.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="descripcion"
          label="Descripción"
          value={product.descripcion}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="precio"
          label="Precio"
          type="number"
          value={product.precio}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Categoría</InputLabel>
          <Select
            name="categoriaProductoBase"
            value={product.categoriaProductoBase}
            onChange={handleChange}
            required
          >
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Artículos</InputLabel>
          <Select
            multiple
            value={product.articulos}
            onChange={handleArticulosChange}
            input={<OutlinedInput label="Artículos" />}
            renderValue={(selected) =>
              articulos
                .filter((a) => selected.includes(a.id))
                .map((a) => a.nombre)
                .join(", ")
            }
          >
            {articulos.map((art) => (
              <MenuItem key={art.id} value={art.id}>
                <Checkbox checked={product.articulos.includes(art.id)} />
                <ListItemText primary={art.nombre} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body1" style={{ marginTop: "1rem" }}>
          Imagen:
        </Typography>
        {imagenPreview && (
          <img
            src={imagenPreview}
            alt="Vista previa"
            style={{ width: "150px", marginTop: "0.5rem" }}
          />
        )}
        <input type="file" accept="image/*" onChange={handleImagenChange} style={{ marginTop: "0.5rem" }} />

        <FormControlLabel
          control={
            <Switch
              checked={product.estado}
              onChange={handleSwitchChange}
              color="primary"
            />
          }
          label={product.estado ? "Activo" : "Inactivo"}
          style={{ marginTop: "1rem" }}
        />

        <div className="form-buttons">
          <Button
            variant="outlined"
            onClick={() => navigate("../listar-productosbase")}
          >
            Cancelar
          </Button>
          <Button variant="contained" type="submit">
            Guardar Cambios
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProductBaseEdit;