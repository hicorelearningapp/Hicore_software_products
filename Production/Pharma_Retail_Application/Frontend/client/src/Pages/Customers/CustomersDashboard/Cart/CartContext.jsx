import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id) => setCart((prev) => prev.filter((p) => p.id !== id));

  const updateQty = (id, action) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, qty: action === "inc" ? p.qty + 1 : Math.max(1, p.qty - 1) }
          : p
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};
