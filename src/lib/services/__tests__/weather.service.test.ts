import { describe, it, expect } from "vitest";
import { weatherService } from "../weather.service";

describe("weatherService", () => {
  it("maps happy to sunny", () => {
    expect(weatherService.emotionToWeather("happy")).toBe("sunny");
  });

  it("maps calm to breeze", () => {
    expect(weatherService.emotionToWeather("calm")).toBe("breeze");
  });

  it("maps tired to overcast", () => {
    expect(weatherService.emotionToWeather("tired")).toBe("overcast");
  });

  it("maps sad to lightRain", () => {
    expect(weatherService.emotionToWeather("sad")).toBe("lightRain");
  });

  it("maps surprised to rainbow", () => {
    expect(weatherService.emotionToWeather("surprised")).toBe("rainbow");
  });

  it("returns correct color for each emotion", () => {
    expect(weatherService.getWeatherColor("happy")).toBe("#F4E9C8");
    expect(weatherService.getWeatherColor("calm")).toBe("#DDE6EC");
    expect(weatherService.getWeatherColor("tired")).toBe("#EFEDE4");
    expect(weatherService.getWeatherColor("sad")).toBe("#F6E8EC");
    expect(weatherService.getWeatherColor("surprised")).toBe("#E8E0F0");
  });

  it("returns correct Chinese label for each emotion", () => {
    expect(weatherService.getWeatherLabel("happy")).toBe("晴天");
    expect(weatherService.getWeatherLabel("calm")).toBe("微风");
    expect(weatherService.getWeatherLabel("tired")).toBe("阴天");
    expect(weatherService.getWeatherLabel("sad")).toBe("小雨");
    expect(weatherService.getWeatherLabel("surprised")).toBe("彩虹");
  });
});
