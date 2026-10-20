# Moving platforms

The player stands on, rides and jumps off anything that is an `AnimatableBody3D`.

## Ready-made platform

1. Add an `AnimatableBody3D` and attach the `MovingPlatform` script.
2. Add a `CollisionShape3D` and a mesh.
3. Keep it on collision layer 1 (World). Keep **Sync to Physics** on.
4. Set the values:

| Property | Meaning |
| --- | --- |
| `Travel` | How far it moves from its start position (metres, `Vector3`). Default `0, 0, 6` |
| `Period` | Seconds for a full trip there and back. It eases in and out at the ends |
| `SpinDegreesPerSecond` | Turning speed around Y. `0` = no spin |

Examples:

| Platform | Travel | Period | Spin |
| --- | --- | --- | --- |
| Lift | `0, 5, 0` | 8 | 0 |
| Ferry over a gap | `10, 0, 0` | 12 | 0 |
| Turntable | `0, 0, 0` | any | 30 |

## Your own movement

Any `AnimatableBody3D` moved by an `AnimationPlayer` or by your code also carries the player.
Move it in `_PhysicsProcess`. The player keeps the platform's speed when jumping off, up to
`MaxPlatformInheritSpeed` in the movement settings.
