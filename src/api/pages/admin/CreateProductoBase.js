import React, { useState, useEffect, useRef } from "react";
import "../scss/EditView.scss";
import api from "../../../api/axios";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateProductoBase = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    estado: true,
    categoriaProductoBase: "",
    imagen: null,
    articulos: [], // Lista de artículos seleccionados
  });

  const navigate = useNavigate();
  const [CategoriasProductoActivas, setCategoriasProductoActivas] = useState([]);
  const [articulos, setArticulos] = useState([]); // Artículos disponibles
  const [selectedArticulo, setSelectedArticulo] = useState(""); // Artículo seleccionado
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  // Cargar categorías y artículos al montar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        const categoriasActivas = response.data.filter(c => c.estado === true);
        setCategoriasProductoActivas(categoriasActivas);
      } catch (error) {
        toast.error("Error al cargar categorías");
      }
    };

    const fetchArticulos = async () => {
      try {
        const response = await api.get("listar-articulos/");
        setArticulos(response.data);
      } catch (error) {
        toast.error("Error al cargar artículos");
      }
    };

    fetchCategorias();
    fetchArticulos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      /*toast.error('Por favor selecciona un archivo de imagen válido');*/
      return;
    }
    setFormData({ ...formData, imagen: file });
  };

  const handleAddArticulo = () => {
    if (selectedArticulo && !formData.articulos.includes(selectedArticulo)) {
      setFormData({
        ...formData,
        articulos: [...formData.articulos, selectedArticulo],
      });
      setSelectedArticulo(""); // Reiniciar selección
      toast.success("Artículo añadido");
    } else {
      toast.error("Seleccione un artículo válido o que no esté ya en la lista");
    }
  };

  const handleCancel = () => {
    navigate("/admin/listar-producto-base");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.imagen && formData.imagen.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("descripcion", formData.descripcion);
    formDataToSend.append("precio", parseFloat(formData.precio));
    formDataToSend.append("estado", formData.estado);
    formDataToSend.append(
      "categoriaProductoBase",
      formData.categoriaProductoBase
    );
    if (formData.imagen) {
      formDataToSend.append("imagen", formData.imagen);
    }
    formDataToSend.append("articulos", JSON.stringify(formData.articulos)); // Enviar artículos como JSON

    try {
      await api.post("crear-producto-base/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Producto creado exitosamente!");
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        estado: true,
        categoriaProductoBase: "",
        imagen: null,
        articulos: [],
      });

      if (imageInputRef.current) {
        imageInputRef.current.value = null;
      }

      navigate("/admin/listar-producto-base");
    } catch (err) {
        const errorData = err.response?.data;
        const msg = typeof errorData === "string" ? errorData : errorData?.error || errorData?.detail || "Error al crear producto";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="edit-container">
      <form
        id="crearProductoBaseForm"
        onSubmit={handleSubmit}
        className="edit-form"
      >
        <Typography variant="h4" align="center" gutterBottom>
          Crear Producto
        </Typography>
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Precio"
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          select
          label="Categoría"
          name="categoriaProductoBase"
          value={formData.categoriaProductoBase}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        >
          {CategoriasProductoActivas.map((categoria) => (
            <MenuItem key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="file"
          name="imagen"
          inputRef={imageInputRef}
          onChange={handleImageChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          select
          label="Seleccionar Artículo"
          value={selectedArticulo}
          onChange={(e) => setSelectedArticulo(e.target.value)}
          fullWidth
          margin="normal"
        >
          {articulos.map((articulo) => (
            <MenuItem key={articulo.id} value={articulo.id}>
              {articulo.nombre}
            </MenuItem>
          ))}
        </TextField>
        <Button
          onClick={handleAddArticulo}
          variant="outlined"
          color="secondary"
          fullWidth
          margin="normal"
        >
          Añadir Artículo
        </Button>
        <TextField
          label="Artículos seleccionados"
          value={formData.articulos
            .map(
              (articuloId) =>
                articulos.find((a) => a.id === articuloId)?.nombre || ""
            )
            .join(", ")}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
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
            disabled={loading}
            className="save-button"
          >
            {loading ? "Cargando..." : "Crear Producto"}
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateProductoBase;
