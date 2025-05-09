"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../../context/CartContext"
import "../../pages/scss/Checkout.scss"
import { FaUser, FaUserPlus } from "react-icons/fa"

const CheckoutPage = () => {
    const { cartItems } = useCart()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userData, setUserData] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
    })
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Verificar si el usuario está autenticado
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access_token")
            if (token) {
                setIsAuthenticated(true)
                fetchUserData()
            } else {
                setIsAuthenticated(false)
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    // Obtener datos del usuario si está autenticado
    const fetchUserData = async () => {
        try {
            // Intentar obtener datos del localStorage primero
            const storedUser = localStorage.getItem("usuario")
            console.log(storedUser)
            if (storedUser) {
                const user = JSON.parse(storedUser)
                setUserData({
                    nombre: user.nombre || "",
                    correo: user.correo || "",
                    telefono: user.telefono || "",
                    direccion: user.direccion || "",
                })
            }

            // Opcionalmente, también podríamos hacer una petición al API para obtener datos más actualizados
            // const response = await api.get("/perfil/")
            // const user = response.data
            // setUserData({
            //   nombre: user.nombre_completo || "",
            //   correo: user.correo || "",
            //   telefono: user.telefono || "",
            //   direccion: user.direccion || "",
            // })
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error)
        } finally {
            setLoading(false)
        }
    }

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({
            ...userData,
            [name]: value,
        })
    }

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Aquí iría la lógica para procesar el pedido
            // Por ejemplo:
            // await api.post("/crear-pedido/", {
            //   productos: cartItems,
            //   datosEnvio: userData,
            // })

            // Redirigir a una página de confirmación
            navigate("/confirmacion-pedido")
        } catch (error) {
            console.error("Error al procesar el pedido:", error)
        }
    }

    // Si el carrito está vacío, redirigir al carrito
    if (cartItems.length === 0) {
        return (
            <div className="checkout-empty">
                <h2>No hay productos en tu carrito</h2>
                <p>Agrega productos a tu carrito antes de proceder al pago.</p>
                <Link to="/" className="btn-back">
                    Volver a la tienda
                </Link>
            </div>
        )
    }

    // Mostrar indicador de carga
    if (loading) {
        return (
            <div className="checkout-loading">
                <p>Cargando...</p>
            </div>
        )
    }

    return (
        <div className="checkout-container">
            <h2>Finalizar Compra</h2>

            {!isAuthenticated ? (
                // Caso 1: Usuario no autenticado
                <div className="auth-required">
                    <div className="auth-message">
                        <h3>¡Hola! Para proceder con la compra, ingresa a tu cuenta</h3>
                        <p>
                            Necesitas iniciar sesión para completar tu compra. Si aún no tienes una cuenta, puedes crear una
                            rápidamente.
                        </p>
                    </div>
                    <div className="auth-buttons">
                        <Link to="/sign-in" className="btn-login">
                            <FaUser /> Iniciar Sesión
                        </Link>
                        <Link to="/sign-up" className="btn-register">
                            <FaUserPlus /> Crear Cuenta
                        </Link>
                    </div>
                </div>
            ) : (
                // Caso 2: Usuario autenticado
                <div className="checkout-form-container">
                    <div className="checkout-summary">
                        <h3>Resumen de tu pedido</h3>
                        <div className="checkout-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="checkout-item">
                                    <img src={item.imagen || "/placeholder.svg"} alt={item.nombre} className="item-thumbnail" />
                                    <div className="item-info">
                                        <h4>{item.nombre}</h4>
                                        <p>${Number.parseFloat(item.precio).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="checkout-total">
                            <span>Total:</span>
                            <strong>${cartItems.reduce((sum, item) => sum + Number.parseFloat(item.precio), 0).toFixed(2)}</strong>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="checkout-form">
                        <h3>Datos de envío</h3>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre completo</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={userData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Tu nombre completo"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="correo">Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={userData.correo}
                                onChange={handleChange}
                                required
                                placeholder="tu@correo.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={userData.telefono}
                                onChange={handleChange}
                                required
                                placeholder="Tu número de teléfono"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="direccion">Dirección de envío</label>
                            <textarea
                                id="direccion"
                                name="direccion"
                                value={userData.direccion}
                                onChange={handleChange}
                                required
                                placeholder="Tu dirección completa"
                                rows={3}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-complete-order">
                            Completar Pedido
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default CheckoutPage
