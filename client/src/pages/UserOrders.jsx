import React, { useState, useEffect } from 'react';
import axios from 'axios';
const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/orders/myorders', {
                    headers: { 'x-auth-token': token }
                });
                setOrders(res.data);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
        };
        fetchOrders();
    }, [token]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (!orders.length) return (
        <div className="min-h-screen bg-primary py-12 px-4 flex flex-col items-center justify-center font-lato">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <h2 className="text-xl font-playfair font-bold text-secondary mb-2">No Past Orders</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                <a href="/shop" className="bg-secondary text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition shadow-md">Start Shopping</a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8 font-lato">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <a href="/profile" className="mr-4 text-gray-500 hover:text-secondary transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </a>
                    <h1 className="text-3xl font-playfair font-bold text-secondary">My Order History</h1>
                </div>

                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-xs text-uppercase text-gray-500 font-bold tracking-wider">ORDER PLACED</p>
                                    <p className="text-gray-700 font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-uppercase text-gray-500 font-bold tracking-wider">TOTAL</p>
                                    <p className="font-playfair font-bold text-secondary">₹{order.totalPrice}</p>
                                </div>
                                <div className="flex-grow sm:flex-grow-0 text-right">
                                    <p className="text-xs text-uppercase text-gray-500 font-bold tracking-wider mb-1">ORDER # {order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Order Content Preview - assuming we might want to list items here later, for now just details summary */}
                                <div className="flex justify-between items-end">
                                    <div>
                                        {order.expectedDeliveryDate && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                <strong>Expected Delivery: </strong>
                                                <span className="text-green-600 font-bold">
                                                    {new Date(order.expectedDeliveryDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                                </span>
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {order.itemsCount || 'Items'} included in this order.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = `/order/${order._id}`}
                                        className="text-accent hover:text-yellow-600 font-bold text-sm border border-accent hover:bg-accent hover:text-white px-4 py-2 rounded transition-colors duration-300">
                                        View Order Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserOrders;
