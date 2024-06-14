import React, { useEffect, useState, useContext } from 'react';
import ProductCard from './ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './ProductPage.css';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    return (
        <section className="product-page">
            <h2 className="product-category">Best Selling</h2>
            <div className="product-container">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
                ))}
            </div>
        </section>
    );
};

export default ProductPage;
