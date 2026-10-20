# Install GameKit in a project

GameKit is not an editor plugin. It is a set of folders you copy into your game. There is nothing to
enable and no autoload to add.

?> Take the folders from a demo project in your language:
[GameKitDemoCSharp](https://github.com/Diginaat/GameKitDemoCSharp) for C#, or
[GameKitDemoGDScript](https://github.com/Diginaat/GameKitDemoGDScript) for GDScript. New to Godot? Follow
[Demo projects](getting-started/demo-projects.md) step by step first.

## 1. Copy the module folders

Copy the folders you need from the demo's `addons/` folder (or `GameClient/addons/`) into your project's
`addons/` folder. Always copy
a module **together with the modules it needs**:

| If you want | Copy |
| --- | --- |
| Only the shared basics | `gamekit_core` |
| Doors, buttons, pickups | `gamekit_core`, `gamekit_interaction` |
| Ladders, moving platforms | `gamekit_core`, `gamekit_world` |
| Pools | `gamekit_core`, `gamekit_water` |
| Weather | `gamekit_core`, `gamekit_weather` |
| Camera look | `gamekit_core`, `gamekit_lens` |
| The player | `gamekit_core`, `gamekit_interaction`, `gamekit_world`, `gamekit_water`, `gamekit_lens`, `gamekit_fps_controller` |
| The player with weapons | everything above + `gamekit_viewmodel` |

The full dependency graph is on [Modules and dependencies](reference/modules.md).

## 2. Build (C# only)

GDScript projects skip this step: Godot loads the scripts by itself.

1. Open the project in the Godot .NET editor.
2. Press **Build**. If the project has no C# solution yet, Godot asks to create one.
3. Godot imports the new files. GameKit nodes now appear in the **Create New Node** dialog
   (for example `WaterVolume`, `WeatherSystem`, `CameraLens`).

## 3. Copy the project settings

Some modules need settings in `project.godot`. Follow [Project settings](getting-started/project-settings.md).

## Updating GameKit later

Copy the new module folders over the old ones. Keep your own data **outside** the `gamekit_*` folders:

- Tuned `.tres` files (movement profile, weather presets, lens profiles): save copies in your own folder,
  for example `res://game/settings/`.
- Your own abilities, interactables and weapons: your own scripts in your own folder.

Then an update never overwrites your work.
