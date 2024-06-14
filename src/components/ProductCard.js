import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product, setNotification }) => {
    const { addToCart } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation
        addToCart(product);
        setNotification('Product added to cart!');
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault(); // Prevent navigation
        addToWishlist(product);
        setNotification('Product added to wishlist!');
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-image">
                {product.discount > 0 && <span className="discount-tag">{product.discount}% off</span>}
                <img src={`http://localhost:5000/${product.images[0]}`} alt={product.name} className="product-thumb" />
                <button className="card-btn" onClick={handleAddToCart}>Add to Cart</button>
                <button className="wishlist-btn" onClick={handleAddToWishlist}>Add to Wishlist</button>
            </div>
            <div className="product-info">
                <h2 className="product-brand">{product.brand}</h2>
                <p className="product-short-des">{product.description}</p>
                <span className="price">₹{product.price}</span>
                <span className="actual-price">₹{product.actualPrice}</span>
            </div>
        </Link>
    );
};

export default ProductCard;
