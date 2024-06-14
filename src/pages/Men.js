import React, { useEffect, useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './CategoryPage.css'; // Create a common CSS file for category pages

const Men = ({ setNotification }) => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products?pageCategory=men');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="category-page">
            <h2 className="category-title">Men's Collection</h2>
            <div className="product-container">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} setNotification={setNotification} />
                ))}
            </div>
        </section>
    );
};

export default Men;
