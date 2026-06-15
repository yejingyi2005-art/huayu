import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Image, Type, Smile, X, Check, Loader } from "lucide-react";
import { motion } from "motion/react";
import type { TraceType, Emotion } from "../../lib/types";
import { MOOD_WEATHER_MAP } from "../../lib/constants";
import { savePhoto } from "../../lib/services/photo-store";
import { traceService } from "../../lib/services/trace.service";
import { useAuth } from "../../hooks/use-auth";

const emotions: { key: Emotion; label: string }[] = [
  { key: "happy", label: "开心" },
  { key: "calm", label: "平静" },
  { key: "tired", label: "疲惫" },
  { key: "sad", label: "难过" },
  { key: "surprised", label: "惊喜" },
];

const MAX_IMG_WIDTH = 1200;
const MAX_IMG_HEIGHT = 1200;
const JPEG_QUALITY = 0.7;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > MAX_IMG_WIDTH || h > MAX_IMG_HEIGHT) {
        const ratio = Math.min(MAX_IMG_WIDTH / w, MAX_IMG_HEIGHT / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function TracePage() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [traceType, setTraceType] = useState<TraceType>("text");
  const [text, setText] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("请选择图片文件"); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError("图片不能超过 10MB"); return; }
    setUploading(true);
    setUploadError("");
    try {
      const compressed = await compressImage(file);
      setPhotoDataUrl(compressed);
    } catch {
      setUploadError("图片处理失败，请重试");
    }
    setUploading(false);
    e.target.value = "";
  }, []);

  const handleSave = async () => {
    if (!gardenId || !user) return;
    if (traceType === "text" && !text.trim()) return;
    if (traceType === "mood" && !selectedEmotion) return;
    if (traceType === "photo" && !photoDataUrl) return;

    const traceId = crypto.randomUUID();

    try {
      if (traceType === "text") {
        await traceService.create(gardenId, user.user_id, "text", { body: text.trim() });
      } else if (traceType === "mood" && selectedEmotion) {
        await traceService.create(gardenId, user.user_id, "mood", { emotion: selectedEmotion });
      } else if (traceType === "photo" && photoDataUrl) {
        await savePhoto(traceId, photoDataUrl);
        await traceService.create(gardenId, user.user_id, "photo", { photoId: traceId, caption: photoCaption });
      }
    } catch {
      setUploadError("保存失败，请重试");
      return;
    }

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
          <div className="mb-6 grid grid-cols-3 gap-2">
            {([
              { key: "text" as TraceType, label: "文字", icon: Type },
              { key: "photo" as TraceType, label: "照片", icon: Image },
              { key: "mood" as TraceType, label: "情绪", icon: Smile },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setTraceType(key); setUploadError(""); }}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-4 transition ${
                  traceType === key ? "border-[#A8B6A3] bg-[#A8B6A3]/10" : "border-border bg-[#FFFDF7]"
                }`}
              >
                <Icon size={20} className="text-[#8EA085]" />
                <span className="text-xs text-[#596650]">{label}</span>
              </button>
            ))}
          </div>

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
                    onClick={() => { setPhotoDataUrl(null); setPhotoCaption(""); setUploadError(""); }}
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
                  <p className="border-t border-border px-4 py-2 text-[10px] text-[#B9B19F]">
                    已压缩至 ~{Math.round(photoDataUrl.length * 0.75 / 1024)}KB
                  </p>
                </div>
              ) : uploading ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#D9D2C3] bg-[#F8F7F2] px-6 py-12">
                  <Loader size={24} className="animate-spin text-[#8EA085]" />
                  <p className="text-sm text-[#707465]">正在处理图片...</p>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#D9D2C3] bg-[#F8F7F2] px-6 py-12 transition hover:border-[#A8B6A3]"
                  >
                    <Image size={32} className="text-[#8EA085]" />
                    <p className="text-sm text-[#707465]">点击选择照片</p>
                    <p className="text-xs text-muted-foreground">支持 JPG / PNG，最大 10MB</p>
                  </button>
                  {uploadError && (
                    <p className="mt-2 rounded-xl bg-[#F6E8EC] px-4 py-2 text-xs text-[#B97979]">{uploadError}</p>
                  )}
                </div>
              )}
            </div>
          )}

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

          {uploadError && (
            <p className="mt-4 rounded-xl bg-[#F6E8EC] px-4 py-2.5 text-xs text-[#B97979]">{uploadError}</p>
          )}

          <button
            onClick={handleSave}
            disabled={
              uploading ||
              (traceType === "text" && !text.trim()) ||
              (traceType === "mood" && !selectedEmotion) ||
              (traceType === "photo" && !photoDataUrl)
            }
            className="mt-6 w-full rounded-full border-2 border-[#8EA085] bg-primary px-5 py-3 text-primary-foreground transition duration-500 hover:-rotate-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "处理中..." : "保存到花园"}
          </button>
        </div>
      </div>
    </main>
  );
}
