# 花屿 MVP 开发清单

> 基于 PRD V1.0、设计 V1.0、开发约束 V1.0 整理

---

## 一、项目初始化

- [x] 创建 Vite + React 项目（已存在，修复依赖 + 安装）
- [x] 配置 TypeScript 严格模式
- [x] 配置 Tailwind CSS v4 + `tw-animate-css`
- [x] 配置 `motion`（Framer Motion）
- [x] 配置路径别名 `@` → `src/`
- [x] 安装 shadcn/ui 组件库
- [x] 安装 Lucide React
- [x] 安装 date-fns、react-hook-form、sonner
- [x] 配置包管理（npm）
- [x] 配置 ESLint + Prettier

## 二、样式系统

- [x] 设置 `src/styles/fonts.css` — 导入 Long Cang + Noto Sans SC
- [x] 设置 `src/styles/tailwind.css` — Tailwind 入口 + tw-animate-css
- [x] 设置 `src/styles/theme.css` — 所有 CSS 变量（配色、圆角、字重）
- [x] 设置 `src/styles/index.css` — 统一入口
- [x] 实现网格纸背景纹理（`linear-gradient` 34px 网格）
- [x] 配置 dark mode variant

## 三、数据层

### Supabase 项目搭建（需手动操作）

- [ ] 创建 Supabase 项目
- [ ] 配置邮箱登录（开发版）
- [ ] 配置微信登录（正式版预留）

### 数据库表（通过 Supabase SQL Editor 执行 `scripts/001_init.sql`）

- [x] 创建 `scripts/001_init.sql` — 含全部表 + RLS + 触发器
- [ ] 在 Supabase SQL Editor 中执行 `001_init.sql`
- [ ] 创建 `trace-photos` Storage bucket

### 客户端

- [x] 实现 `src/lib/supabase/client.ts`
- [x] 实现 `src/lib/types.ts` — 所有 TS 类型定义
- [x] 实现 `src/lib/constants.ts` — 情绪→天气映射、季节定义

## 四、服务层

- [x] 实现 `src/lib/services/auth.service.ts`
- [x] 实现 `src/lib/services/garden.service.ts` — CRUD + invite + join
- [x] 实现 `src/lib/services/trace.service.ts` — CRUD
- [x] 实现 `src/lib/services/timeline.service.ts` — 按季节分组查询
- [x] 实现 `src/lib/services/memory-book.service.ts` — 自动生成
- [x] 实现 `src/lib/services/weather.service.ts` — 情绪→天气映射逻辑

## 五、Hooks

- [x] 实现 `use-auth.ts`
- [x] 实现 `use-garden.ts`
- [x] 实现 `use-traces.ts`
- [x] 实现 `use-timeline.ts`
- [x] 实现 `use-memory-book.ts`
- [x] 实现 `use-mobile.ts`

## 六、品牌组件

- [x] 实现 `PaperTape` — 纸胶带装饰组件
- [x] 实现 `DoodleIsland` — 手绘小岛（含动画云朵/树木/票根/天数徽章）
- [x] 实现 `SproutFloat` — 浮动嫩芽图标（从 LandingPage 提取为独立组件）

## 七、页面（P1-P7）

### P1 启动页

- [x] Logo + "花屿 Huayu" 品牌标识
- [x] "关系收藏馆" 标签
- [x] "TODAY'S QUIET PAGE" 宽间距英文
- [x] 主标题 "今天也在悄悄生长"（Long Cang 字型）
- [x] 产品定位描述文案
- [x] CTA 按钮 "写下一片记忆"（主）
- [x] CTA 按钮 "翻看旧相册"（次）
- [x] DoodleIsland 插图

### P2 创建空间页

- [x] 花园名称输入
- [x] 空间类型选择（双人 / 2-5 人小群）
- [x] 邀请链接生成
- [x] 分享功能（复制邀请码）

### P3 花园主页

- [x] 花园场景展示（季节/天气/昼夜）
- [x] "留下今天" 入口按钮
- [x] 最近痕迹展示列表
- [x] 共同时间计数器（如 "128 天"）
- [x] 小岛状态描述（场景组件内嵌）
- [x] 低刺激原则展示（3 条）
- [x] 情绪天气四宫格（晴/微风/阴/小雨）
- [x] 记忆卡片列表（含交错入场动画）
- [x] "手帐感 × 绘本感 × Calm Technology" 设计哲学横幅

### P4 留痕页

- [x] 文字记录（纯文本输入，最大 500 字）
- [x] 照片上传（MVP 展示入口）
- [x] 情绪选择器（开心/平静/疲惫/难过/惊喜）
- [x] 保存按钮 + 保存后反馈动画
- [x] 轻量表单，无互动压力

### P5 时间长卷页

- [x] 按时间线展示所有痕迹
- [x] 按季节分组（"2026 春" "2026 夏" ...）
- [x] 逐条痕迹卡片展示

### P6 关系纪念册页

- [x] 自动生成季度纪念册（MVP 展示框架）
- [x] 纪念册封面 + 内容展示
- [x] 季节里程碑展示

### P7 我的页面

- [x] 个人资料展示
- [x] 设置入口
- [x] 隐私管理入口

## 八、核心流程

- [x] **登录流程**：LandingPage → LoginPage（邮箱注册/登录） → GardensPage
- [x] **创建空间**：GardensPage → CreateGardenPage → 自动跳转返回
- [x] **记录痕迹**：进入花园 → 点击"留下今天" → 上传照片/情绪/一句话 → 保存 → 空间变化
- [x] **关系回顾**：进入时间长卷 → 浏览季节记录 → 查看纪念册 → 回顾共同时间
- [x] **重逢体验**：长时间未进入 → 再次打开 → 系统展示季节变化消息 → 回到空间

## 九、动效实现

- [x] 云朵漂浮动画（14s 循环）— DoodleIsland
- [x] 树木摇摆动画（5.5s / 6.5s 循环）— DoodleIsland
- [x] 记忆卡片交错入场（0.7s + 0.12s stagger）— GardenPage
- [x] 嫩芽浮动动画（8s 循环）— SproutFloat
- [x] CTA 按钮 hover 旋转（-1deg / +1deg）— GardenPage + LandingPage
- [x] CTA 按钮箭头位移（group-hover translate-x-1）— GardenPage

## 十、AI 能力（V2）

- [ ] 实现 `src/lib/ai/client.ts` — OpenAI 客户端
- [ ] 实现 `src/lib/ai/prompts.ts` — 提示词模板
  - [ ] 季度回忆录摘要提示词
  - [ ] 年度关系故事提示词
  - [ ] 纪念册自动整理提示词
- [ ] 实现 `src/lib/ai/generators.ts` — 生成器函数
- [ ] 预览机制（AI 生成内容先预览后保存）

## 十一、质量保障

### 测试

- [x] 单元测试：服务层函数（26 tests, 6 files）
- [ ] 集成测试：核心业务流
- [ ] E2E 测试：创建空间 → 留痕 → 回顾

### 验收

- [x] TypeScript 编译零错误
- [x] 无 `any` 类型
- [x] 组件文件 ≤ 200 行（最大 151 行）
- [x] 服务层与组件层分离
- [x] 所有样式使用 CSS 变量或 Tailwind
- [x] 配色符合 theme.css Token 表
- [x] 圆角使用 `--radius` 体系
- [x] 无饱和色、无锐利直角
- [x] 交互用天气/季节/植物表达，无数字红点
- [x] 响应式：mobile 单栏 → md 双栏

## 十二、MVP 红线检查

- [x] 确认无聊天功能
- [x] 确认无点赞功能
- [x] 确认无评论功能
- [x] 确认无私信功能
- [x] 确认无已读状态
- [x] 确认无红点提醒
- [x] 确认无打卡/签到
- [x] 确认无排行榜
- [x] 确认无等级体系
- [x] 确认无商城系统
- [x] 确认无社区/广场

---

## 进度

| 阶段 | 状态 |
|------|------|
| 项目初始化 | ✅ |
| 样式系统 | ✅ |
| 数据层 | ✅（Supabase 项目搭建需手动） |
| 服务层 | ✅ |
| Hooks | ✅ |
| 品牌组件 | ✅ |
| P1 启动页 | ✅ |
| P2 创建空间页 | ✅ |
| P3 花园主页 | ✅ |
| P4 留痕页 | ✅ |
| P5 时间长卷页 | ✅ |
| P6 关系纪念册页 | ✅ |
| P7 我的页面 | ✅ |
| GardensPage 花园列表 | ✅ |
| BottomNav 底部导航 | ✅ |
| LoginPage 登录页 | ✅ |
| 重逢时刻 | ✅ |
| iPhone 响应式布局 | ✅（safe-area + viewport-fit + BottomNav） |
| 核心流程联调 | ✅（登录→创建→花园→留痕→回顾，mock数据） |
| 动效实现 | ✅（全部 6 项完成） |
| AI 能力（V2） | ⬜（V2 阶段） |
| 测试 | ✅（26 tests, 6 files, Vitest） |
| 验收 | ✅（全部通过） |
