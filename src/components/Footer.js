// src/components/Footer.js
import React from 'react';
import './Footer.css';
import logo from '../img/made4you-ww.png';

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                <img src={logo} className="logo" alt="Made4You Logo" />
                
            </div>
            <p className="footer-title">about company</p>
            <p className="info">At Made4You, we believe in providing our customers with a unique and personalized shopping experience. From the latest fashion trends to timeless classics, we offer a wide range of products to suit every style and preference. Our mission is to deliver high-quality products with exceptional service, ensuring customer satisfaction at every step.</p>
            <p className="info">support emails - support@made4you.com, customersupport@made4you.com</p>
            <p className="info">telephone - 180 00 00 001, 180 00 00 002</p>
            <div className="footer-social-container">
                <div>
                    <a href="#" className="social-link">terms & services</a>
                    <a href="#" className="social-link">privacy page</a>
                </div>
                <div>
                    <a href="#" className="social-link">instagram</a>
                    <a href="#" className="social-link">facebook</a>
                    <a href="#" className="social-link">twitter</a>
                </div>
            </div>
            <p className="footer-credit">© 2024 Made4You. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
