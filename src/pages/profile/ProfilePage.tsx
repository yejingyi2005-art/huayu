import { useNavigate } from "react-router";
import { ArrowLeft, Leaf, User, Shield, Settings } from "lucide-react";

export function ProfilePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] text-foreground">
      <div className="mx-auto max-w-lg px-5 py-6">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465] transition hover:text-[#596650]">
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm text-muted-foreground">我的</p>
        </div>

        <div className="rounded-[2rem] border-2 border-border bg-[#FFFDF7]/80 p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#A8B6A3] bg-[#A8B6A3]/20">
            <User size={32} className="text-[#596650]" />
          </div>
          <p className="mt-4 text-lg font-medium text-[#596650]">花屿用户</p>
          <p className="mt-1 text-sm text-muted-foreground">待登录</p>
        </div>

        <div className="mt-6 space-y-3">
          {[
            { icon: User, label: "个人资料" },
            { icon: Settings, label: "设置" },
            { icon: Shield, label: "隐私管理" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex cursor-pointer items-center gap-4 rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-5 transition hover:bg-[#FFFDF7]"
            >
              <Icon size={18} className="text-[#8EA085]" />
              <span className="text-sm text-[#596650]">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Leaf size={20} className="mx-auto text-[#D9D2C3]" />
          <p className="mt-2 text-xs text-muted-foreground">花屿 Huayu v0.1.0</p>
        </div>
      </div>
    </main>
  );
}
