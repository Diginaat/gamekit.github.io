# Example: AI walker

An NPC that walks between waypoints using the same controller as the player: stairs, slopes,
platforms and ladders work for it the same way. It shows how to drive the controller with
`PlayerCommand` instead of the keyboard.

## 1. The script

Create `res://game/ai/WaypointWalker.cs`:

```csharp
using GameKit.FpsController;
using Godot;

namespace MyGame.Ai;

/// <summary>
/// Drives its parent FpsPlayerController along waypoints, in a loop. Child of the NPC.
/// </summary>
[GlobalClass]
public partial class WaypointWalker : Node
{
    [Export] public Godot.Collections.Array<Node3D> Waypoints { get; set; } = new();
    /// <summary>Distance at which a waypoint counts as reached (horizontal).</summary>
    [Export] public float ArriveDistance { get; set; } = 0.6f;
    [Export] public bool Run { get; set; } = true;
    /// <summary>Jump when blocked for this long (seconds), for small obstacles.</summary>
    [Export] public float StuckJumpTime { get; set; } = 0.5f;

    private FpsPlayerController _body = null!;
    private int _next;
    private float _stuck;

    public override void _Ready()
    {
        _body = GetParent<FpsPlayerController>();
        _body.UseExternalCommand = true;
        ProcessPhysicsPriority = -1; // write the command before the controller runs this tick
    }

    public override void _PhysicsProcess(double delta)
    {
        if (Waypoints.Count == 0)
        {
            _body.Command.Move = Vector2.Zero;
            return;
        }

        Vector3 to = Waypoints[_next].GlobalPosition - _body.GlobalPosition;
        to.Y = 0f;
        if (to.Length() < ArriveDistance)
        {
            _next = (_next + 1) % Waypoints.Count;
            return;
        }

        // Face the waypoint: the view looks along -Z rotated by yaw.
        _body.SetLook(Mathf.Atan2(-to.X, -to.Z), 0f);
        _body.Command.Move = new Vector2(0f, 1f);  // forward
        _body.Command.WalkHeld = !Run;

        // Hop over small obstacles when not moving.
        _stuck = _body.Motor.HorizontalVelocity.Length() < 0.3f ? _stuck + (float)delta : 0f;
        if (_stuck > StuckJumpTime)
        {
            _body.Command.JumpPressed = true; // cleared by the controller after one tick
            _stuck = 0f;
        }
    }
}
```

## 2. The NPC scene

Create `res://game/ai/walker.tscn`:

```
Walker  (CharacterBody3D + FpsPlayerController)   layer 2, mask 1 + 3
│       Movement = modern_aaa.tres
├── CollisionShape3D   CapsuleShape3D radius 0.4, height 1.83, position y = 0.915
├── Abilities          Node (add Ladder / Swim nodes if the NPC needs them)
├── Body               MeshInstance3D CapsuleMesh, position y = 0.915
└── Brain              Node + WaypointWalker
```

!> Don't build NPCs from `fps_player.tscn`. It has a **current camera**, mouse input and footsteps for the
local player.

## 3. Use it

1. Instance `walker.tscn` in your map.
2. Add some `Marker3D` nodes as waypoints.
3. Select `Brain` and add the markers to `Waypoints`.

## How it works

- `UseExternalCommand = true` makes the controller ignore its `PlayerInput` and read `Command` instead.
- `SetLook(yaw, pitch)` turns the character; movement is relative to the view, like for the player.
- The `*Pressed` fields last one tick: the controller clears them after using them.
- For path finding, replace the straight line with a `NavigationAgent3D`: steer toward
  `agent.GetNextPathPosition()` instead of the waypoint.
