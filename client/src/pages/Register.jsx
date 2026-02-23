import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        place: '',
        pincode: '',
        state: '',
        country: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
        "Lakshadweep", "Puducherry"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await axios.post('https://sample-textile.onrender.com/api/auth/register', formData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert('Registration failed: User may already exist');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-primary p-4">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-md w-full max-w-[400px] flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-center text-secondary text-3xl mb-2 font-playfair">Register</h2>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <textarea
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors resize-y min-h-[80px]"
                    />
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        name="place"
                        placeholder="Place"
                        value={formData.place}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors w-full"
                    />
                    <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors w-full"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors w-full bg-white"
                    >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors w-full"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors"
                    />
                </div>
                <button type="submit" className="p-4 bg-secondary text-white border-0 rounded text-base font-bold cursor-pointer uppercase tracking-wider transition-colors hover:bg-opacity-90 font-lato">Sign Up</button>
                <p className="text-center text-sm text-gray-500 font-lato">
                    Already have an account? <Link to="/login" className="text-secondary font-bold underline cursor-pointer hover:text-accent">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
