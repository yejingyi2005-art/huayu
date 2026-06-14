import { useState, useEffect } from "react";
import type { Season, Trace } from "../lib/types";
import { timelineService, type TimelineGroup } from "../lib/services/timeline.service";

export function useTimeline(gardenId: string | undefined) {
  const [groups, setGroups] = useState<TimelineGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gardenId) return;
    let cancelled = false;
    timelineService
      .getByGarden(gardenId)
      .then((data) => { if (!cancelled) setGroups(data); })
      .catch((e) => { if (!cancelled) setError((e as { message?: string }).message ?? "获取时间长卷失败"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [gardenId]);

  return { groups, loading, error };
}

export function useSeasonTraces(
  gardenId: string | undefined,
  year: number,
  season: Season,
) {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gardenId) return;
    let cancelled = false;
    timelineService
      .getBySeason(gardenId, year, season)
      .then((data) => { if (!cancelled) setTraces(data); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [gardenId, year, season]);

  return { traces, loading };
}
