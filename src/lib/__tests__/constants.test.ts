import { describe, it, expect } from "vitest";
import { MOOD_WEATHER_MAP, SEASONS, GARDEN_MAX_MEMBERS } from "../constants";

describe("constants", () => {
  it("maps all 5 emotions", () => {
    expect(Object.keys(MOOD_WEATHER_MAP)).toHaveLength(5);
    expect(MOOD_WEATHER_MAP.happy.weather).toBe("sunny");
    expect(MOOD_WEATHER_MAP.calm.weather).toBe("breeze");
    expect(MOOD_WEATHER_MAP.tired.weather).toBe("overcast");
    expect(MOOD_WEATHER_MAP.sad.weather).toBe("lightRain");
    expect(MOOD_WEATHER_MAP.surprised.weather).toBe("rainbow");
  });

  it("has 4 seasons", () => {
    expect(SEASONS).toHaveLength(4);
    expect(SEASONS).toContain("spring");
    expect(SEASONS).toContain("summer");
    expect(SEASONS).toContain("autumn");
    expect(SEASONS).toContain("winter");
  });

  it("max members is 5", () => {
    expect(GARDEN_MAX_MEMBERS).toBe(5);
  });
});
