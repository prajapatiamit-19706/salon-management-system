import { motion } from "framer-motion";
import { useState } from "react";

export const BeforeAfterCard = ({ item,index }) => {
  const [showAfter, setShowAfter] = useState(false);

  return (
                <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: "easeIn" }}
               className="bg-bg-panel rounded-2xl overflow-hidden shadow-medium">

      {/* Image */}
      <div className="relative aspect-3/4 w-full">
         {/* BEFORE */}
      <img
        src={item.before}
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-all duration-500 ease-out
          ${showAfter ? "opacity-0 scale-105" : "opacity-100 scale-100"}
        `}
      />

      {/* AFTER */}
      <img
        src={item.after}
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-all duration-500 ease-out
          ${showAfter ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      />

        {/* Label */}
        <span className="
          absolute top-3 left-3
          bg-black/60 text-white text-xs px-3 py-1 rounded-full
        ">
          {showAfter ? "After" : "Before"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-text-heading font-medium">
          {item.title}
        </h3>

        {/* Toggle Button */}
        <button
          onClick={() => setShowAfter(!showAfter)}
          className="
            mt-4 w-full py-2 rounded-xl
            bg-primary text-white text-sm font-medium
            transition hover:opacity-90 active:scale-95
          "
        >
          View {showAfter ? "Before" : "After"}
        </button>
      </div>

    </motion.div>
  );
};
