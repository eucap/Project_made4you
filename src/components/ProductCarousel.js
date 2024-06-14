import React from 'react';
import ProductCard from './ProductCard';
import './ProductCarousel.css';

const ProductCarousel = ({ products }) => {
    return (
        <div className="product-carousel">
            <h2 className="carousel-title">Similar Products</h2>
            <div className="product-carousel-container">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;
