import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import banner from "../images/banner-desayuno.png";
import "./scss/Home.scss";
import ProductGridSkeleton from "../components/Skeleton/ProductGridSkeleton";

const Home = () => {
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("catalogo-productos/");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al cargar los productos", error);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al cargar las categorías", error);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  const categoriasHabilitadas = categorias.filter(c => c.estado === true).slice(0, 5);

  return (
    <div className="home-container">
      {/* Banner principal */}
      <div className="banner">
        <img src={banner || "/placeholder.svg"} alt="Banner desayuno" />
      </div>

      {/* Sección de bienvenida y logo */}
      <div className="intro-section">
        <div className="text">
          <h2>
            Bienvenido a <br /> Douceur
          </h2>
          <p>
            Somos una marca dedicada a crear detalles para que <br /> hagas de tus momentos especiales experiencias <br /> inolvidables.
          </p>
        </div>
        <div className="logo">
          <img src={logo || "/placeholder.svg"} alt="Logo Douceur" />
        </div>
      </div>

      {/* Carrusel de categorías */}
      <div className="categorias-section">
        <h3>Categorías</h3>
        {loadingCategorias ? (
          <p>Cargando categorías...</p>
        ) : (
          <div className="categorias">
            {categoriasHabilitadas.map(categoria => (
              <Link to={`/categoria/${categoria.id}`} className="categoria" key={categoria.id}>
                <p>{categoria.nombre}</p>
              </Link>
            ))}

            <Link to="/catalogo" className="catalogo">
              <div className="mas">+</div>
              <p>Ver todas</p>
            </Link>
          </div>
        )}
      </div>

      {/* Carrusel de PRODUCTOS */}
      <div className="productos-section">
        <h3>Productos</h3>
        {loadingProductos ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">
            {productos.map(p => (
              <div className="col" key={p.id}>
                <div className="product-item">
                  <figure>
                    <Link to={`/producto/${p.id}`} title={p.nombre}>
                      <img src={p.imagen?.startsWith("http") ? p.imagen : "/placeholder.svg"} alt={p.nombre} className="tab-image" />
                    </Link>
                  </figure>
                  <div className="d-flex flex-column">
                    <h4 className="fs-6 fw-semibold">{p.nombre}</h4>
                    <div className="d-flex  gap-2">
                      <span className="text-dark fw-semibold">
                        $
                        {parseFloat(p.precio).toLocaleString("es-CO", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center mt-4 mb-4">
        <Link to="/catalogo" className="ver-todos-btn">
          Ver Todos
        </Link>
      </div>
    </div>
  );
};

export default Home;
