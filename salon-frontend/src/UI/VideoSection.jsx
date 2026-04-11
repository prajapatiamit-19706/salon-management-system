import { useCallback, useEffect, useRef, useState } from "react";

export const VideoSection = () => {
  const [activeReel, setActiveReel] = useState(null);

  const reels = [
    { id: 1, src: "https://res.cloudinary.com/dqxt1fxap/video/upload/v1775544086/mullet_cut_em4nbl.mp4", title: "Mullet Haircut 🔥" },
    { id: 2, src: "https://res.cloudinary.com/dqxt1fxap/video/upload/v1775544662/Italian_Beard_v0y26d.mp4", title: "Italian Beard Styling ✂️" },
    { id: 4, src: "https://res.cloudinary.com/dqxt1fxap/video/upload/v1775544612/bridal_txovxk.mp4", title: "Bridal Look 💄" },
    { id: 5, src: "https://res.cloudinary.com/dqxt1fxap/video/upload/v1775544686/spa_rhj7i2.mp4", title: "Deep Relaxation 💆‍♂️🕯️" },
    { id: 3, src: "https://res.cloudinary.com/dqxt1fxap/video/upload/v1775544636/facial_xbkfla.mp4", title: "Facial Glow ✨" },
  ];

  const scrollRef = useRef(null);
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (activeReel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeReel]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setActiveReel(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);



  return (
    <>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="md:flex absolute left-0 top-1/2 -translate-y-1/2
             bg-white/80 hover:bg-white shadow-lg
             w-15 h-10 rounded-full items-center justify-center z-20"
        >
          ←
        </button>
        {/* 🎞️ Reels Preview */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {reels.map((reel, index) => (
            <div

              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="relative min-w-[220px] h-[390px] rounded-2xl overflow-hidden bg-black
                       cursor-pointer hover:scale-[1.05] transition-all duration-500"

            >
              <video
                src={reel.src}
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-all duration-500 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/50 text-white p-4 rounded-full text-xl">
                  ▶
                </span>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 w-full p-4 bg-linear-to-t from-black/80 to-transparent">
                <p className="text-white text-lg font-semibold">
                  {reel.title}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="md:flex absolute right-0 top-1/2 -translate-y-1/2
             bg-white/80 hover:bg-white shadow-lg
             w-10 h-10 rounded-full items-center justify-center z-20"
        >
          →
        </button>

      </div>



      {activeReel && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setActiveReel(null)} // bg click closes
        >
          {/* Close button */}
          <button
            onClick={() => setActiveReel(null)}
            className="absolute top-2 right-2
                   z-50
                   bg-white text-black
                   w-10 h-10 rounded-full
                   flex items-center justify-center
                   text-xl font-bold
                   shadow-xl
                   hover:scale-110 transition
                   pointer-events-auto"
            aria-label="Close video"
          >
            ✕
          </button>

          {/* Video */}
          <video
            src={activeReel.src}
            controls
            autoPlay
            className="max-h-[90vh] max-w-[90vw] rounded-xl mt-20"
            onClick={(e) => e.stopPropagation()} // stop bg close
          />
        </div>
      )}

    </>
  );
};
