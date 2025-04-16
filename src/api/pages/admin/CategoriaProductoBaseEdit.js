import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriaProductoBaseEdit = () => {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState({ nombre: "" });
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await api.get(
          `editar-categoria-producto-base/${categoriaId}/`
        );
        setCategoria(response.data);
      } catch (error) {
        console.error("Error al cargar la categoría", error);
        toast.error("Error al cargar la categoría.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        setCategoriasExistentes(response.data);
      } catch (error) {
        console.error("Error al cargar las categorías existentes", error);
        toast.error("Error al cargar las categorías existentes.");
      }
    };

    fetchCategoria();
    fetchCategorias();
  }, [categoriaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nombreExiste = categoriasExistentes.some(
      (cat) =>
        cat.nombre.toLowerCase() === categoria.nombre.trim().toLowerCase() &&
        cat.id !== Number(categoriaId)
    );

    if (nombreExiste) {
      toast.error("El nombre de categoría ya existe.");
      return;
    }

    try {
      toast.success("Categoría editada correctamente");
      await api.put(`editar-categoria-producto-base/${categoriaId}/`, {
        nombre: categoria.nombre.trim(),
      });
      navigate("/admin/listar-categoria-producto-base");
    } catch (error) {
      console.error("Error al editar la categoría", error);
      toast.error("Error al editar la categoría.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/listar-categoria-producto-base");
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="create-vendedor">
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Editar Categoría de Producto Base
        </Typography>
        <TextField
          label="Nombre"
          name="nombre"
          value={categoria.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
          >
            Guardar Cambios
          </Button>
          <Button
            type="default"
            onClick={() => navigate(-1)}
            style={{ width: "38%" }}
          >
            Cancelar
          </Button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </form>
    </div>
  );
};

export default CategoriaProductoBaseEdit;
