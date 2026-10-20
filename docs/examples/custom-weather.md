# Example: Custom weather preset

Make a new weather, "Foggy Morning", and a sequence that plays it on a timer.

## 1. The preset

1. In the FileSystem dock, right-click `res://addons/gamekit_weather/presets/overcast.tres` > **Duplicate**.
2. Save it as `res://game/weather/foggy_morning.tres` (your own folder, not inside the addon).
3. Set the values:

| Property | Value |
| --- | --- |
| `DisplayName` | Foggy Morning |
| `CloudCoverage` | 0.7 |
| `Overcast` | 0.6 |
| `RainIntensity` | 0 |
| `WindSpeed` | 1 |
| `FogDensity` | 0.05 |
| `DistanceFog` | 0.04 |
| `SunEnergyScale` | 0.4 |
| `SceneBrightness` | 0.8 |

The file now looks like this (text view):

```ini
[gd_resource type="Resource" script_class="WeatherPreset" format=3]

[ext_resource type="Script" path="res://addons/gamekit_weather/scripts/WeatherPreset.cs" id="1"]

[resource]
script = ExtResource("1")
DisplayName = "Foggy Morning"
CloudCoverage = 0.7
CloudDensity = 0.8
Overcast = 0.6
WindSpeed = 1.0
FogDensity = 0.05
DistanceFog = 0.04
SunEnergyScale = 0.4
SceneBrightness = 0.8
```

## 2. Use it

- **As the start weather:** select the `Weather` node, put `foggy_morning.tres` first in `Presets`.
- **In the F7 cycle:** add it anywhere in `Presets`.

## 3. A timed weather sequence

`res://game/weather/WeatherSchedule.cs`:

```csharp
using GameKit.Weather;
using Godot;

namespace MyGame.World;

/// <summary>Plays weather presets one after another, each for a while. Child of the WeatherSystem's parent.</summary>
[GlobalClass]
public partial class WeatherSchedule : Node
{
    [Export] public WeatherSystem? Weather { get; set; }
    [Export] public Godot.Collections.Array<WeatherPreset> Sequence { get; set; } = new();
    /// <summary>Seconds each preset lasts, blend included.</summary>
    [Export] public float SecondsEach { get; set; } = 120f;
    [Export] public float BlendTime { get; set; } = 30f;

    private int _index = -1;
    private double _timer;
    private bool _started;

    public override void _Process(double delta)
    {
        if (Weather == null || Sequence.Count == 0)
            return;
        _timer -= delta;
        if (_timer > 0)
            return;
        _timer = SecondsEach;
        _index = (_index + 1) % Sequence.Count;
        Weather.SetWeather(Sequence[_index], _started ? BlendTime : 0f); // the first one starts instantly
        _started = true;
    }
}
```

Fill `Sequence` with, for example, foggy morning → partly cloudy → storm → clear.

## Tips

- Lightning only happens when `LightningPerMinute` > 0.
- `Overcast` near 1 switches off the direct sun and its shadows. Use 0.6–0.8 for a soft, grey day that
  still has sunlight.
- Values blend smoothly, so you can switch between any two presets.
