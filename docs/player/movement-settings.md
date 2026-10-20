# Movement settings

All movement values live in a `PlayerMovementSettings` resource (`.tres`). The player's `Movement`
property points at one. Nothing about movement is hard-coded.

## Built-in profiles

| File | Feel |
| --- | --- |
| `res://addons/gamekit_fps_controller/resources/modern_aaa.tres` | Modern shooter: coyote time, jump buffer, variable jump height, slide and mantle |
| `res://addons/gamekit_fps_controller/resources/source_classic.tres` | Half-Life 2: Source units, air strafing, bunny hop allowed, no slide or mantle |

## Make your own profile

1. In the FileSystem dock, right-click `modern_aaa.tres` > **Duplicate**. Save the copy in your own folder,
   for example `res://game/settings/my_movement.tres`.
2. Select the player and drag the new file onto **Movement**.
3. Change values in the Inspector while the game runs. Changes apply immediately.

To switch profiles from code:

```csharp
player.ApplyMovementSettings(GD.Load<PlayerMovementSettings>("res://game/settings/my_movement.tres"));
```

## The values

All distances are metres, speeds m/s, times seconds.

| Group | Properties |
| --- | --- |
| Body | `Radius`, `StandingHeight`, `CrouchHeight`, `StandingEyeHeight`, `CrouchEyeHeight` |
| Speeds | `WalkSpeed` (Alt), `RunSpeed` (default), `SprintSpeed` (Shift), `CrouchSpeed` |
| Ground | `GroundAcceleration`, `Friction`, `StopSpeed` |
| Air | `Gravity`, `AirAcceleration`, `AirSpeedCap` (air strafing), `MaxFallSpeed` |
| Jump | `JumpHeight`, `VariableJumpHeight` + `JumpCutMultiplier` (release early = lower jump), `JumpBufferTime`, `CoyoteTime` |
| Bunny hop | `AllowBunnyHop`, `AutoBunnyHop` (hold jump), `BunnyHopSpeedCap` (× ground speed when not allowed) |
| Toggles | `SprintToggle`, `CrouchToggle`, `SprintMinForwardInput` (−1 = sprint in every direction) |
| Level shape | `StepHeight` (highest step you walk up), `MaxSlopeDegrees` |
| Platforms, props | `MaxPlatformInheritSpeed`, `PushForce`, `MaxPushMass` |
| Slide | `SlideEnabled`, `SlideMinStartSpeed`, `SlideStartBoost`, `SlideFriction`, `SlideEndSpeed`, `SlideMaxDuration`, `SlideCooldown` |
| Mantle | `MantleEnabled`, `MantleMinHeight`, `MantleMaxHeight`, `MantleReach`, `MantleSpeed` |
| Ladder | `LadderEnabled`, `LadderClimbSpeed`, `LadderJumpOffSpeed` |
| Swim | `SwimEnabled`, `SwimSpeed`, `SwimAcceleration`, `WaterFriction`, `SwimDepthFraction` (how deep before you swim) |

## Tips

- **Level design and movement go together.** Stairs must be lower than `StepHeight` and ramps less steep
  than `MaxSlopeDegrees`. Ledges between `MantleMinHeight` and `MantleMaxHeight` can be climbed.
- **Want a heavier feel?** Lower `GroundAcceleration` and raise `Friction`.
- **Want more air control?** Raise `AirAcceleration`.
- The `*Enabled` flags turn an ability off without removing its node. See [Movement abilities](player/abilities.md).
