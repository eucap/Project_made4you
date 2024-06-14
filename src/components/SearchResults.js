import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './SearchResults.css';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchResults = (setNotification) => {
    const [products, setProducts] = useState([]);
    const query = useQuery().get('query');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/search?query=${query}`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error('Failed to fetch search results');
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="search-results">
            <h1>Search Results for "{query}"</h1>
            <div className="product-container">
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map(product => (
                        <div key={product._id} onClick={() => handleProductClick(product._id)}>
                            <ProductCard product={product} setNotification={setNotification} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchResults;
