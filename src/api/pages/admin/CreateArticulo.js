import React, { useState, useEffect } from "react";
import "../scss/EditView.scss";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CreateArticulo = () => {
  const [nombre, setNombre] = useState("");
  const [categoriaArticulo, setCategoriaArticulo] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("/listar-categoria-articulo/");
        const categoriasActivas = response.data.filter(categoria => categoria.estado === true);
        setCategorias(categoriasActivas);
      } catch (err) {
        console.error("Error al cargar las categorías de artículo:", err);
        setError("Error al cargar las categorías de artículo");
        toast.error("Error al cargar las categorías de artículo");
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await api.post("/crear-articulo/", {
        nombre,
        categoriaArticulo
      });
      navigate("/admin/listar-articulos");
      toast.success("Artículo creado correctamente.");
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
      {error && <div className="error">{error.message}</div>}
      <form onSubmit={handleSubmit} className="edit-form">
        <Typography variant="h4" gutterBottom>
          Crear Artículo
        </Typography>
        <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} fullWidth margin="normal" required />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Categoría</InputLabel>
          <Select value={categoriaArticulo} onChange={e => setCategoriaArticulo(e.target.value)} label="Categoría">
            {categorias.map(categoria => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="form-buttons">
          <Button type="default" onClick={() => navigate(-1)} className="cancel-button">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" className="save-button">
            Crear Artículo
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateArticulo;
