import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                const { title, description, price, category, stock } = res.data;
                setFormData({ title, description, price, category, stock });
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert('Error fetching product details');
                navigate('/admin/products');
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            // Send as JSON since we aren't updating image here (simplification)
            // Backend PUT /:id expects req.body
            await axios.put(`http://localhost:5000/api/products/${id}`, formData, config);
            alert('Product Updated Successfully!');
            navigate('/admin/products');
        } catch (err) {
            console.error(err);
            alert('Error updating product. Please try again.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="mb-8 font-playfair text-2xl text-secondary">Edit Product</h2>
            <form onSubmit={handleSubmit} className="flex flex-col max-w-[600px] gap-6 bg-white p-8 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                <input
                    type="text"
                    name="title"
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="p-4 text-base border border-gray-300 rounded outline-none focus:border-secondary transition-colors"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="p-4 text-base border border-gray-300 rounded outline-none focus:border-secondary transition-colors min-h-[100px]"
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="price"
                        placeholder="Price (₹)"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="p-4 text-base border border-gray-300 rounded outline-none focus:border-secondary transition-colors"
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock Quantity"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="p-4 text-base border border-gray-300 rounded outline-none focus:border-secondary transition-colors"
                    />
                </div>
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="p-4 text-base border border-gray-300 rounded outline-none focus:border-secondary transition-colors"
                />

                <button type="submit" className="p-4 bg-secondary text-white border-none text-lg rounded mt-4 cursor-pointer transition-colors hover:bg-opacity-90">
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
