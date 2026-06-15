import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, BookHeart, Camera, Type, Heart } from "lucide-react";
import { SEASON_LABEL } from "../../lib/constants";
import type { Season } from "../../lib/types";
import type { Trace } from "../../lib/types";
import { PhotoImg } from "../../components/PhotoImg";
import { traceService } from "../../lib/services/trace.service";
import { memoryBookService } from "../../lib/services/memory-book.service";

function seasonEnum(m: number): Season {
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

const seasonBg: Record<Season, string> = {
  spring: "bg-[#F6E8EC]", summer: "bg-[#F4E9C8]", autumn: "bg-[#EFEDE4]", winter: "bg-[#DDE6EC]",
};

const seasonColors: Record<Season, string> = {
  spring: "border-[#F6E8EC] bg-[#FDF1F4]", summer: "border-[#F4E9C8] bg-[#FDF8E8]", autumn: "border-[#EFEDE4] bg-[#F8F5EE]", winter: "border-[#DDE6EC] bg-[#F0F4F6]",
};

const moodLabels: Record<string, string> = {
  happy: "开心", calm: "平静", tired: "疲惫", sad: "难过", surprised: "惊喜",
};

function buildSummary(traces: Trace[]) {
  const photoCount = traces.filter((t) => t.type === "photo").length;
  const textCount = traces.filter((t) => t.type === "text").length;
  const moodCount = traces.filter((t) => t.type === "mood").length;
  const total = traces.length;

  const moodEmotions: Record<string, number> = {};
  for (const t of traces) {
    if (t.type === "mood" && t.content.emotion) {
      moodEmotions[t.content.emotion] = (moodEmotions[t.content.emotion] ?? 0) + 1;
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
  return { summary: summaries[Math.floor(Math.random() * summaries.length)] ?? "", dominantMood };
}

export function MemoryBookPage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState<{ year: number; season: Season; traces: Trace[]; summary: string; dominantMood: string }[]>([]);

  useEffect(() => {
    if (!gardenId) return;
    let cancelled = false;
    traceService.getByGarden(gardenId).then((traces) => {
      if (cancelled) return;
      const sorted = [...traces].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      const grouped = new Map<string, Trace[]>();
      for (const t of sorted) {
        const d = new Date(t.created_at);
        const year = d.getFullYear();
        const season = seasonEnum(d.getMonth() + 1);
        const groupKey = `${year}-${season}`;
        const existing = grouped.get(groupKey);
        if (existing) existing.push(t);
        else grouped.set(groupKey, [t]);
      }

      const result: { year: number; season: Season; traces: Trace[]; summary: string; dominantMood: string }[] = [];
      for (const [key, seasonTraces] of grouped) {
        const [yearStr, seasonStr] = key.split("-");
        const { summary, dominantMood } = buildSummary(seasonTraces);
        result.push({ year: Number(yearStr), season: seasonStr as Season, traces: seasonTraces, summary, dominantMood });
      }
      setBooks(result);
    });
    return () => { cancelled = true; };
  }, [gardenId]);

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px]">
      <div className="mx-auto max-w-lg px-5 py-6" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(`/garden/${gardenId}`)} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465] transition hover:text-[#596650]">
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm text-muted-foreground">关系纪念册</p>
        </div>

        {books.length === 0 ? (
          <div className="rounded-[1.75rem] border-2 border-dashed border-[#D9D2C3] bg-[#FFFDF7]/50 p-10 text-center">
            <BookHeart size={28} className="mx-auto text-[#D9D2C3]" />
            <p className="mt-3 text-sm text-[#B9B19F]">还没有纪念册</p>
            <p className="mt-1 text-xs text-[#B9B19F]">留下一些痕迹，纪念册会自动生成</p>
          </div>
        ) : (
          <div className="space-y-6">
            {books.map((book) => (
              <div
                key={`${book.year}-${book.season}`}
                className={`rounded-[2rem] border-2 ${seasonColors[book.season]} p-6`}
              >
                {/* Cover */}
                <div className={`rounded-[1.5rem] ${seasonBg[book.season]} p-6 text-center`}>
                  <h2 className="font-['Long_Cang'] text-4xl text-[#596650]">
                    {book.year} {SEASON_LABEL[book.season]}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#707465]">{book.summary}</p>
                </div>

                {/* Traces */}
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-medium text-muted-foreground">记忆碎片</h3>
                  {book.traces.slice(0, 20).map((trace) => {
                    const Icon = trace.type === "photo" ? Camera : trace.type === "text" ? Type : Heart;
                    return (
                      <div key={trace.trace_id} className="flex items-start gap-3 rounded-xl border border-border bg-white/60 p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-[#F8F7F2]">
                          <Icon size={14} className="text-[#8EA085]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          {trace.type === "photo" && trace.content.url && (
                            <PhotoImg src={trace.content.url} alt="" className="mb-2 w-full max-h-32 object-cover rounded-lg" />
                          )}
                          <p className="text-xs leading-6 text-[#4C5148]">
                            {trace.type === "text" ? trace.content.body : trace.type === "mood" ? `心情：${moodLabels[trace.content.emotion ?? "calm"] ?? ""}` : (trace.content.caption ?? "📷")}
                          </p>
                          <p className="mt-1 text-[10px] text-[#B9B19F]">
                            {new Date(trace.created_at).toLocaleDateString("zh-CN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

