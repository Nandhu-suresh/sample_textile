import React, { useState, useEffect } from 'react';
const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="relative w-full h-[85vh] lg:h-screen overflow-hidden group">
            <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)] h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((slide, index) => (
                    <div className="min-w-full h-full relative" key={index}>
                        <div className="absolute inset-0 bg-black/20 z-10 transition-opacity duration-700"></div>
                        <img
                            src={slide.src}
                            alt={slide.alt || `Slide ${index}`}
                            className="w-full h-full object-cover object-top"
                        />
                        {slide.caption && (
                            <div className="absolute inset-0 flex justify-start items-center bg-transparent pl-[5%] md:pl-[10%] pointer-events-none text-white text-left z-20">
                                <p className={`font-dancing text-5xl md:text-7xl lg:text-8xl font-bold m-0 leading-tight max-w-[80%] md:max-w-[50%] lg:max-w-[40%] w-full transition-all duration-1000 transform ${index === currentIndex ? 'translate-y-0 opacity-100 drop-shadow-[2px_4px_8px_rgba(0,0,0,0.8)]' : 'translate-y-10 opacity-0'}`}>
                                    {slide.caption}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 bg-black/30 text-white/90 border border-white/20 text-xl p-3 cursor-pointer z-30 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/60 hover:scale-110 hover:border-white/50 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                onClick={goToPrevious}
                aria-label="Previous Slide"
            >
                <i className="fas fa-chevron-left"></i>
            </button>
            <button
                className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 bg-black/30 text-white/90 border border-white/20 text-xl p-3 cursor-pointer z-30 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/60 hover:scale-110 hover:border-white/50 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                onClick={goToNext}
                aria-label="Next Slide"
            >
                <i className="fas fa-chevron-right"></i>
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {images.map((_, index) => (
                    <button
                        key={index}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`transition-all duration-500 rounded-full cursor-pointer shadow-sm ${index === currentIndex ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'}`}
                        onClick={() => setCurrentIndex(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
