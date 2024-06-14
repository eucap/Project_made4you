import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './Wishlist.css';

const Wishlist = ({ setNotification }) => {
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleRemoveClick = (item, e) => {
        e.stopPropagation(); // Prevent navigation when clicking the remove button
        removeFromWishlist(item._id);
        setNotification('Product removed from wishlist!');
    };

    const handleAddToCart = (item, e) => {
        e.stopPropagation(); // Prevent navigation when clicking the add to cart button
        addToCart(item);
        setNotification('Product added to cart!');
    };

    return (
        <div className="wishlist">
            <h1>My Wishlist</h1>
            {wishlistItems.length === 0 ? (
                <p>Your wishlist is empty</p>
            ) : (
                <ul className="wishlist-list">
                    {wishlistItems.map(item => (
                        <li key={item._id} className="wishlist-item" onClick={() => handleProductClick(item._id)}>
                            <img src={`http://localhost:5000/${item.images[0]}`} alt={item.name} className="wishlist-image" />
                            <div className="wishlist-info">
                                <h2>{item.name}</h2>
                                <p>{item.description}</p>
                                <span>₹{item.price}</span>
                                <button onClick={(e) => handleAddToCart(item, e)} className="add-to-cart-btn">Add to Cart</button>
                                <button onClick={(e) => handleRemoveClick(item, e)} className="remove-btn">Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Wishlist;
