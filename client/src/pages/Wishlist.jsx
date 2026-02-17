import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get('http://localhost:5000/api/user/wishlist', {
                    headers: { 'x-auth-token': token }
                });
                setWishlistItems(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchWishlist();
    }, [token]);



    if (!token) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-playfair text-secondary">Please Login to view your Wishlist</h2>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-center text-3xl font-playfair mb-8 text-secondary">My Wishlist</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : wishlistItems.length === 0 ? (
                <p className="text-center text-gray-500">Your wishlist is currently empty.</p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 p-8">
                    {wishlistItems.map(product => (
                        <ProductCard key={product._id} product={product} isWishlisted={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
