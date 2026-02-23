import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Analytics from '../components/Admin/Analytics';
import AddProduct from '../components/Admin/AddProduct';
import EditProduct from '../components/Admin/EditProduct';
import ProductList from '../components/Admin/ProductList';
import OrderList from '../components/Admin/OrderList';
import OrderDetails from '../components/Admin/OrderDetails';
import AdminReviews from '../components/Admin/AdminReviews';

const AdminDashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-100 font-lato">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">

                <Routes>
                    <Route path="/" element={<Analytics />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/edit-product/:id" element={<EditProduct />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/reviews" element={<AdminReviews />} />
                </Routes>
            </div>
        </div>
    );
};

// Helper to keep code clean


export default AdminDashboard;

