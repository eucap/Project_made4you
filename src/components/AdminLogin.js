import React, { useState } from 'react';
import './LoginForm.css';  // Reuse the same CSS

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        if (result.token) {
            const tokenPayload = JSON.parse(atob(result.token.split('.')[1]));
            if (tokenPayload.isAdmin) {
                localStorage.setItem('token', result.token);
                setError('');
                window.location.href = '/dashboard';  // Redirect to dashboard after admin login
            } else {
                setError('Access denied. Admins only.');
            }
        } else {
            setError(result.msg);
        }
    };

    return (
        <div className="login-form">
            <h2>Admin Login</h2>
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
        </div>
    );
};

export default AdminLogin;
