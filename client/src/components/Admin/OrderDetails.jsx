import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deliveryDate, setDeliveryDate] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://sample-textile.onrender.com/api/orders/admin/orders/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                    if (data.expectedDeliveryDate) {
                        setDeliveryDate(data.expectedDeliveryDate.split('T')[0]);
                    }
                } else {
                    console.error('Failed to fetch order');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleProcessOrder = async () => {
        if (!deliveryDate) {
            alert('Please select an expected delivery date.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://sample-textile.onrender.com/api/orders/admin/order/${id}/process`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ expectedDeliveryDate: deliveryDate })
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrder(updatedOrder);
                alert('Order placed successfully');
                navigate('/admin/orders');
            } else {
                alert('Failed to process order');
            }
        } catch (error) {
            console.error('Error processing order:', error);
            alert('Error processing order');
        }
    };

    if (loading) return <div>Loading order details...</div>;
    if (!order) return <div>Order not found.</div>;

    return (
        <div className="p-8 bg-white rounded-lg max-w-[800px] mx-auto shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <h2 className="font-playfair text-2xl mb-6">Order Details #{order._id}</h2>

            <div className="mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold mb-4">Items</h3>
                {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center mb-4 border-b border-gray-50 pb-2">
                        <img
                            src={`https://sample-textile.onrender.com${item.image}`}
                            alt={item.title}
                            className="w-[60px] h-[60px] object-cover mr-4 rounded"
                        />
                        <div className="flex-1">
                            <div className="font-bold">{item.title}</div>
                            <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                        </div>
                        <div className="font-bold">₹{item.price * item.quantity}</div>
                    </div>
                ))}
                <div className="text-right font-bold text-lg mt-4">
                    Total Price: ₹{order.totalPrice}
                </div>
            </div>

            <div className="mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold mb-4">Customer Details</h3>
                <p><strong>Name:</strong> {order.user ? order.user.name : 'Unknown'}</p>
                <p><strong>Email:</strong> {order.user ? order.user.email : 'Unknown'}</p>
                <p><strong>Address:</strong> {order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` : 'No address provided'}</p>
            </div>

            <div className="mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold mb-4">Order Status</h3>
                <p><strong>Current Status:</strong> <span className="text-accent font-bold">{order.status}</span></p>

                <div className="mt-4">
                    <label className="block mb-2 font-bold">Expected Delivery Date:</label>
                    <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="p-2 rounded border border-gray-300 w-full max-w-[300px]"
                    />
                </div>
            </div>

            <div className="overflow-hidden">
                <button
                    onClick={handleProcessOrder}
                    className="px-6 py-3 bg-accent text-white border-none rounded cursor-pointer text-base font-bold float-right mt-4 transition-colors hover:bg-opacity-90"
                >
                    Proceed
                </button>
            </div>
        </div>
    );
};

export default OrderDetails;
