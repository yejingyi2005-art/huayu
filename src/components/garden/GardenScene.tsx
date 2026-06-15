import { motion } from "motion/react";
import type { Weather, Season } from "../../lib/types";

const weatherBg: Record<Weather, string> = {
  sunny: "from-[#F4E9C8]/70 via-[#FFFDF7]/50 to-[#F4E9C8]/30",
  breeze: "from-[#DDE6EC]/70 via-[#FFFDF7]/50 to-[#DDE6EC]/30",
  overcast: "from-[#EFEDE4]/70 via-[#FFFDF7]/50 to-[#EFEDE4]/40",
  lightRain: "from-[#F6E8EC]/70 via-[#FFFDF7]/50 to-[#F6E8EC]/40",
  rainbow: "from-[#F4E9C8]/50 via-[#F6E8EC]/40 to-[#DDE6EC]/50",
};

const seasonColors: Record<Season, string> = {
  spring: "#F6E8EC",
  summer: "#F4E9C8",
  autumn: "#EFEDE4",
  winter: "#DDE6EC",
};

interface GardenSceneProps {
  weather?: Weather;
  season?: Season;
}

export function GardenScene({ weather = "breeze", season = "spring" }: GardenSceneProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${weatherBg[weather]}`}>
      {/* 远处地平线 */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#C5D0C0]/40 to-transparent" />

      {/* 云朵动画 */}
      <motion.div
        animate={{ y: [0, -6, 0], x: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[12%] top-[12%] rounded-full border border-[#C9C2B4]/30 bg-white/50 px-3 py-1 text-xs text-[#8A8B7B] backdrop-blur-sm"
      >
        ☁️ 云
      </motion.div>

      <motion.div
        animate={{ y: [0, -3, 0], x: [0, -4, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[18%] top-[8%] rounded-full bg-white/40 px-3 py-1 text-xs text-[#8A8B7B] backdrop-blur-sm"
      >
        ☁️
      </motion.div>

      {/* 树木 */}
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[20%] bottom-[25%] h-14 w-10 rounded-t-full border-2 border-[#7F967B]/60 bg-[#A8B6A3]/60"
      />
      <motion.div
        animate={{ rotate: [1, -2, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[22%] bottom-[22%] h-18 w-14 rounded-t-full border-2 border-[#7F967B]/60 bg-[#B7C2B4]/60"
      />

      {/* 地面装饰 */}
      <div className="absolute bottom-[15%] left-[30%] h-2 w-24 rounded-full border border-[#A6B3A0]/30 bg-[#A8B6A3]/20" />
      <div className="absolute bottom-[12%] right-[25%] h-2 w-16 rounded-full border border-[#A6B3A0]/30 bg-[#A8B6A3]/20" />

      {/* 季节指示条 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: seasonColors[season] }}
      />
    </div>
  );
}
