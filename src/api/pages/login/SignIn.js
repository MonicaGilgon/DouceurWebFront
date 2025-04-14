import React, { useState } from 'react';
import api from '../../../api/axios'; // Usa la instancia configurada
import { useNavigate, Link } from 'react-router-dom';
import '../scss/sign.scss';
import 'boxicons/css/boxicons.min.css';

const SignIn = () => {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/sign-in/', form);
      // Aquí puedes guardar el token o datos del usuario si tu backend los retorna
      // localStorage.setItem('token', response.data.token)
      // Almacena los datos del usuario en Redux (si es necesario)
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  const togglePassword = () => {
    const input = document.getElementById("password");
    input.type = input.type === 'password' ? 'text' : 'password';
  };

  return (
    <section id="auth-section" className="auth-container">
      <div className="left-side">
        <div className="form-container">
          <div className="form login">
            <div className="form-content">
              <header>Iniciar Sesión</header>

              {error && (
                <div className="alert alert-danger">
                  <strong>{error}</strong>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="field input-field">
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    className="input"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="field input-field">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Contraseña"
                    className="password"
                    required
                    onChange={handleChange}
                  />
                  <span className="eye-icon" onClick={togglePassword} tabIndex="0">
                    <i className='bx bx-show'></i>
                  </span>
                </div>
                <div className="form-link">
                  <Link to="/recover-password" className="forgot-pass">¿Olvidaste la contraseña?</Link>
                </div>
                <div className="field button-field">
                  <button type="submit">Continuar</button>
                </div>
              </form>

              <div className="form-link">
                <span>¿No tienes una cuenta? <Link to="/sign-up" className="link signup-link">Crear cuenta</Link></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;