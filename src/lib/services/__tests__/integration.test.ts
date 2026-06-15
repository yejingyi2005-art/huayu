import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../supabase/client", () => ({
  supabase: { from: vi.fn() },
}));

import { supabase } from "../../supabase/client";
import { gardenService } from "../garden.service";
import { traceService } from "../trace.service";
import { timelineService } from "../timeline.service";
import { memoryBookService } from "../memory-book.service";
import { weatherService } from "../weather.service";
import type { Garden, Trace } from "../../types";

function makeTrace(overrides: Partial<Trace> = {}): Trace {
  const id = `t${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  return {
    trace_id: id,
    garden_id: "g_int_1",
    user_id: "u_int_1",
    type: "text",
    content: { body: "test" },
    created_at: new Date().toISOString(),
    ...overrides,
  } as Trace;
}

const mockGarden = {
  garden_id: "g_int_1",
  name: "测试花园",
  invite_code: "ABC123",
  status: "active",
  created_at: "2026-01-15T08:00:00Z",
} as Garden;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("核心业务流程：创建空间 → 留痕 → 回顾", () => {
  it("完整的创建花园流程", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: mockGarden, error: null });
    const selectMock = vi.fn().mockReturnThis();
    const insertMock = vi.fn().mockReturnThis();
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === "gardens") {
        return { insert: insertMock.mockReturnValue({ select: selectMock.mockReturnValue({ single: singleMock }) }) };
      }
      if (table === "garden_members") {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
      return {};
    });

    const garden = await gardenService.create("测试花园", "u_int_1");
    expect(garden.garden_id).toBe("g_int_1");
    expect(garden.name).toBe("测试花园");
    expect(garden.invite_code).toBeDefined();
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ name: "测试花园" }));
  });

  it("完整的留痕流程（文字 → 心情 → 照片）", async () => {
    let inserted: Record<string, unknown>[] = [];
    const singleMock = vi.fn().mockImplementation(() => {
      const data = inserted[inserted.length - 1];
      return Promise.resolve({ data, error: null });
    });
    const selectMock = vi.fn().mockReturnThis();
    const insertMock = vi.fn().mockImplementation((row: Record<string, unknown>) => {
      inserted.push(row);
      return { select: selectMock.mockReturnValue({ single: singleMock }) };
    });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: insertMock,
    });

    await traceService.create("g_int_1", "u_int_1", "text", { body: "今天去了海边" });
    await traceService.create("g_int_1", "u_int_1", "mood", { emotion: "happy" });
    await traceService.create("g_int_1", "u_int_1", "photo", { caption: "落日", url: "url1" });

    expect(insertMock).toHaveBeenCalledTimes(3);
    expect(inserted[0]?.content).toMatchObject({ body: "今天去了海边" });
    expect(inserted[1]?.content).toMatchObject({ emotion: "happy", weather: "sunny" });
    expect(inserted[2]?.content).toMatchObject({ caption: "落日", url: "url1" });
  });

  it("时间线按季节分组的正确性", async () => {
    const traces = [
      makeTrace({ trace_id: "t1", created_at: "2026-03-15T10:00:00Z", content: { body: "春1" } }),
      makeTrace({ trace_id: "t2", created_at: "2026-04-01T10:00:00Z", content: { body: "春2" } }),
      makeTrace({ trace_id: "t3", created_at: "2026-07-15T10:00:00Z", content: { body: "夏" } }),
      makeTrace({ trace_id: "t4", created_at: "2026-10-01T10:00:00Z", content: { body: "秋" } }),
      makeTrace({ trace_id: "t5", created_at: "2027-01-10T10:00:00Z", content: { body: "冬" } }),
    ];
    const orderMock = vi.fn().mockResolvedValue({ data: traces, error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({ order: orderMock }),
      }),
    });

    const groups = await timelineService.getByGarden("g_int_1");

    expect(groups).toHaveLength(4);
    const spring = groups.find((g) => g.season === "spring" && g.year === 2026);
    const summer = groups.find((g) => g.season === "summer" && g.year === 2026);
    const autumn = groups.find((g) => g.season === "autumn" && g.year === 2026);
    const winter = groups.find((g) => g.season === "winter" && g.year === 2026);
    expect(spring?.traces).toHaveLength(2);
    expect(summer?.traces).toHaveLength(1);
    expect(autumn?.traces).toHaveLength(1);
    expect(winter?.traces).toHaveLength(1);
  });

  it("纪念册 getOrCreate 在存在时返回已有记录", async () => {
    const mockBook = {
      book_id: "b1",
      garden_id: "g_int_1",
      season: "spring",
      year: 2026,
      summary: "春天的回忆",
      created_at: "2026-06-01T00:00:00Z",
    };
    const singleMock = vi.fn().mockResolvedValue({ data: mockBook, error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({ single: singleMock }),
          }),
        }),
      }),
    });

    const book = await memoryBookService.getOrCreate("g_int_1", "spring", 2026);
    expect(book.book_id).toBe("b1");
    expect(book.summary).toBe("春天的回忆");
  });

  it("纪念册 getOrCreate 在没有记录时创建", async () => {
    const singleMockFind = vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } });
    const newBook = {
      book_id: "b_new",
      garden_id: "g_int_1",
      season: "summer",
      year: 2026,
      summary: "",
      created_at: "2026-09-01T00:00:00Z",
    };
    const singleMockCreate = vi.fn().mockResolvedValue({ data: newBook, error: null });
    const insertMock = vi.fn().mockReturnThis();
    const selectMock = vi.fn().mockReturnThis();

    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === "memory_books") {
        return {
          select: vi.fn().mockImplementation(() => ({
            eq: vi.fn().mockImplementation(() => ({
              eq: vi.fn().mockImplementation(() => ({
                eq: vi.fn().mockImplementation(() => ({
                  single: singleMockFind,
                })),
              })),
            })),
          })),
          insert: insertMock.mockReturnValue({ select: selectMock.mockReturnValue({ single: singleMockCreate }) }),
        };
      }
      return {};
    });

    const book = await memoryBookService.getOrCreate("g_int_1", "summer", 2026);
    expect(book.book_id).toBe("b_new");
    expect(insertMock).toHaveBeenCalled();
  });
});

describe("心情 → 天气映射", () => {
  it("所有情绪都有对应的天气映射", () => {
    const emotions = ["happy", "calm", "tired", "sad", "surprised"];
    for (const e of emotions) {
      const weather = weatherService.emotionToWeather(e as never);
      expect(weather).toBeDefined();
      expect(typeof weather).toBe("string");
    }
  });
});

describe("跨服务协作场景", () => {
  it("创建花园 → 留痕 → 获取时间线 → 创建纪念册", async () => {
    const traces = [
      makeTrace({ trace_id: "t1", garden_id: "g_int_2", type: "text", content: { body: "第一天" }, created_at: "2026-03-01T10:00:00Z" }),
      makeTrace({ trace_id: "t2", garden_id: "g_int_2", type: "mood", content: { emotion: "calm" }, created_at: "2026-04-15T10:00:00Z" }),
      makeTrace({ trace_id: "t3", garden_id: "g_int_2", type: "photo", content: { url: "url2", caption: "花开" }, created_at: "2026-05-20T10:00:00Z" }),
    ];

    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === "gardens") {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { garden_id: "g_int_2", name: "协作花园", invite_code: "DEF456", status: "active", created_at: "2026-03-01T00:00:00Z" },
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === "garden_members") {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
      if (table === "traces") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: traces, error: null }),
            }),
          }),
        };
      }
      if (table === "memory_books") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
                }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { book_id: "b_collab", garden_id: "g_int_2", season: "spring", year: 2026, summary: "", created_at: "2026-06-01T00:00:00Z" },
                error: null,
              }),
            }),
          }),
        };
      }
      return {};
    });

    const garden = await gardenService.create("协作花园", "u_int_2");
    expect(garden.garden_id).toBe("g_int_2");

    const groups = await timelineService.getByGarden("g_int_2");
    expect(groups).toHaveLength(1);
    expect(groups[0]?.traces).toHaveLength(3);

    const book = await memoryBookService.getOrCreate("g_int_2", "spring", 2026);
    expect(book.book_id).toBe("b_collab");
    expect(book.season).toBe("spring");
  });
});
