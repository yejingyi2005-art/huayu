import { useParams, useNavigate } from "react-router";
import { ArrowLeft, BookHeart } from "lucide-react";
import { SEASON_LABEL } from "../../lib/constants";
import type { Season } from "../../lib/types";

const mockBooks = [
  { year: 2026, season: "spring" as Season, summary: "一起度过了第一个春天。三月的风还带着凉意，但花已经开始开了。" },
  { year: 2026, season: "summer" as Season, summary: "夏天来了。一起在傍晚散步，看云慢慢飘过。" },
];

export function MemoryBookPage() {
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
            <BookHeart size={16} /> 关系纪念册
          </div>
        </div>

        <div className="space-y-5">
          {mockBooks.map((book) => {
            const colorIndex = ["spring", "summer", "autumn", "winter"].indexOf(book.season);
            const colors = ["bg-[#F6E8EC]", "bg-[#F4E9C8]", "bg-[#EFEDE4]", "bg-[#DDE6EC]"];
            return (
              <div
                key={`${book.year}-${book.season}`}
                className={`${colors[colorIndex]} rounded-[1.75rem] border-2 border-border p-6`}
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-border bg-white/45 px-3 py-1 text-xs text-muted-foreground">
                    {book.year} {SEASON_LABEL[book.season]}
                  </div>
                </div>
                <p className="mt-4 leading-7 text-[#4C5148]">{book.summary}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
