# GameKit

GameKit is a set of modular first-person game systems for **Godot 4**, in **C#** and **GDScript**. You get a Source-style
player controller, ladders, moving platforms, doors and pickups, swimmable water, dynamic weather,
a photographic camera look and first-person weapons. Each system is a folder you can copy into a game.

![Feature showcase](images/sc_overview.png)

## Download

| What | Download |
| --- | --- |
| **Engine** (Godot NVIDIA + PhysX, Windows) | **[Latest release](https://github.com/Diginaat/godot/releases/latest)**, then under **Assets**: `..._editor_windows_amd64_mono.zip` (C# and GDScript) or `..._editor_windows_amd64.zip` (GDScript only). Export templates: `..._export_templates_windows_amd64.tpz`. [All releases](https://github.com/Diginaat/godot/releases) |
| **GDScript demo** | [Download ZIP](https://github.com/Diginaat/GameKitDemoGDScript/archive/refs/heads/main.zip) or [GitHub page](https://github.com/Diginaat/GameKitDemoGDScript) |
| **C# demo** | [Download ZIP](https://github.com/Diginaat/GameKitDemoCSharp/archive/refs/heads/main.zip) or [GitHub page](https://github.com/Diginaat/GameKitDemoCSharp) |

The **Latest release** link always opens the newest engine version. New to this? Follow
[Demo projects](getting-started/demo-projects.md) step by step.

## What is in the kit

| Module | What you get |
| --- | --- |
| `gamekit_core` | Collision/render layers, footstep surfaces, placeholder sounds, prototype grid shader |
| `gamekit_fps_controller` | First-person player: walk, run, sprint, crouch, jump, slide, mantle, swim, climb |
| `gamekit_interaction` | Use, pick up and throw; buttons and sliding doors; your own interactables |
| `gamekit_world` | Ladders and moving / rotating platforms |
| `gamekit_water` | Pools with refraction, reflections, caustics, underwater view and swimming |
| `gamekit_weather` | Clouds, rain, wind, fog, lightning and thunder, wet surfaces that stay dry under roofs |
| `gamekit_lens` | Photographic camera finish: grading, grain, halation, vignette, depth of field, lens flares |
| `gamekit_viewmodel` | First-person weapons: rifle and pistol, sway, recoil, reload |

## How the kit is built

- **Nodes, not code.** You build maps by placing nodes and setting values in the Inspector.
  Code is only needed to add new behaviour.
- **Settings are resources.** Movement, camera, weather and lens settings are `.tres` files.
  Duplicate one, change the values, and assign it.
- **No singletons, no autoloads.** Everything is a node in your scene. Remove a node and that
  feature is gone; nothing else breaks.
- **One-way dependencies.** Modules only use the modules below them (see
  [Modules and dependencies](reference/modules.md)). A test in the project fails if that rule is broken.

?> **Search** is at the top of the sidebar. Press **/** to jump to it. Typos are fine: "ladr" finds Ladders.
Use **↑ ↓ Enter** to pick a result. The **☾ Dark / ☀ Light** button is at the top right.

## Where to start

?> **New here?** Follow [Demo projects](getting-started/demo-projects.md). It explains step by step how to
download the engine and a demo, open it and play it, with no programming needed.

1. Play a demo project: [GameKitDemoGDScript](https://github.com/Diginaat/GameKitDemoGDScript) (easiest) or
   [GameKitDemoCSharp](https://github.com/Diginaat/GameKitDemoCSharp). See
   [Demo projects](getting-started/demo-projects.md).
2. Read [Requirements](getting-started/requirements.md).
3. Look at the [feature showcase](getting-started/showcase.md) to see every feature.
4. Build [your first map](getting-started/first-map.md) from the template.

## Links

| What | Link |
| --- | --- |
| C# demo project | [Diginaat/GameKitDemoCSharp](https://github.com/Diginaat/GameKitDemoCSharp) |
| GDScript demo project | [Diginaat/GameKitDemoGDScript](https://github.com/Diginaat/GameKitDemoGDScript) |
| Engine (Godot NVIDIA + PhysX) | [Diginaat/godot](https://github.com/Diginaat/godot), [downloads](https://github.com/Diginaat/godot/releases/latest) |
| PhysX 5 module by Wild Ox Studios | [uno1982/godot `feature/physx5-module`](https://github.com/uno1982/godot/tree/feature/physx5-module), [example project](https://github.com/uno1982/godot-physx-example), [YouTube](https://www.youtube.com/@WildOxStudios) |
| Godot Engine | [godotengine.org](https://godotengine.org) |

The people who made GameKit possible are on [Credits](reference/credits.md).
4. Use the [Examples](examples/lever.md) when you want to add your own behaviour.

?> These docs describe the GameKit in the `GameClient` project. Each module folder also has a short
`README.md`, and the project has `docs/INTEGRATION.md` and `docs/BUILDING_MAPS.md` for quick reference.
