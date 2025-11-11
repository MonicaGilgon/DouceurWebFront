import React, { useState } from "react";
import "../scss/EditView.scss";
import api from "../../../api/axios";
import { TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const CreateVendedor = () => {
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    correo: "",
    contrasenia: "",
    telefono: "",
    direccion: "",
    activo: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value); // Llama a la validación en cada cambio
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case "cedula":
        if (value.length < 7 || value.length > 10 || value.length === 8 || value.length === 9) {
          errorMessage = "Cédula no válida: debe tener entre 7 y 10 caracteres.";
        }
        break;
      case "telefono":
        if (value.length !== 10) {
          errorMessage = "Teléfono no válido: debe tener exactamente 10 caracteres.";
        }
        break;
      case "correo":
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value)) {
          errorMessage = "Correo no válido: debe tener un formato válido (por ejemplo, usuario@dominio.com).";
        }
        break;
      case "contrasenia":
        if (value.length < 8) {
          errorMessage = "La contraseña debe tener al menos 8 caracteres.";
        } else if (/^\d+$/.test(value)) {
          errorMessage = "La contraseña no puede contener solo números.";
        } else if (!/[A-Z]/.test(value)) {
          errorMessage = "La contraseña debe contener al menos una letra mayúscula.";
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMessage
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    // Validar todos los campos antes de enviar el formulario
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
    });

    // Revisar si hay errores antes de enviar
    if (Object.values(errors).some(error => error)) {
      setLoading(false);
      alert("Por favor corrige los errores en el formulario.");
      return;
    }

    try {
      await api.post("crear-vendedor/", formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      toast.success("Vendedor creado exitosamente!"); // Mensaje de éxito

      // Limpiar el formulario
      setFormData({
        cedula: "",
        nombre: "",
        correo: "",
        contrasenia: "",
        telefono: "",
        direccion: "",
        activo: true
      });
      setErrors({}); // Limpiar errores
    } catch (err) {
      toast.error("Error al crear vendedor"); // Mensaje de error
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("../listar-vendedores");
  };

  return (
    <div className="edit-container">
      <form id="crearVendedorForm" onSubmit={handleSubmit} className="edit-form">
        <Typography variant="h4" align="center" gutterBottom>
          Crear Vendedor
        </Typography>
        <TextField
          label="Cédula"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={!!errors.cedula}
          helperText={errors.cedula}
        />
        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth required margin="normal" />
        <TextField
          label="Correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={!!errors.correo}
          helperText={errors.correo}
        />
        <TextField
          label="Contraseña"
          name="contrasenia"
          value={formData.contrasenia}
          onChange={handleChange}
          type={showPassword ? "text" : "password"}
          fullWidth
          required
          margin="normal"
          error={!!errors.contrasenia}
          helperText={errors.contrasenia}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={!!errors.telefono}
          helperText={errors.telefono}
        />
        <TextField label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} fullWidth required margin="normal" />
        <div className="form-buttons">
          <Button type="button" onClick={handleCancel} variant="outlined" className="cancel-button">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading} className="save-button">
            {loading ? "Cargando..." : "Crear Vendedor"}
          </Button>
        </div>
      </form>
      <ToastContainer /> {/* Contenedor para los toasts */}
    </div>
  );
};

export default CreateVendedor;
