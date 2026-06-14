import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from "../../supabase/client";
import { memoryBookService } from "../memory-book.service";
import type { MemoryBook } from "../../types";

const mockBook = {
  book_id: "b1",
  garden_id: "g1",
  season: "spring",
  year: 2026,
  summary: "一个安静的春天",
} as MemoryBook;

function makeChain(result: unknown) {
  const chain = { order: vi.fn(), eq: vi.fn(), select: vi.fn(), single: vi.fn(), insert: vi.fn() };
  chain.order
    .mockReturnValueOnce(chain)
    .mockResolvedValue(result);
  chain.eq.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.single.mockResolvedValue(result);
  chain.insert.mockReturnValue(chain);
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("memoryBookService.getByGarden", () => {
  it("returns memory books for garden", async () => {
    const chain = makeChain({ data: [mockBook], error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);

    const books = await memoryBookService.getByGarden("g1");
    expect(books).toHaveLength(1);
    expect(books[0]?.season).toBe("spring");
  });
});

describe("memoryBookService.create", () => {
  it("creates a new memory book", async () => {
    const chain = makeChain({ data: mockBook, error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);

    const book = await memoryBookService.create("g1", "spring", 2026, "一个安静的春天");
    expect(book.book_id).toBe("b1");
  });
});

describe("memoryBookService.getOrCreate", () => {
  it("returns existing book if found", async () => {
    const chain = makeChain({ data: mockBook, error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);

    const book = await memoryBookService.getOrCreate("g1", "spring", 2026);
    expect(book.book_id).toBe("b1");
    expect(book.summary).toBe("一个安静的春天");
  });

  it("creates new book if not found", async () => {
    let callCount = 0;
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return makeChain({ data: null, error: { message: "Not found" } });
      }
      return makeChain({ data: { ...mockBook, summary: "" }, error: null });
    });

    const book = await memoryBookService.getOrCreate("g1", "spring", 2026);
    expect(book.summary).toBe("");
  });
});
