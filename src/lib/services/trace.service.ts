import { supabase } from "../supabase/client";
import type { Trace, TraceContent, TraceType } from "../types";
import { MOOD_WEATHER_MAP } from "../constants";

export const traceService = {
  async create(
    gardenId: string,
    userId: string,
    type: TraceType,
    content: TraceContent,
  ): Promise<Trace> {
    if (type === "mood" && content.emotion) {
      const weather = MOOD_WEATHER_MAP[content.emotion]?.weather;
      content.weather = weather;
    }

    const { data, error } = await supabase
      .from("traces")
      .insert({
        garden_id: gardenId,
        user_id: userId,
        type,
        content,
      })
      .select()
      .single();
    if (error) throw { code: "TRACE_CREATE_FAILED", message: error.message };
    return data as Trace;
  },

  async getByGarden(gardenId: string): Promise<Trace[]> {
    const { data, error } = await supabase
      .from("traces")
      .select()
      .eq("garden_id", gardenId)
      .order("created_at", { ascending: false });
    if (error) throw { code: "TRACES_FETCH_FAILED", message: error.message };
    return data as Trace[];
  },

  async getRecent(gardenId: string, limit = 10): Promise<Trace[]> {
    const { data, error } = await supabase
      .from("traces")
      .select()
      .eq("garden_id", gardenId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw { code: "TRACES_FETCH_FAILED", message: error.message };
    return data as Trace[];
  },

  async getById(id: string): Promise<Trace> {
    const { data, error } = await supabase.from("traces").select().eq("trace_id", id).single();
    if (error) throw { code: "TRACE_NOT_FOUND", message: error.message };
    return data as Trace;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("traces").delete().eq("trace_id", id);
    if (error) throw { code: "TRACE_DELETE_FAILED", message: error.message };
  },
};
