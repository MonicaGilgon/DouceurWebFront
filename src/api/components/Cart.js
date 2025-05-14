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
          <div className="summary-row">
            <span>
              Subtotal ({cartItems.length} producto
              {cartItems.length > 1 ? "s" : ""})
            </span>
            <strong>
              $
              {cartItems
                .reduce(
                  (sum, item) => sum + parseFloat(item.precio) * item.cantidad,
                  0
                )
                .toFixed(2)}
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
        src={`http://localhost:8000${item.imagen}` || "/placeholder.svg"}
        alt={item.nombre}
        className="item-image"
      />
      <div className="item-details">
        <h4>{item.nombre}</h4>
        <p>${parseFloat(item.precio).toFixed(2)}</p>
        <div className="cantidad-row">
          <span>Cantidad</span>
          <div className="cantidad-controls">
            <button
              onClick={() => removeOneFromCart(item.id)}
              className="btn-cantidad"
            >
              -
            </button>
            <span>{item.cantidad}</span>
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
