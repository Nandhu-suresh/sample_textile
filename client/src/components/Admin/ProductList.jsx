import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div>
            <h2 className="mb-8 font-playfair text-2xl text-secondary">Current Inventory</h2>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
                    {products.map(product => (
                        <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-transform duration-200 flex flex-col">
                            <img
                                src={product.images[0] ? (product.images[0].startsWith('/') ? `http://localhost:5000${product.images[0]}` : product.images[0]) : 'https://via.placeholder.com/200'}
                                alt={product.title}
                                className="w-full h-[200px] object-cover"
                            />
                            <div className="p-4 flex-1 flex flex-col">
                                <h4 className="m-0 mb-2 text-lg font-bold">{product.title}</h4>
                                <p className="text-gray-500 text-sm mb-4 flex-1">{product.category}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">₹{product.price}</span>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-[#e74c3c] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-opacity-90 transition-opacity"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
