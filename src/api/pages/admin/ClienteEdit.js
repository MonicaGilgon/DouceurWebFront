import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import "../scss/EditView.scss";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ClienteEdit = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const clienteResponse = await api.get(`/editar-cliente/${clienteId}/`);
        setCliente(clienteResponse.data);
      } catch (error) {
        console.error("Error al cargar el cliente", error);
        toast.error("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [clienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cliente.nombre.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (!cliente.correo.trim()) {
      toast.error("El correo no puede estar vacío.");
      return;
    }
    if (!cliente.telefono.trim()) {
      toast.error("El teléfono no puede estar vacío.");
      return;
    }

    try {
      await api.post(`/editar-cliente/${clienteId}/`, {
        id: clienteId,
        nombre: cliente.nombre,
        correo: cliente.correo,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
      });
      toast.success("Cliente actualizado con éxito.");
      navigate("../listar-clientes");
    } catch (error) {
      console.error("Error al actualizar el cliente", error);
      toast.error("Error al actualizar el cliente.");
    }
  };

  const handleCancel = (event) => {
    navigate("../listar-clientes");
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form">
        <Typography variant="h4" gutterBottom>
          Editar Cliente
        </Typography>
        <TextField
          name="nombre"
          label="Nombre"
          value={cliente.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="correo"
          label="Correo"
          value={cliente.correo}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="email"
          required
        />
        <TextField
          name="telefono"
          label="Teléfono"
          value={cliente.telefono}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="tel"
          required
        />
        <TextField
          name="direccion"
          label="Dirección"
          value={cliente.direccion}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <div className="form-buttons">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outlined"
            className="cancel-button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="save-button"
            onClick={handleSubmit}
          >
            Guardar Cambios
          </Button>
        </div>

        <ToastContainer />
      </form>
    </div>
  );
};

export default ClienteEdit;
