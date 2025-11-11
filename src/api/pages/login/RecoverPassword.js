import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api/axios";
import "../scss/RecoverPassword.scss";
import douxceurLogo from "../../images/logo.png";

const RecoverPassword = () => {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/recover-password/", { correo });
      toast.success(response.data.message);
      setIsEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="auth-section" className="auth-container">
      <div className="recover-content">
        <div className="form-content">
          <header>Recuperar Contraseña</header>
          {!isEmailSent ? (
            <>
              <p className="instructions">Digite su correo electrónico al cual será enviado el enlace para recuperar tu contraseña:</p>
              <form onSubmit={handleSubmit}>
                <div className="field input-field">
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    className="email"
                    required
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                  />
                </div>
                <div className="field button-field">
                  <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
              <div className="form-link">
                <span>
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/sign-in" className="link signin-link">
                    Iniciar sesión
                  </Link>
                </span>
              </div>
            </>
          ) : (
            <div className="confirmation">
              <p className="confirmation-message">Se ha enviado el enlace a tu dirección de correo registrada, revisa tu bandeja de entrada.</p>
              <p className="email-sent">{correo}</p>
            </div>
          )}
        </div>
        <div className="logo-container">
          <img src={douxceurLogo} alt="Douxceur Logo" className="logo" />
        </div>
      </div>
    </section>
  );
};

export default RecoverPassword;
