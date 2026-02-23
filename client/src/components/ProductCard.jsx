import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product, isWishlisted: propIsWishlisted }) => {
    // If prop is provided (e.g. from Wishlist page), use it. Otherwise default false and fetch.
    const [isWishlisted, setIsWishlisted] = useState(propIsWishlisted !== undefined ? propIsWishlisted : false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Check if item is in wishlist on mount (optimistic check or fetch if needed). 
    // Ideally, we'd pass this down from a parent or context to avoid N+1 requests, 
    // but for now, we'll just manage local toggle state or check against a stored list if available.
    // For simplicity in this step, we'll default to false and let the user interact, 
    // or we could fetch the user's wishlist once in the Shop component. 
    // Let's rely on the user clicking to toggle for now, or fetch individual status if critical.

    // Better approach: Fetch user's wishlist in Shop/Home and pass `isWishlisted` prop.
    // However, to keep it self-contained for this refactor without changing parents yet:

    // Check if item is in wishlist on mount if not provided via prop
    useEffect(() => {
        if (token && propIsWishlisted === undefined) {
            checkWishlistStatus();
        }
    }, [token, propIsWishlisted]);

    const checkWishlistStatus = async () => {
        try {
            const res = await axios.get('https://sample-textile.onrender.com/api/user/wishlist', {
                headers: { 'x-auth-token': token }
            });
            // res.data is array of objects populated. We need to check IDs.
            const found = res.data.find(item => item._id === product._id);
            if (found) setIsWishlisted(true);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            alert('Please login to add to wishlist');
            // Optional: redirect to login here if desired, but alert is often enough for "not logged in" state.
            // However, 401 handling below is for "token invalid/expired".
            return;
        }

        try {
            await axios.post(`https://sample-textile.onrender.com/api/user/wishlist/${product._id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            setIsWishlisted(!isWishlisted);
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                alert('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert('Error updating wishlist');
            }
        }
    };

    const addToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item._id === product._id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));

        if (!token) {
            alert("Please login to proceed with your order.");
            navigate('/login');
            return;
        }

        navigate('/cart');
    };

    return (
        <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative border border-gray-100 flex flex-col h-full">
            <div className="relative overflow-hidden text-center">
                {/* Increased z-index and ensured consistent positioning */}
                <button
                    type="button"
                    className={`absolute top-2 right-2 text-lg cursor-pointer z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform duration-200 hover:scale-110 border-none outline-none ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                    onClick={toggleWishlist}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
                    <span className="sr-only">{isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                </button>

                <Link to={`/product/${product._id}`} className="block overflow-hidden h-48">
                    <img
                        src={product.images[0] ? (product.images[0].startsWith('/') ? `https://sample-textile.onrender.com${product.images[0]}` : product.images[0]) : 'https://via.placeholder.com/300'}
                        alt={product.title}
                        className="w-full h-full object-contain mx-auto transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                </Link>
            </div>

            <div className="p-4 flex flex-col flex-grow text-center">
                <Link to={`/product/${product._id}`} className="block">
                    <h3 className="text-base font-playfair font-bold text-gray-800 mb-1 hover:text-secondary transition-colors line-clamp-1" title={product.title}>
                        {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-lato mb-2 line-clamp-2" title={product.description}>
                        {product.description}
                    </p>
                    <p className="text-secondary font-medium font-lato text-base">₹{product.price}</p>
                </Link>

                <div className="mt-auto pt-3">
                    <button
                        onClick={addToCart}
                        className="w-full py-2 rounded-full border border-secondary text-secondary text-sm font-medium hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-shopping-bag"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
