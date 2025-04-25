import React from "react";
import api from '../../api/axios';
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import logo from '../images/logo.png';
import banner from '../images/banner-desayuno.png';
import categorias from  './admin/CategoriaProductoBaseList';
import "./scss/Home.scss";

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/sign-in");
  };
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al cargar las categorías", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const categoriasVisibles = categorias.slice(0, 5);

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
        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <div className="categorias">
            {categoriasVisibles.map((categoria) => (
              <Link to={`/categoria/${categoria.id}`} className="categoria" key={categoria.id}>
                <p>{categoria.nombre}</p>
              </Link>
            ))}

            <Link /* to="/catalogo" */ className="categoria catalogo">
              <div className="mas">+</div>
              <p>Ver todas</p>
            </Link>
          </div>
        )}   
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
