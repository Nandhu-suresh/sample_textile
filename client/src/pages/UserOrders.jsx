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
            }
        };
        fetchOrders();
    }, [token]);

    if (!orders.length) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No orders found.</p>;

    return (
        <div className="p-8 max-w-[800px] mx-auto">
            <h1 className="text-center mb-8 text-3xl font-playfair text-secondary">My Orders</h1>
            {orders.map(order => (
                <div key={order._id} className="border border-gray-300 p-4 mb-4 rounded font-lato">
                    <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                        <span className="font-bold">Order ID: {order._id}</span>
                        <span className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* Display Order Items logic here if details needed, for now just summary */}
                    <div className="mt-2">
                        <p className="mb-1"><strong>Total:</strong> ₹{order.totalPrice}</p>
                        <p className="mb-1">
                            <strong>Status: </strong>
                            <span className={`font-bold ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Shipped' ? 'text-blue-600' : 'text-orange-500'}`}>
                                {order.status}
                            </span>
                        </p>
                        {order.expectedDeliveryDate && (
                            <p className="mb-1">
                                <strong>Expected Delivery: </strong>
                                {new Date(order.expectedDeliveryDate).toLocaleDateString(undefined, {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserOrders;
