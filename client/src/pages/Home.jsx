import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Carousel from '../components/Carousel';
import sareeModel from '../assets/saree_model.png';
import salwarModel from '../assets/salwar_model.png';
import churidarModel from '../assets/churidhar_model.png';
import ReviewSection from '../components/ReviewSection';
import SilkWave from '../components/SilkWave';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('https://sample-textile.onrender.com/api/products');
                // Fetch only top 4 products for the featured section
                setProducts(res.data.slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch featured products", err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const slides = [
        {
            src: sareeModel,
            alt: "Elegant Saree",
            caption: "\"Grace in every pleat, elegance in every drape.\""
        },
        {
            src: salwarModel,
            alt: "Stylish Salwar",
            caption: "\"Comfort tailored with timeless beauty.\""
        },
        {
            src: churidarModel,
            alt: "Traditional Churidar",
            caption: "\"Tradition woven with modern sophistication.\""
        }
    ];

    return (
        <div className="bg-[#fcfaf8]">
            {/* Hero Carousel */}
            <Carousel images={slides} />

            {/* Call to Action Section with SilkWave */}
            <div className="relative py-24 px-8 text-center bg-primary overflow-hidden shadow-inner">
                <SilkWave />
                <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                    <h1 className="text-5xl md:text-6xl font-playfair mb-6 text-secondary tracking-wide drop-shadow-sm">Elegance Redefined</h1>
                    <div className="w-24 h-1 bg-secondary mx-auto mb-8 rounded-full opacity-70"></div>
                    <p className="text-xl md:text-2xl mb-12 text-text font-lato font-light leading-relaxed">Discover a world where traditional craftsmanship meets modern sophistication. Explore our curated collection of premium textiles.</p>
                    <button
                        className="px-10 py-5 bg-secondary text-white border-0 text-sm md:text-base tracking-[0.2em] uppercase font-bold shadow-lg hover:shadow-2xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 rounded-sm"
                        onClick={() => navigate('/shop')}
                    >
                        Explore Collection
                    </button>
                </div>
            </div>

            {/* Featured Products Section Placeholder */}
            <div className="py-24 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-secondary font-lato tracking-widest uppercase text-sm font-semibold mb-2 block">Our Picks</span>
                        <h2 className="text-4xl md:text-5xl font-playfair text-gray-800">Featured Products</h2>
                        <div className="w-16 h-0.5 bg-secondary mx-auto mt-6 opacity-60"></div>
                    </div>

                    {/* Featured Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-60">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex flex-col items-center animate-pulse">
                                    <div className="w-full h-[300px] bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <div key={product._id} className="animate-fade-in-up">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* View All Button */}
                    {!loading && products.length > 0 && (
                        <div className="text-center mt-16">
                            <button
                                onClick={() => navigate('/shop')}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-secondary text-secondary font-bold tracking-widest uppercase hover:bg-secondary hover:text-white transition-all duration-300 rounded-sm"
                            >
                                View All Products <i className="fas fa-arrow-right text-sm"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white py-12 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <ReviewSection />
            </div>

        </div>
    );
};

export default Home;
