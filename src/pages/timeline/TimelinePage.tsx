import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CalendarDays, Camera, Type, Heart } from "lucide-react";
import { SEASON_LABEL } from "../../lib/constants";
import type { Season } from "../../lib/types";
import { PhotoImg } from "../../components/PhotoImg";

interface SavedTrace {
  id: string; type: "photo" | "text" | "mood";
  user: string; time: string;
  content: string | { photoId: string; caption?: string } | { emotion: string };
  createdAt: string;
}

interface TraceGroup {
  year: number;
  season: Season;
  traces: SavedTrace[];
}

function seasonEnum(m: number): Season {
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

const typeIcons: Record<string, typeof Type> = {
  text: Type, photo: Camera, mood: Heart,
};

const seasonColors: Record<Season, string> = {
  spring: "bg-[#F6E8EC]", summer: "bg-[#F4E9C8]", autumn: "bg-[#EFEDE4]", winter: "bg-[#DDE6EC]",
};

export function TimelinePage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<TraceGroup[]>([]);

  useEffect(() => {
    const key = `huayu_traces_${gardenId}`;
    const traces: SavedTrace[] = JSON.parse(localStorage.getItem(key) || "[]");
    const sorted = [...traces].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const grouped = new Map<string, TraceGroup>();
    for (const t of sorted) {
      const d = new Date(t.createdAt);
      const year = d.getFullYear();
      const season = seasonEnum(d.getMonth() + 1);
      const groupKey = `${year}-${season}`;
      const existing = grouped.get(groupKey);
      if (existing) {
        existing.traces.push(t);
      } else {
        grouped.set(groupKey, { year, season, traces: [t] });
      }
    }
    setGroups(Array.from(grouped.values()));
  }, [gardenId]);

  const renderContent = (trace: SavedTrace) => {
    if (trace.type === "text" && typeof trace.content === "string") return trace.content;
    if (trace.type === "photo" && typeof trace.content === "object" && "photoId" in trace.content) {
      return trace.content.caption || "📷 一张照片";
    }
    if (trace.type === "mood" && typeof trace.content === "object" && "emotion" in trace.content) {
      return `心情：${trace.content.emotion}`;
    }
    return "";
  };

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-6" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate(`/garden/${gardenId}`)} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465] transition hover:text-[#596650]">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays size={16} /> 时间长卷
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-[1.75rem] border-2 border-dashed border-[#D9D2C3] bg-[#FFFDF7]/50 p-12 text-center">
            <CalendarDays size={32} className="mx-auto text-[#D9D2C3]" />
            <p className="mt-4 text-sm text-[#B9B19F]">还没有记录</p>
            <p className="mt-1 text-xs text-[#B9B19F]">留下第一条痕迹后，时间线会在这里展开</p>
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map((group) => {
              return (
                <div key={`${group.year}-${group.season}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`h-px flex-1 ${seasonColors[group.season]}`} />
                    <h2 className="shrink-0 font-['Long_Cang'] text-2xl text-[#596650]">
                      {group.year} {SEASON_LABEL[group.season]}
                    </h2>
                    <div className={`h-px flex-1 ${seasonColors[group.season]}`} />
                  </div>

                  <div className="space-y-4">
                    {group.traces.map((trace) => {
                      const Icon = typeIcons[trace.type] ?? Type;
                      const d = new Date(trace.createdAt);
                      const dateStr = `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
                      return (
                        <div key={trace.id} className="rounded-[1.5rem] border-2 border-border bg-[#FFFDF7]/80 p-5">
                          <div className="flex items-center gap-2">
                            <Icon size={12} className="text-[#8EA085]" />
                            <span className="text-xs text-muted-foreground">{dateStr}</span>
                            <span className="text-[10px] text-[#B9B19F]">{trace.user}</span>
                          </div>
                          {trace.type === "photo" && typeof trace.content === "object" && "photoId" in trace.content && (
                            <PhotoImg photoId={trace.content.photoId} alt="" className="mt-3 w-full max-h-48 rounded-xl border border-border object-cover" />
                          )}
                          <p className="mt-2 text-sm leading-7 text-[#707465]">{renderContent(trace)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
