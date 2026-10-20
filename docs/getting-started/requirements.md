# Requirements

| Need | Version / note |
| --- | --- |
| Godot | The [Godot NVIDIA + PhysX engine](https://github.com/Diginaat/godot) 4.8 ([downloads](https://github.com/Diginaat/godot/releases/latest)). For C#, use its **.NET (mono)** editor |
| .NET SDK | C# only: [.NET SDK 8](https://dotnet.microsoft.com/download/dotnet/8.0) or newer (C# with `Nullable` enabled, LangVersion 12+). Not needed for GDScript |
| Language | **C#** ([GameKitDemoCSharp](https://github.com/Diginaat/GameKitDemoCSharp)) or **GDScript** ([GameKitDemoGDScript](https://github.com/Diginaat/GameKitDemoGDScript)). See [GDScript version](reference/gdscript.md) |
| Physics | PhysX (`physics/3d/physics_engine = PhysX`). Every module except **water** also works with Godot Physics or Jolt |
| Renderer | Forward+ (water, weather and lens use screen and depth textures) |

!> `gamekit_water` needs the custom engine build, because it uses `PhysXWaterSurface3D`. If you use a
standard Godot build, leave the water module out. Everything else uses standard Godot APIs.

## Opening the project

1. Start the Godot .NET editor (in this repository: `GodotEnginePhysx/godot.windows.editor.x86_64.mono.exe`).
2. Import `GameClient/project.godot`.
3. Press **Build** (the hammer icon, top right) once, so the C# scripts compile.
4. Press **F5** to play the main scene (the test course), or open a scene and press **F6**.

## Running the tests

The project has a headless test suite that checks every module. Run it from the `GameClient` folder:

```bash
../GodotEnginePhysx/godot.windows.editor.x86_64.mono.console.exe --headless --path . res://tests/player/player_tests.tscn
```

Run one test with `-- filter=Name`, for example `-- filter=Weather`. Every test should pass before you
copy GameKit into another project.
