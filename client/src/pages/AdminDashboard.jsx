import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Analytics from '../components/Admin/Analytics';
import AddProduct from '../components/Admin/AddProduct';
import ProductList from '../components/Admin/ProductList';
import OrderList from '../components/Admin/OrderList';
import OrderDetails from '../components/Admin/OrderDetails';

const AdminDashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-100 font-lato">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <LinkToHome /> {/* Optional: Link back to main site if needed, or just rely on Sidebar */}
                <Routes>
                    <Route path="/" element={<Analytics />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                </Routes>
            </div>
        </div>
    );
};

// Helper to keep code clean
const LinkToHome = () => (
    <div className="text-right mb-4">
        <a href="/" className="text-gray-500 no-underline text-sm hover:text-gray-700 transition-colors">Back to Shop Site &rarr;</a>
    </div>
);

export default AdminDashboard;

