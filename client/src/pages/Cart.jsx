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
        <div className="p-8">
            <h1 className="text-center text-3xl font-playfair mb-8">Shopping Cart</h1>
            {cart.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
                <div className="max-w-[800px] mx-auto">
                    {cart.map(item => (
                        <div key={item._id} className="flex justify-between items-center border-b border-gray-200 py-4">
                            <div className="flex items-center">
                                <img
                                    src={item.images[0] ? (item.images[0].startsWith('/') ? `http://localhost:5000${item.images[0]}` : item.images[0]) : 'https://via.placeholder.com/100'}
                                    alt={item.title}
                                    className="w-20 h-20 object-cover mr-4"
                                />
                                <div>
                                    <h3 className="font-playfair text-lg text-secondary">{item.title}</h3>
                                    <p className="font-lato text-gray-500">₹{item.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => updateQuantity(item._id, -1)} className="px-2 py-1 border border-gray-300 rounded">-</button>
                                <span className="mx-2">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, 1)} className="px-2 py-1 border border-gray-300 rounded">+</button>
                                <button onClick={() => removeItem(item._id)} className="ml-4 text-red-600 hover:text-red-800">Remove</button>
                            </div>
                        </div>
                    ))}
                    <div className="text-right mt-8">
                        <h2 className="text-2xl font-playfair mb-4">Total: ₹{total.toFixed(2)}</h2>
                        <button
                            onClick={() => window.location.href = '/checkout'}
                            className="px-8 py-4 bg-secondary text-white border-0 text-base cursor-pointer hover:bg-opacity-90 font-lato"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
