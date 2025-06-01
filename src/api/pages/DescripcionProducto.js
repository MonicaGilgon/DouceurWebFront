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
      }
    });
  }, [productoId]);

  if (!producto) return <div className="producto-detalle-loading">Cargando...</div>;

  const handleAddToCart = () => {
    // Buscar la imagen principal o la primera
    let imagen = "/placeholder.svg";
    if (producto.imagenes && producto.imagenes.length > 0) {
      imagen = producto.imagenes[imgSeleccionada]?.url_imagen || producto.imagenes[0].url_imagen;
    }

    const productoParaCarrito = {
      ...producto,
      imagen,
      cantidad: parseInt(cantidad)
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
        </div>
      </div>
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
