import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { SEASONS, SEASON_LABEL } from "../../lib/constants";
import type { Season } from "../../lib/types";

const mockGroups = [
  {
    year: 2026,
    season: "spring" as Season,
    traces: [
      { date: "03.18", title: "在桥边散步", weather: "微风", note: "风把围巾吹成一条小河。" },
      { date: "04.02", title: "把第一颗种子埋下", weather: "晴天", note: "没有催它，只记得浇了一点水。" },
    ],
  },
  {
    year: 2026,
    season: "summer" as Season,
    traces: [
      { date: "06.01", title: "一起看完旧相册", weather: "小雨", note: "照片边缘有一点褪色，很好。" },
    ],
  },
];

export function TimelinePage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-6">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate(`/garden/${gardenId}`)} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465] transition hover:text-[#596650]">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays size={16} /> 时间长卷
          </div>
        </div>

        <div className="space-y-10">
          {mockGroups.map((group) => {
            const seasonIndex = SEASONS.indexOf(group.season);
            const seasonColors = ["bg-[#F6E8EC]", "bg-[#F4E9C8]", "bg-[#EFEDE4]", "bg-[#DDE6EC]"];
            return (
              <div key={`${group.year}-${group.season}`}>
                {/* Season header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`h-px flex-1 ${seasonColors[seasonIndex]}`} />
                  <h2 className="shrink-0 font-['Long_Cang'] text-2xl text-[#596650]">
                    {group.year} {SEASON_LABEL[group.season]}
                  </h2>
                  <div className={`h-px flex-1 ${seasonColors[seasonIndex]}`} />
                </div>

                {/* Traces */}
                <div className="space-y-4">
                  {group.traces.map((trace) => (
                    <div
                      key={trace.date + trace.title}
                      className="rounded-[1.5rem] border-2 border-border bg-[#FFFDF7]/80 p-5"
                    >
                      <p className="text-xs text-muted-foreground">{trace.date}</p>
                      <h3 className="mt-2 text-lg leading-7 text-[#596650]">{trace.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#707465]">{trace.note}</p>
                      {trace.weather && (
                        <p className="mt-3 inline-block rounded-full border border-border bg-white/35 px-3 py-1 text-xs text-muted-foreground">
                          天气：{trace.weather}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
