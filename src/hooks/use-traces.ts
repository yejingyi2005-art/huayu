import { useState, useEffect, useCallback, useRef } from "react";
import type { Trace, TraceContent, TraceType } from "../lib/types";
import { traceService } from "../lib/services/trace.service";

export function useTraces(gardenId: string | undefined) {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  const fetch = useCallback(async () => {
    if (!gardenId) return;
    try {
      const data = await traceService.getByGarden(gardenId);
      if (mounted.current) setTraces(data);
    } catch (e) {
      if (mounted.current) setError((e as { message?: string }).message ?? "获取痕迹失败");
    }
    if (mounted.current) setLoading(false);
  }, [gardenId]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(
    async (type: TraceType, content: TraceContent, userId: string) => {
      if (!gardenId) return;
      const trace = await traceService.create(gardenId, userId, type, content);
      setTraces((prev) => [trace, ...prev]);
    },
    [gardenId],
  );

  const remove = useCallback(async (id: string) => {
    await traceService.delete(id);
    setTraces((prev) => prev.filter((t) => t.trace_id !== id));
  }, []);

  return { traces, loading, error, create, remove, refetch: fetch };
}

export function useRecentTraces(gardenId: string | undefined, limit = 10) {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gardenId) return;
    let cancelled = false;
    traceService
      .getRecent(gardenId, limit)
      .then((data) => { if (!cancelled) setTraces(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [gardenId, limit]);

  return { traces, loading };
}
