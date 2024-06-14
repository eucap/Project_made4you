import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import './CategoryPage.css';

const Accessories = ({ onAddToCart, onAddToWishlist,setNotification }) => {
    const [accessoriesProducts, setAccessoriesProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products?pageCategory=accessories', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAccessoriesProducts(data);
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
            <h2 className="category-title">Accessories</h2>
            <div className="product-container">
                {accessoriesProducts.map(product => (
                    <ProductCard 
                        key={product._id} 
                        product={product} 
                        onAddToCart={onAddToCart} 
                        onAddToWishlist={onAddToWishlist} 
                        setNotification={setNotification}
                    />
                ))}
            </div>
        </section>
    );
};

export default Accessories;
