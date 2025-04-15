// src/views/pages/RegisterCliente.js
import React, { useState } from 'react'
import api from '../../../api/axios';
import { useNavigate } from 'react-router-dom'
import '../scss/sign.scss'
import 'boxicons/css/boxicons.min.css'

const SignUp = () => {
  const [form, setForm] = useState({
    nombre_completo: '',
    correo: '',
    password1: '',
    password2: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password1 !== form.password2) {
      setError('Las contraseñas no coinciden.')
      return
    }
    try {
      const res = await api.post('/sign-up/', form)
      setSuccess(res.data.success)
      setTimeout(() => {
        navigate('/sign-in')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error desconocido')
    }
  }

  const togglePassword = (inputId) => {
    const input = document.getElementById(inputId)
    input.type = input.type === 'password' ? 'text' : 'password'
  }

  return (
    <section id="auth-section" className="auth-container">
      <div className="left-side">
        <section className="container forms show-signup">
          <div className="form signup">
            <div className="form-content">

              {error && <div className="alert alert-danger"><strong>{error}</strong></div>}
              {success && <div className="alert alert-success"><strong>{success}</strong></div>}

              <header>Crear Cuenta</header>

              <form onSubmit={handleSubmit}>
                <div className="field input-field">
                  <input type="text" name="nombre" placeholder="Nombre completo" required onChange={handleChange} />
                </div>
                <div className="field input-field">
                  <input type="email" name="correo" placeholder="Correo electrónico" required onChange={handleChange} />
                </div>
                <div className="field input-field">
                  <input type="password" id="password1" name="password1" placeholder="Contraseña" required onChange={handleChange} />
                  <span className="eye-icon" onClick={() => togglePassword("password1")} tabIndex="0">
                    <i className="bx bx-show"></i>
                  </span>
                </div>
                <div className="field input-field">
                  <input type="password" id="password2" name="password2" placeholder="Confirmar contraseña" required onChange={handleChange} />
                  <span className="eye-icon" onClick={() => togglePassword("password2")} tabIndex="0">
                    <i className="bx bx-show"></i>
                  </span>
                </div>
                <div className="field button-field">
                  <button type="submit">Continuar</button>
                </div>
              </form>

              <div className="form-link">
                <span>¿Ya tienes una cuenta? <a href="/sign-in" className="link login-link">Iniciar Sesión</a></span>
              </div>
            </div>
          </div>
        </section>
      </div>

    </section>
  )
}

export default SignUp
