import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Leaf, Plus, LogOut, ChevronRight } from "lucide-react";

interface GardenItem {
  id: string;
  name: string;
  memberCount: number;
  dayCount: number;
  weather: string;
}

const mockGardens: GardenItem[] = [
  { id: "g1", name: "我们的花园", memberCount: 2, dayCount: 128, weather: "微风" },
  { id: "g2", name: "室友回忆录", memberCount: 4, dayCount: 365, weather: "晴天" },
];

export function GardensPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nickname: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("huayu_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("huayu_user");
    navigate("/login");
  };

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px]">
      <div className="mx-auto max-w-lg px-5 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-[#8EA085]" />
            <span className="text-sm text-[#596650]">花屿</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#707465]">{user?.nickname}</span>
            <button onClick={handleLogout} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465]">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <h1 className="font-['Long_Cang'] text-3xl text-[#596650]">我的花园</h1>
        <p className="mt-1 text-sm text-[#707465]">选择或创建一个关系空间</p>

        {/* Garden list */}
        <div className="mt-6 space-y-4">
          {mockGardens.map((g) => (
            <button
              key={g.id}
              onClick={() => navigate(`/garden/${g.id}`)}
              className="flex w-full items-center gap-4 rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-5 text-left transition active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-[#F8F7F2]">
                <Leaf size={20} className="text-[#8EA085]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#596650]">{g.name}</p>
                <p className="mt-0.5 text-xs text-[#838777]">
                  {g.memberCount} 人 · {g.dayCount} 天 · {g.weather}
                </p>
              </div>
              <ChevronRight size={18} className="text-[#D9D2C3]" />
            </button>
          ))}
        </div>

        {/* Create new */}
        <button
          onClick={() => navigate("/create")}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-[1.75rem] border-2 border-dashed border-[#D9D2C3] bg-[#FFFDF7]/50 px-5 py-4 text-[#596650] transition active:scale-[0.98]"
        >
          <Plus size={18} /> 创建新花园
        </button>
      </div>
    </main>
  );
}
