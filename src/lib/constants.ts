import type { Emotion, Weather, Season } from "./types";

export const MOOD_WEATHER_MAP: Record<Emotion, { label: string; weather: Weather; color: string }> = {
  happy: { label: "晴天", weather: "sunny", color: "#F4E9C8" },
  calm: { label: "微风", weather: "breeze", color: "#DDE6EC" },
  tired: { label: "阴天", weather: "overcast", color: "#EFEDE4" },
  sad: { label: "小雨", weather: "lightRain", color: "#F6E8EC" },
  surprised: { label: "彩虹", weather: "rainbow", color: "#E8E0F0" },
} as const;

export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

export const SEASON_LABEL: Record<Season, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
};

export const GARDEN_MAX_MEMBERS = 5;
export const GARDEN_MIN_MEMBERS = 2;
export const INVITE_CODE_LENGTH = 8;
