import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gfm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('gfm_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('gfm_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('gfm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1, selectedUnit = null) => {
    const unitToUse = selectedUnit || product.unit || '১ কেজি';
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product_id === product.id && item.unit === unitToUse
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product_id: product.id,
            name_bn: product.name_bn,
            name_en: product.name_en || product.name_bn,
            price: product.sale_price || product.price,
            regular_price: product.price,
            image: (product.images && product.images[0]) || '',
            unit: unitToUse,
            quantity: quantity,
            category_slug: product.category_slug
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId, unit) => {
    setCartItems(prev => prev.filter(item => !(item.product_id === productId && item.unit === unit)));
  };

  const updateQuantity = (productId, unit, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product_id === productId && item.unit === unit) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
