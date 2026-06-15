import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Leaf, User, Shield, Settings, Sun, Moon,
  LogOut, Camera, Edit3, BarChart3, Book, Sprout, Image,
  Heart, Smile, Meh, Frown, Sparkles, Trash2, Download, Loader,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { savePhoto, getPhoto } from "../../lib/services/photo-store";

interface SavedTrace {
  id: string; type: "photo" | "text" | "mood";
  user: string; time: string;
  content: string | { url: string; caption?: string } | { emotion: string };
  createdAt: string;
}

interface SavedGarden {
  id: string; name: string; createdAt: string; memberCount: number; traceCount: number;
}

const emotionIcons: Record<string, typeof Smile> = {
  happy: Smile, calm: Meh, tired: Meh, sad: Frown, surprised: Sparkles,
};

const emotionLabels: Record<string, string> = {
  happy: "开心", calm: "平静", tired: "疲惫", sad: "难过", surprised: "惊喜",
};

const MAX_AVATAR_SIZE = 400;

function compressAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      const size = Math.min(img.width, img.height, MAX_AVATAR_SIZE);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "stats" | "settings">("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(localStorage.getItem("huayu_nickname") || "花屿用户");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [now] = useState(Date.now);

  const gardens: SavedGarden[] = useMemo(() => {
    const g = localStorage.getItem("huayu_gardens");
    return g ? JSON.parse(g) : [];
  }, []);

  const traces: SavedTrace[] = useMemo(() => {
    const all: SavedTrace[] = [];
    for (const garden of gardens) {
      try {
        const key = `huayu_traces_${garden.id}`;
        const items = JSON.parse(localStorage.getItem(key) || "[]");
        all.push(...items);
      } catch { /* garden has no traces yet */ }
    }
    return all;
  }, [gardens]);

  const stats = useMemo(() => {
    const photoCount = traces.filter((t) => t.type === "photo").length;
    const textCount = traces.filter((t) => t.type === "text").length;
    const moodCount = traces.filter((t) => t.type === "mood").length;
    const moodEmotions: Record<string, number> = {};
    for (const t of traces) {
      if (t.type === "mood" && typeof t.content === "object" && "emotion" in t.content) {
        const e = t.content.emotion as string;
        moodEmotions[e] = (moodEmotions[e] ?? 0) + 1;
      }
    }
    const sortedMoods = Object.entries(moodEmotions).sort((a, b) => b[1] - a[1]);
    const dominantMood = sortedMoods[0]?.[0] ?? "calm";
    const firstDate = traces.length > 0 ? Math.min(...traces.map((t) => new Date(t.createdAt).getTime())) : now;
    const daysSinceFirst = Math.max(1, Math.floor((now - firstDate) / 86400000));
    return { photoCount, textCount, moodCount, dominantMood, sortedMoods, daysSinceFirst, totalTraces: traces.length };
  }, [traces, now]);

  useEffect(() => {
    getPhoto("avatar").then((url) => { if (url) setAvatarUrl(url); });
    const saved = localStorage.getItem("huayu_dark_mode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    setUploadingAvatar(true);
    try {
      const dataUrl = await compressAvatar(file);
      await savePhoto("avatar", dataUrl);
      setAvatarUrl(dataUrl);
    } catch { /* ignore */ }
    setUploadingAvatar(false);
    e.target.value = "";
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("huayu_dark_mode", String(next));
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("huayu_user");
    navigate("/login");
  };

  const handleClearData = () => {
    if (confirm("确定要清除所有本地数据吗？此操作不可撤销。")) {
      for (const garden of gardens) {
        localStorage.removeItem(`huayu_traces_${garden.id}`);
      }
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = { traces, gardens, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `huayu-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] text-foreground">
      <div className="mx-auto max-w-lg px-5" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
        {/* 顶栏 */}
        <div className="flex items-center justify-between py-5">
          <button onClick={() => navigate(-1)} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465] transition hover:text-[#596650]">
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm text-muted-foreground">我的</p>
          <div className="w-9" />
        </div>

        {/* 标签切换 */}
        <div className="mb-5 flex gap-1 rounded-2xl border-2 border-border bg-[#F0EFE8]/60 p-1">
          {[
            { key: "profile" as const, label: "资料", icon: User },
            { key: "stats" as const, label: "统计", icon: BarChart3 },
            { key: "settings" as const, label: "设置", icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs transition ${
                activeTab === key ? "bg-[#FFFDF7] text-[#596650] shadow-sm" : "text-[#B9B19F]"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* 资料标签 */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <div className="rounded-[2rem] border-2 border-border bg-[#FFFDF7]/80 p-6 text-center">
                <div className="relative mx-auto inline-block">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#A8B6A3] overflow-hidden bg-gradient-to-br from-[#A8B6A3]/20 to-[#C5D0C0]/20">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User size={32} className="text-[#596650]" />
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-[#FFFDF7] shadow-sm"
                  >
                    {uploadingAvatar ? <Loader size={10} className="animate-spin text-[#8EA085]" /> : <Camera size={12} className="text-[#8EA085]" />}
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {editingNickname ? (
                    <input
                      autoFocus
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      onBlur={() => { localStorage.setItem("huayu_nickname", nickname); setEditingNickname(false); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { localStorage.setItem("huayu_nickname", nickname); setEditingNickname(false); } }}
                      className="w-40 rounded-lg border-2 border-[#8EA085] bg-white px-3 py-1 text-center text-lg font-medium text-[#596650] outline-none"
                    />
                  ) : (
                    <p className="text-lg font-medium text-[#596650]">{nickname}</p>
                  )}
                  <button onClick={() => setEditingNickname(!editingNickname)} className="text-[#B9B19F] hover:text-[#8EA085]">
                    <Edit3 size={12} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  加入花屿 {stats.daysSinceFirst} 天
                </p>
              </div>

              <div className="rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-5">
                <p className="mb-3 text-xs font-medium text-[#596650] flex items-center gap-2">
                  <Sprout size={14} className="text-[#8EA085]" /> 我的花园
                </p>
                <div className="space-y-2">
                  {gardens.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => navigate(`/garden/${g.id}`)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-[#F0EFE8]/40 p-3 transition hover:bg-[#F0EFE8]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A8B6A3]/20">
                        <Leaf size={16} className="text-[#8EA085]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#596650]">{g.name}</p>
                        <p className="text-[10px] text-muted-foreground">{g.memberCount} 人 · {g.traceCount} 条痕迹</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/create")}
                  className="mt-3 w-full rounded-xl border-2 border-dashed border-[#D9D2C3] py-2.5 text-xs text-[#B9B19F] transition hover:border-[#8EA085] hover:text-[#8EA085]"
                >
                  + 创建新花园
                </button>
              </div>
            </motion.div>
          )}

          {/* 统计标签 */}
          {activeTab === "stats" && (
            <motion.div key="stats" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Image, label: "照片", value: stats.photoCount, color: "#8EA085" },
                  { icon: Edit3, label: "文字", value: stats.textCount, color: "#D9A0A0" },
                  { icon: Heart, label: "心情", value: stats.moodCount, color: "#C8A8D0" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="rounded-[1.25rem] border-2 border-border bg-[#FFFDF7]/80 p-4 text-center">
                    <Icon size={18} className="mx-auto" style={{ color }} />
                    <p className="mt-2 font-['Long_Cang'] text-xl text-[#596650]">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-5">
                <p className="mb-3 text-xs font-medium text-[#596650]">心情分布</p>
                {stats.sortedMoods.length === 0 ? (
                  <p className="text-xs text-muted-foreground">还没有心情记录</p>
                ) : (
                  <div className="space-y-2">
                    {stats.sortedMoods.map(([emotion, count]) => {
                      const EmotionIcon = emotionIcons[emotion] ?? Meh;
                      const pct = Math.round((count / stats.totalTraces) * 100);
                      return (
                        <div key={emotion} className="flex items-center gap-2">
                          <EmotionIcon size={14} className="text-[#8EA085]" />
                          <span className="w-10 text-xs text-[#596650]">{emotionLabels[emotion] ?? emotion}</span>
                          <div className="flex-1 h-2 rounded-full bg-[#F0EFE8] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-[#A8B6A3] to-[#8EA085]"
                            />
                          </div>
                          <span className="w-8 text-right text-[10px] text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-5">
                <p className="mb-3 text-xs font-medium text-[#596650]">时光统计</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "共同天数", value: stats.daysSinceFirst, unit: "天", icon: Leaf },
                    { label: "痕迹总数", value: stats.totalTraces, unit: "条", icon: Book },
                    { label: "花园数量", value: gardens.length, unit: "个", icon: Sprout },
                    { label: "主导心情", value: emotionLabels[stats.dominantMood] ?? stats.dominantMood, unit: "", icon: Smile },
                  ].map(({ label, value, unit, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-2 rounded-xl border border-border bg-[#F0EFE8]/40 p-3">
                      <Icon size={14} className="text-[#8EA085]" />
                      <div>
                        <p className="text-xs text-[#596650]">{value}{unit}</p>
                        <p className="text-[9px] text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 设置标签 */}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <div className="rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-5">
                <p className="mb-3 text-xs font-medium text-[#596650] icon-[Sun]">偏好</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-[#F0EFE8]/40 p-3">
                    <div className="flex items-center gap-2">
                      {darkMode ? <Moon size={16} className="text-[#8EA085]" /> : <Sun size={16} className="text-[#8EA085]" />}
                      <span className="text-sm text-[#596650]">深色模式</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative h-5 w-9 rounded-full transition-colors ${darkMode ? "bg-[#8EA085]" : "bg-[#D9D2C3]"}`}
                    >
                      <motion.div
                        animate={{ x: darkMode ? 18 : 2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="h-4 w-4 rounded-full bg-white shadow-sm"
                        style={{ marginTop: 2 }}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border bg-[#F0EFE8]/40 p-3">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-[#8EA085]" />
                      <span className="text-sm text-[#596650]">隐私管理</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">本地存储</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-5">
                <p className="mb-3 text-xs font-medium text-[#596650]">数据管理</p>
                <div className="space-y-2">
                  <button onClick={handleExportData} className="flex w-full items-center gap-2 rounded-xl border border-border bg-[#F0EFE8]/40 p-3 text-left transition hover:bg-[#F0EFE8]">
                    <Download size={16} className="text-[#8EA085]" />
                    <div>
                      <p className="text-sm text-[#596650]">导出数据</p>
                      <p className="text-[10px] text-muted-foreground">下载 JSON 格式备份</p>
                    </div>
                  </button>
                  <button onClick={handleClearData} className="flex w-full items-center gap-2 rounded-xl border border-[#E8C0C0] bg-[#FFF0F0]/40 p-3 text-left transition hover:bg-[#FFF0F0]">
                    <Trash2 size={16} className="text-[#D07070]" />
                    <div>
                      <p className="text-sm text-[#C06060]">清除数据</p>
                      <p className="text-[10px] text-[#D0A0A0]">删除所有本地痕迹记录</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="rounded-[1.75rem] border-2 border-border bg-[#FFFDF7]/80 p-5">
                <p className="mb-3 text-xs font-medium text-[#596650]">关于</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-[#F0EFE8]/40 p-3">
                    <span className="text-sm text-[#596650]">版本</span>
                    <span className="text-xs text-muted-foreground">v0.1.0</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border bg-[#F0EFE8]/40 p-3">
                    <span className="text-sm text-[#596650]">数据位置</span>
                    <span className="text-xs text-muted-foreground">本地存储</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-[1.75rem] border-2 border-[#E8C0C0] bg-[#FFF0F0]/60 py-4 text-sm text-[#C06060] transition hover:bg-[#FFF0F0]"
              >
                <LogOut size={16} />
                退出登录
              </button>

              <AnimatePresence>
                {showLogoutConfirm && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="rounded-[1.5rem] border-2 border-[#E8C0C0] bg-[#FFF0F0]/80 p-5 text-center"
                  >
                    <p className="text-sm text-[#C06060]">确定退出登录？</p>
                    <p className="mt-1 text-xs text-[#D0A0A0]">本地数据仍会保留</p>
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-xl border-2 border-border bg-white py-2.5 text-xs text-[#596650]">
                        取消
                      </button>
                      <button onClick={handleLogout} className="flex-1 rounded-xl border-2 border-[#D07070] bg-[#D07070] py-2.5 text-xs text-white">
                        退出
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pb-6 text-center">
                <Leaf size={16} className="mx-auto text-[#D9D2C3]" />
                <p className="mt-2 text-[10px] text-muted-foreground">花屿 Huayu · 关系收藏馆</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
