import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Determine API URL based on environment or hardcode for now
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-center mt-8 text-3xl font-playfair text-secondary">Shop Collection</h1>
            {searchQuery && (
                <p className="text-center text-gray-500 mt-2">
                    Showing results for "{searchQuery}"
                </p>
            )}
            {loading ? (
                <p className="text-center">Loading products...</p>
            ) : (
                <>
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 p-8">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-500">Item not found</p>
                            <p className="text-gray-400 mt-2">Try searching for a different item.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Shop;
