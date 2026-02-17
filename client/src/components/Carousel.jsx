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
        <div className="relative w-full h-screen overflow-hidden">
            <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((slide, index) => (
                    <div className="min-w-full h-full relative" key={index}>
                        <img
                            src={slide.src}
                            alt={slide.alt || `Slide ${index}`}
                            className="w-full h-full object-cover object-top"
                        />
                        {slide.caption && (
                            <div className="absolute inset-0 flex justify-start items-center bg-transparent pl-[10%] pointer-events-none text-white text-left">
                                <p className="font-dancing text-7xl font-bold m-0 drop-shadow-[3px_3px_6px_rgba(0,0,0,0.9)] leading-[1.2] max-w-[40%] w-full">
                                    {slide.caption}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button
                className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white border-none text-2xl p-2 cursor-pointer z-10 rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-black/80 left-[10px]"
                onClick={goToPrevious}
            >
                &#10094;
            </button>
            <button
                className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white border-none text-2xl p-2 cursor-pointer z-10 rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-black/80 right-[10px]"
                onClick={goToNext}
            >
                &#10095;
            </button>
            <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 flex gap-[10px]">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`w-[12px] h-[12px] bg-white/50 rounded-full cursor-pointer ${index === currentIndex ? 'bg-white' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
