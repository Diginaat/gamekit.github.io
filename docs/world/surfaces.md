# Floors, walls and surfaces

## Floors and walls

Any `StaticBody3D` on collision layer 1 (World) is a floor or wall. Give it a `CollisionShape3D` and a
mesh of the same size.

| Shape | Rule |
| --- | --- |
| Stairs | Each step lower than the movement profile's `StepHeight` (0.4 m in `modern_aaa`) |
| Slopes | Less steep than `MaxSlopeDegrees` (46° in `modern_aaa`); steeper slopes make you slide |
| Ledges | Between `MantleMinHeight` (0.5 m) and `MantleMaxHeight` (1.8 m) can be climbed with mantle |

!> Don't move a `StaticBody3D` from code. PhysX notices the move late, so the player can fall through.
For anything that moves, use an `AnimatableBody3D` (see [Moving platforms](world/platforms.md)).

## Prototype material

For blocking out levels, use a `ShaderMaterial` with one of these shaders:

| Shader | Use |
| --- | --- |
| `res://addons/gamekit_core/shaders/prototype_grid.gdshader` | World-space grid, 1 m cells |
| `res://addons/gamekit_weather/shaders/wet_prototype_grid.gdshader` | Same grid, gets wet in rain (use this outdoors) |

Set `color` per block. The grid stays the same size however big the block is.

## Footstep surfaces

The surface under the player changes the footstep sound. Ice and mud also change grip and speed.

To tag a collider:

1. Select the `StaticBody3D` (or a `CollisionShape3D`'s body).
2. At the bottom of the Inspector, click **Add Metadata**.
3. Name `surface`, type **int**, value from the table.

| Value | Surface | Effect |
| --- | --- | --- |
| 0 | Default | |
| 1 | Concrete | |
| 2 | Metal | |
| 3 | Wood | |
| 4 | Grass | |
| 5 | Ice | Slippery |
| 6 | Mud | Slow |

From code:

```csharp
using GameKit.Core;

Surfaces.Tag(myFloorBody, SurfaceType.Metal);
```

## Adding a surface type

Add a value at the end of `SurfaceType` and a row in the table in `Surfaces.cs` (`gamekit_core`), in the
same order. Don't reorder existing values: scenes store the number.
