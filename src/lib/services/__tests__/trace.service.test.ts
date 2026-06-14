import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from "../../supabase/client";
import { traceService } from "../trace.service";
import type { Trace } from "../../types";

const mockTrace = {
  trace_id: "t1",
  garden_id: "g1",
  user_id: "u1",
  type: "text",
  content: { body: "今天天气真好" },
  created_at: "2026-03-18T10:00:00Z",
} as Trace;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("traceService.create", () => {
  it("creates a text trace", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: mockTrace, error: null });
    const selectMock = vi.fn().mockReturnThis();
    const insertMock = vi.fn().mockReturnThis();
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: insertMock.mockReturnValue({
        select: selectMock.mockReturnValue({
          single: singleMock,
        }),
      }),
    });

    const trace = await traceService.create("g1", "u1", "text", { body: "今天天气真好" });
    expect(trace.trace_id).toBe("t1");
    expect(trace.content.body).toBe("今天天气真好");
  });

  it("maps emotion to weather on mood traces", async () => {
    let capturedContent: Record<string, unknown> = {};
    const singleMock = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        data: { ...mockTrace, type: "mood", content: capturedContent },
        error: null,
      });
    });
    const selectMock = vi.fn().mockReturnThis();
    const insertMock = vi.fn().mockImplementation((data: Record<string, unknown>) => {
      capturedContent = data.content as Record<string, unknown>;
      return { select: selectMock.mockReturnValue({ single: singleMock }) };
    });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: insertMock,
    });

    await traceService.create("g1", "u1", "mood", { emotion: "happy" });
    expect(capturedContent.weather).toBe("sunny");
  });

  it("throws on create error", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: "Insert error" } });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: singleMock,
        }),
      }),
    });

    await expect(traceService.create("g1", "u1", "text", { body: "hi" })).rejects.toThrow("Insert error");
  });
});

describe("traceService.getByGarden", () => {
  it("returns traces ordered by date", async () => {
    const orderMock = vi.fn().mockReturnThis();
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: orderMock.mockResolvedValue({ data: [mockTrace], error: null }),
        }),
      }),
    });

    const traces = await traceService.getByGarden("g1");
    expect(traces).toHaveLength(1);
  });
});
