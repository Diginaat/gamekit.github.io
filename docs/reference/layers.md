# Collision and render layers

## Collision layers

| Layer | Bit | `CollisionLayers.` | Put here |
| --- | --- | --- | --- |
| 1 | 1 | `World` | Floors, walls, stairs, doors, platforms, buttons, levers |
| 2 | 2 | `Player` | Players and NPCs using the controller |
| 3 | 4 | `Props` | Rigid bodies: crates, barrels, pickups |
| 4 | 8 | `Triggers` | Ladder volumes, water volumes, your trigger areas |

## What each thing needs

| Node | Layer | Mask |
| --- | --- | --- |
| Player | 2 | 1, 3 |
| Static level geometry | 1 | — |
| Prop (`RigidBody3D`) | 3 | 1, 2, 3 |
| `LadderVolume` | 4 | 2 |
| `WaterVolume` | 4 | 2, 3 |
| Your trigger (jump pad, weather zone) | 4 | 2 |
| `InteractionRay` (`Mask`) | — | 1, 3 |
| Weapon hitscan | — | 1, 3 |

?> In the Inspector the layer grid starts at 1. In code, use the constants:
`CollisionLayers.World | CollisionLayers.Props`.

## Render layers

| Layer | `RenderLayers.` | Holds | Seen by |
| --- | --- | --- | --- |
| 1–16 | `World` (1) | Your level meshes | Every camera; counts as cover from rain |
| 17 | `WeatherCapture` | Rain cover capture | Rain cover camera only |
| 18 | `Weather` | Rain particles | Player camera |
| 19 | `Viewmodel` | Weapons, lens pass | Player camera only (not reflections, not the rain cover) |
| 20 | `Water` | Water surfaces | Player camera (not reflection cameras) |

!> Keep your level meshes off layers 17–20, or they disappear from reflections or stop blocking rain.
