# Camera lens

`CameraLens` gives a camera a photographic finish: lens distortion, colour fringes at the edges,
depth of field, film halation (warm glow around bright lights), grading, LUT, vignette, sensor grain
and lens flares from the sun and from lights you choose.

| Lens off | Natural |
| --- | --- |
| ![Off](images/l_off.png) | ![Natural](images/l_natural.png) |

| Film | Sun flare |
| --- | --- |
| ![Film](images/l_film.png) | ![Sun flare](images/l_sun2.png) |

## The player already has it

`fps_player.tscn` has a `Lens` node under its `Camera3D`. The camera settings choose its look:
`PlayerCameraSettings.Lens` (see [Camera settings](player/camera.md)).

## Add it to any camera

1. Select a `Camera3D`, add a child `Node3D`, and attach `CameraLens` (or create a `CameraLens` node).
2. Set `Profile` to a file from `res://addons/gamekit_lens/profiles/`.

| Property | Meaning |
| --- | --- |
| `Profile` | The look (`LensProfile`). Empty = no effect |
| `Camera` | The camera to finish. Empty = the parent camera |
| `Sun` | Sun for the sun flare. Empty = first `DirectionalLight3D` in the scene |
| `OcclusionMask` | Physics layers that hide a flare (a wall in front of a lamp). Default World |
| `FlareCanvasLayer` | Canvas layer of the flares. Keep it below your HUD |

## Lens flares from lamps

The sun flares automatically. Other lights only flare when you ask for it, so a big map doesn't pay for
every lamp:

1. Select an `OmniLight3D` or `SpotLight3D`.
2. **Node > Groups**, add the group `lens_flare`.
3. Its energy must be above the profile's `FlareEnergyThreshold` (2 by default).

## Changing the look from code

```csharp
using GameKit.Lens;

var lens = GetNode<CameraLens>("Camera3D/Lens");
lens.Profile = GD.Load<LensProfile>("res://addons/gamekit_lens/profiles/film.tres");

// Change values of the current profile, then apply them:
lens.Profile!.GrainStrength = 0.03f;
lens.Refresh();
```

Example: switch to `film` in a flashback, or raise `VignetteIntensity` when the player is hurt.

## Good to know

- **Only the camera it belongs to shows it.** The effect draws only while its camera is current, and
  mirror and rain cameras don't see it.
- **Transparent things are drawn on top of the effect**, without it: water surfaces, rain, particles,
  3D text. That is why distortion is off in `natural`: otherwise water would shift against the walls
  near the screen edges.
- **Exposure stays with the environment and the weather.** The lens never changes the camera's
  `Attributes`, so storms still darken the scene. The sun flare fades when the weather dims the sun.
- **Cost.** Halation and depth of field are the expensive parts. Turn them off in a profile for slow
  hardware, or use `clean`.

## Credits

Based on EpicCameraX by Diginaat / DevKine (MIT). The licence is in
`addons/gamekit_lens/LICENSE-EpicCameraX.txt`.
