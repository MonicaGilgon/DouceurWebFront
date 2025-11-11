import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../scss/Reset.scss";
import douxceurLogo from "../../images/logo.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    if (password !== passwordConfirm) {
      toast.error("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/reset-password/", {
        token,
        uid,
        password,
        password_confirm: passwordConfirm
      });
      toast.success(response.data.message);
      setTimeout(() => navigate("/sign-in"), 2000); // Redirigir después de 2 segundos
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="auth-section" className="auth-container">
      <div className="recover-content">
        <div className="form-content">
          <header>Restablecer Contraseña</header>
          <p className="instructions">Por favor digita tu nueva contraseña:</p>
          <form onSubmit={handleSubmit}>
            <div className="field input-field">
              <input
                type="password"
                name="password"
                placeholder="Nueva contraseña"
                className="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="field input-field">
              <input
                type="password"
                name="password_confirm"
                placeholder="Confirmar contraseña"
                className="password"
                required
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
              />
            </div>
            <div className="field button-field">
              <button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
        <div className="logo-container">
          <img src={douxceurLogo} alt="Douxceur Logo" className="logo" />
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
