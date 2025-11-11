import { useState, useEffect, useRef } from "react";
import "../scss/EditView.scss";
import api from "../../../api/axios";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
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

  const [fotos, setFotos] = useState([]);
  const navigate = useNavigate();
  const [CategoriasProductoActivas, setCategoriasProductoActivas] = useState(
    []
  );
  const [articulos, setArticulos] = useState([]); // Artículos disponibles
  const [selectedArticulo, setSelectedArticulo] = useState(""); // Artículo seleccionado
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);
  const [categoriasArticulo, setCategoriasArticulo] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

  // Cargar categorías y artículos al montar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        const categoriasActivas = response.data.filter(
          (c) => c.estado === true
        );
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

    const fetchCategoriasArticulo = async () => {
      try {
        const response = await api.get("listar-categoria-articulo/");
        const activas = response.data.filter((cat) => cat.estado === true);
        setCategoriasArticulo(activas);
      } catch (error) {
        toast.error("Error al cargar categorías de artículo");
      }
    };

    fetchCategorias();
    fetchArticulos();
    fetchCategoriasArticulo();
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
    formDataToSend.append(
      "categorias_articulo",
      JSON.stringify(categoriasSeleccionadas)
    );

    if (fotos.length > 5) {
      toast.error("Solo puedes subir hasta 5 imágenes adicionales.");
      setLoading(false);
      return;
    }

    fotos.forEach((foto) => {
      formDataToSend.append("fotos", foto);
    });

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
      const msg =
        typeof errorData === "string"
          ? errorData
          : errorData?.error || errorData?.detail || "Error al crear producto";
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
        className="edit-form">
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
          margin="normal">
          {CategoriasProductoActivas.map((categoria) => (
            <MenuItem key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </MenuItem>
          ))}
        </TextField>

        <FormControl fullWidth required margin="normal">
          <InputLabel id="categorias-personalizables-label">
            Categorías personalizables
          </InputLabel>
          <Select
            labelId="categorias-personalizables-label"
            multiple
            value={categoriasSeleccionadas}
            onChange={(e) => setCategoriasSeleccionadas(e.target.value)}
            renderValue={(selected) =>
              selected
                .map(
                  (id) =>
                    categoriasArticulo.find((cat) => cat.id === id)?.nombre
                )
                .join(", ")
            }>
            {categoriasArticulo.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="file"
          name="imagen"
          inputRef={imageInputRef}
          onChange={handleImageChange}
          fullWidth
          required
          margin="normal"
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);

            if (files.length > 5) {
              toast.error("Máximo 5 imágenes permitidas.");
              return;
            }

            const archivosValidos = files.filter((file) => {
              if (!file.type.startsWith("image/")) {
                toast.error(`Archivo no válido: ${file.name}`);
                return false;
              }
              if (file.size > 5 * 1024 * 1024) {
                toast.error(`'${file.name}' excede los 5MB`);
                return false;
              }
              return true;
            });

            if (archivosValidos.length > 5) {
              toast.error("Solo puedes subir hasta 5 imágenes válidas.");
              return;
            }

            setFotos(archivosValidos);
          }}
          fullWidth
          margin="normal"
        />

        {fotos.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <Typography variant="subtitle2">
              Imágenes adicionales seleccionadas:
            </Typography>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {fotos.map((foto, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(foto)}
                  alt={`Foto ${index + 1}`}
                  style={{ width: "100px", borderRadius: "8px" }}
                />
              ))}
            </div>
          </div>
        )}

        <TextField
          select
          label="Seleccionar Artículo"
          value={selectedArticulo}
          onChange={(e) => setSelectedArticulo(e.target.value)}
          fullWidth
          margin="normal">
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
          margin="normal">
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
            className="cancel-button">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className="save-button">
            {loading ? "Cargando..." : "Crear Producto"}
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateProductoBase;
