import React, { useState, useEffect } from 'react';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartItems);
    }, []);

    const updateQuantity = (id, delta) => {
        const newCart = cart.map(item => {
            if (item._id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item._id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-lato">
            <h1 className="text-center text-4xl font-playfair mb-12 text-secondary">Shopping Cart</h1>
            {cart.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-2xl text-gray-400 mb-8">Your cart is currently empty.</p>
                    <button
                        onClick={() => window.location.href = '/shop'}
                        className="px-8 py-3 bg-secondary text-white rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map(item => (
                            <div key={item._id} className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group">
                                <img
                                    src={item.images[0] ? (item.images[0].startsWith('/') ? `http://localhost:5000${item.images[0]}` : item.images[0]) : 'https://via.placeholder.com/150'}
                                    alt={item.title}
                                    className="w-32 h-32 object-contain mr-0 sm:mr-6 mb-4 sm:mb-0 transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="flex-1 text-center sm:text-left space-y-2">
                                    <h3 className="font-playfair text-xl font-bold text-gray-800">{item.title}</h3>
                                    <p className="font-lato text-secondary text-lg font-semibold">₹{item.price}</p>
                                </div>
                                <div className="flex flex-col items-center gap-4 mt-4 sm:mt-0">
                                    <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                                        <button
                                            onClick={() => updateQuantity(item._id, -1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-secondary hover:bg-white rounded-full transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="mx-4 font-bold text-gray-700 w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, 1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-secondary hover:bg-white rounded-full transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-1"
                                    >
                                        <i className="fas fa-trash-alt"></i> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 sticky top-24">
                            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-800 pt-4 border-t">
                                    <span>Total</span>
                                    <span className="text-secondary">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.href = '/checkout'}
                                className="w-full py-4 bg-secondary text-white rounded-lg text-lg font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-2xl hover:bg-gray-800 transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
