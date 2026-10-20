# Movement abilities

Slide, mantle, ladder climbing and swimming are **ability nodes** under the player's `Abilities` node.

```
FpsPlayer
└── Abilities
    ├── Mantle   (MantleMovement)
    ├── Swim     (SwimMovement)
    ├── Ladder   (LadderMovement)
    └── Slide    (SlideMovement)
```

## Rules

- **Child order is priority.** Each physics tick the motor asks the abilities, top to bottom, whether
  they want to start. The first one that says yes takes control until it says it is done.
- **Remove a node to remove the ability.** Without `Swim`, the player walks on the bottom of a pool.
- **Turn one off temporarily** with its `*Enabled` flag in the movement settings (`SlideEnabled`,
  `MantleEnabled`, `LadderEnabled`, `SwimEnabled`).
- **Add or remove ability nodes at runtime**, for example to unlock a skill.

## How an ability works

Every ability derives from `MovementAbility` and implements four methods:

| Method | Called | Return |
| --- | --- | --- |
| `CanBegin(motor, cmd)` | Each tick while no ability is active | `true` to take control |
| `Begin(motor, cmd)` | Once, when it takes control | — |
| `Tick(motor, cmd, dt)` | Each tick while active. Set `motor.Velocity`, then call `motor.MoveBody(...)` | `false` to hand control back |
| `End(motor)` | Once, when it stops | — |

And one property, `State`. Use `MovementState.Custom` for your own abilities; the debug overlay then
shows the node's name.

```csharp
using GameKit.FpsController;
using Godot;

[GlobalClass]
public partial class MyAbility : MovementAbility
{
    public override MovementState State => MovementState.Custom;

    public override bool CanBegin(PlayerMotor motor, in PlayerCommand cmd) => false;
    public override void Begin(PlayerMotor motor, in PlayerCommand cmd) { }
    public override bool Tick(PlayerMotor motor, in PlayerCommand cmd, float dt)
    {
        motor.MoveBody(dt, tryStep: false);
        return false;
    }
    public override void End(PlayerMotor motor) { }
}
```

After **Build**, add a node of your type under `Abilities` and drag it to the right priority.

A full working example is the [Wall run ability](examples/wall-run.md).

## What the motor gives you

| Member | Use |
| --- | --- |
| `motor.Velocity` | Velocity in m/s; set it in `Tick` |
| `motor.HorizontalVelocity` | Velocity without Y |
| `motor.IsOnFloor`, `motor.FloorNormal` | Ground state |
| `motor.Settings` | The `PlayerMovementSettings` in use |
| `motor.Body` | The `FpsPlayerController` (position, physics space) |
| `motor.JumpVelocity` | Upward speed of a normal jump |
| `motor.MoveBody(dt, tryStep)` | Moves the body with collision, steps and floor detection |
| `motor.WishMovement(cmd, out dir, out speed)` | Where the player wants to go, from the input and view |
