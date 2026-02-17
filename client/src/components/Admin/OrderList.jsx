import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/orders/admin/orders', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders or invalid format');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Loading orders...</div>;

    return (
        <div>
            <h2 className="mb-8 font-playfair text-2xl text-secondary">Orders & Customers</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-[0_2px_5px_rgba(0,0,0,0.05)] rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="bg-secondary text-white p-4 text-left">Order ID</th>
                            <th className="bg-secondary text-white p-4 text-left">Customer Name</th>
                            <th className="bg-secondary text-white p-4 text-left">Date</th>
                            <th className="bg-secondary text-white p-4 text-left">Total Price</th>
                            <th className="bg-secondary text-white p-4 text-left">Status</th>
                            <th className="bg-secondary text-white p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td className="p-4 border-b border-gray-100">{order._id}</td>
                                <td className="p-4 border-b border-gray-100">{order.user ? order.user.name : 'Unknown'}</td>
                                <td className="p-4 border-b border-gray-100">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 border-b border-gray-100">₹{order.totalPrice}</td>
                                <td className="p-4 border-b border-gray-100">{order.status}</td>
                                <td className="p-4 border-b border-gray-100">
                                    <button
                                        className="px-4 py-2 bg-accent text-white border-none rounded cursor-pointer text-sm font-bold uppercase transition-colors hover:bg-opacity-90"
                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                    >
                                        Proceed
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-4 text-center border-b border-gray-100">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
