import { motion } from "motion/react";

export function SproutFloat({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#8EA085]">
        <path d="M12 3C12 3 8 7 8 11C8 13.5 10 15 12 15C14 15 16 13.5 16 11C16 7 12 3 12 3Z" fill="currentColor" opacity="0.8" />
        <path d="M12 15V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 19L12 21L14 19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}
