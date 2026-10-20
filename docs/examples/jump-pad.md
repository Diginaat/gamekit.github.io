# Example: Jump pad

A pad that launches the player into the air. It shows how to change the player's velocity from a
trigger area.

## 1. The script

Create `res://game/world/JumpPad.cs`:

```csharp
using GameKit.FpsController;
using Godot;

namespace MyGame.World;

/// <summary>Launches players that step on it. Put it on layer Triggers (4), mask Player (2).</summary>
[GlobalClass]
public partial class JumpPad : Area3D
{
    /// <summary>Upward speed in m/s. About sqrt(2 * gravity * height): 17 m/s² gravity, 8 m high = 16.5.</summary>
    [Export] public float LaunchSpeed { get; set; } = 16f;
    /// <summary>Extra push along the pad's local -Z (its forward), in m/s. 0 = straight up.</summary>
    [Export] public float ForwardSpeed { get; set; }

    public override void _Ready() => BodyEntered += OnBodyEntered;

    private void OnBodyEntered(Node3D body)
    {
        if (body is not FpsPlayerController player)
            return;
        Vector3 forward = -GlobalBasis.Z * ForwardSpeed;
        var motor = player.Motor;
        motor.Velocity = new Vector3(motor.Velocity.X + forward.X, LaunchSpeed, motor.Velocity.Z + forward.Z);
        motor.SetFloorState(false); // airborne now, so the next tick doesn't snap back to the floor
    }
}
```

## 2. The scene

```
JumpPad   (Area3D + JumpPad)   layer 4, mask 2, LaunchSpeed = 16
├── CollisionShape3D   BoxShape3D 2 x 0.3 x 2
└── MeshInstance3D     a flat box so the player can see it
```

Rotate the pad around Y and set `ForwardSpeed` to send players in a direction.

## How it works

- `Motor.Velocity` is the player's velocity in m/s. You can read and write it.
- The motor treats the player as grounded until it moves up faster than half a normal jump, and
  `SetFloorState(false)` ends the grounded state at once. That is how the built-in jump works too.
- The player keeps air control after the launch (`AirAcceleration` in the movement settings).
