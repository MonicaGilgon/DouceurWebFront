import React, { useState, useEffect } from "react";
import "../scss/EditView.scss";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCategoriaProductoBase = () => {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(true);
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        setCategoriasExistentes(response.data);
      } catch (err) {
        toast.error("Error al cargar las categorías existentes.");
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nombreExiste = categoriasExistentes.some(
      (categoria) =>
        categoria.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );
    if (nombreExiste) {
      toast.error("Nombre de categoría existente");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre.trim());
    formData.append("estado", estado);

    try {
      await api.post("crear-categoria-producto-base/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Categoría creada correctamente.");
      navigate("/admin/listar-categoria-producto-base");
    } catch (err) {
      toast.error("Error al crear la categoría. Intenta de nuevo.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/listar-categoria-producto-base");
  };

  return (
    <div className="edit-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit} className="edit-form">
        <Typography variant="h4" gutterBottom>
          Crear Nueva Categoría de Producto Base
        </Typography>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <label style={{ color: "black", margin: "15px 10px 15px 0" }}>
          Activo:
        </label>
        <input
          type="checkbox"
          checked={estado}
          onChange={() => setEstado(!estado)}
          style={{ marginBottom: "20px" }}
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
            Crear Categoría
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategoriaProductoBase;
