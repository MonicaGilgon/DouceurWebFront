// src/pages/cart/CartPage.js
import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../pages/scss/Cart.scss";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, removeOneFromCart, addToCart } =
    useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="cart-container">
      <h2>🛒 Tú Carrito</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeFromCart={removeFromCart}
              addToCart={addToCart}
              removeOneFromCart={removeOneFromCart}
            />
          ))}
        </div>

        <div className="cart-summary">
          <h3>Resumen</h3>

          <div style={{ marginBottom: "1rem" }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.98em",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: 500 }}>{item.nombre}</span>
                <span>
                  x {item.cantidad} &nbsp;|&nbsp; $
                  {parseFloat(item.precio).toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span
              style={{ display: "flex", flexDirection: "column", minWidth: 0 }}
            >
              <span
                style={{
                  fontSize: "0.98em",
                  whiteSpace: "nowrap",
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontSize: "0.98em",
                  color: "#888",
                  whiteSpace: "nowrap",
                }}
              >
                ({cartItems.reduce((acc, item) => acc + item.cantidad, 0)}{" "}
                producto
                {cartItems.reduce((acc, item) => acc + item.cantidad, 0) !== 1
                  ? "s"
                  : ""}
                )
              </span>
            </span>
            <strong>
              $
              {cartItems
                .reduce(
                  (sum, item) => sum + parseFloat(item.precio) * item.cantidad,
                  0
                )
                .toLocaleString("es-CO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </strong>
          </div>
          <button
            className="btn-checkout"
            onClick={() => navigate("/checkout")}
          >
            Proceder al pago
          </button>
          <button className="btn-clear" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente individual del producto en el carrito
const CartItem = ({ item, removeFromCart, addToCart, removeOneFromCart }) => {
  return (
    <div className="cart-item">
      <img
        src={item.imagen}
        alt={item.nombre}
        className="item-image"
      />
      <div className="item-details">
        <h4>{item.nombre}</h4>
        <p>
          $
          {parseFloat(item.precio).toLocaleString("es-CO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <div className="cantidad-row">
          <span>Cantidad</span>
          <div className="cantidad-controls">
            <span>{item.cantidad}</span>
            <button
              onClick={() => removeOneFromCart(item.id)}
              className="btn-cantidad"
            >
              -
            </button>

            <button onClick={() => addToCart(item)} className="btn-cantidad">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vista cuando el carrito está vacío
const EmptyCartView = () => {
  return (
    <div className="empty-cart">
      <h2>🛒 Tú carrito está vacío</h2>
      <p>
        Aún no has agregado ningún producto. ¡Explora nuestro catálogo y empieza
        a comprar!
      </p>
      <button
        className="btn-explore"
        onClick={() => (window.location.href = "/catalogo")}
      >
        Ver Catálogo
      </button>
    </div>
  );
};

export default Cart;
