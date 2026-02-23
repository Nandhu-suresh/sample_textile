import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaTrash } from 'react-icons/fa';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/reviews');
            setReviews(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setReviews(reviews.filter(review => review._id !== id));
            } catch (err) {
                console.error('Error deleting review:', err);
                alert('Failed to delete review');
            }
        }
    };

    if (loading) return <div className="text-center p-8">Loading reviews...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 font-playfair text-secondary">Customer Reviews Management</h2>

            {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review._id} className="min-w-[300px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group">
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent -z-10 opacity-50"></div>

                            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                <span className="bg-white/80 px-2 py-1 rounded text-xs font-bold text-gray-600 border border-gray-200">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Profile Image - Centered */}
                            <div className="w-24 h-24 mb-6 relative">
                                <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {review.user && review.user.avatar ? (
                                        <img
                                            src={review.user.avatar}
                                            alt={review.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-gray-400 uppercase">
                                            {review.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Username */}
                            <h3 className="font-playfair font-bold text-xl text-secondary mb-2 tracking-wide text-center">
                                {review.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex text-yellow-500 text-sm mb-6 gap-1 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < review.rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-200"} />
                                ))}
                            </div>

                            {/* Quote Icon */}
                            <div className="text-accent opacity-20 text-4xl leading-none mb-2 font-serif">“</div>

                            {/* Description */}
                            <p className="text-gray-600 text-center font-lato leading-relaxed text-base px-2 italic mb-6">
                                {review.text}
                            </p>

                            {/* Closing Quote Icon */}
                            <div className="text-accent opacity-20 text-4xl leading-none -mt-4 mb-4 font-serif">”</div>

                            <button
                                onClick={() => handleDelete(review._id)}
                                className="w-full mt-auto flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-lg hover:bg-red-100 transition-colors font-semibold"
                            >
                                <FaTrash size={14} /> Delete Review
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
