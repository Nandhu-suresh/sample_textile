import React, { useState, useEffect } from 'react';
import axios from 'axios';


const UserProfile = () => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Since we don't have a specific /me endpoint, we can decode the token or fetch from localstorage 
        // if we stored the user object on login/register.
        // However, robust apps usually have a /me endpoint.
        // For this task, let's assume we relying on what we stored or create a /me endpoint if needed.
        // Actually, the prompt says "after the registeration this will be shown in the profile".
        // The Login/Register response usually sends the user object.
        // Let's create a Fetch Me endpoint in auth.js or just decode if data is static.
        // But user might update. Let's create a GET /api/auth/me endpoint quickly or use localstorage for now 
        // if simplicity is key. The plan said "Fetch user details".
        // I'll create a simple /me endpoint in auth.js to be safe.
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            // I'll implement this endpoint next
            const res = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Profile...</p>;

    return (
        <div className="max-w-[600px] mx-auto my-16 p-8 border border-gray-100 rounded-lg shadow-md bg-white">
            <h1 className="text-center mb-8 text-secondary font-playfair text-3xl">My Profile</h1>
            <div className="leading-loose font-lato text-text">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                <p><strong>Place:</strong> {user.place || 'N/A'}</p>
                <p><strong>Pincode:</strong> {user.pincode || 'N/A'}</p>
                <p><strong>State:</strong> {user.state || 'N/A'}</p>
                <p><strong>Country:</strong> {user.country || 'N/A'}</p>
            </div>
        </div>
    );
};

export default UserProfile;
