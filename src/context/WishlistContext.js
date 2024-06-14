import React, { createContext, useState } from 'react';

// Create a Context for the wishlist
export const WishlistContext = createContext();

// Create a Provider component
export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    // Add to wishlist function
    const addToWishlist = (item) => {
        setWishlistItems((prevItems) => {
            const itemExists = prevItems.find(wishlistItem => wishlistItem._id === item._id);
            if (itemExists) {
                return prevItems; // If item already in wishlist, do nothing
            }
            return [...prevItems, item];
        });
    };
    // Remove from wishlist function
    const removeFromWishlist = (itemId) => {
        setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
