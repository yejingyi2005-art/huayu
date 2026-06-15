import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, Mail, Lock, ArrowLeft } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("请填写邮箱和密码");
      return;
    }
    if (password.length < 6) {
      setError("密码至少 6 位");
      return;
    }
    if (mode === "register" && !nickname.trim()) {
      setError("请填写昵称");
      return;
    }

    // Simulate auth — stores user in localStorage for MVP
    const userNickname = mode === "register" ? nickname.trim() : (email.split("@")[0] || "");
    const user = {
      id: crypto.randomUUID(),
      email: email.trim(),
      nickname: userNickname,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("huayu_user", JSON.stringify(user));
    localStorage.setItem("huayu_nickname", userNickname);
    navigate("/gardens");
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] px-5">
      <div className="w-full max-w-sm">
        <button onClick={() => navigate("/")} className="mb-8 flex items-center gap-2 text-sm text-[#707465]">
          <ArrowLeft size={16} /> 返回首页
        </button>

        <div className="text-center">
          <Leaf className="mx-auto size-10 text-[#8EA085]" />
          <h1 className="mt-4 font-['Long_Cang'] text-4xl text-[#596650]">花屿</h1>
          <p className="mt-2 text-sm text-[#707465]">
            {mode === "login" ? "欢迎回来" : "创建一个位置"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-sm text-[#596650]">昵称</label>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-[#FFFDF7] px-4 py-3">
                <Leaf size={16} className="text-[#838777]" />
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="你的名字"
                  className="flex-1 bg-transparent text-sm text-[#4C5148] placeholder:text-[#838777] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-[#596650]">邮箱</label>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-[#FFFDF7] px-4 py-3">
              <Mail size={16} className="text-[#838777]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm text-[#4C5148] placeholder:text-[#838777] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#596650]">密码</label>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-[#FFFDF7] px-4 py-3">
              <Lock size={16} className="text-[#838777]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位"
                className="flex-1 bg-transparent text-sm text-[#4C5148] placeholder:text-[#838777] focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-[#F6E8EC] px-4 py-2 text-sm text-[#B97979]">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-full border-2 border-[#8EA085] bg-primary px-5 py-3 text-primary-foreground transition duration-500 active:scale-[0.97]"
          >
            {mode === "login" ? "登录" : "注册"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#838777]">
          {mode === "login" ? "没有账号？" : "已有账号？"}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="ml-1 text-[#596650] underline"
          >
            {mode === "login" ? "注册" : "登录"}
          </button>
        </p>
      </div>
    </main>
  );
}
