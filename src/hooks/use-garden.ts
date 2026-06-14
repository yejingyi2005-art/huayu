import { useState, useEffect, useCallback, useRef } from "react";
import type { Garden } from "../lib/types";
import { gardenService } from "../lib/services/garden.service";

export function useGardens(userId: string | undefined) {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  const fetch = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await gardenService.getByUser(userId);
      if (mounted.current) setGardens(data);
    } catch (e) {
      if (mounted.current) setError((e as { message?: string }).message ?? "获取花园列表失败");
    }
    if (mounted.current) setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { gardens, loading, error, refetch: fetch };
}

export function useGarden(gardenId: string | undefined) {
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gardenId) return;
    let cancelled = false;
    gardenService
      .getById(gardenId)
      .then((g) => { if (!cancelled) setGarden(g); })
      .catch((e) => { if (!cancelled) setError((e as { message?: string }).message ?? "获取花园失败"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [gardenId]);

  return { garden, loading, error };
}
