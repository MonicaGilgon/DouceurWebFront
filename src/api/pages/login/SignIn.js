"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/axios";
import "../scss/sign.scss";
import douxceurLogo from "../../images/logo.png";
import "boxicons/css/boxicons.min.css";

const SignIn = () => {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/sign-in/", form);
      if (response.data.usuario.estado) {
        // Almacena el token en localStorage
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        // Almacenar información del usuario si está disponible en la respuesta
        if (response.data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
        }

        // Disparar un evento personalizado para notificar el cambio de autenticación
        window.dispatchEvent(new Event("auth-change"));

        // Mostrar mensaje de éxito
        toast.success("Inicio de sesión exitoso");

        // Redirigir según el rol del usuario
        const userRole = response.data.usuario?.rol || "cliente"; // Valor por defecto: cliente

        switch (userRole.toLowerCase()) {
          case "admin":
            navigate("/admin/"); // Redirigir a la página principal de admin
            break;
          case "vendedor":
            navigate("/vendedor/"); // Redirigir a la página principal de vendedor
            break;
          case "cliente":
          default:
            navigate("/"); // Redirigir a la página de inicio para clientes
            break;
        }
      } else {
        toast.error("El usuario se encuentra deshabilitado");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
  };

  return (
    <section id="auth-section" className="auth-container">
      <div className="recover-content">
        <div className="form-content">
          <header>Iniciar Sesión</header>

          <form onSubmit={handleSubmit}>
            <div className="field input-field">
              <input type="email" name="correo" placeholder="Correo electrónico" className="input" required onChange={handleChange} />
            </div>
            <div className="field input-field">
              <input type="password" name="password" id="password" placeholder="Contraseña" className="password" required onChange={handleChange} />
              <span className="eye-icon" onClick={togglePassword} tabIndex="0">
                <i className="bx bx-show"></i>
              </span>
            </div>
            <div className="form-link">
              <Link to="/recover-password" className="forgot-pass">
                ¿Olvidaste la contraseña?
              </Link>
            </div>
            <div className="field button-field">
              <button type="submit" disabled={loading}>
                {loading ? "Cargando..." : "Continuar"}
              </button>
            </div>
          </form>

          <div className="form-link">
            <span>
              ¿No tienes una cuenta?{" "}
              <Link to="/sign-up" className="link signup-link">
                Crear cuenta
              </Link>
            </span>
          </div>
        </div>
        <div className="logo-container">
          <img src={douxceurLogo || "/placeholder.svg"} alt="Douxceur Logo" className="logo" />
        </div>
      </div>
    </section>
  );
};

export default SignIn;
