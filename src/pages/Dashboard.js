import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchAllOrders();
        fetchUsers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
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

    const fetchAllOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                setOrders([]);
                console.error('Failed to fetch all orders: Response is not an array');
            }
        } catch (error) {
            console.error('Error fetching all orders:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            if (response.ok) {
                setProducts(products.filter(product => product._id !== id));
            } else {
                console.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleDeleteOrder = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            if (response.ok) {
                setOrders(orders.filter(order => order._id !== id));
            } else {
                console.error('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            if (response.ok) {
                setUsers(users.filter(user => user._id !== id));
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <button onClick={() => navigate('/upload-product')} className="upload-btn">Upload Product</button>
            <section className="dashboard-section">
                <h2>Products</h2>
                <ul className="dashboard-list">
                    {products.map(product => (
                        <li key={product._id} className="dashboard-list-item">
                            {product.name} - ₹{product.price}
                            <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className="dashboard-section">
                <h2>Orders</h2>
                <ul className="dashboard-list">
                    {orders.map(order => (
                        <li key={order._id} className="dashboard-list-item">
                            Order #{order._id} - ₹{order.totalPrice}
                            <button onClick={() => handleDeleteOrder(order._id)} className="delete-btn">Delete</button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className="dashboard-section">
                <h2>Users</h2>
                <ul className="dashboard-list">
                    {users.map(user => (
                        <li key={user._id} className="dashboard-list-item">
                            {user.email}
                            <button onClick={() => handleDeleteUser(user._id)} className="delete-btn">Delete</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;
