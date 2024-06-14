// utils/auth.js
export const login = (token) => {
    localStorage.setItem('token', token);
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Ensure redirection to login page
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return !!decoded.user;
    } catch (err) {
        return false;
    }
};

export const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.user.isAdmin;
    } catch (err) {
        return false;
    }
};

export const getToken = () => {
    return localStorage.getItem('token');
};
