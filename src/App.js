import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import Accessories from './pages/Accessories';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import Chat from './components/Chat';
import ProductDetails from './components/ProductDetails'; 
import ProductPage from './components/ProductPage';
import Footer from './components/Footer';
import { isAuthenticated, isAdmin } from './utils/auth';
import ProductUploadForm from './components/ProductuploadForm';
import SearchResults from './components/SearchResults';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NavigationProvider } from './context/NavigationContext';
import './App.css';


const App = () => {
    const [products, setProducts] = useState([]);
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const [notification, setNotification] = useState('');
    

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        setNotification('Product added to cart!');
        setTimeout(() => setNotification(''), 2000); 
    };

    const handleAddToWishlist = (product) => {
        setNotification('Product added to wishlist!');
        setTimeout(() => setNotification(''), 2000);
    };

    const handleRemoveFromWishlist = (productId) => {
        setNotification('Product removed from wishlist!');
        setTimeout(() => setNotification(''), 2000); 
    };

    return (
        <Router>
            <CartProvider>
            <WishlistProvider>
            <NavigationProvider>                
                    {authenticated && <Navbar />}
                    {notification && <div className="notification">{notification}</div>}
                    <Routes>
                        <Route path="/login" element={authenticated ? <Navigate to="/" /> : <LoginForm setAuthenticated={setAuthenticated} />} />  
                        <Route path="/signup" element={authenticated ? <Navigate to="/" /> : <SignupForm />} />
                        <Route path="/" element={authenticated ? <Home products={products} setNotification={setNotification} /> : <Navigate to="/login" />} />
                        <Route path="/men" element={authenticated ? <Men products={products.filter(p => p.pageCategory === 'men')} setNotification={setNotification} /> : <Navigate to="/login" />} />
                        <Route path="/women" element={authenticated ? <Women products={products.filter(p => p.pageCategory === 'women')} setNotification={setNotification}/> : <Navigate to="/login" />} />
                        <Route path="/kids" element={authenticated ? <Kids products={products.filter(p => p.pageCategory === 'kids')} setNotification={setNotification}/> : <Navigate to="/login" />} />
                        <Route path="/accessories" element={authenticated ? <Accessories products={products.filter(p => p.pageCategory === 'accessories')} setNotification={setNotification}/> : <Navigate to="/login" />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/product/:productId" element={<ProductDetails products={products} setNotification={setNotification} />} />
                        <Route path="/dashboard" element={authenticated && isAdmin() ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/cart" element={authenticated ? <Cart /> : <Navigate to="/login" />} />
                        <Route path="/wishlist" element={authenticated ? <Wishlist setNotification={setNotification} onRemove={handleRemoveFromWishlist} /> : <Navigate to="/login" />} />
                        <Route path="/checkout" element={authenticated ? <Checkout /> : <Navigate to="/login" />} />
                        <Route path="/order-history" element={authenticated ? <OrderHistory /> : <Navigate to="/login" />} />
                        <Route path="/upload-product" element={authenticated && isAdmin() ? <ProductUploadForm /> : <Navigate to="/login" />} />
                        <Route path="/orders" element={authenticated ? <Orders /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={authenticated ? <Profile /> : <Navigate to="/login" />} />
                        <Route path="/search" element={authenticated ? <SearchResults setNotification={setNotification}  products={products} /> : <Navigate to="/login" />} />
                    </Routes>
                    {authenticated && <Chat />}
                    {authenticated && <Footer />}             
            </NavigationProvider>
            </WishlistProvider>
            </CartProvider>
         </Router>
    );
};

export default App;
