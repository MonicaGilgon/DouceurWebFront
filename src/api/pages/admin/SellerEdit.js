import React, { useEffect, useState } from "react";
import "../scss/EditView.scss";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import api from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { FormControlLabel, Switch } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

const SellerEdit = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState({
    document_number: "",
    nombre_completo: "",
    correo: "",
    telefono: "",
    direccion: "",
    estado: "",
  });
  const [sellersExistentes, setSellersExistentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const [sellerResponse, sellersResponse] = await Promise.all([
          api.get(`http://localhost:8000/api/editar-vendedor/${sellerId}/`),
          api.get("http://localhost:8000/api/listar-vendedores/"),
        ]);

        setSeller(sellerResponse.data);
        setSellersExistentes(sellersResponse.data);
      } catch (error) {
        console.error(
          "Error al cargar el seller o los sellers existentes",
          error
        );
        toast.error("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [sellerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeller((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!seller.document_number.trim()) {
      toast.error("El documento no puede estar vacío.");
      return;
    }
    if (!seller.nombre_completo.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (!seller.correo.trim()) {
      toast.error("El correo no puede estar vacío.");
      return;
    }
    if (!seller.telefono.trim()) {
      toast.error("El teléfono no puede estar vacío.");
      return;
    }
    if (!seller.direccion.trim()) {
      toast.error("La dirección no puede estar vacía.");
      return;
    }

    try {
      toast.success("Vendedor editado con éxito.");
      await api.post(`http://localhost:8000/api/editar-vendedor/${sellerId}/`, {
        id: sellerId,
        document_number: seller.document_number,
        nombre_completo: seller.nombre_completo,
        correo: seller.correo,
        telefono: seller.telefono,
        direccion: seller.direccion,
        estado: seller.estado === "Activo" ? true : false,
      });

      navigate("../listar-vendedores");
    } catch (error) {
      console.error("Error al editar el vendedor", error);
      toast.error("Error al editar el vendedor.");
    }
  };

  const handleCancel = () => {
    navigate("../listar-vendedores");
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form">
        <Typography variant="h4" gutterBottom>
          Editar Vendedor
        </Typography>
        <TextField
          name="documento"
          label="Documento"
          value={seller.document_number}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="nombre"
          label="Nombre"
          value={seller.nombre_completo}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="correo"
          label="Correo"
          value={seller.correo}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="telefono"
          label="Teléfono"
          value={seller.telefono}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="direccion"
          label="Dirección"
          value={seller.direccion}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Typography
          variant="body1"
          style={{ marginTop: "1rem", fontWeight: "normal" }}
        >
          Estado: *
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={seller.estado === "Activo"} // El estado "Activo" se considera true
              onChange={(e) =>
                setSeller((prevState) => ({
                  ...prevState,
                  estado: e.target.checked ? "Activo" : "Inactivo", // Cambia entre "Activo" e "Inactivo"
                }))
              }
              color="primary"
            />
          }
          label={seller.estado === "Activo" ? "Activo" : "Inactivo"} // Muestra el estado actual
          style={{ marginTop: "1rem" }}
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
          <Button type="submit" variant="contained" className="save-button">
            Guardar Cambios
          </Button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default SellerEdit;
