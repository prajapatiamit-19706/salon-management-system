import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.995 },
};

// SLOWER + SMOOTHER
const pageTransition = {
  duration: 2,
  ease: [0.22, 1, 0.36, 1],
};

export default function PageMotion({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}
