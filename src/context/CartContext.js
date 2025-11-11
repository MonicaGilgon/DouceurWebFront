// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const CART_KEY = "cart";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error al cargar carrito del localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    // Guarda los elementos del carrito en el localStorage cada vez que cambian
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Función para agregar un producto al carrito
  const addToCart = producto => {
    setCart(prevItems => {
      // Busca si ya existe el producto en el carrito
      const foundItem = prevItems.find(item => item.id === producto.id);

      if (foundItem) {
        // Si ya está, solo aumenta la cantidad
        return prevItems.map(item =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + producto.cantidad
              }
            : item
        );
      }

      // Si no está, agrégalo con sus artículos fijos y personalizaciones
      return [
        ...prevItems,
        {
          ...producto,
          cantidad: producto.cantidad || 1,
          articulosFijos: producto.articulos || [],
          personalizaciones: producto.personalizaciones || []
        }
      ];
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = itemId => {
    setCart(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const removeOneFromCart = itemId => {
    setCart(prev =>
      prev
        .map(prevItems => (prevItems.id === itemId ? { ...prevItems, cantidad: prevItems.cantidad - 1 } : prevItems))
        .filter(item => item.cantidad > 0)
    );
  };
  // Función para limpiar todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  const addOneToCart = itemId => {
    setCart(prev => prev.map(prevItem => (prevItem.id === itemId ? { ...prevItem, cantidad: prevItem.cantidad + 1 } : prevItem)));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
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
