import { motion } from "motion/react";
import type { Weather, Season } from "../../lib/types";

const weatherBg: Record<Weather, string> = {
  sunny: "from-[#F4E9C8]/70 via-[#FFFDF7]/50 to-[#F4E9C8]/30",
  breeze: "from-[#DDE6EC]/70 via-[#FFFDF7]/50 to-[#DDE6EC]/30",
  overcast: "from-[#EFEDE4]/70 via-[#FFFDF7]/50 to-[#EFEDE4]/40",
  lightRain: "from-[#F6E8EC]/70 via-[#FFFDF7]/50 to-[#F6E8EC]/40",
  rainbow: "from-[#F4E9C8]/50 via-[#F6E8EC]/40 to-[#DDE6EC]/50",
};

interface GardenSceneProps {
  weather: Weather;
  season: Season;
  dayCount: number;
}

export function GardenScene({ weather }: GardenSceneProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${weatherBg[weather]}`}>
      {/* 远处的山/地平线 */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#C5D0C0]/40 to-transparent" />

      {/* 装饰元素 */}
      <motion.div
        animate={{ y: [0, -6, 0], x: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[15%] top-[15%] rounded-full border border-[#C9C2B4]/40 bg-white/40 px-4 py-2 text-xs text-[#8A8B7B] backdrop-blur-sm"
      >
        ☁️ 云
      </motion.div>

      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[25%] bottom-[25%] h-16 w-12 rounded-t-full border-2 border-[#7F967B]/60 bg-[#A8B6A3]/70"
      />

      <motion.div
        animate={{ rotate: [1, -2, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[20%] bottom-[20%] h-20 w-16 rounded-t-full border-2 border-[#7F967B]/60 bg-[#B7C2B4]/70"
      />

      {/* 地面装饰 */}
      <div className="absolute bottom-[15%] left-[30%] h-2 w-24 rounded-full border border-[#A6B3A0]/30 bg-[#A8B6A3]/20" />
      <div className="absolute bottom-[12%] right-[25%] h-2 w-16 rounded-full border border-[#A6B3A0]/30 bg-[#A8B6A3]/20" />
    </div>
  );
}
