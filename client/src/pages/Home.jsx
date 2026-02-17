import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import sareeModel from '../assets/saree_model.png';
import salwarModel from '../assets/salwar_model.png';
import churidarModel from '../assets/churidhar_model.png';

const Home = () => {
    const navigate = useNavigate();
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
        <div>
            <Carousel images={slides} />
            <div className="py-16 px-8 text-center bg-primary">
                <h1 className="text-5xl font-playfair mb-4 text-secondary">Elegance Redefined</h1>
                <p className="text-xl mb-8 text-text">Discover the latest collection of premium textiles.</p>
                <button
                    className="px-8 py-4 bg-secondary text-white border-0 text-base tracking-wider uppercase cursor-pointer hover:bg-opacity-90 transition-opacity"
                    onClick={() => navigate('/shop')}
                >
                    Shop Collection
                </button>
            </div>
            <div className="py-16 px-8 bg-white">
                <h2 className="text-3xl text-center mb-8 font-playfair text-secondary">Featured Products</h2>
                <div className="text-center">
                    <p className="text-gray-500">Loading products...</p>
                    {/* Product Grid will go here */}
                </div>
            </div>
        </div>
    );
};

export default Home;
