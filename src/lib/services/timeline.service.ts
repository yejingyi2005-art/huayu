import { supabase } from "../supabase/client";
import type { Trace, Season } from "../types";
import { SEASONS } from "../constants";

export interface TimelineGroup {
  year: number;
  season: Season;
  traces: Trace[];
}

export const timelineService = {
  async getByGarden(gardenId: string): Promise<TimelineGroup[]> {
    const { data, error } = await supabase
      .from("traces")
      .select()
      .eq("garden_id", gardenId)
      .order("created_at", { ascending: true });
    if (error) throw { code: "TIMELINE_FETCH_FAILED", message: error.message };

    const traces = data as Trace[];
    const groups = new Map<string, TimelineGroup>();

    for (const trace of traces) {
      const date = new Date(trace.created_at);
      const year = date.getFullYear();
      const month = date.getMonth();
      const seasonIndex = Math.floor(month / 3);
      const season = SEASONS[seasonIndex] ?? "spring";
      const key = `${year}-${season}`;

      if (!groups.has(key)) {
        groups.set(key, { year, season, traces: [] });
      }
      const group = groups.get(key);
      if (group) group.traces.push(trace);
    }

    return Array.from(groups.values());
  },

  async getBySeason(gardenId: string, year: number, season: Season): Promise<Trace[]> {
    const seasonMonths: Record<Season, [number, number]> = {
      spring: [3, 5],
      summer: [6, 8],
      autumn: [9, 11],
      winter: [0, 2],
    };
    const [startMonth, endMonth] = seasonMonths[season];
    const startDate = new Date(year, startMonth, 1).toISOString();
    const endDate = new Date(year, endMonth + 1, 0, 23, 59, 59).toISOString();

    const { data, error } = await supabase
      .from("traces")
      .select()
      .eq("garden_id", gardenId)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .order("created_at", { ascending: true });
    if (error) throw { code: "TIMELINE_SEASON_FETCH_FAILED", message: error.message };
    return data as Trace[];
  },
};
