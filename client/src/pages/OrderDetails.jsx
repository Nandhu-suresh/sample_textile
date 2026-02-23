import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`https://sample-textile.onrender.com/api/orders/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setOrder(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, token]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-primary">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent"></div>
        </div>
    );

    if (!order) return <p className="text-center mt-8 text-lg font-lato">Order not found.</p>;

    // Status Tracking Logic
    const statuses = ['Processing', 'Shipped', 'Out For Delivery', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(order.status) === -1 ? 0 : statuses.indexOf(order.status);
    const progressWidth = (currentStatusIndex / (statuses.length - 1)) * 100;

    return (
        <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8 font-lato">
            <div className="max-w-5xl mx-auto">
                {/* Header / Back Button */}
                <div className="flex items-center mb-8">
                    <Link to="/my-orders" className="mr-4 text-gray-500 hover:text-secondary transition transform hover:-translate-x-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-playfair font-bold text-secondary">Order Details</h1>
                        <p className="text-gray-500 text-sm">Order ID: <span className="uppercase font-mono">{order._id.substring(0, 10)}...</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Tracking & Items */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Shipment Tracking */}
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-xl font-playfair font-bold text-secondary mb-6">Shipment Status</h2>

                            <div className="relative mb-8">
                                <div className="h-2 bg-gray-200 rounded-full w-full absolute top-1/2 transform -translate-y-1/2"></div>
                                <div
                                    className="h-2 bg-green-500 rounded-full absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out"
                                    style={{ width: `${progressWidth}%` }}
                                ></div>

                                <div className="flex justify-between relative">
                                    {statuses.map((status, index) => {
                                        const isCompleted = index <= currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;

                                        return (
                                            <div key={status} className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 bg-white ${isCompleted ? 'border-green-500 text-green-500' : 'border-gray-200 text-gray-300'} ${isCurrent ? 'scale-125 shadow-md' : ''}`}>
                                                    {isCompleted ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                    ) : (
                                                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                    )}
                                                </div>
                                                <span className={`text-xs mt-3 font-bold uppercase tracking-wide ${isCurrent ? 'text-secondary' : 'text-gray-400'}`}>{status}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {order.expectedDeliveryDate && (
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center">
                                    <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <p className="text-blue-800 text-sm font-medium">
                                        Expected Delivery: <span className="font-bold">{new Date(order.expectedDeliveryDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-xl font-playfair font-bold text-secondary mb-6">Items in Order</h2>
                            <div className="space-y-6">
                                {order.orderItems && order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            {/* Fallback image if product image missing */}
                                            {(() => {
                                                const imgSource = item.image || (item.product && item.product.images && item.product.images[0]);
                                                const getImageUrl = (src) => {
                                                    if (!src) return null;
                                                    if (src.startsWith('http')) return src;
                                                    // Remove leading slash if present to avoid double slashes if we append to base with slash
                                                    const cleanSrc = src.startsWith('/') ? src.substring(1) : src;
                                                    // If it looks like an internal path (e.g. uploads/), prepend server URL
                                                    return `https://sample-textile.onrender.com/${cleanSrc}`;
                                                };
                                                const finalSrc = getImageUrl(imgSource);

                                                return finalSrc ? (
                                                    <img src={finalSrc} alt={item.product ? item.product.title : 'Product Image'} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-lg">{item.product ? item.product.title : 'Product Unavailable'}</h3>
                                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-playfair font-bold text-secondary text-lg">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary & Info */}
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-playfair font-bold text-secondary mb-4 border-b border-gray-100 pb-2">Order Summary</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{order.totalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-secondary">
                                    <span>Total</span>
                                    <span>₹{order.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-playfair font-bold text-secondary mb-4 border-b border-gray-100 pb-2">Shipping Details</h3>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p><span className="font-bold text-gray-800">User:</span> {order.user ? order.user.name : 'N/A'}</p>
                                <p>
                                    <span className="font-bold text-gray-800">Address:</span><br />
                                    {order.shippingAddress ? (
                                        typeof order.shippingAddress === 'object' ? (
                                            <>
                                                {order.shippingAddress.address}<br />
                                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                                {order.shippingAddress.country}
                                            </>
                                        ) : order.shippingAddress
                                    ) : (
                                        order.user?.address || 'N/A'
                                    )}
                                </p>
                                <p><span className="font-bold text-gray-800">Email:</span> {order.user ? order.user.email : 'N/A'}</p>
                            </div>
                        </div>

                        {/* Need Help? */}
                        <div className="bg-accent/10 rounded-xl p-6 border border-accent/20 text-center">
                            <h3 className="text-lg font-playfair font-bold text-accent mb-2">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-4">Have issues with this order? Contact our support.</p>
                            <button className="bg-white text-accent border border-accent hover:bg-accent hover:text-white transition py-2 px-6 rounded-lg font-bold text-sm shadow-sm">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
