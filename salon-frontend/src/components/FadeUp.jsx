import { motion } from "framer-motion";

export default function FadeUp({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
