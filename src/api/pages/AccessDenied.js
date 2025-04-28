import { Link } from "react-router-dom"
import douxceurLogo from "../images/logo.png"
import "./scss/sign.scss"

const AccessDenied = () => {
    return (
        <section id="auth-section" className="auth-container">
            <div className="recover-content">
                <div className="form-content">
                    <header>Acceso Denegado</header>

                    <div className="access-denied-message">
                        <br></br>
                        <p>
                            No tienes permisos para acceder a esta página.
                        </p>
                        <br></br>
                    </div>

                    <div className="field">
                        <Link to="/" style={{ textDecoration: "none", display: "block", height: "100%" }}>
                            <button style={{ backgroundColor: "#ff8ac2" }}>Volver al Inicio</button>
                        </Link>
                    </div>
                </div>
                <div className="logo-container">
                    <img src={douxceurLogo || "/placeholder.svg"} alt="Douxceur Logo" className="logo" />
                </div>
            </div>
        </section>
    )
}

export default AccessDenied
