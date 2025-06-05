import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import "./scss/DescripcionProducto.scss";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [imgSeleccionada, setImgSeleccionada] = useState(0);
  const [seleccionesCategoria, setSeleccionesCategoria] = useState({});
  const [articulosPorCategoria, setArticulosPorCategoria] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/producto/${productoId}/`).then(res => {
      if (res.data) {
        // Unifica las imágenes en el producto
        const imagenes =
          res.data.fotos && res.data.fotos.length > 0
            ? res.data.fotos.map((url, idx) => ({
                id: idx,
                url_imagen: url,
                es_imagen_principal: idx === 0
              }))
            : [
                {
                  id: 0,
                  url_imagen: res.data.imagen || res.data.imagen_url,
                  es_imagen_principal: true
                }
              ];

        setProducto({
          ...res.data,
          imagenes
        });
        // Inicializa selección vacía para cada categoría, PONER LUEGO A QUE SE SELECCIONE EL PRIMERO
        if (res.data.categorias_articulo && res.data.categorias_articulo.length > 0) {
        const initialState = {};
        const categoriasIds = [];

        res.data.categorias_articulo.forEach(cat => {
          initialState[cat.id] = "";
          categoriasIds.push(cat.id);
        });

        setSeleccionesCategoria(initialState);

        // Cargar artículos por cada categoría
        categoriasIds.forEach(async (id) => {
          await fetchArticulosPorCategoria(id);
        });
      }
    }
  });
}, [productoId]);

      const fetchArticulosPorCategoria = async (categoriaId) => {
        try {
          const res = await api.get(`articulos-por-categoria/${categoriaId}/`);
          const articulosActivos = res.data.filter(a => a.estado);

          setArticulosPorCategoria((prev) => ({
            ...prev,
            [categoriaId]: articulosActivos
          }));

          // Selecciona automáticamente el primer artículo si existe
          if (articulosActivos.length > 0) {
            const primerArticuloId = articulosActivos[0].id.toString();

            setSeleccionesCategoria(prev => ({
              ...prev,
              [categoriaId]: primerArticuloId
            }));
          }

        } catch (error) {
          console.error(`Error al traer artículos para la categoría ${categoriaId}`, error);
          setArticulosPorCategoria((prev) => ({
            ...prev,
            [categoriaId]: []
          }));
        }
      };

  if (!producto) return <div className="producto-detalle-loading">Cargando...</div>;

  const handleSeleccionCategoria = (categoriaId, articuloId) => {
    setSeleccionesCategoria(prev => ({
      ...prev,
      [categoriaId]: articuloId
    }));
  };

  const handleAddToCart = () => {
    // Buscar la imagen principal o la primera
    let imagen = "/placeholder.svg";
    if (producto.imagenes && producto.imagenes.length > 0) {
      imagen = producto.imagenes[imgSeleccionada]?.url_imagen || producto.imagenes[0].url_imagen;
    }

    const articulosSeleccionados = Object.entries(seleccionesCategoria).map(([categoriaId, articuloId]) => {
    const categoria = producto.categorias_articulo.find(c => c.id === parseInt(categoriaId));
    const articulo = categoria?.articulos.find(a => a.id === parseInt(articuloId));


      return {
        categoriaNombre: categoria?.nombre || "Sin categoría",
        articuloNombre: articulo?.nombre || "",
        articuloId: articulo?.id || null
      };
    });

    const productoParaCarrito = {
      ...producto,
      imagen,
      cantidad: parseInt(cantidad),
      personalizaciones: articulosSeleccionados,
    };

    addToCart(productoParaCarrito);
    toast.success(`${producto.nombre} añadido al carrito`);
  };

  return (
    <div className="producto-detalle-container">
      <div className="producto-detalle-galeria">
        <div className="producto-detalle-thumbs">
          {producto.imagenes &&
            producto.imagenes.map((img, idx) => (
              <img
                key={img.id}
                src={`${img.url_imagen}`}
                alt={producto.nombre}
                className={imgSeleccionada === idx ? "selected" : ""}
                onClick={() => setImgSeleccionada(idx)}
              />
            ))}
        </div>
        <div className="producto-detalle-mainimg">
          <img
            src={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[imgSeleccionada].url_imagen : "/placeholder.svg"}
            alt={producto.nombre}
          />
          <button className="producto-detalle-fav">♡</button>
          <div className="producto-detalle-desc">
            <div className="producto-detalle-desc-title">Descripción</div>
            <div>{producto.descripcion}</div>
          </div>



            <div className="producto-detalle-articulos">
            <h4>Artículos que componen este producto:</h4>
            {producto.articulos && producto.articulos.length > 0 ? (
              <ul>
                {producto.articulos.map((articulo) => (
                  <li key={articulo.id}>
                    {articulo.nombre} {articulo.estado ? "" : "(deshabilitado)"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay artículos asociados.</p>
            )}
          </div>
        </div>
      </div>



                {producto.categorias_articulo && producto.categorias_articulo.length > 0 && (
          <div className="producto-detalle-categorias-articulo">
            <h4>Personalización del producto:</h4>
            {producto.categorias_articulo.map(categoria => {
              const articulosActivos = articulosPorCategoria[categoria.id] || [];

              return (
                <div key={categoria.id} className="categoria-articulo-group">
                  <label htmlFor={`categoria-${categoria.id}`}>
                    {categoria.nombre}:
                  </label>

                  <select
                    id={`categoria-${categoria.id}`}
                    value={seleccionesCategoria[categoria.id] || ""}
                    onChange={(e) =>
                      handleSeleccionCategoria(categoria.id, e.target.value)
                    }
                    className="categoria-articulo-select"
                  >
                    {articulosActivos.map(articulo => (
                      <option key={articulo.id} value={articulo.id}>
                        {articulo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}

      <div className="producto-detalle-info">
        <div className="producto-detalle-nombre">{producto.nombre}</div>
        <div className="producto-detalle-tags">
          {producto.categoriaProductoBase && <span className="producto-detalle-tag">{producto.categoriaProductoBase.nombre}</span>}
        </div>
        <div className="producto-detalle-precio">${Number(producto.precio).toLocaleString("es-CO")}</div>
        <div className="producto-detalle-cantidad-row">
          <span>Cantidad</span>
          <div className="producto-detalle-cantidad-controls">
            <span className="cantidad-num">{cantidad}</span>
            <button onClick={() => setCantidad(c => Math.max(1, c - 1))}>-</button>
            <button onClick={() => setCantidad(c => c + 1)}>+</button>
          </div>
          <button className="producto-detalle-addcart" onClick={handleAddToCart}>
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
