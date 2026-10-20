# Example: Weather trigger zone

The weather changes when the player walks into an area, for example a storm over the mountain pass,
and changes back when they leave. It shows how to drive the `WeatherSystem` from gameplay.

## 1. The script

Create `res://game/world/WeatherZone.cs`:

```csharp
using GameKit.FpsController;
using GameKit.Weather;
using Godot;

namespace MyGame.World;

/// <summary>Blends to <see cref="Inside"/> while the player is in this area, and back when they leave.</summary>
[GlobalClass]
public partial class WeatherZone : Area3D
{
    [Export] public WeatherSystem? Weather { get; set; }
    [Export] public WeatherPreset? Inside { get; set; }
    /// <summary>Seconds to blend in and out.</summary>
    [Export] public float BlendTime { get; set; } = 8f;

    private WeatherPreset? _before;

    public override void _Ready()
    {
        BodyEntered += OnEntered;
        BodyExited += OnExited;
    }

    private void OnEntered(Node3D body)
    {
        if (body is not FpsPlayerController || Weather == null || Inside == null)
            return;
        _before = Weather.Target;
        Weather.SetWeather(Inside, BlendTime);
    }

    private void OnExited(Node3D body)
    {
        if (body is not FpsPlayerController || Weather == null || _before == null)
            return;
        Weather.SetWeather(_before, BlendTime);
        _before = null;
    }
}
```

## 2. The scene

```
StormZone   (Area3D + WeatherZone)   layer 4, mask 2
│           Weather = ../../Weather, Inside = presets/storm.tres, BlendTime = 8
└── CollisionShape3D   BoxShape3D 40 x 20 x 40
```

## How it works

- `WeatherSystem.Target` is the weather it is blending to (or has reached). The zone saves it on enter
  and returns to it on exit.
- `SetWeather(preset, seconds)` blends every value: clouds, rain, fog, sun, sound. 0 seconds switches instantly.
- Exported node references (`WeatherSystem? Weather`) are set by dragging the node onto the field in
  the Inspector.

## Variations

- **One-way change** (a storm starts when you reach the lighthouse): call `SetWeather` on enter and
  remove the exit handler.
- **Indoors:** you don't need a zone. Roofs keep rain out, and the floor under them stays dry.
