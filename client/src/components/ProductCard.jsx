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
            const res = await axios.get('http://localhost:5000/api/user/wishlist', {
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
        e.preventDefault(); // Prevent Link navigation
        if (!token) {
            alert('Please login to add to wishlist');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/user/wishlist/${product._id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            setIsWishlisted(!isWishlisted);
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (err) {
            console.error(err);
            alert('Error updating wishlist');
        }
    };

    const addToCart = (e) => {
        e.preventDefault(); // Prevent Link navigation if button is inside Link (though it's outside here, good practice or just in case)
        e.stopPropagation(); // Prevent bubbling to Link

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

        alert('Added to cart!');
    };

    return (
        <div className="border border-gray-200 p-4 text-center transition-transform duration-200 relative hover:shadow-lg">
            <span
                className={`absolute top-2 right-2 text-2xl cursor-pointer z-10 bg-white/70 rounded-full p-1 leading-none ${isWishlisted ? 'text-red-600' : 'text-gray-300'}`}
                onClick={toggleWishlist}
            >
                &#10084; {/* Heart Entity */}
            </span>
            <Link to={`/product/${product._id}`}>
                <img
                    src={product.images[0] ? (product.images[0].startsWith('/') ? `http://localhost:5000${product.images[0]}` : product.images[0]) : 'https://via.placeholder.com/300'}
                    alt={product.title}
                    className="w-full h-[300px] object-cover mb-4"
                />
                <h3 className="text-lg my-2 font-playfair text-secondary">{product.title}</h3>
                <p className="text-gray-500 italic font-lato">₹{product.price}</p>
            </Link>
            <button
                onClick={addToCart}
                className="mt-4 px-4 py-2 bg-transparent border border-secondary text-secondary cursor-pointer hover:bg-secondary hover:text-white transition-colors font-lato"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
