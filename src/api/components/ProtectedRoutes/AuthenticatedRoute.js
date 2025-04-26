"use client"

import { useEffect, useState } from "react"
import { Navigate, Outlet, useNavigate } from "react-router-dom"

const AuthenticatedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = () => {
            // Verificar si el usuario está autenticado
            const token = localStorage.getItem("access_token")
            if (token) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        }

        checkAuth()

        // Verificar periódicamente la autenticación
        const interval = setInterval(checkAuth, 5000)

        return () => clearInterval(interval)
    }, [navigate])

    // Mostrar un indicador de carga mientras se verifica la autenticación
    if (isAuthenticated === null) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <p>Verificando autenticación...</p>
            </div>
        )
    }

    // Redirigir a la página de inicio de sesión si no está autenticado
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />
    }

    // Renderizar las rutas protegidas si está autenticado
    return <Outlet />
}

export default AuthenticatedRoute
