# Ladders

A ladder is an invisible volume in front of a wall or a ladder mesh. Inside it, the player climbs.

## Set up

1. Add an `Area3D` and attach the `LadderVolume` script (or create a `LadderVolume` node).
2. Add a `CollisionShape3D` child with a `BoxShape3D` that covers the climbable face, for example
   `1, 4, 0.6`.
3. **Collision > Layer**: only layer 4 (Triggers). **Mask**: layer 2 (Player). `Monitorable` can be off.
4. **Rotate it** so the volume's local **+Z** (the blue arrow in local space) points away from the wall,
   toward the climber.
5. Make the box a little **taller than the top ledge**, so the climber can step off at the top.
6. Add your ladder mesh next to it (or use a plain wall).

```
Ladder (Area3D + LadderVolume)   layer 4, mask 2
└── CollisionShape3D             BoxShape3D 1 x 4 x 0.6
```

## How to climb

| Do | Result |
| --- | --- |
| Walk into it and look up, press W | Climb up |
| Look down, press W | Climb down |
| Jump | Jump off, away from the wall (`LadderJumpOffSpeed`) |
| Walk off at the top | Step onto the ledge |

Climb speed is `LadderClimbSpeed` in the movement settings.

## Other bodies on ladders

The volume tells any body that implements `ILadderUser` when it enters and leaves. `FpsPlayerController`
implements it. Implement it on your own creature to let it climb too.
