import { supabase } from "../supabase/client";
import type { MemoryBook, Season } from "../types";

export const memoryBookService = {
  async getByGarden(gardenId: string): Promise<MemoryBook[]> {
    const { data, error } = await supabase
      .from("memory_books")
      .select()
      .eq("garden_id", gardenId)
      .order("year", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw { code: "BOOKS_FETCH_FAILED", message: error.message };
    return data as MemoryBook[];
  },

  async getById(id: string): Promise<MemoryBook> {
    const { data, error } = await supabase
      .from("memory_books")
      .select()
      .eq("book_id", id)
      .single();
    if (error) throw { code: "BOOK_NOT_FOUND", message: error.message };
    return data as MemoryBook;
  },

  async create(
    gardenId: string,
    season: Season,
    year: number,
    summary: string,
  ): Promise<MemoryBook> {
    const { data, error } = await supabase
      .from("memory_books")
      .insert({ garden_id: gardenId, season, year, summary })
      .select()
      .single();
    if (error) throw { code: "BOOK_CREATE_FAILED", message: error.message };
    return data as MemoryBook;
  },

  async getOrCreate(gardenId: string, season: Season, year: number): Promise<MemoryBook> {
    const { data: existing } = await supabase
      .from("memory_books")
      .select()
      .eq("garden_id", gardenId)
      .eq("season", season)
      .eq("year", year)
      .single();

    if (existing) return existing as MemoryBook;
    return memoryBookService.create(gardenId, season, year, "");
  },
};
