import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/variables.css';


// Basic responsive navbar using state for mobile menu toggle could be added, 
// for now relying on CSS media queries to stack elements.

const Navbar = () => {
    // Retrieve user from local storage token (simple check)
    // In a real app, use Context API
    const token = localStorage.getItem('token');
    // Retrieve user from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    let userRole = user ? user.role : null;
    if (!userRole && token) {
        try {
            userRole = JSON.parse(atob(token.split('.')[1])).role;
        } catch (e) {
            console.error("Error decoding token for role", e);
        }
    }

    const userName = user ? user.name : 'User';

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const [wishlistCount, setWishlistCount] = useState(0);

    const updateWishlistCount = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setWishlistCount(0);
            return;
        }
        try {
            // We can create a lightweight endpoint for count if needed, but for now fetching all is okay
            // Or just fetch ids.
            const response = await fetch('http://localhost:5000/api/user/wishlist', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setWishlistCount(data.length);
            }
        } catch (error) {
            console.error('Error fetching wishlist count:', error);
        }
    };

    React.useEffect(() => {
        updateWishlistCount();

        const handleWishlistUpdate = () => {
            updateWishlistCount();
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);

        return () => {
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
        };
    }, []);

    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Count total items (sum of quantities) or just number of unique items?
        // User said "how many products added", usually implies unique items or total quantity.
        // Let's stick to unique items count for consistency with Wishlist (data.length) unless specified otherwise.
        // If user wants total quantity, we'd reduce. Let's do unique items for now as it's "same like wishlist".
        setCartCount(cart.length);
    };

    React.useEffect(() => {
        updateCartCount();

        const handleCartUpdate = () => {
            updateCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('storage', handleCartUpdate); // For cross-tab updates

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, []);

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee'
    };

    const logoStyle = {
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'var(--secondary-color)',
        textDecoration: 'none'
    };

    const linkContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className="flex flex-col md:flex-row justify-between items-center px-4 py-4 md:px-8 md:py-4 bg-white border-b border-gray-200">
            <div>
                <Link to="/home" className="font-playfair text-2xl font-bold text-secondary no-underline">BOUTIQUE</Link>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 mt-4 md:mt-0 w-full md:w-auto">
                {/* Search Bar - Animated & Centered */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const searchTerm = e.target.elements.search.value.trim();
                    if (searchTerm) {
                        navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
                    } else {
                        navigate('/shop');
                    }
                }} className="relative flex items-center group mb-2 md:mb-0">
                    <div className="relative">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search..."
                            className="pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-40 sm:w-64 focus:w-80 transition-all duration-300 ease-in-out shadow-sm text-sm"
                        />
                        <button type="submit" className="absolute right-0 top-0 mt-0.5 mr-0.5 h-full w-10 flex items-center justify-center text-gray-500 hover:text-secondary bg-transparent transition-colors rounded-full">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </form>

                <Link to="/home" className="hover:text-accent transition-colors py-2 md:py-0">Home</Link>
                <Link to="/shop" className="hover:text-accent transition-colors py-2 md:py-0">Shop</Link>

                {/* Wishlist Link with Badge */}
                <Link to="/wishlist" className="relative hover:text-accent transition-colors">
                    Wishlist
                    {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full px-1.5 text-xs">
                            {wishlistCount}
                        </span>
                    )}
                </Link>
                {/* Cart Link with Badge */}
                <Link to="/cart" className="relative hover:text-accent transition-colors">
                    Cart
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full px-1.5 text-xs">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {token ? (
                    <div className="relative inline-block ml-4 group">
                        <div onClick={toggleDropdown} className="cursor-pointer flex items-center hover:text-accent transition-colors">
                            <i className="fas fa-user mr-2"></i>
                            {userName}
                            <span className="ml-1">▼</span>
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-10 py-2">
                                <Link to="/profile" onClick={closeDropdown} className="block px-4 py-2 text-black hover:bg-gray-100">Profile</Link>
                                <Link to="/my-orders" onClick={closeDropdown} className="block px-4 py-2 text-black hover:bg-gray-100">My Orders</Link>
                                {userRole === 'admin' && <Link to="/admin" onClick={closeDropdown} className="block px-4 py-2 text-black hover:bg-gray-100">Dashboard</Link>}
                                <a onClick={() => { closeDropdown(); handleLogout(); }} className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">Logout</a>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="hover:text-accent transition-colors">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
