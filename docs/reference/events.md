# Events

Subscribe in C# with `+=`. Unsubscribe (`-=`) when your node leaves the tree if the sender lives longer.

## Player (`gamekit_fps_controller`)

| Event | Arguments | When |
| --- | --- | --- |
| `player.Motor.Jumped` | — | The player jumps |
| `player.Motor.Landed` | `float` fall speed | The player lands |
| `player.Motor.StateChanged` | `MovementState old, MovementState new` | Grounded, Airborne, Sliding, Mantling, Climbing, Swimming, Disabled, Custom |
| `player.Motor.VisualStep` | `float` height | The player stepped up or down a stair |
| `player.Motor.Stance.Changed` | `bool` crouched, `float` feet shift | Crouch / stand |
| `SwimMovement.UnderwaterChanged` | `bool` | The eyes go under or above the water |

```csharp
player.Motor.Landed += speed =>
{
    if (speed > 12f)
        health.Damage((speed - 12f) * 5f);   // fall damage
};
```

## Interaction (`gamekit_interaction`)

| Event | Arguments | When |
| --- | --- | --- |
| `InteractionRay.PromptChanged` | `string?` prompt | The object under the crosshair changes (null = nothing) |
| `InteractionRay.PickedUp` | `RigidBody3D` | Something is picked up |
| `InteractionRay.Dropped` | `RigidBody3D` | It is dropped or thrown |

## Weather (`gamekit_weather`)

| Event | Arguments | When |
| --- | --- | --- |
| `WeatherSystem.WeatherChanged` | `WeatherPreset` | A new weather starts blending in |
| `WeatherSystem.LightningStruck` | `float` distance in metres | Lightning strikes (thunder follows at 343 m/s) |

## Weapons (`gamekit_viewmodel`)

| Event | Arguments | When |
| --- | --- | --- |
| `Weapon.Fired` | `Weapon` | A shot is fired |
