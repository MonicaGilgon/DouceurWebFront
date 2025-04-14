import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../scss/sign.scss';

const RecoverPassword = () => {
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/recover-password/', { correo });
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="auth-section" className="auth-container">
      <div className="left-side">
        <div className="form-container">
          <div className="form login">
            <div className="form-content">
              <header>Recuperar Contraseña</header>

              <form onSubmit={handleSubmit}>
                <div className="field input-field">
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    className="input"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
                <div className="field button-field">
                  <button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar enlace'}
                  </button>
                </div>
              </form>

              <div className="form-link">
                <span>
                  ¿Ya tienes una cuenta? <Link to="/sign-in" className="link signup-link">Iniciar sesión</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecoverPassword;