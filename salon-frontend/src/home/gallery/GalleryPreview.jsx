import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export const GalleryPreview = () => {

  const galleryItems = [
    { id: 1, src: "/images/galleryp1.jpg", title: "Salon Set Up" },
    { id: 2, src: "/images/galleryp2.jpg", title: "women's area" },
    { id: 3, src: "/images/galleryp3.jpg", title: "Accessories" },
    { id: 4, src: "/images/galleryp4.jpg", title: "genuien services" },
    { id: 5, src: "/images/galleryp5.jpg", title: "shooting Set Up" },
  ];


  return <>

    {/* heading */}
    <div className="mb-10 text-center">
      <h2 className="text-5xl font-serif text-text-heading mask-b-from-black">
        Our Gallery
      </h2>
      <p className="text-text-muted text-xl mt-3">
        A glimpse of our signature work
      </p>
    </div>

    {/* 3D stack */}
    {/* Header with Luxury feel */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
      <div className="max-w-xl">
        <h2 className="text-5xl text-text-heading font-extralight tracking-tighter italic">The Art of Grooming</h2>
        <p className="text-zinc-500 mt-4 text-lg">A glimpse into our signature transformations and premium sanctuary.</p>
      </div>
      <NavLink to="/gallery" className="group flex text-white items-center gap-2 text-sm tracking-[0.2em] uppercase border-b hover:border-zinc-800 pb-2 border-white transition-all">
        <p className=" text-text-heading "> Explore Collection <span className="group-hover:translate-x-2 transition-transform">→</span></p>
      </NavLink>
    </div>

    {/* Bento Grid Logic */}
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] perspective-distant">

      {galleryItems.map((item, index) => (
        <motion.div
          key={item.id}
          whileHover={{
            scale: 0.98, // Slight shrink on hover creates a "press" effect
            rotateX: index % 2 === 0 ? 2 : -2,
            rotateY: index % 2 === 0 ? -2 : 2
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`relative overflow-hidden rounded-sm group shadow-2xl 
                ${index === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"}
              `}
        >
          {/* Image with Parallax-like effect */}
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
            src={item.src}
            alt={item.title}
            className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
          />

          {/* Minimalist 3D Content Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="translate-z-10"
            >
              <span className="text-xs text-white tracking-[0.3em] uppercase opacity-70">Signature</span>
              <h3 className="text-2xl text-white font-medium mt-1">{item.title}</h3>
            </motion.div>
          </div>
        </motion.div>
      ))}

    </div>
  </>

}