import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, BookHeart, Camera, Heart, Type } from "lucide-react";
import { SEASON_LABEL } from "../../lib/constants";
import type { Season } from "../../lib/types";
import { PhotoImg } from "../../components/PhotoImg";

interface SavedTrace {
  id: string; type: "photo" | "text" | "mood";
  user: string; time: string;
  content: string | { photoId: string; caption?: string } | { emotion: string };
  createdAt: string;
}

interface SeasonBook {
  year: number;
  season: Season;
  traces: SavedTrace[];
  summary: string;
  dominantMood: string;
}

function seasonEnum(m: number): Season {
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

const seasonBg: Record<Season, string> = {
  spring: "bg-[#F6E8EC]", summer: "bg-[#F4E9C8]", autumn: "bg-[#EFEDE4]", winter: "bg-[#DDE6EC]",
};

const moodLabels: Record<string, string> = {
  happy: "开心", calm: "平静", tired: "疲惫", sad: "难过", surprised: "惊喜",
};

function buildSummary(traces: SavedTrace[]): { summary: string; dominantMood: string } {
  const photoCount = traces.filter((t) => t.type === "photo").length;
  const textCount = traces.filter((t) => t.type === "text").length;
  const moodCount = traces.filter((t) => t.type === "mood").length;
  const total = traces.length;

  const moodEmotions: Record<string, number> = {};
  for (const t of traces) {
    if (t.type === "mood" && typeof t.content === "object" && "emotion" in t.content) {
      const e = t.content.emotion as string;
      moodEmotions[e] = (moodEmotions[e] ?? 0) + 1;
    }
  }
  const sorted = Object.entries(moodEmotions).sort((a, b) => b[1] - a[1]);
  const dominantMood = sorted[0]?.[0] ?? "calm";

  const parts: string[] = [];
  if (photoCount > 0) parts.push(`${photoCount} 张照片`);
  if (textCount > 0) parts.push(`${textCount} 段文字`);
  if (moodCount > 0) parts.push(`${moodCount} 次心情`);
  const detail = parts.length > 0 ? `，包含 ${parts.join("、")}` : "";

  const summaries = [
    `一起度过了这个季节，留下了 ${total} 条记忆${detail}。`,
    `这个季节充满了 ${moodLabels[dominantMood] ?? "平静"} 的瞬间，共 ${total} 次记录。`,
    `${total} 次痕迹，拼成了这一季的故事。`,
  ];
  const summary = summaries[Math.floor(Math.random() * summaries.length)] ?? "";
  return { summary, dominantMood };
}

export function MemoryBookPage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState<SeasonBook[]>([]);

  useEffect(() => {
    const key = `huayu_traces_${gardenId}`;
    const traces: SavedTrace[] = JSON.parse(localStorage.getItem(key) || "[]");
    const sorted = [...traces].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const grouped = new Map<string, SavedTrace[]>();
    for (const t of sorted) {
      const d = new Date(t.createdAt);
      const year = d.getFullYear();
      const season = seasonEnum(d.getMonth() + 1);
      const groupKey = `${year}-${season}`;
      const existing = grouped.get(groupKey);
      if (existing) existing.push(t);
      else grouped.set(groupKey, [t]);
    }

    const result: SeasonBook[] = [];
    for (const [key, seasonTraces] of grouped) {
      const [yearStr, seasonStr] = key.split("-");
      const { summary, dominantMood } = buildSummary(seasonTraces);
      result.push({
        year: Number(yearStr),
        season: seasonStr as Season,
        traces: seasonTraces,
        summary,
        dominantMood,
      });
    }
    setBooks(result);
  }, [gardenId]);

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-6" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate(`/garden/${gardenId}`)} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465] transition hover:text-[#596650]">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookHeart size={16} /> 关系纪念册
          </div>
        </div>

        {books.length === 0 ? (
          <div className="rounded-[1.75rem] border-2 border-dashed border-[#D9D2C3] bg-[#FFFDF7]/50 p-12 text-center">
            <BookHeart size={32} className="mx-auto text-[#D9D2C3]" />
            <p className="mt-4 text-sm text-[#B9B19F]">还没有纪念册</p>
            <p className="mt-1 text-xs text-[#B9B19F]">留下痕迹后，每个季节会自动生成一册纪念</p>
          </div>
        ) : (
          <div className="space-y-5">
            {[...books].reverse().map((book) => (
              <div
                key={`${book.year}-${book.season}`}
                className={`${seasonBg[book.season]} rounded-[1.75rem] border-2 border-border p-6`}
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-border bg-white/45 px-3 py-1 text-xs text-muted-foreground">
                    {book.year} {SEASON_LABEL[book.season]}
                  </div>
                  <div className="rounded-full border border-border bg-white/45 px-3 py-1 text-xs text-muted-foreground">
                    {book.traces.length} 条记忆
                  </div>
                </div>

                <p className="mt-4 leading-7 text-[#4C5148]">{book.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {book.traces.slice(0, 5).map((trace) => {
                    if (trace.type === "photo" && typeof trace.content === "object" && "photoId" in trace.content) {
                      return (
                        <div key={trace.id} className="h-14 w-14 overflow-hidden rounded-xl border border-border">
                          <PhotoImg photoId={trace.content.photoId} alt="" className="h-full w-full object-cover" />
                        </div>
                      );
                    }
                    const icons: Record<string, typeof Heart> = { text: Type, photo: Camera, mood: Heart };
                    const Icon = icons[trace.type] ?? Type;
                    return (
                      <div key={trace.id} className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-white/60">
                        <Icon size={16} className="text-[#8EA085]" />
                      </div>
                    );
                  })}
                  {book.traces.length > 5 && (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-border bg-white/30 text-[10px] text-muted-foreground">
                      +{book.traces.length - 5}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
