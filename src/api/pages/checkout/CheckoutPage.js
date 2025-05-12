"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../../context/CartContext"
import "../../pages/scss/Checkout.scss"
import { FaUser, FaUserPlus, FaWhatsapp } from "react-icons/fa"

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userData, setUserData] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
        horarioEntrega: "",
    })
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Número de WhatsApp de la tienda (reemplazar con el número real)
    const whatsappNumber = "573142853147" // Ejemplo: 573001234567 para Colombia

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
            if (storedUser) {
                const user = JSON.parse(storedUser)
                setUserData({
                    nombre: user.nombre || "",
                    correo: user.correo || "",
                    telefono: user.telefono || "",
                    direccion: user.direccion || "",
                    horarioEntrega: "",
                })
            }
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

    // Generar mensaje de WhatsApp
    const generateWhatsAppMessage = () => {
        // Crear la sección de productos
        let productosTexto = "*Detalles del pedido:*\n"
        cartItems.forEach((item, index) => {
            productosTexto += `${index + 1}. ${item.nombre} - $${Number.parseFloat(item.precio).toFixed(2)}\n`
        })

        // Calcular el subtotal
        const subtotal = cartItems.reduce((sum, item) => sum + Number.parseFloat(item.precio), 0).toFixed(2)
        productosTexto += `\n*Subtotal:* $${subtotal}\n\n`

        // Datos del cliente
        const datosCliente =
            `*Datos de entrega:*\n` +
            `Nombre: ${userData.nombre}\n` +
            `Teléfono: ${userData.telefono}\n` +
            `Correo: ${userData.correo}\n` +
            `Dirección: ${userData.direccion}\n` +
            `Horario de entrega: ${userData.horarioEntrega}\n\n`

        // Mensaje final
        const mensajeFinal =
            "Hola, acabo de realizar un pedido en Douceur. " +
            "Quisiera información sobre el costo del envío y los medios de pago disponibles. ¡Gracias!"

        // Mensaje completo
        return productosTexto + datosCliente + mensajeFinal
    }

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validar que todos los campos estén completos
        const requiredFields = ["nombre", "correo", "telefono", "direccion", "horarioEntrega"]
        const missingFields = requiredFields.filter((field) => !userData[field])

        if (missingFields.length > 0) {
            alert("Por favor completa todos los campos requeridos")
            return
        }

        try {
            // Generar el mensaje para WhatsApp
            const mensaje = generateWhatsAppMessage()

            // Codificar el mensaje para URL
            const mensajeCodificado = encodeURIComponent(mensaje)

            // Crear la URL de WhatsApp
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`

            // Limpiar el carrito
            clearCart()

            // Abrir WhatsApp en una nueva pestaña
            window.open(whatsappUrl, "_blank")

            // Redirigir a la página de inicio o a una página de confirmación
            navigate("/")
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
                            <label htmlFor="nombre">Nombre de quien recibe*</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={userData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Nombre completo"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="correo">Correo electrónico*</label>
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
                            <label htmlFor="telefono">Teléfono de contacto*</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={userData.telefono}
                                onChange={handleChange}
                                required
                                placeholder="Número de teléfono"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="direccion">Dirección de entrega*</label>
                            <textarea
                                id="direccion"
                                name="direccion"
                                value={userData.direccion}
                                onChange={handleChange}
                                required
                                placeholder="Dirección completa"
                                rows={3}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="horarioEntrega">Horario de entrega preferido*</label>
                            <select
                                id="horarioEntrega"
                                name="horarioEntrega"
                                value={userData.horarioEntrega}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un horario</option>
                                <option value="Mañana (8:00 AM - 12:00 PM)">Mañana (8:00 AM - 12:00 PM)</option>
                                <option value="Tarde (12:00 PM - 5:00 PM)">Tarde (12:00 PM - 5:00 PM)</option>
                                <option value="Noche (5:00 PM - 8:00 PM)">Noche (5:00 PM - 8:00 PM)</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-complete-order">
                            <FaWhatsapp style={{ marginRight: "8px" }} /> Completar Pedido por WhatsApp
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default CheckoutPage
