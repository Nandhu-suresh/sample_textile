import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaBoxOpen } from 'react-icons/fa';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            await axios.delete(`http://localhost:5000/api/products/${id}`, config);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-fadeIn pb-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="font-playfair text-3xl text-secondary font-bold">Product Inventory</h2>
                    <p className="text-gray-500 mt-1">{products.length} Items Available</p>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                    <FaBoxOpen className="text-6xl text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No products found</h3>
                    <p className="text-gray-400 mb-6">Start by adding some items to your inventory.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map(product => (
                        <div key={product._id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                            <div className="relative h-64 overflow-hidden bg-gray-100">
                                <img
                                    src={product.images && product.images[0] ? (product.images[0].startsWith('/') ? `http://localhost:5000${product.images[0]}` : product.images[0]) : 'https://via.placeholder.com/200'}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1" title={product.title}>{product.title}</h4>
                                <div className="flex justify-between items-end mt-auto">
                                    <span className="font-playfair text-2xl font-bold text-secondary">₹{product.price}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <Link
                                            to={`/admin/edit-product/${product._id}`}
                                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-accent hover:text-white transition-colors"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                {/* Mobile fallback for buttons (always visible on touch devices if hover not supported well, but generally hover works or first tap) */}
                                <div className="flex sm:hidden gap-2 mt-4 justify-end">
                                    <Link
                                        to={`/admin/edit-product/${product._id}`}
                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {/* Stock Indicator Strip */}
                            <div className={`h-1.5 w-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
