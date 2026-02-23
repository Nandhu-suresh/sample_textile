import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="w-[250px] bg-secondary text-white flex flex-col h-full min-h-[calc(100vh-80px)] p-8 box-border font-lato">
            <div className="font-playfair text-3xl mb-12 text-center text-accent tracking-widest uppercase">BOUTIQUE</div>
            <nav className="flex flex-col gap-4">
                {['/admin', '/admin/add-product', '/admin/products', '/admin/orders', '/admin/reviews'].map((path) => {
                    const labels = {
                        '/admin': 'Overview',
                        '/admin/add-product': 'Add Products',
                        '/admin/products': 'Display Products',
                        '/admin/orders': 'Orders & Customers',
                        '/admin/reviews': 'Customer Reviews'
                    };
                    const isActive = location.pathname === path;

                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`relative p-4 rounded-lg transition-all duration-300 group overflow-hidden flex items-center ${isActive ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className={`relative z-10 font-bold transition-all duration-300 ${isActive ? '' : 'group-hover:translate-x-2'}`}>{labels[path]}</span>
                            {/* Active indicator line on the left for extra style */}
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent"></div>}
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto border-t border-white/20 pt-4">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex justify-center items-center font-bold mr-2.5 shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-xs opacity-80">Administrator</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full p-3 bg-transparent border border-white text-white rounded cursor-pointer transition-all duration-300 hover:bg-white hover:text-secondary">
                    Logout
                </button>
                <div className="text-center mt-4">
                    <Link to="/home" className="text-accent no-underline text-sm hover:underline">Go to Shop Website</Link>
                </div>

            </div>
        </div>
    );
};

export default Sidebar;
