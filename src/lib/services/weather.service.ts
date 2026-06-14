import type { Emotion, Weather } from "../types";
import { MOOD_WEATHER_MAP } from "../constants";

export const weatherService = {
  emotionToWeather(emotion: Emotion): Weather {
    return MOOD_WEATHER_MAP[emotion]?.weather ?? "sunny";
  },

  getWeatherColor(emotion: Emotion): string {
    return MOOD_WEATHER_MAP[emotion]?.color ?? "#F4E9C8";
  },

  getWeatherLabel(emotion: Emotion): string {
    return MOOD_WEATHER_MAP[emotion]?.label ?? "晴天";
  },
};
