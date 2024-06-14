import React, { useState, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            if (!token) {
                alert('You must be logged in to place an order.');
                navigate('/login');
                return;
            }

            // Log the cartItems to ensure quantity is included
            console.log('Cart Items:', cartItems);
            // Ensure each item in cartItems includes a price
            const itemsWithPrices = cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity,
                price: item.price // Include price in each item
            }));

            console.log('Order payload:', { items: itemsWithPrices, name, email, phone, address, paymentMethod });

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token, // Use the token from local storage
                },
                body: JSON.stringify({ items: itemsWithPrices, name, email, phone, address, paymentMethod }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Order placed successfully!');
                clearCart(); // Clear the cart
                navigate('/order-history');
            } else {
                console.error('Failed to place order:', data);
                alert(`Failed to place order: ${data.msg || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing the order. Please try again.');
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <div className="checkout-section">
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            </div>
            <div className="checkout-section">
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>
            <div className="checkout-section">
                <label htmlFor="phone">Phone Number</label>
                <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                />
            </div>
            <div className="checkout-section">
                <label htmlFor="address">Address</label>
                <textarea 
                    id="address" 
                    name="address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                />
            </div>
            <div className="checkout-section">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select 
                    id="paymentMethod" 
                    name="paymentMethod" 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    required
                >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                </select>
            </div>
            <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>
        </div>
    );
};

export default Checkout;
