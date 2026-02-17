import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to COD
    const [loading, setLoading] = useState(false);

    // Address State - matching UserProfile fields roughly
    const [address, setAddress] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '', // 'place' in User model?
        postalCode: '', // 'pincode' in User model
        state: '',
        country: ''
    });

    useEffect(() => {
        // Load Cart
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
        const cartTotal = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(cartTotal);

        // Load User Profile for Address Pre-fill
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                // Determine user role or just fetch generic profile if available
                // Adjust endpoint based on what UserProfile.jsx uses or raw user data if stored
                // For now, let's try to fetch from the auth/me endpoint I saw UserProfile using, or fallback to localStorage user
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setAddress({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '', // Might not be in initial social login/basic reg
                        address: user.address || '',
                        city: user.place || '',
                        postalCode: user.pincode || '',
                        state: user.state || '',
                        country: user.country || ''
                    });
                }

                // If we implemented an endpoint to get full profile including address updates:
                // const res = await axios.get('http://localhost:5000/api/auth/me', { headers: { 'x-auth-token': token } });
                // if(res.data) setAddress(...) 
            } catch (err) {
                console.error("Error fetching profile", err);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');

        // Construct Order Payload matching server/models/Order.js
        const orderItems = cart.map(item => ({
            title: item.title,
            quantity: item.quantity,
            image: item.images && item.images.length > 0 ? item.images[0] : '', // Adjust based on Product model
            price: item.price,
            product: item._id
        }));

        const shippingAddress = {
            address: address.address,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country
        };

        try {
            if (paymentMethod === 'online') {
                const res = await loadRazorpay();
                if (!res) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    setLoading(false);
                    return;
                }

                // Create Order on Backend
                const result = await axios.post('http://localhost:5000/api/payment/order', {
                    amount: total
                }, {
                    headers: { 'x-auth-token': token }
                });

                if (!result) {
                    alert('Server error. Are you online?');
                    setLoading(false);
                    return;
                }

                const { amount, id: order_id, currency } = result.data;
                const key = 'rzp_test_f6eGg9xIexcdCg';

                const options = {
                    key: key,
                    amount: amount.toString(),
                    currency: currency,
                    name: 'Boutique Shop',
                    description: 'Test Transaction',
                    order_id: order_id,
                    handler: async function (response) {
                        try {
                            await axios.post('http://localhost:5000/api/orders', {
                                orderItems,
                                shippingAddress,
                                totalPrice: total,
                                paymentMethod: 'online',
                                paymentResult: {
                                    id: response.razorpay_payment_id,
                                    status: 'success',
                                    update_time: new Date().toISOString(),
                                    email_address: address.email
                                },
                                isPaid: true,
                                paidAt: new Date().toISOString()
                            }, {
                                headers: { 'x-auth-token': token }
                            });

                            alert('Payment Successful! Order Placed.');
                            localStorage.removeItem('cart');
                            window.dispatchEvent(new Event('cartUpdated'));
                            navigate('/my-orders');
                        } catch (error) {
                            console.error(error);
                            alert('Order creation failed after payment. Please contact support.');
                        }
                    },
                    prefill: {
                        name: address.name,
                        email: address.email,
                        contact: address.phone
                    },
                    notes: {
                        address: address.address
                    },
                    theme: {
                        color: '#3399cc'
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                setLoading(false);

            } else {
                // COD Flow
                await axios.post('http://localhost:5000/api/orders', {
                    orderItems,
                    shippingAddress,
                    totalPrice: total,
                    paymentMethod // Backend might not save this yet based on schema, but we send it.
                }, {
                    headers: { 'x-auth-token': token }
                });

                alert('Order Placed Successfully!');
                localStorage.removeItem('cart'); // Clear Cart
                window.dispatchEvent(new Event('cartUpdated')); // Update Navbar Badge
                navigate('/my-orders'); // Redirect to Orders
            }
        } catch (err) {
            console.error(err);
            alert('Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return <div className="p-8 text-center"><h2>Your Cart is Empty</h2></div>;
    }

    return (
        <div className="p-8 max-w-[1000px] mx-auto flex gap-8 flex-wrap">
            <div className="flex-1 min-w-[300px]">
                <h2 className="mb-6 border-b-2 border-secondary pb-2 font-playfair text-2xl text-secondary">Shipping Address</h2>
                <form onSubmit={handlePlaceOrder} id="checkout-form">
                    <div className="mb-4">
                        <label className="block mb-2 font-lato">Name</label>
                        <input type="text" name="name" value={address.name} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-lato">Email</label>
                        <input type="email" name="email" value={address.email} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-lato">Phone</label>
                        <input type="text" name="phone" value={address.phone} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-lato">Address</label>
                        <textarea name="address" value={address.address} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded min-h-[80px]"></textarea>
                    </div>
                    <div className="flex gap-4">
                        <div className="mb-4 flex-1">
                            <label className="block mb-2 font-lato">City / Place</label>
                            <input type="text" name="city" value={address.city} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                        <div className="mb-4 flex-1">
                            <label className="block mb-2 font-lato">Postal Code</label>
                            <input type="text" name="postalCode" value={address.postalCode} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="mb-4 flex-1">
                            <label className="block mb-2 font-lato">State</label>
                            <input type="text" name="state" value={address.state} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                        <div className="mb-4 flex-1">
                            <label className="block mb-2 font-lato">Country</label>
                            <input type="text" name="country" value={address.country} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex-[0_0_350px] border border-gray-200 p-6 rounded-lg h-fit">
                <h3 className="mb-4 text-center font-playfair text-xl text-secondary">Order Summary</h3>
                <div className="mb-4 max-h-[200px] overflow-y-auto">
                    {cart.map(item => (
                        <div key={item._id} className="flex justify-between mb-2 text-sm font-lato">
                            <span>{item.title} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-lg font-playfair text-secondary">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>

                <div className="mt-8">
                    <h4 className="mb-2 font-lato font-bold">Payment Method</h4>
                    <div className="mb-2 flex items-center">
                        <input
                            type="radio"
                            id="online"
                            name="payment"
                            value="online"
                            checked={paymentMethod === 'online'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        <label htmlFor="online" className="ml-2 font-lato">Online Payment</label>
                    </div>
                    <div className="mb-4 flex items-center">
                        <input
                            type="radio"
                            id="cod"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-2"
                        />
                        <label htmlFor="cod" className="ml-2 font-lato">Cash on Delivery</label>
                    </div>
                </div>

                <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className={`w-full p-4 text-white border-0 text-base cursor-pointer mt-4 font-lato ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-opacity-90'}`}
                >
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
