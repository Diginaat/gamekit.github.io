# Water and pools

`WaterVolume` makes a swimmable pool that renders itself: moving surface, refraction, reflections,
caustics, an underwater view, and ripples where bodies touch the water.

![Pool](images/sc_pool.png)

!> Water needs the custom Godot build with the PhysX module (`PhysXWaterSurface3D`). Without a
RenderingDevice (headless, Compatibility renderer) the surface is still, but swimming works.

## Set up a pool

1. Build the pool **walls and floor** from static bodies. The water must be walled in on all four sides:
   the surface covers exactly the top of the box.
2. Add an `Area3D` and attach `WaterVolume`.
3. Add a `CollisionShape3D` child with a `BoxShape3D` that fills the pool. **The top of the box is the
   water surface.** Don't rotate the node.
4. **Collision > Layer**: only 4 (Triggers). **Mask**: 2 (Player) and 3 (Props). Props in the mask ripple
   the surface.
5. Optional: set `Reflection` to `res://addons/gamekit_water/resources/pool_reflection.tres`.

```
Pool
├── Walls ...                      StaticBody3D, layer 1
└── Water (Area3D + WaterVolume)   layer 4, mask 2 + 3, Reflection = pool_reflection.tres
    └── CollisionShape3D           BoxShape3D 8 x 2 x 6
```

| Property | Meaning |
| --- | --- |
| `Rendered` | `false` = invisible swim volume (for example for water you draw yourself) |
| `Reflection` | `PlanarReflectionSettings`: mirror of the pool on the surface. Empty = no reflection |

## Caustics on the walls

Give the pool walls and floor a `ShaderMaterial` with `res://addons/gamekit_water/shaders/pool_tile.gdshader`
and set:

| Uniform | Value |
| --- | --- |
| `water_surface_y` | World Y of the water surface |
| `water_rect` | `min x, min z, max x, max z` of the water in world space |
| `sun_direction` | Direction the sun shines (match your `DirectionalLight3D`) |

The feature showcase has a finished material: copy the pool station.

## Swimming

| Key | Action |
| --- | --- |
| W A S D + look | Swim where you look |
| Space | Up |
| Ctrl | Down |
| Jump + forward at the edge | Climb out |

The player swims once deeper than `SwimDepthFraction` of its height. Speeds are in the movement
settings (`SwimSpeed`, `SwimAcceleration`, `WaterFriction`).

## Cost

The water simulation runs only while the pool is on screen, and the reflection camera only renders
while a camera is under that water. Many pools in a big map cost little.

## Other bodies in water

Bodies that implement `IWaterUser` are told when they enter and leave (`FpsPlayerController` does).
Implement it on a creature to let it swim.
