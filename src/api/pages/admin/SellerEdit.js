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
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    estado: "",
  });
  const [ setSellersExistentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const [sellerResponse, sellersResponse] = await Promise.all([
          api.get(`/editar-vendedor/${sellerId}/`),
          api.get("/listar-vendedores/"),
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
    if (!seller.nombre.trim()) {
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
      await api.post(`/editar-vendedor/${sellerId}/`, {
        id: sellerId,
        document_number: seller.document_number,
        nombre_completo: seller.nombre,
        correo: seller.correo,
        telefono: seller.telefono,
        direccion: seller.direccion,
        estado: seller.estado,
      });
      toast.success("Vendedor editado con éxito.");
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
          name="document_number"
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
          value={seller.nombre}
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
              checked={seller.estado} // El estado "Activo" se considera true
              onChange={(e) =>
                setSeller((prevState) => ({
                  ...prevState,
                  estado: e.target.checked ? true : false, // Cambia entre "Activo" e "Inactivo"
                }))
              }
              color="primary"
            />
          }
          label={seller.estado ? "Activo" : "Inactivo"} // Muestra el estado actual
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
