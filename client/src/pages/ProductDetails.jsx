import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`https://sample-textile.onrender.com/api/products/${id}`);
                setProduct(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (token && product) {
            checkWishlistStatus();
        }
    }, [token, product]);

    const checkWishlistStatus = async () => {
        try {
            const res = await axios.get('https://sample-textile.onrender.com/api/user/wishlist', {
                headers: { 'x-auth-token': token }
            });
            const found = res.data.find(item => item._id === product._id);
            if (found) setIsWishlisted(true);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleWishlist = async () => {
        if (!token) {
            alert('Please login to add to wishlist');
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

    const addToCart = () => {
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

    if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>;
    if (!product) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Product not found</p>;

    return (
        <div className="flex p-16 gap-16 justify-center flex-wrap">
            <img
                src={product.images[0] ? (product.images[0].startsWith('/') ? `https://sample-textile.onrender.com${product.images[0]}` : product.images[0]) : 'https://via.placeholder.com/400'}
                alt={product.title}
                className="max-w-[500px] w-full object-cover"
            />
            <div className="max-w-[500px] relative">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl m-0 font-playfair text-secondary">{product.title}</h1>
                    <span
                        className={`text-3xl cursor-pointer ml-4 align-middle ${isWishlisted ? 'text-red-600' : 'text-gray-300'}`}
                        onClick={toggleWishlist}
                    >
                        &#10084;
                    </span>
                </div>
                <p className="text-2xl text-gray-500 mb-4 font-lato">₹{product.price}</p>

                {/* Stock Status */}
                <div className="mb-6">
                    {product.stock > 0 ? (
                        <div>
                            <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-bold mb-2">
                                In Stock
                            </span>
                            {product.stock < 10 && (
                                <p className="text-red-500 text-sm font-bold">
                                    Only {product.stock} left in stock - order soon!
                                </p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">
                                Available Quantity: {product.stock}
                            </p>
                        </div>
                    ) : (
                        <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-bold">
                            Out of Stock
                        </span>
                    )}
                </div>

                <p className="mb-8 leading-relaxed font-lato text-secondary">{product.description}</p>
                <button
                    onClick={addToCart}
                    disabled={product.stock === 0}
                    className={`px-8 py-4 border-none text-xl cursor-pointer transition-all duration-300 font-lato ${product.stock > 0
                        ? 'bg-secondary text-white hover:bg-opacity-90'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
