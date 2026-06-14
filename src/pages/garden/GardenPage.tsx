import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Leaf, Plus, Clock, Trees } from "lucide-react";
import { motion } from "motion/react";
import { type CropType, type CropStage, type GardenCrop, type MemoryRing } from "../../lib/types";
import { Clover } from "../../components/garden/crops/Clover";
import { Sunflower } from "../../components/garden/crops/Sunflower";
import { Rose } from "../../components/garden/crops/Rose";
import { Lotus } from "../../components/garden/crops/Lotus";

const CROP_TYPES: CropType[] = ["clover", "sunflower", "rose", "lotus"];
const STAGES: CropStage[] = ["seed", "sprout", "growing", "bloom"];

const cropLabels: Record<CropType, string> = {
  clover: "四叶草", sunflower: "向日葵", rose: "蔷薇花", lotus: "荷花",
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

function buildMockCrops(traceCount: number): { crops: GardenCrop[]; rings: MemoryRing[] } {
  const level = Math.min(traceCount, 20);
  const cropCount = Math.min(Math.floor(level / 3) + 1, 8);
  const crops: GardenCrop[] = [];
  for (let i = 0; i < cropCount; i++) {
    const stageIdx = Math.min(Math.floor((level - i * 2) / 3), 3);
    crops.push({
      id: `c${i}`,
      type: CROP_TYPES[i % CROP_TYPES.length] as CropType,
      stage: STAGES[Math.max(0, stageIdx)] as CropStage,
      plantedBy: i % 2 === 0 ? "你" : "小明",
      plantedAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
      position: { col: i % 4, row: Math.floor(i / 4) },
    });
  }

  const ringCount = Math.min(Math.floor(traceCount / 5) + 1, 6);
  const rings: MemoryRing[] = [];
  for (let i = 0; i < ringCount; i++) {
    const month = ((i * 3) % 12) + 1;
    rings.push({
      id: `r${i}`,
      season: seasonEnum(month),
      year: 2025 + Math.floor(i / 4),
      radius: (i + 1) * 12,
      tracesCount: Math.floor(Math.random() * 8) + 1,
      summary: i === 0 ? "种下第一颗种子" : `第 ${i + 1} 圈记忆`,
    });
  }
  return { crops, rings };
}

interface SavedTrace {
  id: string; type: "photo" | "text" | "mood";
  user: string; time: string;
  content: string | { url: string; caption?: string } | { emotion: string };
  createdAt: string;
}

export function GardenPage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const [reunion, setReunion] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [savedTraces, setSavedTraces] = useState<SavedTrace[]>([]);
  const [selectedRing, setSelectedRing] = useState<number | null>(null);
  const traceCount = savedTraces.length;

  const garden = useMemo(() => buildMockCrops(traceCount), [traceCount]);

  useEffect(() => {
    const storageKey = `huayu_last_visit_${gardenId}`;
    const lastVisit = localStorage.getItem(storageKey);
    const now = Date.now();
    if (lastVisit) {
      const daysAgo = Math.floor((now - Number(lastVisit)) / 86400000);
      if (daysAgo >= 1) {
        setReunion({ show: true, message: `自上次见面以来，这里又经历了一个${seasonLabel(new Date().getMonth() + 1)}。` });
        setTimeout(() => setReunion((p) => ({ ...p, show: false })), 5000);
      }
    }
    localStorage.setItem(storageKey, String(now));

    const stored = JSON.parse(localStorage.getItem("huayu_traces") || "[]");
    setSavedTraces(stored);
  }, [gardenId]);

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px]">
      {reunion.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed left-0 right-0 top-0 z-50 bg-[#F4E9C8]/90 px-5 py-4 text-center text-sm leading-6 text-[#596650] backdrop-blur-sm"
          style={{ paddingTop: "calc(var(--sat, 0px) + 16px)" }}
        >
          {reunion.message}
        </motion.div>
      )}

      {/* 花园场景 — 作物 + 年轮树 */}
      <div className="relative h-[48vh] min-h-[340px] w-full overflow-hidden bg-gradient-to-b from-[#DDE6EC]/60 via-[#FFFDF7]/40 to-[#C5D0C0]/30">
        {/* 天空装饰 */}
        <motion.div
          animate={{ y: [0, -5, 0], x: [0, 6, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[12%] top-[10%] rounded-full bg-white/50 px-3 py-1 text-xs text-[#8A8B7B] backdrop-blur-sm"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ y: [0, -3, 0], x: [0, -4, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[18%] top-[8%] rounded-full bg-white/40 px-3 py-1 text-xs text-[#8A8B7B] backdrop-blur-sm"
        >
          ☁️
        </motion.div>

        {/* 地面 */}
        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[#A8B6A3]/40 via-[#C5D0C0]/20 to-transparent" />

        {/* 作物种植区 */}
        <div className="absolute bottom-[18%] left-5 right-5">
          <div className="grid grid-cols-4 gap-x-2 gap-y-6">
            {garden.crops.map((crop) => {
              const cropComponents: Record<CropType, typeof Clover> = { clover: Clover, sunflower: Sunflower, rose: Rose, lotus: Lotus };
            const CropIcon = cropComponents[crop.type];
              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  <CropIcon stage={crop.stage} className="h-10 w-10" />
                  <span className="mt-1 text-[8px] text-[#707465]/70">{cropLabels[crop.type]}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 记忆年轮树 — 核心机制 */}
        <div className="absolute bottom-[15%] right-6 z-10">
          <div className="relative flex h-28 w-28 items-center justify-center">
            {/* 树轮 */}
            {garden.rings.map((ring, i) => (
              <button
                key={ring.id}
                onClick={() => setSelectedRing(selectedRing === i ? null : i)}
                className={`absolute rounded-full border transition-all duration-500 ${
                  selectedRing === i
                    ? "border-[#8EA085] bg-[#A8B6A3]/30"
                    : "border-[#B9B19F]/60 bg-[#D9D2C3]/20"
                }`}
                style={{
                  width: ring.radius * 2,
                  height: ring.radius * 2,
                }}
              >
                {selectedRing === i && (
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-[8px] font-medium text-[#596650]">{ring.season === "spring" ? "春" : ring.season === "summer" ? "夏" : ring.season === "autumn" ? "秋" : "冬"}{String(ring.year).slice(2)}</p>
                    <p className="mt-0.5 text-[6px] text-[#838777]">{ring.tracesCount} 条</p>
                  </div>
                )}
              </button>
            ))}
            {/* 树心 */}
            <div className="absolute z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#8B7E5A]/40 bg-[#D9B98B]/60">
              <Trees size={14} className="text-[#5A7A4A]" />
            </div>
          </div>
        </div>

        {/* 花园信息覆盖 */}
        <div className="absolute bottom-4 left-5 right-5 z-20 flex items-end justify-between">
          <div className="rounded-2xl bg-white/30 px-4 py-2 backdrop-blur-sm">
            <h1 className="font-['Long_Cang'] text-2xl text-[#314032] drop-shadow-sm">我们的花园</h1>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#314032]/70">
              <Clock size={11} /> 128 天 · {garden.crops.length} 株作物 · {garden.rings.length} 圈年轮
            </p>
          </div>
          <div className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[11px] text-[#314032]/70 backdrop-blur-sm">
            2 人
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-5 pt-5" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
        {/* 年轮详情 */}
        {selectedRing !== null && garden.rings[selectedRing] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 overflow-hidden rounded-[1.5rem] border-2 border-[#D9C892] bg-[#F4E9C8]/60 p-4"
          >
            <p className="text-xs text-[#7B704E]">
              {garden.rings[selectedRing].year} 年 {seasonLabel(new Date(0, ["spring", "summer", "autumn", "winter"].indexOf(garden.rings[selectedRing].season) * 3 + 1).getMonth() + 1)}
            </p>
            <p className="mt-1 text-sm text-[#596650]">{garden.rings[selectedRing].summary}</p>
            <p className="mt-1 text-[10px] text-[#838777]">{garden.rings[selectedRing].tracesCount} 条记忆</p>
          </motion.div>
        )}

        {/* 留痕入口 */}
        <button
          onClick={() => navigate(`/garden/${gardenId}/trace`)}
          className="group flex w-full items-center justify-center gap-2 rounded-[1.75rem] border-2 border-[#8EA085] bg-primary px-5 py-4 text-primary-foreground transition duration-500 hover:-rotate-1 active:scale-[0.98]"
        >
          <Plus size={18} />
          <span className="font-medium">留下今天</span>
          <span className="text-xs text-primary-foreground/60">（已有 {traceCount} 条记录）</span>
        </button>

        {/* 最近痕迹 */}
        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-medium text-[#596650]">
            <Leaf size={14} className="text-[#8EA085]" /> 最近痕迹
          </h2>
          <div className="mt-4 space-y-4">
            {savedTraces.length === 0 ? (
              <div className="rounded-[1.5rem] border-2 border-dashed border-[#D9D2C3] bg-[#FFFDF7]/50 p-8 text-center">
                <p className="text-sm text-[#B9B19F]">还没有痕迹</p>
                <p className="mt-1 text-xs text-[#B9B19F]">点击上方按钮留下今天的第一条记录</p>
              </div>
            ) : (
              savedTraces.slice(0, 10).map((trace, i) => (
                <motion.div
                  key={trace.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="rounded-[1.5rem] border-2 border-border bg-[#FFFDF7] p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0EFE8] text-[10px] text-[#596650]">{trace.user}</div>
                    <span className="text-xs text-[#838777]">{trace.user}</span>
                    <span className="text-[10px] text-[#B9B19F]">{trace.time}</span>
                  </div>
                  {trace.type === "photo" && typeof trace.content === "object" && "url" in trace.content && (
                    <div className="mt-3 space-y-2">
                      <img src={trace.content.url} alt="upload" className="w-full max-h-48 rounded-2xl border border-border object-cover" />
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
