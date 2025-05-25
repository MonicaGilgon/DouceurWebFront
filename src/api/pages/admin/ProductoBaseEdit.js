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
  const [nuevasFotos, setNuevasFotos] = useState([]);
  const [fotosActuales, setFotosActuales] = useState([]);
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
  const [categoriasArticulo, setCategoriasArticulo] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [articulosDisponibles, setArticulosDisponibles] = useState([]);

  useEffect(() => {
    if (!productoId) {
      console.error("Producto ID no está disponible");
      return;
    }
    const fetchProducto = async () => {
      try {
        const response = await api.get(`editar-producto-base/${productoId}/`);

        setProducto(response.data);
        setFotosActuales(response.data.fotos || []);

        setCategoriasSeleccionadas(
          response.data.categorias_articulo.map((c) => c.id)
        );
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

    const fetchCategoriasArticulo = async () => {
      try {
        const response = await api.get("listar-categoria-articulo/");
        const activas = response.data.filter((cat) => cat.estado === true);
        setCategoriasArticulo(activas);
      } catch (error) {
        console.error("Error al cargar categorías de artículo:", error);
        toast.error("Error al cargar categorías de artículo");
      }
    };

    const fetchArticulos = async () => {
      try {
        const response = await api.get("listar-articulos/");
        const activos = response.data.filter((a) => a.estado === true);
        setArticulosDisponibles(activos);
      } catch (err) {
        console.error("Error al cargar artículos disponibles", err);
      }
    };

    fetchProducto();
    fetchCategorias();
    fetchCategoriasArticulo();
    fetchArticulos();
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

    if (!producto.nombre) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (!producto.precio || producto.precio <= 0) {
      toast.error("El precio debe ser mayor a 0.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("descripcion", producto.descripcion);
    formData.append("precio", parseFloat(producto.precio));
    formData.append("estado", producto.estado);
    formData.append("categoriaProductoBase", producto.categoriaProductoBase);

    const articulosIds = producto.articulos.map((a) =>
      typeof a === "object" ? a.id : a
    );
    formData.append("articulos", JSON.stringify(articulosIds));

    formData.append(
      "categorias_articulo",
      JSON.stringify(categoriasSeleccionadas)
    );

    if (producto.imagen instanceof File) {
      formData.append("imagen", producto.imagen);
    }

    nuevasFotos.forEach((foto) => {
      formData.append("fotos", foto);
    });

    try {
      await api.put(`editar-producto-base/${productoId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Producto editado correctamente.");
      navigate("/admin/listar-producto-base");
    } catch (error) {
      const msg = error.response?.data?.error || "Error al editar el producto.";
      toast.error(msg);
      console.error("Error al editar el producto", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin/listar-producto-base"); // Redirigir a la lista de productos base si se cancela
  };

  const handleEliminarArticulo = (articuloId) => {
    setProducto((prevState) => ({
      ...prevState,
      articulos: prevState.articulos.filter(
        (articulo) =>
          (typeof articulo === "object" ? articulo.id : articulo) !== articuloId
      ),
    }));
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
            label="Categoría">
            {categoriasProductoActivas.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            const validas = files.filter(
              (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
            );
            if (validas.length + fotosActuales.length > 5) {
              toast.error("Máximo 5 imágenes (entre nuevas y actuales).");
              return;
            }
            setNuevasFotos(validas);
          }}
        />
        {producto.imagen && !(producto.imagen instanceof File) && (
          <div style={{ marginTop: "10px" }}>
            <Typography variant="subtitle2">Imagen actual:</Typography>
            <img
              src={`http://localhost:8000${producto.imagen}`}
              alt="Imagen actual"
              style={{ width: "120px", borderRadius: "8px", marginTop: "5px" }}
            />
          </div>
        )}
        {producto.imagen && producto.imagen instanceof File && (
          <div style={{ marginTop: "10px" }}>
            <Typography variant="subtitle2">
              Nueva imagen seleccionada:
            </Typography>
            <img
              src={URL.createObjectURL(producto.imagen)}
              alt="Nueva imagen"
              style={{ width: "120px", borderRadius: "8px", marginTop: "5px" }}
            />
          </div>
        )}
        {fotosActuales.map((foto) => (
          <div
            key={foto.id}
            style={{
              position: "relative",
              display: "inline-block",
              margin: "5px",
            }}>
            <img
              src={`http://localhost:8000${foto.url}`}
              style={{ width: "100px", borderRadius: "8px" }}
            />
            <button
              onClick={async () => {
                try {
                  await api.delete(`foto-producto/${foto.id}/`);
                  setFotosActuales(
                    fotosActuales.filter((f) => f.id !== foto.id)
                  );
                  toast.success("Imagen eliminada.");
                } catch (err) {
                  toast.error("Error al eliminar imagen.");
                }
              }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
              }}>
              ×
            </button>
          </div>
        ))}

        <FormControl fullWidth margin="normal">
          <InputLabel id="articulos-label">Artículos relacionados</InputLabel>
          <Select
            labelId="articulos-label"
            multiple
            value={producto.articulos.map((a) =>
              typeof a === "object" ? a.id : a
            )}
            onChange={(e) => {
              const nuevosIds = e.target.value;
              const nuevosArticulos = nuevosIds.map((id) => {
                const existente = producto.articulos.find((a) =>
                  typeof a === "object" ? a.id === id : a === id
                );
                return existente || { id }; // si ya tienes el objeto, reutilízalo
              });
              setProducto((prev) => ({ ...prev, articulos: nuevosArticulos }));
            }}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {selected.map((id) => {
                  const articulo = articulosDisponibles.find(
                    (a) => a.id === id
                  );
                  return (
                    <div
                      key={id}
                      style={{
                        background: "#e0e0e0",
                        padding: "4px 8px",
                        borderRadius: "16px",
                      }}>
                      {articulo?.nombre || `ID: ${id}`}
                    </div>
                  );
                })}
              </div>
            )}>
            {articulosDisponibles.map((articulo) => (
              <MenuItem key={articulo.id} value={articulo.id}>
                {articulo.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            className="save-button">
            Guardar Cambios
          </Button>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
};

export default ProductoBaseEdit;
