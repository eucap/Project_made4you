import React, { useState, useEffect } from 'react';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/orders/user', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                console.log('Fetched Orders:', data);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error.message);
            }
        };

        fetchOrders();
    }, []);

    const getProductImage = (product) => {
        if (product && product.images && product.images.length > 0) {
            const imageUrl = `http://localhost:5000/${product.images[0]}`;
            console.log('Image URL:', imageUrl);
            return imageUrl;
        }
        console.log('No image available for product:', product);
        return 'https://via.placeholder.com/150';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="order-history">
            <h2>Order History</h2>
            {error && <p className="error">{error}</p>}
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order._id} className="order-card">
                            <h3>Order #{order._id}</h3>
                            <p>Total Price: ₹{order.totalPrice}</p>
                            <p>Status: {order.status}</p>
                            <p>Placed on: {formatDate(order.createdAt)}</p>
                            <div className="order-items">
                                {order.items.map(item => (
                                    item && item.productId ? (
                                        <div key={item.productId._id || item._id} className="order-item">
                                            <img
                                                src={getProductImage(item.productId)}
                                                alt={item.productId.name || 'Product'}
                                                className="order-item-image"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                            />
                                            <div className="order-item-details">
                                                <h3>{item.productId.name || 'Unknown Product'}</h3>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Price: ₹{item.productId.price}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={item._id} className="order-item">
                                            <p>Product details not available</p>
                                        </div>
                                    )
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;
