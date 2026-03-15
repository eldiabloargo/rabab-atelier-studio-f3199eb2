import React, { createContext, useContext, useState, useEffect } from 'react';

// التعريف التقني للمنتج داخل السلة
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
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // تحميل البيانات من LocalStorage عند بداية التشغيل
  useEffect(() => {
    const saved = localStorage.getItem('rabab_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing cart data:", e);
      }
    }
  }, []);

  // حفظ البيانات في LocalStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem('rabab_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(prev => {
      // التأكد واش البرودوي ديجا كاين بنفس الـ ID ونفس اللون
      const existing = prev.find(i => i.id === newItem.id && i.selectedColor.hex === newItem.selectedColor.hex);
      if (existing) {
        return prev.map(i => (i.id === newItem.id && i.selectedColor.hex === newItem.selectedColor.hex) 
          ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string, hex: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.selectedColor.hex === hex)));
  };

  const updateQuantity = (id: string, hex: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id && i.selectedColor.hex === hex) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);
  
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
