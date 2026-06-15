import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, Users, Link, ArrowLeft, Check } from "lucide-react";

type GardenType = "duo" | "group";

interface GardenInfo {
  id: string; name: string; type: GardenType;
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

export function CreateGardenPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState<GardenType>("duo");
  const [garden, setGarden] = useState<GardenInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    const id = crypto.randomUUID().slice(0, 8);
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newGarden: GardenInfo = {
      id, name: name.trim(), type,
      inviteCode: code,
      createdAt: new Date().toISOString(),
      memberCount: 1, memberNames: ["我"],
    };
    const all = loadGardens();
    all.push(newGarden);
    saveGardens(all);
    setGarden(newGarden);
  };

  const handleCopy = () => {
    if (!garden) return;
    const text = `🏡 花屿 · ${garden.name}\n邀请码：${garden.inviteCode}\n在「花屿」App 中输入邀请码即可加入我们`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (garden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] p-5">
        <div className="w-full max-w-md rounded-[2rem] border-2 border-border bg-[#FFFDF7]/80 p-8 text-center">
          <Leaf className="mx-auto mb-4 size-10 text-[#8EA085]" />
          <h1 className="font-['Long_Cang'] text-4xl text-[#596650]">花园已创建</h1>
          <p className="mt-3 text-sm text-[#707465]">分享邀请码，让朋友加入</p>
          <div className="mt-6 rounded-2xl border-2 border-dashed border-[#D9D2C3] bg-[#F8F7F2] px-6 py-4">
            <p className="font-mono text-2xl tracking-[0.3em] text-[#596650]">{garden.inviteCode}</p>
          </div>
          <button
            onClick={handleCopy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#8EA085] bg-primary px-5 py-3 text-primary-foreground transition duration-500 hover:-rotate-1"
          >
            {copied ? <Check size={16} /> : <Link size={16} />}
            {copied ? "已复制" : "复制邀请码"}
          </button>
          <button
            onClick={() => navigate("/gardens")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-[#FFFDF7] px-5 py-3 text-[#6E725F] transition duration-500 hover:rotate-1"
          >
            <ArrowLeft size={16} /> 查看我的花园
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] p-5">
      <div className="w-full max-w-md rounded-[2rem] border-2 border-border bg-[#FFFDF7]/80 p-8">
        <button onClick={() => navigate("/gardens")} className="mb-6 flex items-center gap-2 text-sm text-[#707465] transition hover:text-[#596650]">
          <ArrowLeft size={16} /> 返回
        </button>

        <Leaf className="mb-4 size-10 text-[#8EA085]" />
        <h1 className="font-['Long_Cang'] text-4xl text-[#596650]">创建花园</h1>
        <p className="mt-2 text-sm leading-6 text-[#707465]">为一段关系留一个位置</p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#596650]">花园名称</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="给你们的空间取个名字..."
              className="w-full rounded-2xl border-2 border-border bg-[#FFFDF7] px-4 py-3 text-sm text-[#4C5148] placeholder:text-[#838777] focus:border-[#A8B6A3] focus:outline-none"
              maxLength={50}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#596650]">空间类型</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType("duo")}
                className={`rounded-2xl border-2 p-4 text-center transition ${
                  type === "duo" ? "border-[#A8B6A3] bg-[#A8B6A3]/10" : "border-border bg-[#FFFDF7]"
                }`}
              >
                <Users size={20} className="mx-auto mb-2 text-[#8EA085]" />
                <p className="text-sm font-medium text-[#596650]">双人空间</p>
                <p className="mt-1 text-xs text-[#838777]">两个人</p>
              </button>
              <button
                onClick={() => setType("group")}
                className={`rounded-2xl border-2 p-4 text-center transition ${
                  type === "group" ? "border-[#A8B6A3] bg-[#A8B6A3]/10" : "border-border bg-[#FFFDF7]"
                }`}
              >
                <Users size={20} className="mx-auto mb-2 text-[#8EA085]" />
                <p className="text-sm font-medium text-[#596650]">小群空间</p>
                <p className="mt-1 text-xs text-[#838777]">2~5 人</p>
              </button>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="w-full rounded-full border-2 border-[#8EA085] bg-primary px-5 py-3 text-primary-foreground transition duration-500 hover:-rotate-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            创建花园
          </button>
        </div>
      </div>
    </main>
  );
}
