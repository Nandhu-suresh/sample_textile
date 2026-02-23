import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCamera } from 'react-icons/fi';


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
            const res = await axios.get('https://sample-textile.onrender.com/api/auth/me', {
                headers: { 'x-auth-token': token }
            });
            setUser(res.data);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await axios.post('https://sample-textile.onrender.com/api/user/upload-avatar', formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser({ ...user, avatar: res.data.avatar });
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (!user) return (
        <div className="flex justify-center items-center h-screen bg-primary">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8 font-lato">
            <div className="max-w-[95%] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Sidebar / User Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-accent transform transition duration-500 hover:scale-[1.02]">
                            <div className="relative w-32 h-32 mx-auto mb-4 group">
                                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400 overflow-hidden border-2 border-gray-100 shadow-inner">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                                    )}
                                </div>
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition shadow-md">
                                    <FiCamera className="w-5 h-5" />
                                </label>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <h2 className="text-3xl font-playfair font-bold text-secondary mb-2">{user.name}</h2>
                            <p className="text-gray-500 text-base mb-6">{user.email}</p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.href = '/edit-profile'}
                                    className="w-full bg-secondary text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 shadow-md text-base font-medium tracking-wide">
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-white text-red-500 border border-red-200 py-3 px-6 rounded-lg hover:bg-red-50 transition duration-300 text-base font-medium"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Info */}
                    <div className="md:col-span-3 space-y-8">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h3 className="text-2xl font-playfair font-bold text-secondary">Personal Information</h3>
                                <button
                                    onClick={() => window.location.href = '/edit-profile'}
                                    className="text-accent hover:text-yellow-600 text-base font-semibold transition"
                                >
                                    Edit Details
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                    <p className="text-gray-800 text-lg font-medium border-b border-transparent group-hover:border-gray-200 transition-colors py-1">{user.name}</p>
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <p className="text-gray-800 text-lg font-medium border-b border-transparent group-hover:border-gray-200 transition-colors py-1">{user.email}</p>
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <p className="text-gray-800 text-lg font-medium border-b border-transparent group-hover:border-gray-200 transition-colors py-1">{user.phone || 'Not Provided'}</p>
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                                    <p className="text-gray-800 text-lg font-medium border-b border-transparent group-hover:border-gray-200 transition-colors py-1">
                                        {[user.place, user.state, user.country].filter(Boolean).join(', ') || 'Not Provided'}
                                    </p>
                                </div>
                                <div className="col-span-1 sm:col-span-2 group">
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Address</label>
                                    <p className="text-gray-800 text-lg font-medium border-b border-transparent group-hover:border-gray-200 transition-colors py-1">
                                        {user.address || 'No address saved.'} {user.pincode ? `- ${user.pincode}` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
