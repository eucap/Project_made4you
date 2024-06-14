import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');


    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEmail(data.email);
                setAddress(data.address || '');
            } else {
                console.error('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, []);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/address', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ address })
            });

            if (response.ok) {
                alert('Address updated successfully');
            } else {
                alert('Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-section">
                <label>Email:</label>
                <input type="email" value={email} readOnly />
            </div>
            <div className="profile-section">
                <label>Address:</label>
                <textarea value={address} onChange={handleAddressChange} />
            </div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};
export default Profile;
