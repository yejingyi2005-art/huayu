import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Leaf, Plus, Clock, Trees, Sun, Wind, CloudRain, Cloud, Sparkles, ChevronDown, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type CropType, type CropStage, type GardenCrop, type MemoryRing, type Weather } from "../../lib/types";
import { GardenScene } from "../../components/garden/GardenScene";
import { PhotoImg } from "../../components/PhotoImg";
import { Clover } from "../../components/garden/crops/Clover";
import { Sunflower } from "../../components/garden/crops/Sunflower";
import { Rose } from "../../components/garden/crops/Rose";
import { Lotus } from "../../components/garden/crops/Lotus";
import { ChinaRose } from "../../components/garden/crops/ChinaRose";
import { Lavender } from "../../components/garden/crops/Lavender";
import { Orchid } from "../../components/garden/crops/Orchid";
import { PearBlossom } from "../../components/garden/crops/PearBlossom";

const CROP_TYPES: CropType[] = ["clover", "sunflower", "rose", "lotus", "chinaRose", "lavender", "orchid", "pearBlossom"];
const STAGES: CropStage[] = ["seed", "sprout", "growing", "bloom"];

const cropLabels: Record<CropType, string> = {
  clover: "四叶草", sunflower: "向日葵", rose: "蔷薇花", lotus: "荷花",
  chinaRose: "月季", lavender: "薰衣草", orchid: "兰花", pearBlossom: "梨花树",
};

const emotionWeatherMap: Record<string, Weather> = {
  happy: "sunny", calm: "breeze", tired: "overcast", sad: "lightRain", surprised: "rainbow",
};

const weatherIcons: Record<Weather, typeof Sun> = {
  sunny: Sun, breeze: Wind, overcast: Cloud, lightRain: CloudRain, rainbow: Sparkles,
};

const weatherLabels: Record<Weather, string> = {
  sunny: "晴天", breeze: "微风", overcast: "阴天", lightRain: "小雨", rainbow: "彩虹",
};

const ringSeasonColors: Record<string, string> = {
  spring: "#F6E8EC", summer: "#F4E9C8", autumn: "#EFEDE4", winter: "#DDE6EC",
};

const ringSeasonLabels: Record<string, string> = {
  spring: "春", summer: "夏", autumn: "秋", winter: "冬",
};

function seasonLabel(m: number): string {
  if (m >= 3 && m <= 5) return "春天";
  if (m >= 6 && m <= 8) return "夏天";
  if (m >= 9 && m <= 11) return "秋天";
  return "冬天";
}

function seasonEnum(m: number): "spring" | "summer" | "autumn" | "winter" {
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

function dominantWeather(traces: SavedTrace[]): { weather: Weather; season: "spring" | "summer" | "autumn" | "winter" } {
  if (traces.length === 0) return { weather: "breeze", season: "spring" };
  const counts: Record<string, number> = { happy: 0, calm: 0, tired: 0, sad: 0, surprised: 0 };
  for (const t of traces) {
    if (t.type === "mood" && typeof t.content === "object" && "emotion" in t.content) {
      const e = t.content.emotion as string;
      if (counts[e] !== undefined) counts[e]++;
    }
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topCount = sorted[0]?.[1] ?? 0;
  const topMood = sorted[0]?.[0] ?? "calm";
  const weather = topCount > 0 ? (emotionWeatherMap[topMood] ?? "breeze") : "breeze";

  const now = new Date();
  const month = now.getMonth() + 1;
  return { weather, season: seasonEnum(month) };
}

function buildGardenState(traces: SavedTrace[]): { crops: GardenCrop[]; rings: MemoryRing[] } {
  const count = traces.length;
  const level = Math.min(count, 48);
  const cropCount = Math.min(Math.floor(level / 2) + 1, 16);
  const crops: GardenCrop[] = [];
  for (let i = 0; i < cropCount; i++) {
    const stageIdx = Math.min(Math.floor((level - i * 2) / 3), 3);
    crops.push({
      id: `c${i}`,
      type: CROP_TYPES[i % CROP_TYPES.length] as CropType,
      stage: STAGES[Math.max(0, stageIdx)] as CropStage,
      plantedBy: i % 2 === 0 ? "你" : "对方",
      plantedAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
      position: { col: i % 4, row: Math.floor(i / 4) },
    });
  }

  const rings: MemoryRing[] = [];
  if (count > 0) {
    const sorted = [...traces].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const groups = new Map<string, SavedTrace[]>();
    for (const t of sorted) {
      const d = new Date(t.createdAt);
      const month = d.getMonth() + 1;
      const season = seasonEnum(month);
      const key = `${d.getFullYear()}-${season}`;
      const group = groups.get(key) ?? [];
      group.push(t);
      groups.set(key, group);
    }
    let i = 0;
    for (const [, seasonTraces] of groups) {
      const moodCounts: Record<string, number> = { happy: 0, calm: 0, tired: 0, sad: 0, surprised: 0 };
      for (const t of seasonTraces) {
        if (t.type === "mood" && typeof t.content === "object" && "emotion" in t.content) {
          moodCounts[t.content.emotion as string] = (moodCounts[t.content.emotion as string] ?? 0) + 1;
        }
      }
      const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "calm";
      const ringWeather = emotionWeatherMap[topMood] ?? "breeze";
      const firstTrace = seasonTraces[0];
      const d = new Date(firstTrace?.createdAt ?? new Date().toISOString());
      const summary = seasonTraces.length <= 2
        ? seasonTraces.map((t) => typeof t.content === "string" ? t.content : t.type === "photo" ? "📷 一张照片" : "💭 一个心情").join("、")
        : `共 ${seasonTraces.length} 条记忆`;
      rings.push({
        id: `r${i}`,
        season: seasonEnum(d.getMonth() + 1),
        year: d.getFullYear(),
        radius: Math.max(14, Math.min(seasonTraces.length * 3 + 10, 48)),
        tracesCount: seasonTraces.length,
        summary,
        dominantWeather: ringWeather,
      });
      i++;
    }
  }
  return { crops, rings };
}

interface SavedTrace {
  id: string; type: "photo" | "text" | "mood";
  user: string; time: string;
  content: string | { photoId: string; caption?: string } | { emotion: string };
  createdAt: string;
}

export function GardenPage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const [reunion, setReunion] = useState<{ show: boolean; days: number; newTraces: number; lastSeason: string; currentSeason: string } | null>(null);
  const [savedTraces, setSavedTraces] = useState<SavedTrace[]>([]);
  const [selectedRing, setSelectedRing] = useState<number | null>(null);
  const [ringDetailOpen, setRingDetailOpen] = useState(false);
  const [pulsingRing, setPulsingRing] = useState<number | null>(null);
  const [now] = useState(Date.now);
  const traceCount = savedTraces.length;

  const garden = useMemo(() => buildGardenState(savedTraces), [savedTraces]);
  const { weather, season } = useMemo(() => dominantWeather(savedTraces), [savedTraces]);
  const WeatherIcon = weatherIcons[weather];

  const handleRingTap = useCallback((i: number) => {
    setPulsingRing(i);
    setTimeout(() => setPulsingRing(null), 300);
    if (selectedRing === i && ringDetailOpen) {
      setRingDetailOpen(false);
      setTimeout(() => setSelectedRing(null), 200);
    } else {
      setSelectedRing(i);
      setRingDetailOpen(true);
    }
  }, [selectedRing, ringDetailOpen]);

  const displayedTraces = useMemo(() => {
    if (!ringDetailOpen || selectedRing === null) return savedTraces.slice(0, 10);
    const ring = garden.rings[selectedRing];
    if (!ring) return savedTraces.slice(0, 10);
    const year = ring.year;
    const seasonStr = ring.season;
    return savedTraces.filter((t) => {
      const d = new Date(t.createdAt);
      return d.getFullYear() === year && seasonEnum(d.getMonth() + 1) === seasonStr;
    });
  }, [savedTraces, selectedRing, ringDetailOpen, garden.rings]);

  useEffect(() => {
    const storageKey = `huayu_last_visit_${gardenId}`;
    const stored = JSON.parse(localStorage.getItem(`huayu_traces_${gardenId}`) || "[]");
    setSavedTraces(stored);
    const lastVisit = localStorage.getItem(storageKey);
    const nowMs = Date.now();
    if (lastVisit) {
      const daysAgo = Math.floor((nowMs - Number(lastVisit)) / 86400000);
      const lastVisitDate = new Date(Number(lastVisit));
      const lastSeason = seasonLabel(lastVisitDate.getMonth() + 1);
      const currentSeason = seasonLabel(new Date().getMonth() + 1);
      const oldTraceCount = stored.filter((t: SavedTrace) => new Date(t.createdAt).getTime() > Number(lastVisit)).length;
      if (daysAgo >= 1) {
        setReunion({ show: true, days: daysAgo, newTraces: oldTraceCount, lastSeason, currentSeason });
        const timer = setTimeout(() => setReunion(null), 6000);
        return () => clearTimeout(timer);
      }
    }
    localStorage.setItem(storageKey, String(nowMs));
  }, [gardenId]);

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px]">
      <AnimatePresence>
        {reunion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFDF7]/95 to-[#F4E9C8]/95 px-8 backdrop-blur-xl"
            style={{ paddingTop: "var(--sat, 0px)", paddingBottom: "var(--sab, 0px)" }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 120, damping: 14 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, -4, 0] }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#A8B6A3] bg-[#A8B6A3]/20"
              >
                <Trees size={28} className="text-[#596650]" />
              </motion.div>

              <h2 className="font-['Long_Cang'] text-4xl text-[#596650]">
                别来无恙
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#707465]">
                自上次见面，已经过了 <strong className="text-[#596650]">{reunion.days} 天</strong>
              </p>
              <p className="text-sm leading-7 text-[#707465]">
                花园从 <strong className="text-[#596650]">{reunion.lastSeason}</strong> 走到了 <strong className="text-[#596650]">{reunion.currentSeason}</strong>
              </p>

              {reunion.newTraces > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 rounded-2xl border border-[#D9C892] bg-[#F4E9C8]/60 px-5 py-3"
                >
                  <p className="text-xs text-[#7B704E]">
                    你不在的日子里，这里新增了 <strong className="text-[#596650]">{reunion.newTraces} 条</strong> 新痕迹
                  </p>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                onClick={() => setReunion(null)}
                className="mt-8 rounded-full border-2 border-[#8EA085] bg-primary px-8 py-3 text-sm text-primary-foreground transition hover:-rotate-1"
              >
                回到花园
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 花园场景 */}
      <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <GardenScene weather={weather} season={season} />
        </div>

        {/* 当前天气指示 */}
        <div className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-full bg-white/25 px-3 py-1.5 backdrop-blur-sm">
          <WeatherIcon size={14} className="text-white" />
          <span className="text-xs text-white drop-shadow-sm">{weatherLabels[weather]}</span>
        </div>

        {/* 作物种植区 */}
        <div className="absolute bottom-[22%] left-3 right-3 z-10 max-h-[45%] overflow-y-auto scrollbar-none">
          <div className="grid grid-cols-4 gap-x-1 gap-y-5">
            {garden.crops.map((crop, i) => {
              const cropComponents: Record<CropType, typeof Clover> = {
                clover: Clover, sunflower: Sunflower, rose: Rose, lotus: Lotus,
                chinaRose: ChinaRose, lavender: Lavender, orchid: Orchid, pearBlossom: PearBlossom,
              };
              const CropIcon = cropComponents[crop.type];
              const delay = i * 0.06;
              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.5, ease: "backOut" }}
                  className="flex flex-col items-center"
                >
                  <CropIcon stage={crop.stage} className="h-9 w-9 md:h-11 md:w-11" />
                  <span className="mt-0.5 text-[7px] text-[#A8B6A3] drop-shadow-sm md:text-[8px]">{cropLabels[crop.type]}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 互动年轮树 */}
        <div className="absolute bottom-[18%] right-4 z-10">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <AnimatePresence>
              {garden.rings.map((ring, i) => {
                const isActive = selectedRing === i;
                const isPulsing = pulsingRing === i;
                const color = ringSeasonColors[ring.season] ?? "#D9D2C3";
                return (
                  <motion.button
                    key={ring.id}
                    onClick={() => handleRingTap(i)}
                    className="absolute rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isPulsing ? [1, 1.15, 1] : isActive ? 1.08 : 1,
                      opacity: 0.5 + (i / garden.rings.length) * 0.5,
                    }}
                    transition={{
                      scale: isPulsing ? { duration: 0.3, ease: "easeOut" } : { duration: 0.4, ease: "backOut" },
                      opacity: { duration: 0.3 },
                    }}
                    style={{
                      width: ring.radius * 2,
                      height: ring.radius * 2,
                      border: isActive ? "2.5px solid rgba(255,255,255,0.9)" : "1.5px solid rgba(255,255,255,0.35)",
                      backgroundColor: isActive ? color + "80" : color + "20",
                      zIndex: isActive ? 20 : garden.rings.length - i,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                      >
                        <p className="text-[10px] font-medium text-[#314032] drop-shadow-sm">
                          {ringSeasonLabels[ring.season]}{String(ring.year).slice(2)}
                        </p>
                        <p className="mt-0.5 text-[7px] text-[#314032]/70">{ring.tracesCount} 条</p>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
            <motion.div
              className="absolute z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-white/30 backdrop-blur-sm"
              animate={{ scale: selectedRing !== null ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Trees size={18} className="text-white drop-shadow-sm" />
            </motion.div>
          </div>
        </div>

        {/* 花园信息 */}
        <div className="absolute bottom-4 left-5 right-5 z-20 flex items-end justify-between">
          <div className="rounded-2xl bg-white/25 px-4 py-2 backdrop-blur-sm">
            <h1 className="font-['Long_Cang'] text-2xl text-white drop-shadow-md">我们的花园</h1>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/90 drop-shadow-sm">
              <Clock size={11} /> {Math.max(1, Math.floor(traceCount > 0 ? (now - new Date(savedTraces[0]?.createdAt ?? now).getTime()) / 86400000 : 0)) + 30} 天 · {garden.crops.length} 株 · {garden.rings.length} 圈年轮
            </p>
          </div>
          <div className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[11px] text-white/90 backdrop-blur-sm">
            2 人
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-5 pt-5" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
        {/* 天气 & 年轮详情面板 */}
        <div className="mb-4 space-y-3">
          <div className="rounded-[1.25rem] border-2 border-border bg-[#FFFDF7] p-3">
            <p className="text-[10px] text-[#838777]">今日花园天气</p>
            <div className="mt-1 flex items-center gap-2">
              <WeatherIcon size={18} className="text-[#8EA085]" />
              <span className="font-['Long_Cang'] text-xl text-[#596650]">{weatherLabels[weather]}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-[#838777]">基于 {traceCount} 条心情记录</p>
          </div>

          {/* 年轮时间线 */}
          {garden.rings.length > 0 && (
            <div className="rounded-[1.25rem] border-2 border-[#D9C892] bg-[#FFFDF7] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-[#838777]">记忆年轮</p>
                <motion.button
                  onClick={() => setRingDetailOpen(!ringDetailOpen)}
                  animate={{ rotate: ringDetailOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#B9B19F]"
                >
                  <ChevronDown size={14} />
                </motion.button>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {garden.rings.map((ring, i) => (
                  <motion.button
                    key={ring.id}
                    onClick={() => handleRingTap(i)}
                    className={`rounded-full border transition-colors ${
                      selectedRing === i
                        ? "border-[#8EA085] bg-[#8EA085]/20"
                        : "border-border bg-[#F0EFE8]"
                    } px-2.5 py-1`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`text-[10px] ${selectedRing === i ? "text-[#596650]" : "text-[#838777]"}`}>
                      {ringSeasonLabels[ring.season]}{String(ring.year).slice(2)}
                    </span>
                    <span className="ml-1 text-[8px] text-[#B9B19F]">{ring.tracesCount}</span>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {ringDetailOpen && selectedRing !== null && (() => {
                  const r = garden.rings[selectedRing];
                  if (!r) return null;
                  return (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="rounded-xl border border-[#D9C892] bg-[#F4E9C8]/40 p-3">
                        <p className="text-[10px] text-[#7B704E]">
                          {r.year} 年 · {ringSeasonLabels[r.season]}季
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[#596650]">
                          {r.summary}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Heart size={10} className="text-[#D9A0A0]" />
                          <span className="text-[9px] text-[#838777]">
                            心情天气：{weatherLabels[r.dominantWeather]}
                          </span>
                        </div>
                        <p className="mt-1 text-[9px] text-[#838777]">
                          {r.tracesCount} 条记忆 · 年轮厚度 {r.radius}px
                        </p>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* 留痕入口 */}
        <button
          onClick={() => navigate(`/garden/${gardenId}/trace`)}
          className="group flex w-full items-center justify-center gap-2 rounded-[1.75rem] border-2 border-[#8EA085] bg-primary px-5 py-4 text-primary-foreground transition duration-500 hover:-rotate-1 active:scale-[0.98]"
        >
          <Plus size={18} />
          <span className="font-medium">留下今天</span>
          <span className="text-xs text-primary-foreground/60">（{traceCount} 条）</span>
        </button>

        {/* 痕迹列表 */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium text-[#596650]">
              <Leaf size={14} className="text-[#8EA085]" />
              {ringDetailOpen && selectedRing !== null && garden.rings[selectedRing] ? `${ringSeasonLabels[garden.rings[selectedRing].season]}季记忆` : "最近痕迹"}
            </h2>
          </div>
          <div className="mt-4 space-y-4">
            {displayedTraces.length === 0 ? (
              <div className="rounded-[1.5rem] border-2 border-dashed border-[#D9D2C3] bg-[#FFFDF7]/50 p-8 text-center">
                <p className="text-sm text-[#B9B19F]">还没有痕迹</p>
                <p className="mt-1 text-xs text-[#B9B19F]">留下第一条记录，花园就会开始生长</p>
              </div>
            ) : (
              displayedTraces.map((trace, i) => (
                <motion.div
                  key={trace.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="rounded-[1.5rem] border-2 border-border bg-[#FFFDF7] p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0EFE8] text-[10px] text-[#596650]">{trace.user}</div>
                    <span className="text-xs text-[#838777]">{trace.user}</span>
                    <span className="text-[10px] text-[#B9B19F]">{trace.time}</span>
                  </div>
                  {trace.type === "photo" && typeof trace.content === "object" && "photoId" in trace.content && (
                    <div className="mt-3 space-y-2">
                      <PhotoImg photoId={trace.content.photoId} alt="upload" className="w-full max-h-48 rounded-2xl border border-border object-cover" />
                      {trace.content.caption && <p className="text-sm leading-6 text-[#707465]">{trace.content.caption}</p>}
                    </div>
                  )}
                  {trace.type === "text" && typeof trace.content === "string" && (
                    <p className="mt-3 text-sm leading-6 text-[#707465]">{trace.content}</p>
                  )}
                  {trace.type === "mood" && typeof trace.content === "object" && "emotion" in trace.content && (
                    <p className="mt-3 text-sm leading-6 text-[#707465]">心情：{trace.content.emotion}</p>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
