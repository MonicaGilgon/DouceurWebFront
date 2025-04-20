import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.png';
import banner from '../images/banner-desayuno.png';
import "./scss/Home.scss";

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/sign-in");
  };

  return (
    <div className="home-container">
      {/* Banner principal */}
      <div className="banner">
        <img src={banner} alt="Banner desayuno" />
      </div>

      {/* Sección de bienvenida y logo */}
      <div className="intro-section">
        <div className="text">
          <h2>Bienvenido a <br/> Douceur</h2>
          <p>
            Somos una marca dedicada a crear detalles para que <br/> hagas de tus momentos especiales experiencias <br/> inolvidables.
          </p>
        </div>
        <div className="logo">
          <img src={logo} alt="Logo Douceur" />
        </div>
      </div>

      {/* Carrusel de categorías */}
      <div className="categorias-section">
        <h3>Categorías</h3>
        <div className="categorias">
          <div className="categoria">
            <p>Amor y Amistad</p>
          </div>
          <div className="categoria">
            <p>Flores</p>
          </div>
          <div className="categoria">
            <p>Desayunos y Meriendas</p>
          </div>
          <div className="categoria">
            <p>Caballero</p>
          </div>
          <div className="categoria">
            <p>Chocolatería</p>
          </div>
          <div className="categoria ver-todas">
            <div className="mas">+</div>
            <p>Ver todas</p>
          </div>
        </div>
      </div>

        {/* Carrusel de PRODUCTOS */}
        <div className="productos-section">
        <h3>Productos</h3>
        <div className="productos">
          <div className="producto">
            <p>Hecho con amor 1</p>
          </div>
          <div className="producto">
            <p>Hecho con amor 2</p>
          </div>
          <div className="producto">
            <p>Hecho con amor 3</p>
          </div>
          <div className="producto ver-todos">
            <div className="mas">+</div>
            <p>Ver todos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
