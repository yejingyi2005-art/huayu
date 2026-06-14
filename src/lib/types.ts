export type TraceType = "photo" | "text" | "mood";
export type Emotion = "happy" | "calm" | "tired" | "sad" | "surprised";
export type Weather = "sunny" | "breeze" | "overcast" | "lightRain" | "rainbow";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type GardenStatus = "active" | "archived";
export type GardenRole = "owner" | "member";
export type CropType = "clover" | "sunflower" | "rose" | "lotus";
export type CropStage = "seed" | "sprout" | "growing" | "bloom";

export interface User {
  user_id: string;
  nickname: string;
  avatar: string | null;
  email: string | null;
  created_at: string;
}

export interface Garden {
  garden_id: string;
  name: string;
  created_at: string;
  status: GardenStatus;
  invite_code: string;
}

export interface GardenMember {
  garden_id: string;
  user_id: string;
  role: GardenRole;
  joined_at: string;
}

export interface TraceContent {
  url?: string;
  caption?: string;
  body?: string;
  emotion?: Emotion;
  weather?: Weather;
}

export interface Trace {
  trace_id: string;
  garden_id: string;
  user_id: string;
  type: TraceType;
  content: TraceContent;
  created_at: string;
}

export interface MemoryBook {
  book_id: string;
  garden_id: string;
  season: Season;
  year: number;
  summary: string | null;
  cover_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface GardenCrop {
  id: string;
  type: CropType;
  stage: CropStage;
  plantedBy: string;
  plantedAt: string;
  position: { col: number; row: number };
}

export interface MemoryRing {
  id: string;
  season: Season;
  year: number;
  radius: number;
  tracesCount: number;
  summary: string;
}

export interface GardenState {
  crops: GardenCrop[];
  rings: MemoryRing[];
  growthLevel: number;
}

export interface AppError {
  code: string;
  message: string;
}
