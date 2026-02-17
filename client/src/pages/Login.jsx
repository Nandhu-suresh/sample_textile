import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            alert('Login failed: Invalid credentials');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-primary p-4">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-md w-full max-w-[400px] flex flex-col gap-6">
                <h2 className="text-center text-secondary text-3xl mb-2 font-playfair">Login</h2>
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
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-200 rounded text-base font-lato focus:outline-none focus:border-secondary transition-colors"
                    />
                </div>
                <button type="submit" className="p-4 bg-secondary text-white border-0 rounded text-base font-bold cursor-pointer uppercase tracking-wider transition-colors hover:bg-opacity-90 font-lato">Sign In</button>
                <p className="text-center text-sm text-gray-500 font-lato">
                    Don't have an account? <Link to="/register" className="text-secondary font-bold underline cursor-pointer hover:text-accent">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
