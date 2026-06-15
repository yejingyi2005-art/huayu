import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Leaf, Plus, LogOut, ChevronRight, DoorOpen, X } from "lucide-react";

interface GardenInfo {
  id: string; name: string; type: string;
  inviteCode: string; createdAt: string;
  memberCount: number; memberNames: string[];
}

function loadGardens(): GardenInfo[] {
  try { return JSON.parse(localStorage.getItem("huayu_gardens") || "[]"); }
  catch { return []; }
}

function saveGardens(gardens: GardenInfo[]) {
  localStorage.setItem("huayu_gardens", JSON.stringify(gardens));
}

export function GardensPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nickname: string } | null>(null);
  const [gardens, setGardens] = useState<GardenInfo[]>([]);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [now] = useState(Date.now);

  useEffect(() => {
    const raw = localStorage.getItem("huayu_user");
    if (raw) setUser(JSON.parse(raw));
    setGardens(loadGardens());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("huayu_user");
    navigate("/login");
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) { setJoinError("请输入邀请码"); return; }
    const all = loadGardens();
    const target = all.find((g) => g.inviteCode === code);
    if (!target) { setJoinError("邀请码无效，请确认后重试"); return; }
    if (target.memberNames.includes("我")) { setJoinError("你已经在这个花园中了"); return; }
    target.memberCount += 1;
    target.memberNames.push("我");
    saveGardens(all);
    setGardens(loadGardens());
    setShowJoin(false);
    setJoinCode("");
    setJoinError("");
  };

  const dayCount = (createdAt: string) =>
    Math.max(1, Math.floor((now - new Date(createdAt).getTime()) / 86400000));

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px]">
      <div className="mx-auto max-w-lg px-5 py-6" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Long_Cang'] text-3xl text-[#596650]">我的花园</h1>
            <p className="mt-1 text-sm text-[#707465]">选择或创建一个关系空间</p>
          </div>
          {!showJoin && (
            <button onClick={() => setShowJoin(true)} className="flex items-center gap-1.5 rounded-full border border-[#A8B6A3] bg-[#A8B6A3]/10 px-3 py-1.5 text-xs text-[#596650]">
              <DoorOpen size={12} /> 加入
            </button>
          )}
        </div>

        {/* Join panel */}
        {showJoin && (
          <div className="mt-4 rounded-[1.75rem] border-2 border-[#D9C892] bg-[#F4E9C8]/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-[#7B704E]">输入邀请码加入花园</p>
              <button onClick={() => { setShowJoin(false); setJoinCode(""); setJoinError(""); }} className="text-[#B9B19F]">
                <X size={14} />
              </button>
            </div>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="输入 8 位邀请码"
              maxLength={8}
              className="w-full rounded-xl border-2 border-[#D9C892] bg-white px-4 py-2.5 text-center font-mono text-lg tracking-[0.3em] text-[#596650] placeholder:text-[#D9D2C3] focus:border-[#A8B6A3] focus:outline-none"
            />
            {joinError && <p className="mt-1.5 text-xs text-[#D07070]">{joinError}</p>}
            <button
              onClick={handleJoin}
              disabled={!joinCode.trim()}
              className="mt-3 w-full rounded-xl border-2 border-[#8EA085] bg-primary py-2.5 text-xs text-primary-foreground transition hover:-rotate-1 disabled:opacity-50"
            >
              加入
            </button>
          </div>
        )}

        {/* Garden list */}
        <div className="mt-6 space-y-4">
          {gardens.length === 0 ? (
            <div className="rounded-[1.75rem] border-2 border-dashed border-[#D9D2C3] bg-[#FFFDF7]/50 p-10 text-center">
              <Leaf size={28} className="mx-auto text-[#D9D2C3]" />
              <p className="mt-3 text-sm text-[#B9B19F]">还没有花园</p>
              <p className="mt-1 text-xs text-[#B9B19F]">创建一个，开始收藏你们的关系</p>
            </div>
          ) : (
            gardens.map((g) => (
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
                    {g.memberCount} 人 · {dayCount(g.createdAt)} 天
                    {g.memberNames.length > 0 && ` · ${g.memberNames.join("、")}`}
                  </p>
                </div>
                <ChevronRight size={18} className="text-[#D9D2C3]" />
              </button>
            ))
          )}
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
