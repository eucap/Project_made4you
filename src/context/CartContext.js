import React, { createContext, useState } from 'react';

// Create a Context for the cart
export const CartContext = createContext();

// Create a Provider component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Add to cart function
    const addToCart = (item) => {
        const itemIndex = cartItems.findIndex(cartItem => cartItem._id === item._id);

        if (itemIndex > -1) {
            // Increment quantity if item is already in cart
            const updatedCartItems = [...cartItems];
            updatedCartItems[itemIndex].quantity += 1;
            setCartItems(updatedCartItems);
        } else {
            // Add item with quantity 1 if not in cart
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    // Remove from cart function
    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item._id !== itemId));
    };

    // Clear cart function
    const clearCart = () => {
        setCartItems([]);
    };

    // Update item quantity function
    const updateItemQuantity = (itemId, quantity) => {
        const itemIndex = cartItems.findIndex(cartItem => cartItem._id === itemId);

        if (itemIndex > -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[itemIndex].quantity = quantity;
            setCartItems(updatedCartItems);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateItemQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
