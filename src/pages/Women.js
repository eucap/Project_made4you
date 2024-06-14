import React, { useEffect, useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './CategoryPage.css';

const Women = ({ setNotification }) => {
    const [womenProducts, setWomenProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products?pageCategory=women', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setWomenProducts(data);
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
            <h2 className="category-title">Women's Collection</h2>
            <div className="product-container">
                {womenProducts.map(product => (
                    <ProductCard 
                        key={product._id} 
                        product={product} 
                        onAddToCart={addToCart} 
                        onAddToWishlist={addToWishlist} 
                        setNotification={setNotification}
                    />
                ))}
            </div>
        </section>
    );
};

export default Women;
