import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CalendarDays, Camera, Type, Heart } from "lucide-react";
import type { Season } from "../../lib/types";
import { PhotoImg } from "../../components/PhotoImg";
import { useTimeline } from "../../hooks/use-timeline";

const typeIcons: Record<string, typeof Type> = {
  text: Type, photo: Camera, mood: Heart,
};

const seasonColors: Record<Season, string> = {
  spring: "bg-[#F6E8EC]", summer: "bg-[#F4E9C8]", autumn: "bg-[#EFEDE4]", winter: "bg-[#DDE6EC]",
};

const seasonLabels: Record<Season, string> = {
  spring: "春", summer: "夏", autumn: "秋", winter: "冬",
};

function traceContent(trace: { type: string; content: Record<string, unknown> }) {
  if (trace.type === "text") return trace.content.body as string ?? "";
  if (trace.type === "photo") {
    const c = trace.content as { photoId?: string; caption?: string };
    return c.caption ?? "📷";
  }
  return "💭";
}

export function TimelinePage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const { groups, loading } = useTimeline(gardenId);

  if (loading) return null;

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px]">
      <div className="mx-auto max-w-lg px-5 py-6" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(`/garden/${gardenId}`)} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465] transition hover:text-[#596650]">
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm text-muted-foreground">时间长卷</p>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-[1.75rem] border-2 border-dashed border-[#D9D2C3] bg-[#FFFDF7]/50 p-10 text-center">
            <CalendarDays size={28} className="mx-auto text-[#D9D2C3]" />
            <p className="mt-3 text-sm text-[#B9B19F]">还没有记录</p>
            <p className="mt-1 text-xs text-[#B9B19F]">留下一些痕迹，时间会帮你收藏</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={`${group.year}-${group.season}`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full ${seasonColors[group.season]}`} />
                  <h2 className="font-['Long_Cang'] text-2xl text-[#596650]">
                    {group.year} {seasonLabels[group.season]}
                  </h2>
                </div>
                <div className="space-y-3">
                  {group.traces.map((trace) => {
                    const Icon = typeIcons[trace.type] ?? Type;
                    return (
                      <div
                        key={trace.trace_id}
                        className="flex items-start gap-4 rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-[#F8F7F2]">
                          <Icon size={16} className="text-[#8EA085]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {trace.type === "photo" && (trace.content as { url?: string }).url && (
                            <PhotoImg
                              src={(trace.content as { url: string }).url}
                              alt=""
                              className="mb-2 w-full max-h-40 object-cover rounded-xl"
                            />
                          )}
                          <p className="text-sm leading-7 text-[#4C5148]">{traceContent(trace)}</p>
                          <p className="mt-1 text-[10px] text-[#B9B19F]">
                            {new Date(trace.created_at).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
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
