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

    // Scroll Effect
    const [isScrolled, setIsScrolled] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [desktopSearchTerm, setDesktopSearchTerm] = useState('');
    const [mobileSearchTerm, setMobileSearchTerm] = useState('');


    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    // Helper for Nav Links with Hover Animation
    const NavLink = ({ to, children, badge }) => (
        <Link to={to} className="relative group text-gray-800 hover:text-secondary transition-colors font-medium py-2">
            {children}
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-secondary transition-all duration-300 ease-in-out group-hover:w-full"></span>
            {badge > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full px-1.5 text-xs animate-bounce">
                    {badge}
                </span>
            )}
        </Link>
    );

    return (
        <nav className={`fixed w-full z-40 transition-all duration-300 ease-in-out ${isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md py-2'
            : 'bg-white py-4 border-b border-gray-100'
            }`}>
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link to="/home" className="flex items-center gap-2 group">
                    {/* Optional: Add an icon or just text */}
                    <span className={`font-playfair font-bold text-secondary transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
                        BOUTIQUE
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Search Bar */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (desktopSearchTerm.trim()) {
                            navigate(`/shop?search=${encodeURIComponent(desktopSearchTerm.trim())}`);
                        }
                    }} className="relative group">
                        <input
                            type="text"
                            name="search"
                            value={desktopSearchTerm}
                            onChange={(e) => setDesktopSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="pl-4 pr-10 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-40 focus:w-60 transition-all duration-300 ease-in-out text-sm bg-transparent"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>

                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/shop">Shop</NavLink>
                    <NavLink to="/wishlist" badge={wishlistCount}>Wishlist</NavLink>
                    <NavLink to="/cart" badge={cartCount}>Cart</NavLink>

                    {token ? (
                        <div className="relative group">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center gap-2 hover:text-secondary transition-colors focus:outline-none"
                            >
                                <i className="fas fa-user text-lg"></i>
                                <span className="font-medium">{userName}</span>
                                <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Dropdown Menu - Click triggered only */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
                                    <Link to="/profile" onClick={closeDropdown} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-secondary transition-colors">Profile</Link>
                                    <Link to="/my-orders" onClick={closeDropdown} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-secondary transition-colors">My Orders</Link>
                                    {userRole === 'admin' && <Link to="/admin" onClick={closeDropdown} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-secondary transition-colors">Dashboard</Link>}
                                    <button onClick={() => { closeDropdown(); handleLogout(); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="px-6 py-2 bg-secondary text-white rounded-full shadow-md hover:bg-[#fcfaf8] hover:text-secondary transition-colors duration-300">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-2xl text-secondary focus:outline-none"
                >
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} transition-all duration-300`}></i>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-4 space-y-4">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (mobileSearchTerm.trim()) {
                            navigate(`/shop?search=${encodeURIComponent(mobileSearchTerm.trim())}`);
                            setIsMobileMenuOpen(false);
                        }
                    }} className="relative">
                        <input
                            type="text"
                            name="search_mobile"
                            value={mobileSearchTerm}
                            onChange={(e) => setMobileSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>

                    <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium hover:text-secondary">Home</Link>
                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium hover:text-secondary">Shop</Link>
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between text-gray-800 font-medium hover:text-secondary">
                        Wishlist
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{wishlistCount}</span>
                    </Link>
                    <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between text-gray-800 font-medium hover:text-secondary">
                        Cart
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{cartCount}</span>
                    </Link>

                    {token ? (
                        <>
                            <div className="border-t border-gray-100 pt-2 mt-2">
                                <div className="font-bold text-secondary mb-2">My Account</div>
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-gray-600 hover:text-secondary">Profile</Link>
                                <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-gray-600 hover:text-secondary">My Orders</Link>
                                {userRole === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-gray-600 hover:text-secondary">Admin Dashboard</Link>}
                                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1 text-red-500 hover:text-red-600">Logout</button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-2 bg-secondary text-white rounded-lg">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
