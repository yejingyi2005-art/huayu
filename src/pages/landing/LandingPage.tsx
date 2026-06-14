import { ArrowRight, Feather, Leaf, Wind, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { PaperTape } from "../../components/brand/PaperTape";
import { DoodleIsland } from "../../components/brand/DoodleIsland";
import { SproutFloat } from "../../components/brand/SproutFloat";

const memories = [
  { date: "03.18", title: "在桥边散步", weather: "微风", color: "bg-[#DDE6EC]", note: "风把围巾吹成一条小河。" },
  { date: "04.02", title: "把第一颗种子埋下", weather: "晴天", color: "bg-[#F4E9C8]", note: "没有催它，只记得浇了一点水。" },
  { date: "05.09", title: "一起看完旧相册", weather: "小雨", color: "bg-[#F6E8EC]", note: "照片边缘有一点褪色，很好。" },
];

const weather = [
  { label: "晴天", meaning: "开心", bg: "bg-[#F4E9C8]" },
  { label: "微风", meaning: "平静", bg: "bg-[#DDE6EC]" },
  { label: "阴天", meaning: "疲惫", bg: "bg-[#EFEDE4]" },
  { label: "小雨", meaning: "难过", bg: "bg-[#F6E8EC]" },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-background bg-[linear-gradient(90deg,rgba(217,210,195,0.22)_1px,transparent_1px),linear-gradient(rgba(217,210,195,0.18)_1px,transparent_1px)] bg-[size:34px_34px] text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-10 px-5 py-8 md:grid-cols-[0.92fr_1.08fr] md:items-center md:px-10">
        <section className="relative rounded-[2rem] border-2 border-border bg-[#FFFDF7]/80 p-5 md:p-7">
          <PaperTape className="-top-3 left-12" />
          <div className="mb-9 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 rounded-full border border-border bg-[#F8F7F2] px-4 py-2 text-sm text-muted-foreground"><Leaf size={16} /> 花屿 Huayu</div>
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-border bg-[#F6E8EC] px-3 py-2 text-xs text-[#7E6870]">关系收藏馆</div>
              <button
                onClick={() => navigate("/login")}
                className="rounded-full border border-border bg-[#FFFDF7] px-4 py-2 text-xs text-[#596650] transition hover:bg-[#F8F7F2]"
              >
                <LogIn size={14} className="inline" /> 登录
              </button>
            </div>
          </div>
          <p className="mb-2 text-sm tracking-[0.28em] text-muted-foreground">TODAY'S QUIET PAGE</p>
          <h1 className="font-['Long_Cang'] text-7xl leading-none text-[#596650] md:text-8xl">今天也在<br />悄悄生长</h1>
          <p className="mt-6 max-w-md text-base leading-8 text-[#707465]">花屿把关系设计成一本会呼吸的手帐：没有红点，没有排行榜，只把共同经历过的天气、植物和纸页慢慢收好。</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/login")}
              className="group rounded-full border-2 border-[#8EA085] bg-primary px-5 py-3 text-primary-foreground transition duration-500 hover:-rotate-1"
            >
              写下一片记忆 <ArrowRight className="ml-2 inline size-4 transition duration-500 group-hover:translate-x-1" />
            </button>
            <button className="rounded-full border-2 border-border bg-[#FFFDF7] px-5 py-3 text-[#6E725F] transition duration-500 hover:rotate-1">翻看旧相册</button>
          </div>
          <DoodleIsland />
        </section>

        <section className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.78fr]">
            <div className="relative rounded-[1.75rem] border-2 border-border bg-card p-6">
              <PaperTape className="-top-3 right-10 rotate-3 bg-[#DDE6EC]/70" />
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-sm text-muted-foreground">共同时间</p><h2 className="mt-1 font-['Long_Cang'] text-5xl text-[#596650]">128 天</h2></div>
                <div className="rounded-3xl border border-border bg-[#DDE6EC] p-3 text-[#58707A]"><Wind /></div>
              </div>
              <div className="mt-6 border-t border-dashed border-border pt-5 text-sm leading-7 text-[#707465]">今天的小岛状态：微风。适合把一句没说完的话，夹进植物观察笔记里。</div>
            </div>
            <div className="rounded-[1.75rem] border-2 border-border bg-[#F8F7F2] p-5">
              <p className="mb-4 text-sm text-muted-foreground">低刺激原则</p>
              <div className="space-y-3 text-sm text-[#707465]">
                <p className="rounded-2xl border border-border bg-[#FFFDF7] p-3">不催促打开</p>
                <p className="rounded-2xl border border-border bg-[#FFFDF7] p-3">不显示未读压力</p>
                <p className="rounded-2xl border border-border bg-[#FFFDF7] p-3">只提醒值得纪念的慢时刻</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {weather.map((item) => (
              <div key={item.label} className={`${item.bg} rounded-[1.25rem] border-2 border-border p-4 text-center`}>
                <p className="font-['Long_Cang'] text-3xl text-[#596650]">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.meaning}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
            {memories.map((m, i) => (
              <motion.article key={m.title} initial={{ opacity: 0, y: 16, rotate: i - 1 }} animate={{ opacity: 1, y: 0, rotate: i - 1 }} transition={{ delay: i * 0.12, duration: 0.7 }} className={`${m.color} relative rounded-[1.5rem] border-2 border-border p-4`}>
                <div className="absolute -top-2 left-8 h-5 w-14 rotate-[-4deg] border border-[#D9D2C3] bg-white/45" />
                <p className="text-xs text-muted-foreground">{m.date}</p>
                <h3 className="mt-8 min-h-14 text-lg leading-7">{m.title}</h3>
                <p className="mt-3 text-xs leading-5 text-[#707465]">{m.note}</p>
                <p className="mt-4 rounded-full border border-border bg-white/35 px-3 py-1 text-xs text-muted-foreground">天气：{m.weather}</p>
              </motion.article>
            ))}
          </div>

          <div className="rounded-[1.75rem] border-2 border-dashed border-[#B9B19F] bg-[#FFFDF7] p-6">
            <div className="flex items-start gap-3"><Feather className="mt-2 size-5 text-[#8EA085]" /><div><p className="font-['Long_Cang'] text-4xl text-[#596650]">手帐感 × 绘本感 × Calm Technology</p><p className="mt-3 leading-8 text-[#707465]">每一次记录都像贴上一张纸片；每个入口都像翻页而不是冲刺；每个反馈都用天气、季节和植物生长表达，让用户感到被欢迎，而不是被打扰。</p></div></div>
          </div>
        </section>
      </div>
      <div className="fixed bottom-6 right-6 hidden md:block"><SproutFloat /></div>
    </main>
  );
}
