import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Image, Type, Smile, X, Check } from "lucide-react";
import { motion } from "motion/react";
import type { TraceType, Emotion } from "../../lib/types";
import { MOOD_WEATHER_MAP } from "../../lib/constants";

const emotions: { key: Emotion; label: string }[] = [
  { key: "happy", label: "开心" },
  { key: "calm", label: "平静" },
  { key: "tired", label: "疲惫" },
  { key: "sad", label: "难过" },
  { key: "surprised", label: "惊喜" },
];

export function TracePage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [traceType, setTraceType] = useState<TraceType>("text");
  const [text, setText] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [saved, setSaved] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) { alert("图片不能超过 10MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (traceType === "text" && !text.trim()) return;
    if (traceType === "mood" && !selectedEmotion) return;
    if (traceType === "photo" && !photoDataUrl) return;

    const trace = {
      id: crypto.randomUUID(),
      gardenId,
      type: traceType,
      content: traceType === "text" ? text.trim() :
               traceType === "photo" ? { url: photoDataUrl, caption: photoCaption } :
               { emotion: selectedEmotion },
      user: "你",
      time: "刚刚",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("huayu_traces") || "[]");
    existing.unshift(trace);
    localStorage.setItem("huayu_traces", JSON.stringify(existing));

    setSaved(true);
    setTimeout(() => navigate(`/garden/${gardenId}`), 1500);
  };

  if (saved) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] px-5">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#A8B6A3] bg-[#A8B6A3]/20">
            <Check className="size-8 text-[#596650]" />
          </div>
          <h2 className="font-['Long_Cang'] text-3xl text-[#596650]">已留下痕迹</h2>
          <p className="mt-3 text-sm leading-6 text-[#707465]">{traceType === "photo" ? "照片已添加到花园" : traceType === "mood" ? "你的心情已融入花园天气" : "文字已保存在时间长卷中"}</p>
          <p className="mt-8 text-xs text-[#B9B19F]">即将回到花园</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px]">
      <div className="px-5 py-6" style={{ paddingBottom: "calc(80px + var(--sab, 0px))" }}>
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate(`/garden/${gardenId}`)} className="rounded-full border border-border bg-[#FFFDF7] p-2 text-[#707465] transition hover:text-[#596650]">
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm text-muted-foreground">留下今天</p>
        </div>

        <div className="rounded-[2rem] border-2 border-border bg-[#FFFDF7]/80 p-6">
          {/* Type Selector */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            {([
              { key: "text" as TraceType, label: "文字", icon: Type },
              { key: "photo" as TraceType, label: "照片", icon: Image },
              { key: "mood" as TraceType, label: "情绪", icon: Smile },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTraceType(key)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-4 transition ${
                  traceType === key ? "border-[#A8B6A3] bg-[#A8B6A3]/10" : "border-border bg-[#FFFDF7]"
                }`}
              >
                <Icon size={20} className="text-[#8EA085]" />
                <span className="text-xs text-[#596650]">{label}</span>
              </button>
            ))}
          </div>

          {/* Text input */}
          {traceType === "text" && (
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="今天发生了什么？"
                className="w-full rounded-2xl border-2 border-border bg-[#FFFDF7] px-4 py-3 text-sm text-[#4C5148] placeholder:text-[#838777] focus:border-[#A8B6A3] focus:outline-none"
                rows={5}
                maxLength={500}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">{text.length}/500</p>
            </div>
          )}

          {/* Photo upload */}
          {traceType === "photo" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              {photoDataUrl ? (
                <div className="relative rounded-2xl border-2 border-border overflow-hidden">
                  <img src={photoDataUrl} alt="preview" className="w-full max-h-64 object-cover" />
                  <button
                    onClick={() => { setPhotoDataUrl(null); setPhotoCaption(""); }}
                    className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 text-white"
                  >
                    <X size={14} />
                  </button>
                  <input
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="添加一段描述…"
                    className="w-full border-t border-border bg-[#FFFDF7] px-4 py-3 text-sm text-[#4C5148] placeholder:text-[#838777] focus:outline-none"
                  />
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#D9D2C3] bg-[#F8F7F2] px-6 py-12 transition hover:border-[#A8B6A3]"
                >
                  <Image size={32} className="text-[#8EA085]" />
                  <p className="text-sm text-[#707465]">点击选择照片</p>
                  <p className="text-xs text-muted-foreground">支持 JPG / PNG，最大 10MB</p>
                </button>
              )}
            </div>
          )}

          {/* Mood picker */}
          {traceType === "mood" && (
            <div className="space-y-3">
              <p className="text-sm text-[#707465]">今天的心情是？</p>
              <div className="grid grid-cols-5 gap-2">
                {emotions.map(({ key, label }) => {
                  const weather = MOOD_WEATHER_MAP[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedEmotion(key)}
                      className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition ${
                        selectedEmotion === key ? "border-[#A8B6A3] bg-[#A8B6A3]/10" : "border-border bg-[#FFFDF7]"
                      }`}
                    >
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: weather.color }} />
                      <span className="text-xs text-[#596650]">{weather.label}</span>
                      <span className="text-[10px] text-muted-foreground">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={
              (traceType === "text" && !text.trim()) ||
              (traceType === "mood" && !selectedEmotion) ||
              (traceType === "photo" && !photoDataUrl)
            }
            className="mt-6 w-full rounded-full border-2 border-[#8EA085] bg-primary px-5 py-3 text-primary-foreground transition duration-500 hover:-rotate-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            保存到花园
          </button>
        </div>
      </div>
    </main>
  );
}
