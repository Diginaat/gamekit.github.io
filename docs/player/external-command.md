# AI and network players

The controller does not read the keyboard directly. Input becomes a `PlayerCommand` every physics tick
(like Source's `CUserCmd`), and the motor only reads that command. You can write the command yourself,
so AI, network players, cutscenes and replays run the **same movement code** as the player.

## PlayerCommand

| Field | Meaning |
| --- | --- |
| `Move` | `Vector2`: x = strafe right, y = forward. Length is clamped to 1 |
| `Yaw`, `Pitch` | View angles in radians (filled from the controller's `ViewYaw` / `ViewPitch`) |
| `JumpHeld`, `JumpPressed` | Held this tick / pressed this tick |
| `CrouchHeld`, `CrouchPressed` | |
| `SprintHeld`, `SprintPressed` | |
| `WalkHeld` | |

## Driving a character

1. Set `UseExternalCommand = true` on the `FpsPlayerController`.
2. Every physics tick, **before** the controller runs, write `Command` and turn the view with `SetLook`.

```csharp
npc.UseExternalCommand = true;

// each physics tick:
npc.SetLook(yaw, 0f);                 // the view direction is also the move direction
npc.Command.Move = new Vector2(0f, 1f); // walk forward
npc.Command.JumpPressed = true;       // "Pressed" fields are cleared after one tick
```

?> Run your code first: set `ProcessPhysicsPriority = -1` on the node that writes the command, so it runs
before the controller in the same tick.

## Yaw from a direction

The view looks along −Z rotated by yaw. To look along a world direction `dir`:

```csharp
float yaw = Mathf.Atan2(-dir.X, -dir.Z);
```

## An NPC scene

Don't use `fps_player.tscn` for NPCs: it has a current camera, mouse input and footsteps for the
local player. Build a small scene instead:

```
Npc (CharacterBody3D + FpsPlayerController)   layer 2, mask 1 + 3
├── CollisionShape3D   CapsuleShape3D, radius 0.4, height 1.83, position y = 0.915
├── GroundCheck        RayCast3D at y = 0.1, target (0, -0.35, 0), mask 1 + 3, disabled   optional
├── Abilities          Node, optional; add Swim / Ladder if the NPC needs them
├── MeshInstance3D     whatever the NPC looks like
└── Brain              your AI script
```

The full code is in the [AI walker example](examples/ai-walker.md).

## Network notes

- The command is small and deterministic: send commands from client to server and run the motor on
  both. That is the classic Source client-prediction model.
- The controller has no network code. Write the command from your network layer.
