# Troubleshooting / FAQ

## My new GameKit node doesn't show in Create New Node

Press **Build** (hammer icon). C# classes appear after the project compiles.

## The player falls through the floor

- The floor must be on collision layer 1 (World), with a `CollisionShape3D`.
- The player's origin is at its feet: place it slightly **above** the floor.
- Don't move `StaticBody3D` nodes from code. Use `AnimatableBody3D` for moving things.

## I can't climb the ladder

- The volume is on layer 4 and masks layer 2.
- Its local **+Z** points away from the wall, toward the player.
- `LadderEnabled` is on in the movement settings, and the player has a `Ladder` ability node.

## I walk on the bottom of the pool instead of swimming

- The `WaterVolume` masks layer 2.
- The water is deep enough: the player swims once deeper than `SwimDepthFraction` of its height.
- The player has a `Swim` ability node and `SwimEnabled` is on.

## The water surface is not visible

- `Rendered` is on.
- You use the custom Godot build with PhysX and the Forward+ renderer. Headless and Compatibility
  show a still surface only.

## My floor doesn't get wet in rain

Its material must use `wet_prototype_grid.gdshader` or a shader that includes
`weather_wetness.gdshaderinc`. See [Wet surfaces](weather/wet-surfaces.md). Also check that no roof
(any mesh on layers 1–16) is above it.

## Shader error about `weather_wetness`

The `[shader_globals]` section is missing from `project.godot`. See
[Project settings](getting-started/project-settings.md).

## A shader works headless but not in the game window

Headless runs don't compile shaders on the GPU. Always test shader changes in a window. A common cause:
a uniform with the same name as a local variable in an included file.

## 3D text signs glow in a storm

Unshaded `Label3D` text ignores lighting, so auto exposure makes it bright when the scene is dark.
Turn **Shaded** on for signs in outdoor maps.

## The lens effect looks too strong / I want no effects

Use `clean.tres`, or the camera preset `camera_accessible.tres`. See [Lens profiles](lens/profiles.md).

## The lens distortion makes the water edge shift

Transparent things (water, rain, 3D text) are drawn after the lens effect and are not distorted. Keep
`DistortionEnabled` off, or `Distortion` ≤ 0.02.

## How do I give NPCs the same movement?

See [AI and network players](player/external-command.md) and the [AI walker](examples/ai-walker.md).

## Where do I put my own scripts?

In your own folder, for example `res://game/`. Never inside `addons/gamekit_*`. See
[Modules and dependencies](reference/modules.md).
