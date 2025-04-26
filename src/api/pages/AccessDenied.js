import { Link } from "react-router-dom"

const AccessDenied = () => {
    return (
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
            <h1 style={{ color: "#ff6b6b", marginBottom: "20px" }}>Acceso Denegado</h1>
            <p style={{ fontSize: "18px", marginBottom: "30px" }}>No tienes permisos para acceder a esta página.</p>
            <Link
                to="/"
                style={{
                    backgroundColor: "#ffb9cb",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    fontWeight: "bold",
                }}
            >
                Volver al Inicio
            </Link>
        </div>
    )
}

export default AccessDenied
