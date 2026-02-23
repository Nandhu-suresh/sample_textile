import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);
            if (imageFile) {
                data.append('image', imageFile);
            }

            const config = {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            };

            await axios.post('https://sample-textile.onrender.com/api/products', data, config);
            setFormData({ title: '', description: '', price: '', category: '', stock: '' });
            setImageFile(null);
            alert('Product Added Successfully!');
            // Use window.location as valid navigate might need hook context verification, 
            // but we have navigate from context if we used it. 
            // Wait, AddProduct structure (Step 338) doesn't use useNavigate!
            // I need to add it or use window.location. window.location is safer given I can't see imports change easily here without larger repl.
            // Actually, I can check specific lines.
            window.location.href = '/admin/products';
        } catch (err) {
            console.error(err);
            alert('Error adding product. Please try again.');
        }
    };

    return (
        <div>
            <h2 className="mb-8 font-playfair text-2xl text-secondary">Add New Product</h2>
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

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600">Product Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="p-4 text-base border border-gray-300 rounded outline-none focus:border-secondary transition-colors"
                    />
                </div>

                <button type="submit" className="p-4 bg-secondary text-white border-none text-lg rounded mt-4 cursor-pointer transition-colors hover:bg-opacity-90">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
