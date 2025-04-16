import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCategoriaArticulo = () => {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(true);
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get(
          "http://127.0.0.1:8000/listar-categoria-articulo/"
        );
        setCategoriasExistentes(response.data);
      } catch (err) {
        toast.error(
          "Error al cargar las categorías. Intenta de nuevo más tarde."
        );
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificar si el nombre ya existe, ignorando mayúsculas y minúsculas
    const nombreExiste = categoriasExistentes.some(
      (categoria) =>
        categoria.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (nombreExiste) {
      toast.error("Nombre de categoría existente");
      return;
    }

    try {
      toast.success("Categoría creada correctamente.");
      await api.post("http://127.0.0.1:8000/listar-categoria-articulo/", {
        nombre: nombre.trim(),
        estado,
      });

      navigate("/admin/listar-categoria-articulo");
    } catch (err) {
      toast.error("Error al crear la categoría. Intenta de nuevo.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/listar-categoria-articulo");
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <Typography variant="h4" gutterBottom>
        Crear Nueva Categoría de Artículo
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <label>
          Estado:
          <input
            type="checkbox"
            checked={estado}
            onChange={() => setEstado(!estado)}
          />
        </label>
        <div style={{ marginTop: "16px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
          >
            Crear Categoría
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategoriaArticulo;
