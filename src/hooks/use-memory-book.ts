import { useState, useEffect } from "react";
import type { MemoryBook } from "../lib/types";
import { memoryBookService } from "../lib/services/memory-book.service";

export function useMemoryBooks(gardenId: string | undefined) {
  const [books, setBooks] = useState<MemoryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gardenId) return;
    let cancelled = false;
    memoryBookService
      .getByGarden(gardenId)
      .then((data) => { if (!cancelled) setBooks(data); })
      .catch((e) => { if (!cancelled) setError((e as { message?: string }).message ?? "获取纪念册失败"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [gardenId]);

  return { books, loading, error };
}
