import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAdmin } from '../utils/auth';
import Search from '../components/Search';
import './Navbar.css';
import brandLogo from '../img/made4you-b-1.png';
import userIcon from '../img/user-11.png';
import profileIcon from '../img/profile.png';
import wishlistIcon from '../img/wishlist-icon.png';
import ordersIcon from '../img/orders-icon.png';
import logoutIcon from '../img/logout-icon.png';
import cartIcon from '../img/cart13.png';
import dashboardIcon from '../img/dashboard-icon.png';

const Navbar = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDropdown = (event) => {
        setDropdownVisible(!dropdownVisible);
        event.stopPropagation();
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="nav">
                <Link to="/"><img src={brandLogo} className="brand-logo" alt="Logo" /></Link>
                <div className="nav-items">
                <Search /> 
                    <div className="dropdown" id="userDropdown" ref={dropdownRef}>
                        <a href="#" onClick={toggleDropdown}>
                            <img src={userIcon} alt="User" />
                        </a>
                        {dropdownVisible && (
                            <div className="dropdown-menu show" id="dropdownMenu">
                                <ul>
                                    <li><img src={profileIcon} alt="" /><Link to="/profile" className="dropicons">Profile</Link></li>
                                    <li><img src={wishlistIcon} alt="" /><Link to="/wishlist" className="dropicons">Wishlist</Link></li>
                                    <li><img src={ordersIcon} alt="" /><Link to="/orders" className="dropicons">Orders</Link></li>
                                    {isAdmin() && (
                                        <li><img src={dashboardIcon} alt="" /><Link to="/dashboard" className="dropicons">Dashboard</Link></li>
                                    )}
                                    <li><img src={logoutIcon} alt="" onClick={handleLogout} /><a href="#" className="dropicons">Logout</a></li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <Link to="/cart"><img src={cartIcon} alt="Cart" /></Link>
                </div>
            </div>
            <ul className="links-container">
                <li className="link-item"><Link to="/" className="link">Home</Link></li>
                <li className="link-item"><Link to="/men" className="link">Men</Link></li>
                <li className="link-item"><Link to="/women" className="link">Women</Link></li>
                <li className="link-item"><Link to="/kids" className="link">Kids</Link></li>
                <li className="link-item"><Link to="/accessories" className="link">Accessories</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
