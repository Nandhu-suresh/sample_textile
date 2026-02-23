import React from 'react';

import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Footer from './components/Footer';
import Wishlist from './pages/Wishlist';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import UserOrders from './pages/UserOrders';
import OrderDetails from './pages/OrderDetails';

import Checkout from './pages/Checkout';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';



// Layout component to conditionally render Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">
        {children}
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

// Basic redirection wrapper
const Root = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
    // If not admin, we just render Home (public access allowed)
  }, [user, navigate]);

  if (user && user.role === 'admin') return null; // Redirecting

  return <Home />;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/my-orders" element={<UserOrders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
