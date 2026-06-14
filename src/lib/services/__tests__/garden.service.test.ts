import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from "../../supabase/client";
import { gardenService } from "../garden.service";
import type { Garden } from "../../types";

const mockGarden = {
  garden_id: "g1",
  name: "我们的花园",
  invite_code: "AbCdE",
  status: "active",
} as Garden;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("gardenService.create", () => {
  it("creates garden and adds owner member", async () => {
    const singleMock = vi.fn().mockReturnThis();
    const selectMock = vi.fn().mockReturnThis();
    const insertMock = vi.fn().mockReturnThis();

    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === "gardens") {
        return {
          insert: insertMock.mockReturnValue({
            select: selectMock.mockReturnValue({
              single: singleMock.mockResolvedValue({ data: mockGarden, error: null }),
            }),
          }),
        };
      }
      return {
        insert: vi.fn().mockReturnValue({ error: null }),
      };
    });

    const garden = await gardenService.create("我们的花园", "user1");
    expect(garden.name).toBe("我们的花园");
    expect(garden.invite_code).toHaveLength(5);
  });

  it("throws on garden insert error", async () => {
    const singleMock = vi.fn().mockReturnThis();
    const selectMock = vi.fn().mockReturnThis();
    const insertMock = vi.fn().mockReturnThis();

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: insertMock.mockReturnValue({
        select: selectMock.mockReturnValue({
          single: singleMock.mockResolvedValue({ data: null, error: { message: "Insert failed" } }),
        }),
      }),
    });

    await expect(gardenService.create("test", "user1")).rejects.toThrow("Insert failed");
  });
});

describe("gardenService.getByUser", () => {
  it("returns gardens for user with memberships", async () => {
    let callCount = 0;
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              data: [{ garden_id: "g1" }, { garden_id: "g2" }],
              error: null,
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            data: [mockGarden, { ...mockGarden, garden_id: "g2", name: "室友回忆录" }],
            error: null,
          }),
        }),
      };
    });

    const gardens = await gardenService.getByUser("user1");
    expect(gardens).toHaveLength(2);
    expect(gardens[0]?.name).toBe("我们的花园");
  });

  it("returns empty array when no memberships", async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: [],
          error: null,
        }),
      }),
    });

    const gardens = await gardenService.getByUser("user1");
    expect(gardens).toHaveLength(0);
  });
});

describe("gardenService.getById", () => {
  it("returns garden by id", async () => {
    const singleMock = vi.fn().mockReturnThis();
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: singleMock.mockResolvedValue({ data: mockGarden, error: null }),
        }),
      }),
    });

    const garden = await gardenService.getById("g1");
    expect(garden.garden_id).toBe("g1");
  });
});
