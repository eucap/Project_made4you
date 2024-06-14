import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="carousel">
            <button className="carousel-button prev-button" onClick={handlePrevClick}>&#8249;</button>
            <img src={images[currentIndex]} alt="Carousel" className="carousel-image" />
            <button className="carousel-button next-button" onClick={handleNextClick}>&#8250;</button>
        </div>
    );
};

export default Carousel;
