import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  title: string;
  title_ar: string;
  price: number;
  image: string;
  selectedColor: {
    hex: string;
    name_en: string;
    name_ar: string;
  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, hex: string) => void;
  updateQuantity: (id: string, hex: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'rabab_atelier_vault';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  // تحميل آمن للبيانات عند بداية التشغيل
  useEffect(() => {
    const loadCart = () => {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setItems(parsed);
        }
      } catch (e) {
        console.error("Atelier Vault Error: Failed to retrieve treasures", e);
      } finally {
        setIsCartLoading(false);
      }
    };
    loadCart();
  }, []);

  // حفظ تلقائي مع "Debounce" خفيف (أداء أحسن)
  useEffect(() => {
    if (!isCartLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isCartLoading]);

  const addToCart = useCallback((newItem: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === newItem.id && i.selectedColor.hex === newItem.selectedColor.hex
      );

      if (existingIndex > -1) {
        const updatedItems = [...prev];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + newItem.quantity
        };
        return updatedItems;
      }
      return [...prev, newItem];
    });
  }, []);

  const removeFromCart = useCallback((id: string, hex: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.selectedColor.hex === hex)));
  }, []);

  const updateQuantity = useCallback((id: string, hex: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id && i.selectedColor.hex === hex) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  // حسابات المالية (Financials)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // منطق الشحن: مثلاً فابور إيلا فات 1000 درهم (كمثال فخامة)
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150; 
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      itemCount,
      subtotal,
      shipping,
      total,
      isCartLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider - Check if you wrapped your App!");
  }
  return context;
};
