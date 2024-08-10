import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import './Home.css'; 
import logo from '../img/made4you-ww.png'; 
import arrowImage from '../img/arrow.png';
import womenCollection from '../img/women-collection.png';
import menCollection from '../img/men-collection.png';
import accessoriesCollection from '../img/accessories-collection.png';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Home = ({setNotification} ) => {
    const navigate = useNavigate();  
    const { addToCart } = useContext(CartContext);
    const { addToWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');  
        }
    }, [navigate]);

    const [products, setProducts] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchBestSellingProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products?discount=15');
                if (response.ok) {
                    const data = await response.json();
                    setBestSellingProducts(data);
                } else {
                    console.error('Failed to fetch best selling products');
                }
            } catch (error) {
                console.error('Error fetching best selling products:', error);
            }
        };
    
        fetchProducts();
        fetchBestSellingProducts();
    }, []);


    const scrollContainer = (direction) => {
        const container = document.querySelector('.product-container');
        const scrollAmount = direction === 'left' ? -250 : 250;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const carouselImages = [
        require('../img/men/caro-1.jpg'), 
        require('../img/men/caro-2.jpg'), 
    ];

    return (
        <div>
            <header className="hero-section">
                <div className="content">
                    <img src={logo} className="logo" alt="Logo" />
                    <p className="sub-heading">Best fashion collection of all time</p>
                </div>
            </header>
            <Carousel images={carouselImages} />
            <section className="product">
               <div> <h2 className="product-category">Best Selling</h2>
                <button className="pre-btn" onClick={() => scrollContainer('left')}>
                    <img src={arrowImage} alt="Previous" />
                </button>
                <div className="product-container">
                    {bestSellingProducts.map(product => (
                        <ProductCard key={product._id} product={product} onAddToCart={addToCart} onAddToWishlist={addToWishlist} setNotification={setNotification}  />
                    ))}
                </div>
                <button className="nxt-btn" onClick={() => scrollContainer('right')}>
                    <img src={arrowImage} alt="Next" />
                </button>
                 </div>
            </section>

            <section className="collection-container">
                <a href="/women" className="collection">
                    <img src={womenCollection} alt="Women Collection" />
                    <p className="collection-title">women <br /> apparels</p>
                </a>
                <a href="/men" className="collection">
                    <img src={menCollection} alt="Men Collection" />
                    <p className="collection-title">men <br /> apparels</p>
                </a>
                <a href="/accessories" className="collection">
                    <img src={accessoriesCollection} alt="Accessories Collection" />
                    <p className="collection-title">accessories</p>
                </a>
            </section>
        </div>
    );
};

export default Home;
