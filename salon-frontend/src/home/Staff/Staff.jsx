
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

export const Staff = ({ staff, index, variant = "preview" }) => {
  const { image, name, phone, role, experience, specialties } = staff;

  return (
    <motion.li
      // Entrance animation: fades in and slides up based on its index
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}

      // Hover animation: Lifts the card and intensifies shadow
      whileHover={{ y: -8 }}
      className={`list-none group bg-white rounded-2xl shrink-0
        /* Mobile: Width for 2-card peek | Desktop: Auto */
        w-[75%] 
        sm:w-[40%] 
        lg:w-full 
        ${variant === "full" ? `sm:w-full w-full px-2` : ``
        }
        /* Snap alignment */
        snap-center overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 border border-gray-100`}
    >

      {/* Image Container with Zoom Effect */}
      <div className="relative overflow-hidden h-90">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover antialiased transform-gpu transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Area */}
      <div className="p-6 text-center relative bg-white">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {name}
        </h3>

        <p className="text-indigo-600 font-medium text-[11px] mt-1">
          {role}
        </p>



        <div className="flex items-center justify-center gap-2 mt-3 text-gray-500 text-[10px]">
          <span className="w-8 h-1 bg-gray-200"></span>
          <span>{experience}+ Years Experience</span>
          <span className="w-8 h-1 bg-gray-200"></span>
        </div>

        {/* Specialties Tags */}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {specialties.map((spec, i) => (
            <span
              key={i}
              className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600 bg-gray-100 rounded-full group-hover:bg-indigo-50 group-hover:text-primary-soft transition-colors duration-300"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
      {variant === "full" && (
        <NavLink to={`/staffs/${staff._id}`} className="group flex justify-center items-center gap-2 mb-4
              font-bold
             transition-all duration-300 hover:text-primary"
        >
          <span className="text-xl text-text-heading hover:text-primary">View Profile</span>

          <FaArrowRightLong
            className="text-text-heading hover:text-primary transition-transform duration-300 group-hover:translate-x-2"
          /></NavLink>
      )}
    </motion.li>
  );
};

