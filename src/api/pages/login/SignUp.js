"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/axios";
import "../scss/sign.scss";
import douxceurLogo from "../../images/logo.png";
import "boxicons/css/boxicons.min.css";

const SignUp = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password1: "",
    password2: ""
  });
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    if (form.password1 !== form.password2) {
      toast.error("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      // 1. Registrar al usuario
      const res = await api.post("/sign-up/", form);
      toast.success(res.data.success || "Cuenta creada exitosamente");
      setIsRegistered(true);

      // 2. Iniciar sesión automáticamente
      try {
        const loginResponse = await api.post("/sign-in/", {
          correo: form.correo,
          password: form.password1
        });

        // 3. Almacenar tokens y datos del usuario
        localStorage.setItem("access_token", loginResponse.data.access_token);
        localStorage.setItem("refresh_token", loginResponse.data.refresh_token);

        // Almacenar información del usuario si está disponible
        if (loginResponse.data.usuario) {
          localStorage.setItem("user", JSON.stringify(loginResponse.data.usuario));
        }

        // 4. Disparar evento de cambio de autenticación
        window.dispatchEvent(new Event("auth-change"));

        // 5. Mostrar mensaje de éxito
        toast.success("¡Inicio de sesión automático exitoso!");

        // 6. Redirigir a la página de inicio después de un breve retraso
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (loginErr) {
        console.error("Error al iniciar sesión automáticamente:", loginErr);
        // Si falla el inicio de sesión automático, redirigir a la página de inicio de sesión
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al crear la cuenta");
      setLoading(false);
    }
  };

  const togglePassword = inputId => {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
  };

  return (
    <section id="auth-section" className="auth-container">
      <div className="recover-content">
        <div className="form-content">
          <header>Crear Cuenta</header>

          {!isRegistered ? (
            <form onSubmit={handleSubmit}>
              <div className="field input-field">
                <input type="text" name="nombre" placeholder="Nombre completo" className="input" required onChange={handleChange} />
              </div>
              <div className="field input-field">
                <input type="email" name="correo" placeholder="Correo electrónico" className="input" required onChange={handleChange} />
              </div>
              <div className="field input-field">
                <input
                  type="password"
                  id="password1"
                  name="password1"
                  placeholder="Contraseña"
                  className="password"
                  required
                  onChange={handleChange}
                />
                <span className="eye-icon" onClick={() => togglePassword("password1")} tabIndex="0">
                  <i className="bx bx-show"></i>
                </span>
              </div>
              <div className="field input-field">
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  placeholder="Confirmar contraseña"
                  className="password"
                  required
                  onChange={handleChange}
                />
                <span className="eye-icon" onClick={() => togglePassword("password2")} tabIndex="0">
                  <i className="bx bx-show"></i>
                </span>
              </div>
              <div className="field button-field">
                <button type="submit" disabled={loading}>
                  {loading ? "Cargando..." : "Continuar"}
                </button>
              </div>
            </form>
          ) : (
            <div className="confirmation">
              <p className="confirmation-message">¡Tu cuenta ha sido creada exitosamente!</p>
              <p className="email-sent">Iniciando sesión automáticamente...</p>
            </div>
          )}

          {!isRegistered && (
            <div className="form-link">
              <span>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/sign-in" className="link login-link">
                  Iniciar Sesión
                </Link>
              </span>
            </div>
          )}
        </div>
        <div className="logo-container">
          <img src={douxceurLogo || "/placeholder.svg"} alt="Douxceur Logo" className="logo" />
        </div>
      </div>
    </section>
  );
};

export default SignUp;
