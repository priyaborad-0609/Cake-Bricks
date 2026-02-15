import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (cake) => {
    const exists = cart.find(i => i._id === cake._id);
    if (exists) {
      setCart(cart.map(i =>
        i._id === cake._id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCart([...cart, { ...cake, qty: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    setCart(cart.map(i => i._id === id ? { ...i, qty } : i));
  };

  const removeItem = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQty,
      removeItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
