import React, { useEffect, useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './CategoryPage.css';

const Kids = ({ setNotification  }) => {
    const [kidsProducts, setKidsProducts] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products?pageCategory=kids', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setKidsProducts(data);
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
            <h2 className="category-title">Kids' Collection</h2>
            <div className="product-container">
                {kidsProducts.map(product => (
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

export default Kids;
