import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './ProductDetails.css';
import UserReview from './UserReview';
import Def_img from '../img/default-image.png';

const ProductDetails = ({setNotification}) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);
    
    const fixedSizes = ['S', 'M', 'L', 'XL'];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${productId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                    setReviews(data.reviews || []);
                } else {
                    console.error('Failed to fetch product');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [productId]);

    if (!product) return <div>Loading...</div>;

    const handleImageClick = (index) => {
        setActiveImageIndex(index);
    };

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };
    const handleAddToCart = () => {
        addToCart(product);
        setNotification('Product added to cart!');
    };

    const handleAddToWishlist = () => {
        addToWishlist(product);
        setNotification('Product added to wishlist!');
    };
    return (
        <>
            <section className="product-details">
                <div className="image-slider">
                    {product.images && product.images.length > 0 ? (
                        <img src={`http://localhost:5000/${product.images[activeImageIndex]}`} alt={product.name} className="main-image" />
                    ) : (
                        <img src={Def_img} alt="Default Product" className="main-image" />
                    )}
                    <div className="product-images">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, index) => (
                                <img src={`http://localhost:5000/${img}`} className={index === activeImageIndex ? "active" : ""} alt={product.name} key={index} onClick={() => handleImageClick(index)} />
                            ))
                        ) : (
                            <img src={Def_img} className="active" alt="Default Product" />
                        )}
                    </div>
                </div>
                <div className="details">
                    <h2 className="product-brand">{product.brand}</h2>
                    <p className="product-short-des">{product.description}</p>
                    <span className="product-price">₹{product.price}</span>
                    <span className="product-actual-price">₹{product.actualPrice}</span>
                    <span className="product-discount">({product.discount}% off)</span>

                    <p className="product-sub-heading">Select size</p>
                    {fixedSizes.map(size => (
                        <React.Fragment key={size}>
                            <input type="radio" name="size" value={size} hidden id={`${size}-size`} checked={selectedSize === size} onChange={() => handleSizeClick(size)} />
                            <label htmlFor={`${size}-size`} className={`size-radio-btn ${selectedSize === size ? 'check' : ''}`}>{size}</label>
                        </React.Fragment>
                    ))}

                    <div className="btn-container">
                        <button className="btn" onClick={() => addToCart({ ...product, selectedSize })}>Add to cart</button>
                        <button className="btn" onClick={() => addToWishlist(product)}>Add to wishlist</button>
                    </div>
                </div>
            </section>

            <UserReview reviews={reviews} />
        </>
    );
};

export default ProductDetails;
