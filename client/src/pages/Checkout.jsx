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
        console.log('Token from localStorage:', token); // Debugging

        if (!token) {
            alert('Your session has expired or you are not logged in. Please login again.');
            navigate('/login');
            return;
        }

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
            if (err.response && err.response.status === 401) {
                alert('Session expired. Please login again.');
                localStorage.removeItem('token'); // Clear invalid token
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : 'Failed to place order. Please try again.';
            alert(errorMessage);
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return <div className="p-8 text-center"><h2>Your Cart is Empty</h2></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-lato relative">
            <button
                onClick={() => navigate('/cart')}
                className="absolute top-2 right-6 lg:top-4 lg:right-12 text-gray-500 hover:text-red-500 transition-colors duration-300 bg-white rounded-full p-2 shadow-sm hover:shadow-md w-10 h-10 flex items-center justify-center z-10"
                title="Return to Cart"
            >
                <i className="fas fa-times text-xl"></i>
            </button>
            <h1 className="text-center text-4xl font-playfair mb-12 text-secondary">Checkout</h1>
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Shipping Address Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-3">
                            <i className="fas fa-map-marker-alt text-secondary"></i> Shipping Address
                        </h2>
                        <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-lato text-gray-700 font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={address.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-lato text-gray-700 font-medium">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={address.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 font-lato text-gray-700 font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={address.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-lato text-gray-700 font-medium">Address</label>
                                <textarea
                                    name="address"
                                    value={address.address}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors min-h-[100px]"
                                    placeholder="Street address, apartment, suite, etc."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-lato text-gray-700 font-medium">City / Place</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={address.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-lato text-gray-700 font-medium">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={address.postalCode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 font-lato text-gray-700 font-medium">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={address.state}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-lato text-gray-700 font-medium">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={address.country}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Order Summary & Payment Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 sticky top-24">
                        <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h3>

                        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between items-center text-sm font-lato">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                {item.quantity}
                                            </span>
                                            <img
                                                src={item.images[0] ? (item.images[0].startsWith('/') ? `http://localhost:5000${item.images[0]}` : item.images[0]) : 'https://via.placeholder.com/50'}
                                                alt={item.title}
                                                className="w-12 h-12 object-cover rounded border border-gray-200"
                                            />
                                        </div>
                                        <span className="text-gray-700 line-clamp-1 max-w-[120px]" title={item.title}>{item.title}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-800 pt-4 border-t border-gray-100">
                                <span>Total</span>
                                <span className="text-secondary">₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="mb-3 font-lato font-bold text-gray-800">Payment Method</h4>
                            <div className="space-y-3">
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-secondary bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        id="online"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-3 text-secondary focus:ring-secondary"
                                    />
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-800">Online Payment</span>
                                        <p className="text-xs text-gray-500">Fast and secure</p>
                                    </div>
                                    <i className="fas fa-credit-card text-gray-400"></i>
                                </label>
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-secondary bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        id="cod"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-3 text-secondary focus:ring-secondary"
                                    />
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-800">Cash on Delivery</span>
                                        <p className="text-xs text-gray-500">Pay when you receive</p>
                                    </div>
                                    <i className="fas fa-money-bill-wave text-gray-400"></i>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={loading}
                            className={`w-full py-4 text-white rounded-lg text-lg font-bold tracking-wide transition-all duration-300 shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:shadow-2xl hover:bg-gray-800 transform hover:-translate-y-1 hover:scale-105 active:scale-95'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <i className="fas fa-spinner fa-spin"></i> Processing...
                                </span>
                            ) : (
                                'Place Order'
                            )}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                <i className="fas fa-lock"></i> Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
