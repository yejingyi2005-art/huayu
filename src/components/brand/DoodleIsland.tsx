import { motion } from "motion/react";

export function DoodleIsland() {
  return (
    <div className="relative mx-auto mt-10 h-80 w-80 max-w-full rounded-[42%_58%_48%_52%/58%_43%_57%_42%] border-2 border-[#9DAD97] bg-[#C5D0C0] bg-[radial-gradient(circle_at_30%_25%,rgba(255,253,247,0.55)_0_2px,transparent_3px),radial-gradient(circle_at_70%_60%,rgba(255,253,247,0.35)_0_1px,transparent_2px)]">
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-5 top-10 rounded-full border border-[#C9C2B4] bg-white/55 px-8 py-3 text-sm text-[#8A8B7B]"
      >
        云慢慢飘过
      </motion.div>

      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-16 top-16 h-20 w-16 rounded-t-full border-2 border-[#7F967B] bg-[#A8B6A3]"
      />

      <div className="absolute left-20 top-30 h-24 w-10 rounded-full border-2 border-[#8C7E67] bg-[#D9B98B]" />

      <motion.div
        animate={{ rotate: [1, -2, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-16 top-20 h-28 w-20 rounded-[50%] border-2 border-[#7F967B] bg-[#B7C2B4]"
      />

      <div className="absolute left-36 top-36 h-16 w-20 rounded-[45%] border-2 border-[#95A68D] bg-[#DDE6EC]/65" />

      <div className="absolute bottom-20 left-14 h-14 w-28 -rotate-6 rounded-3xl border-2 border-[#C6AAB1] bg-[#F6E8EC] p-3 text-center text-xs leading-4 text-[#7B6B68]">
        春天的<br />票根
      </div>

      <div className="absolute bottom-12 right-12 rotate-3 rounded-2xl border-2 border-[#D7C892] bg-[#F4E9C8] px-4 py-3 text-xs text-[#7B704E]">
        第 128 天
      </div>

      <div className="absolute bottom-10 left-1/2 h-5 w-32 -translate-x-1/2 rounded-full border border-[#A6B3A0] bg-[#A8B6A3]/40" />

      <div className="absolute left-10 top-44 h-3 w-3 rounded-full bg-[#FFFDF7]" />
      <div className="absolute right-10 top-52 h-2 w-2 rounded-full bg-[#FFFDF7]" />
    </div>
  );
}
