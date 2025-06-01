// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect, use } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Supón que tienes acceso a userId o email
  const user = JSON.parse(localStorage.getItem("usuario")); // Recupera el usuario del localStorage
  const userId = user?.id || "anonimo"; // Usa un valor por defecto si no hay usuario
  const CART_KEY = `cartItems_${userId}`;

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    // Guarda los elementos del carrito en el localStorage cada vez que cambian
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems, CART_KEY]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    setCartItems(stored ? JSON.parse(stored) : []);
  }, [userId]);

  // Función para agregar un producto al carrito
  const addToCart = producto => {
    setCartItems(prevItems => {
      const foundItem = prevItems.find(item => item.id === producto.id);
      if (foundItem) {
        // Suma la cantidad seleccionada, no solo 1
        return prevItems.map(item => (item.id === producto.id ? { ...item, cantidad: item.cantidad + producto.cantidad } : item));
      }
      // Usa la cantidad seleccionada al agregar por primera vez
      return [...prevItems, { ...producto, cantidad: producto.cantidad }];
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = itemId => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const removeOneFromCart = itemId => {
    setCartItems(prev =>
      prev
        .map(prevItems => (prevItems.id === itemId ? { ...prevItems, cantidad: prevItems.cantidad - 1 } : prevItems))
        .filter(item => item.cantidad > 0)
    );
  };
  // Función para limpiar todo el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  const addOneToCart = itemId => {
    setCartItems(prev => prev.map(prevItem => (prevItem.id === itemId ? { ...prevItem, cantidad: prevItem.cantidad + 1 } : prevItem)));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        removeOneFromCart,
        addOneToCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
