# Demo projects

GameKit has two ready-to-play **demo projects**. Each one is a small map that shows every GameKit
feature: walking and jumping, stairs, ladders, a door with a button, moving platforms, a swimming pool,
rain and thunder, and weapons. A sign at every spot ("station") tells you which nodes it uses.

The two projects have the **same map**. Only the programming language is different:

| Project | Language | Pick this one if... |
| --- | --- | --- |
| **[GameKitDemoCSharp](https://github.com/Diginaat/GameKitDemoCSharp)** | C# | you write (or want to learn) C# |
| **[GameKitDemoGDScript](https://github.com/Diginaat/GameKitDemoGDScript)** | GDScript | you are new to Godot, or you use GDScript. No extra tools needed |

?> **New to programming?** Start with the **GDScript** project. GDScript is Godot's own language, and the
project runs without installing anything except the editor.

![Demo map](images/sc_overview.png)

## What you need

- A Windows 10 or 11 PC (64-bit).
- An NVIDIA graphics card is best. Without one, everything still runs, only GPU physics and DLSS are off.
- About 2 GB of free disk space.
- **For the C# project only:** the [.NET SDK 8](https://dotnet.microsoft.com/download/dotnet/8.0) (free).

## Step 1: Download the engine

The demos need a special version of Godot: the
**[Godot NVIDIA + PhysX engine](https://github.com/Diginaat/godot)**. Normal Godot from godotengine.org
**will not work**, because the pool uses this engine's PhysX water.

1. Open the [latest release page](https://github.com/Diginaat/godot/releases/latest).
2. Scroll down to **Assets** and download the editor zip:
   - for the **C#** demo: the file whose name ends in `editor_windows_amd64_mono.zip` (the **.NET / mono**
     editor);
   - for the **GDScript** demo: the mono editor works too. The demos were tested with it.
3. Right-click the zip and choose **Extract All...**. Pick a folder you will find again, for example
   `C:\Godot`.
4. In that folder, double-click `godot.windows.editor.x86_64.mono.exe` once to check that the editor
   starts. Close it again.

!> Windows may show "Windows protected your PC". Click **More info**, then **Run anyway**. This happens
with programs that are not from the Microsoft Store.

## Step 2: Download a demo project

You can download it without any extra tools:

1. Open the project page:
   [GameKitDemoGDScript](https://github.com/Diginaat/GameKitDemoGDScript) or
   [GameKitDemoCSharp](https://github.com/Diginaat/GameKitDemoCSharp).
2. Click the green **Code** button, then **Download ZIP**.
3. Extract the zip, for example to `C:\GodotProjects\GameKitDemoGDScript`.

Or, if you have [Git](https://git-scm.com/downloads) installed, run in a terminal:

```bash
git clone https://github.com/Diginaat/GameKitDemoGDScript.git
# or
git clone https://github.com/Diginaat/GameKitDemoCSharp.git
```

## Step 3: Open the project in Godot

1. Start the editor (`godot.windows.editor.x86_64.mono.exe`).
2. The **Project Manager** opens. Click **Import** (top left).
3. Browse to the demo folder and select its `project.godot` file. Click **Open**, then **Import & Edit**.
4. The first time, Godot imports all files. This takes a minute; wait until the progress bar is gone.

## Step 4: Play

- **GDScript demo:** press **F5** (or the ▶ button at the top right).
- **C# demo:** press **Build** first (the hammer icon at the top right), wait until it finishes, then press
  **F5**.

The game starts at the beginning of the path. Click in the window to capture the mouse. Walk along the
path and read the signs.

### Controls

| Key | What it does |
| --- | --- |
| **W A S D** | Walk |
| Mouse | Look around |
| **Space** | Jump |
| **Ctrl** | Crouch |
| **Shift** | Sprint |
| **Alt** | Walk slowly |
| **Shift + Ctrl** while running | Slide |
| **Space + W** in front of a ledge | Climb onto it (mantle) |
| **E** | Use a button, pick up a crate |
| Left mouse button | Fire, or throw a crate you hold |
| **R** | Reload |
| **1** / **2** / **3** | Rifle / pistol / put weapon away |
| **F7** | Change the weather |
| **L** | Change the camera look (lens) |
| **H** | Hide the controls panel |
| **Esc** | Free the mouse again |
| **F8** | Stop the game (in the editor) |

## Step 5: Look at how it is made

Everything in the map is built from **nodes** (the building blocks of a Godot scene). You don't need to
write code to understand it.

1. Stop the game (**F8**).
2. In the **FileSystem** panel (bottom left), open `addons/gamekit_demo/scenes/gamekit_demo.tscn`. This is
   the main scene.
3. In the **Scene** panel (top left), open **Stations** and click one, for example **Pool**.
4. Click the small **film-strip icon** next to it ("Open in Editor") to open that station on its own.
5. Click a node, for example **Water**. The **Inspector** panel (right) shows all its settings. Change a
   value, press **F6** to play this scene, and see what changes.

!> If you break something, close the scene without saving, or download the demo again.

### The scenes

The main map is `addons/gamekit_demo/scenes/gamekit_demo.tscn`. Every station is a separate scene in
`addons/gamekit_demo/stations/`:

| Scene | What it shows | Main nodes |
| --- | --- | --- |
| `surfaces.tscn` | Different floors: concrete, metal, wood, grass, ice, mud. Each sounds and grips differently | Colliders with metadata `surface` |
| `stairs.tscn` | Stairs and a 25° slope | Plain `StaticBody3D` boxes |
| `interaction.tscn` | A button that opens a sliding door, crates to pick up and throw | `SlidingDoor`, `InteractableButton`, `RigidBody3D` |
| `ladder.tscn` | A ladder tower to climb | `LadderVolume` |
| `platforms.tscn` | An elevator and a turning platform | `MovingPlatform` |
| `abilities.tscn` | Blocks to climb onto and beams to slide under | Plain boxes; the abilities are nodes on the player |
| `weather.tscn` | A shelter that stays dry in the rain (press **F7**) | Materials that get wet |
| `pool.tscn` | A pool to swim in, with light patterns (caustics) on the floor | `WaterVolume`, `PoolCaustics` |

## Step 6: Use it in your own project

1. Make a new Godot project with the same editor (Project Manager > **Create**, renderer
   **Forward+**). For C#, pick the .NET editor.
2. Close the editor. Copy the whole `addons` folder from the demo into your project folder.
3. Open both `project.godot` files in a text editor (for example Notepad). Copy the `[physics]`,
   `[layer_names]`, `[shader_globals]` and `[input]` sections from the demo's file into yours. More on this
   in [Project settings](getting-started/project-settings.md).
4. Open your project. **C# only:** press **Build**.
5. Open `addons/gamekit_demo/scenes/gamekit_demo.tscn` and press **F6**. If it plays, everything is set up.
6. To make your own map, drag stations from `addons/gamekit_demo/stations/` into a new scene. Read
   [Your first map](getting-started/first-map.md) next.

?> Copy the modules from the demo in **your project's language**. The C# and GDScript versions can't be
mixed. The differences are on [GDScript version](reference/gdscript.md).

## Problems?

| Problem | Fix |
| --- | --- |
| Errors about `PhysXWaterSurface3D` or the pool is missing | You opened it with normal Godot. Use the editor from [Step 1](#step-1-download-the-engine) |
| C#: "Build failed" or scripts don't load | Install the [.NET SDK 8](https://dotnet.microsoft.com/download/dotnet/8.0), restart the editor, press **Build** |
| The mouse doesn't turn the camera | Click inside the game window |
| Very low frame rate | Press **F7** until the weather is **Clear**; rain is the heaviest effect |

More answers: [Troubleshooting / FAQ](reference/faq.md).

## Links

| What | Link |
| --- | --- |
| C# demo project | https://github.com/Diginaat/GameKitDemoCSharp |
| GDScript demo project | https://github.com/Diginaat/GameKitDemoGDScript |
| Godot NVIDIA + PhysX engine | https://github.com/Diginaat/godot |
| Engine downloads | https://github.com/Diginaat/godot/releases/latest |
| PhysX 5 module (source) | https://github.com/uno1982/godot/tree/feature/physx5-module |
| PhysX example project | https://github.com/uno1982/godot-physx-example |
| Wild Ox Studios on YouTube | https://www.youtube.com/@WildOxStudios |
| Godot Engine | https://godotengine.org |
| Godot documentation (for beginners) | https://docs.godotengine.org/en/stable/getting_started/introduction/index.html |
| .NET SDK (C# only) | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Git | https://git-scm.com/downloads |

The people who made this possible are listed on [Credits](reference/credits.md).
