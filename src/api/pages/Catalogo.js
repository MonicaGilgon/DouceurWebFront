
import React, { useEffect, useState } from 'react';
import api from "../../api/axios";
import './scss/Catalogo.scss'; // Asegúrate de tener estilos

const Catalogo = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(false);

  // Cargar categorías activas al iniciar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get("listar-categoria-producto-base/");
        const activas = response.data.filter(cat => cat.estado);
        setCategorias(activas);
        if (activas.length > 0) {
          handleSeleccionarCategoria(activas[0]);
        }
      } catch (error) {
        console.error("Error al cargar las categorías", error);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  // Cargar productos por categoría seleccionada
  const handleSeleccionarCategoria = async (categoria) => {
    setCategoriaSeleccionada(categoria);
    setLoadingProductos(true);
    try {
      const response = await api.get(`productos-por-categoria/${categoria.id}/`);
      const productosActivos = response.data.filter(
        p => p.estado && p.categoriaProductoBase.estado
      );
      setProductos(productosActivos);
    } catch (error) {
      console.error("Error al cargar productos", error);
    } finally {
      setLoadingProductos(false);
    }
  };

  return (
    <div className="catalogo-container">
      {/* Panel de Categorías */}
      <aside className="catalogo-categorias">
        <h3>CATEGORÍAS</h3>
        <ul>
          {loadingCategorias ? (
            <li>Cargando...</li>
          ) : (
            categorias.map(cat => (
              <li
                key={cat.id}
                className={categoriaSeleccionada?.id === cat.id ? 'activa' : ''}
                onClick={() => handleSeleccionarCategoria(cat)}
              >
                {cat.nombre.toUpperCase()}
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Panel de Productos */}
      <main className="catalogo-productos">
        {categoriaSeleccionada && (
          <div className="catalogo-header">
            <h2>{categoriaSeleccionada.nombre.toUpperCase()}</h2>            
          </div>
        )}

        {loadingProductos ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="productos-grid">
            {productos.map(producto => (
              <div key={producto.id} className="producto-card">
                <img
                  src={producto.imagen || '/placeholder.jpg'} // usa una imagen por defecto si no hay
                  alt={producto.nombre}
                />
                <h3>{producto.nombre.toUpperCase()}</h3>
                <p>{producto.descripcion}</p>
                <p className="precio">${producto.precio.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalogo;
