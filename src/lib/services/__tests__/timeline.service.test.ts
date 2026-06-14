import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from "../../supabase/client";
import { timelineService } from "../timeline.service";
import type { Trace } from "../../types";

const mockTraces = [
  { trace_id: "1", garden_id: "g1", created_at: "2026-03-15T10:00:00Z", type: "text" },
  { trace_id: "2", garden_id: "g1", created_at: "2025-12-20T10:00:00Z", type: "mood" },
  { trace_id: "3", garden_id: "g1", created_at: "2026-07-10T10:00:00Z", type: "photo" },
] as Trace[];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("timelineService.getByGarden", () => {
  it("groups traces by season", async () => {
    const orderMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockReturnThis();
    const selectMock = vi.fn().mockReturnThis();
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: selectMock.mockReturnValue({
        eq: eqMock.mockReturnValue({
          order: orderMock.mockReturnValue({
            data: mockTraces,
            error: null,
          }),
        }),
      }),
    });

    const groups = await timelineService.getByGarden("g1");

    expect(groups).toHaveLength(3);
    expect(groups[0]).toMatchObject({ year: 2026, season: "spring" });
    expect(groups[1]).toMatchObject({ year: 2025, season: "winter" });
    expect(groups[2]).toMatchObject({ year: 2026, season: "autumn" });
  });

  it("returns empty array when no traces", async () => {
    const orderMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockReturnThis();
    const selectMock = vi.fn().mockReturnThis();
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: selectMock.mockReturnValue({
        eq: eqMock.mockReturnValue({
          order: orderMock.mockReturnValue({
            data: [],
            error: null,
          }),
        }),
      }),
    });

    const groups = await timelineService.getByGarden("g1");
    expect(groups).toHaveLength(0);
  });

  it("throws on supabase error", async () => {
    const orderMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockReturnThis();
    const selectMock = vi.fn().mockReturnThis();
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: selectMock.mockReturnValue({
        eq: eqMock.mockReturnValue({
          order: orderMock.mockReturnValue({
            data: null,
            error: { message: "DB error" },
          }),
        }),
      }),
    });

    await expect(timelineService.getByGarden("g1")).rejects.toThrow("DB error");
  });
});
