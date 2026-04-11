import { useCallback, useEffect, useState } from "react";

export const Carousel = () => {

    // Define the images and their corresponding alt text 
    const carouselItems = [
        { src: "/hair-salon.jpg", alt: "Slide 1" },
        { src: "/salonn.png", alt: "Slide 2" },
        { src: "/images/salonC3.png", alt: "Slide 3" },
        { src: "/images/salonC4.png", alt: "Slide 4" },
        { src: "/images/salonC5.png", alt: "Slide 5" },
    ];

    // Configuration 
    const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds 

    const [activeIndex, setActiveIndex] = useState(0);
    const totalSlides = carouselItems.length;

    // Function to move to the next slide
    const nextSlide = useCallback(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, [totalSlides]);

    // Function to move to the previous slide
    const prevSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    };

    // Auto-scroll effect (runs once on mount)
    useEffect(() => {

        const interval = setInterval(nextSlide, AUTO_SCROLL_INTERVAL);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [nextSlide]); // Dependency array includes nextSlide (via useCallback)

    // --- RENDER LOGIC ---
    return (<>

        <div id="default-carousel" className="relative w-full">
            <div className="relative h-80 overflow-hidden rounded-base md:h-120 lg:h-160">
                {carouselItems.map((item, index) => (
                    // Item: Uses 'activeIndex' to determine visibility
                    <div
                        key={index}
                        className={`absolute inset-0 duration-700 ease-in-out transition-opacity transform ${index === activeIndex ? 'opacity-100 z-20' : 'opacity-0 z-10 hidden'
                            }`}
                        // Instead of -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2
                        // which centers the image, we use modern centering classes for clarity:
                        style={{ display: index === activeIndex ? 'block' : 'none' }}
                    >
                        <img
                            src={item.src}
                            alt={item.alt}
                            // Tailwind classes for centering the image within the container
                            className="absolute block w-full h-full object-cover top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        />
                    </div>
                ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-base ${index === activeIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                            }`}
                        aria-current={index === activeIndex}
                        aria-label={`Slide ${index + 1}`}
                        // Set the active slide on click
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>


            <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={prevSlide}
            >

                <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" /></svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>

            <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={nextSlide}
            >

                <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="w-5 h-5 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" /></svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
    </>)
}