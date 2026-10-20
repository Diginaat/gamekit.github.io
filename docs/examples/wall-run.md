# Example: Wall run ability

A new movement ability: sprint and jump along a wall to run on it, and jump to kick off. It shows how
to write a `MovementAbility`.

## 1. The script

Create `res://game/player/WallRunMovement.cs`:

```csharp
using GameKit.Core;
using GameKit.FpsController;
using Godot;

namespace MyGame.Player;

/// <summary>
/// Wall run: in the air, sprinting forward next to a wall, the player runs along it with weak gravity.
/// Jump kicks off the wall. Add as a child of the player's Abilities node.
/// </summary>
[GlobalClass]
public partial class WallRunMovement : MovementAbility
{
    [Export] public float Speed { get; set; } = 8f;
    [Export] public float MinStartSpeed { get; set; } = 4f;
    /// <summary>Fraction of normal gravity while on the wall.</summary>
    [Export(PropertyHint.Range, "0,1,0.01")] public float GravityScale { get; set; } = 0.25f;
    [Export] public float MaxDuration { get; set; } = 1.5f;
    [Export] public float KickOffSpeed { get; set; } = 5f;
    /// <summary>How far to the side a wall may be, measured from the body's center.</summary>
    [Export] public float WallDistance { get; set; } = 0.8f;

    private float _time;
    private Vector3 _wallNormal;

    public override MovementState State => MovementState.Custom; // the debug overlay shows "WallRun"

    public override bool CanBegin(PlayerMotor motor, in PlayerCommand cmd) =>
        !motor.IsOnFloor
        && cmd.SprintHeld && cmd.Move.Y > 0.5f
        && motor.HorizontalVelocity.Length() >= MinStartSpeed
        && FindWall(motor, out _wallNormal);

    public override void Begin(PlayerMotor motor, in PlayerCommand cmd)
    {
        _time = 0f;
        motor.Velocity.Y = Mathf.Max(motor.Velocity.Y, 0f); // stop falling when you hit the wall
    }

    public override bool Tick(PlayerMotor motor, in PlayerCommand cmd, float dt)
    {
        _time += dt;
        if (_time > MaxDuration || !cmd.SprintHeld || !FindWall(motor, out _wallNormal))
            return false;

        if (cmd.JumpPressed)
        {
            // Kick off: away from the wall and up, then normal air movement takes over.
            motor.Velocity += _wallNormal * KickOffSpeed;
            motor.Velocity.Y = motor.JumpVelocity;
            return false;
        }

        // Run along the wall in the direction we are already moving.
        Vector3 along = motor.HorizontalVelocity.Slide(_wallNormal);
        if (along.LengthSquared() < 0.01f)
            return false;
        along = along.Normalized() * Speed;
        float vy = motor.Velocity.Y - motor.Settings.Gravity * GravityScale * dt;
        motor.Velocity = new Vector3(along.X, vy, along.Z);

        motor.MoveBody(dt, tryStep: false);
        return !motor.IsOnFloor;
    }

    public override void End(PlayerMotor motor) { }

    /// <summary>Looks left and right for a wall on the World layer.</summary>
    private bool FindWall(PlayerMotor motor, out Vector3 normal)
    {
        var body = motor.Body;
        var space = body.GetWorld3D().DirectSpaceState;
        Vector3 from = body.GlobalPosition + Vector3.Up * 1f;
        Vector3 right = body.GlobalBasis.X;
        foreach (Vector3 side in new[] { right, -right })
        {
            var query = PhysicsRayQueryParameters3D.Create(from, from + side * WallDistance, CollisionLayers.World,
                new Godot.Collections.Array<Rid> { body.GetRid() });
            var hit = space.IntersectRay(query);
            if (hit.Count > 0)
            {
                normal = hit["normal"].AsVector3();
                if (Mathf.Abs(normal.Y) < 0.3f) // walls only, not floors or ceilings
                    return true;
            }
        }
        normal = Vector3.Zero;
        return false;
    }
}
```

## 2. Add it to the player

1. Press **Build**.
2. Select the player instance, enable **Editable Children**.
3. Add a `WallRunMovement` node under `Abilities`, named `WallRun`.
4. Drag it **above** `Slide` (child order is priority).

## 3. Try it

Build two long walls 3 m apart. Sprint along one, jump: you run on the wall. Press jump again to kick
off to the other wall.

## How it works

- The motor asks every ability `CanBegin` each tick, top to bottom; the first `true` takes control.
- `Tick` sets `motor.Velocity` and moves with `motor.MoveBody`, so collisions and floors keep working.
  Returning `false` gives control back to normal ground and air movement.
- `motor.Body` is the `FpsPlayerController`: use it for raycasts and positions.
- The ability never reads keys. It reads `PlayerCommand`, so AI characters can wall run too.

?> Allocating the side array and ray query every tick is fine for one player. For hundreds of NPCs,
keep them in fields and reuse them.
