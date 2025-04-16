import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriaArticuloEdit = () => {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState({ nombre: "" });
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar la categoría actual y todas las categorías existentes
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const [categoriaResponse, categoriasResponse] = await Promise.all([
          api.get(
            `http://localhost:8000/editar-categoria-articulo/${categoriaId}/`
          ),
          api.get("http://localhost:8000/listar-categoria-articulo/"),
        ]);

        setCategoria(categoriaResponse.data);
        setCategoriasExistentes(categoriasResponse.data);
      } catch (error) {
        console.error(
          "Error al cargar la categoría o las categorías existentes",
          error
        );
        toast.error("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [categoriaId]);

  // Manejo del cambio en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!categoria.nombre.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }

    // Verificar si el nombre ya existe (ignorando mayúsculas/minúsculas)
    const nombreExiste = categoriasExistentes.some(
      (cat) =>
        cat.nombre.toLowerCase() === categoria.nombre.trim().toLowerCase() &&
        cat.id !== Number(categoriaId)
    );

    if (nombreExiste) {
      toast.error("El nombre de la categoría ya existe.");
      return;
    }

    try {
      toast.success("Categoría editada correctamente.");
      await api.put(
        `http://localhost:8000/editar-categoria-articulo/${categoriaId}/`,
        {
          nombre: categoria.nombre.trim(),
        }
      );
      navigate("/admin/listar-categoria-articulo");
    } catch (error) {
      console.error("Error al editar la categoría", error);
      toast.error("Error al editar la categoría.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/listar-categoria-articulo");
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="create-vendedor">
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Editar Categoría de Artículo
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
        <ToastContainer />
      </form>
    </div>
  );
};

export default CategoriaArticuloEdit;
