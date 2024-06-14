import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateItemQuantity } = useContext(CartContext);
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    }, [cartItems]);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleQuantityChange = (itemId, quantity) => {
        if (quantity < 1) {
            removeFromCart(itemId);
        } else {
            updateItemQuantity(itemId, quantity);
        }
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>
                                    <img src={`http://localhost:5000/${item.images[0]}`} alt={item.name} className="cart-image" />
                                </td>
                                <td>₹{item.price}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                        min="1"
                                    />
                                </td>
                                <td>₹{item.price * item.quantity}</td>
                                <td>
                                    <button onClick={() => removeFromCart(item._id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <p>Total Price: ₹{totalPrice}</p>
                    <button onClick={handleCheckout} className="checkout-btn">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
