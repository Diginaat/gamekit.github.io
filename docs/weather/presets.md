# Weather presets

A `WeatherPreset` (`.tres`) describes one weather. The `WeatherSystem` blends from the current values
to the next preset's values.

## Built-in presets

All in `res://addons/gamekit_weather/presets/`:

| File | Weather |
| --- | --- |
| `clear.tres` | Clear sky, light wind |
| `partly_cloudy.tres` | Clouds, sun |
| `overcast.tres` | Grey sky, no direct sun |
| `light_rain.tres` | Light rain, wet surfaces |
| `storm.tres` | Heavy rain, strong wind, fog |
| `thunderstorm.tres` | Storm with lightning and thunder |

| Clear | Storm |
| --- | --- |
| ![Clear](images/w_clear.png) | ![Storm](images/w_storm_station.png) |

## The values

| Property | Range | Meaning |
| --- | --- | --- |
| `DisplayName` | text | Name shown in the HUD and `WeatherName` |
| `CloudCoverage` | 0–1 | How much of the sky has clouds |
| `CloudDensity` | 0–1 | How thick the clouds are |
| `CloudDarkness` | 0–1 | Rain clouds are dark |
| `Overcast` | 0–1 | Grey sky; near 1 the direct sun and its shadows switch off |
| `RainIntensity` | 0–1 | 0 = dry, 1 = downpour |
| `LightningPerMinute` | ≥ 0 | Strikes per minute (0 = none) |
| `WindSpeed` | m/s | Moves clouds and slants the rain |
| `WindDirectionDegrees` | 0–360 | Where the wind blows to |
| `Gustiness` | 0–1 | How much the wind varies |
| `FogDensity` | ≥ 0 | Extra volumetric fog |
| `DistanceFog` | ≥ 0 | Haze over distance |
| `SunEnergyScale` | 0–1 | Sun light strength |
| `SceneBrightness` | 0–1 | Overall exposure (storms are darker) |

How to make your own: [Custom weather preset](examples/custom-weather.md).
