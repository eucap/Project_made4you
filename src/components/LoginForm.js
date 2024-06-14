import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import './LoginForm.css';

const LoginForm = ({ setAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // LoginForm.js
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            setAuthenticated(true);
            navigate('/');
        } else {
            setError(data.msg || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        setError('An error occurred during login. Please try again.');
    }
    };

return (
    <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="login-button">Login</button>
            {error && <p className="error">{error}</p>}
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
);
};

export default LoginForm;
