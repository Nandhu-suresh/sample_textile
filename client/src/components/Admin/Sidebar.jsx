import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="w-[250px] bg-secondary text-white flex flex-col h-full min-h-[calc(100vh-80px)] p-8 box-border font-lato">
            <div className="font-playfair text-3xl mb-12 text-center text-accent tracking-widest uppercase">BOUTIQUE</div>
            <nav className="flex flex-col gap-4">
                <Link to="/admin" className={`p-4 no-underline rounded transition-all duration-300 ${location.pathname === '/admin' ? 'text-secondary bg-white font-bold' : 'text-white bg-transparent hover:bg-gray-700'}`}>Overview</Link>
                <Link to="/admin/add-product" className={`p-4 no-underline rounded transition-all duration-300 ${location.pathname === '/admin/add-product' ? 'text-secondary bg-white font-bold' : 'text-white bg-transparent hover:bg-gray-700'}`}>Add Products</Link>
                <Link to="/admin/products" className={`p-4 no-underline rounded transition-all duration-300 ${location.pathname === '/admin/products' ? 'text-secondary bg-white font-bold' : 'text-white bg-transparent hover:bg-gray-700'}`}>Display Products</Link>
                <Link to="/admin/orders" className={`p-4 no-underline rounded transition-all duration-300 ${location.pathname === '/admin/orders' ? 'text-secondary bg-white font-bold' : 'text-white bg-transparent hover:bg-gray-700'}`}>Orders & Customers</Link>
            </nav>
            <div className="mt-auto border-t border-white/20 pt-4">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-white text-secondary flex justify-center items-center font-bold mr-2.5">
                        A
                    </div>
                    <div>
                        <div className="font-bold">Admin</div>
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
