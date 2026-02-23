import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const ReviewCard = ({ review }) => {
    return (
        <div className="min-w-[300px] md:min-w-[350px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl snap-center shrink-0 h-full relative overflow-hidden group">
            {/* Decorative Background Element */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent -z-10 opacity-50"></div>

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
                {/* Verified Badge (optional) */}
                <div className="absolute bottom-1 right-1 bg-secondary text-white p-1 rounded-full shadow-sm text-xs border-2 border-white">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
            </div>

            {/* Username */}
            <h3 className="font-playfair font-bold text-xl text-secondary mb-2 tracking-wide">
                {review.name}
            </h3>

            {/* Rating */}
            <div className="flex text-yellow-500 text-sm mb-6 gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-200"} />
                ))}
            </div>

            {/* Quote Icon */}
            <div className="text-accent opacity-20 text-4xl leading-none mb-2 font-serif">“</div>

            {/* Description */}
            <p className="text-gray-600 text-center font-lato leading-relaxed text-base px-2 italic">
                {review.text}
            </p>

            {/* Closing Quote Icon */}
            <div className="text-accent opacity-20 text-4xl leading-none mt-2 font-serif">”</div>
        </div>
    );
};

const ReviewForm = ({ onReviewSubmit }) => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!name.trim() || !text.trim()) {
            setError('Please describe your experience and provide your name.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('rating', rating);
        formData.append('text', text);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    // 'Content-Type': 'multipart/form-data', // No longer needed as we aren't sending files, but axios handles json by default if we send object. 
                    // However, backend expects formData if we use multer array/single on the route? 
                    // The backend route `upload.single('image')` might expect multipart.
                    // If we just send JSON, multer might not complain if the field is missing, but body-parser is needed for JSON.
                    // Let's stick to FormData for compatibility with the existing backend route which uses multer, 
                    // OR just send JSON and backend might need adjustment if it ONLY handles multipart.
                    // The backend has `app.use(express.json())` so it should handle JSON if multer doesn't intercept it strictly.
                    // However, `router.post('/', auth, upload.single('image'), ...)` uses multer. 
                    // Multer populates req.body for multipart forms. It might NOT populate req.body if content-type is application/json.
                    // SAFEST bet without changing backend logic: Keep using FormData but just don't append image.
                    'Content-Type': 'multipart/form-data',
                    ...(token && { 'x-auth-token': token })
                }
            };

            const res = await axios.post('http://localhost:5000/api/reviews', formData, config);
            onReviewSubmit(res.data);
            setName('');
            setRating(5);
            setText('');
        } catch (err) {
            console.error(err);
            setError('Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-lg mx-auto">
            <h3 className="font-playfair text-xl font-bold mb-4 text-center">Share Your Experience</h3>
            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <FaStar className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent"
                    placeholder="Your Name"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Review</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent h-24 resize-none"
                    placeholder="Tell us about your purchase..."
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

const ReviewSection = () => {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/reviews');
                setReviews(res.data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        fetchReviews();
    }, []);

    const handleNewReview = (newReview) => {
        setReviews([newReview, ...reviews]);
        setShowForm(false);
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                    <div className="w-24 h-1 bg-accent mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-lato max-w-2xl mx-auto">
                        Discover why our customers love our collections. Read their genuine feedback and experiences.
                    </p>

                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 px-6 py-2 border-2 border-secondary text-secondary rounded-full font-bold hover:bg-secondary hover:text-white transition-all text-sm uppercase tracking-wide"
                        >
                            Write a Review
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="mb-12 animate-fadeIn">
                        <ReviewForm onReviewSubmit={handleNewReview} />
                        <button
                            onClick={() => setShowForm(false)}
                            className="block mx-auto mt-4 text-gray-500 hover:text-gray-700 text-sm underline"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Horizontal Scrolling Container */}
                {reviews.length > 0 ? (
                    <div className="flex overflow-x-auto gap-6 pb-8 px-4 snap-x snap-mandatory scrollbar-hide">
                        {reviews.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 italic py-8">
                        No reviews yet. Be the first to share your experience!
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewSection;
