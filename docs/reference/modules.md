# Modules and dependencies

Each module is a folder under `addons/` with the namespace `GameKit.<Module>`:

```
addons/gamekit_<name>/
├── scripts/      C# code
├── shaders/      optional
├── resources/    optional .tres (also presets/ or profiles/)
├── scenes/       optional
└── README.md     short reference
```

## Dependency graph

Arrows point from a module to what it uses. Dependencies only go one way.

```
gamekit_core  <-  gamekit_interaction  <-+
              <-  gamekit_world        <-+
              <-  gamekit_water        <-+-  gamekit_fps_controller  <-  gamekit_viewmodel
              <-  gamekit_lens         <-+
              <-  gamekit_weather      (stand-alone; talks to materials through shader globals)

your game code  ->  may use every module
GameKit modules ->  never use your game code
```

| Module | Namespace | Uses |
| --- | --- | --- |
| `gamekit_core` | `GameKit.Core` | — |
| `gamekit_interaction` | `GameKit.Interaction` | core |
| `gamekit_world` | `GameKit.World` | core |
| `gamekit_water` | `GameKit.Water` | core (+ PhysX engine build) |
| `gamekit_weather` | `GameKit.Weather` | core |
| `gamekit_lens` | `GameKit.Lens` | core |
| `gamekit_fps_controller` | `GameKit.FpsController` | core, interaction, world, water, lens |
| `gamekit_viewmodel` | `GameKit.Viewmodel` | core, interaction, fps_controller |

The test `Architecture.ModuleDependencies` fails if a module uses something it shouldn't, or if a module
has no `README.md`.

## How modules talk to each other

Lower modules define small interfaces, and higher modules implement them:

| Interface | Defined in | Implemented by |
| --- | --- | --- |
| `IInteractable` | interaction | doors, buttons, your objects |
| `IInteractionViewer` | interaction | `FpsPlayerController` |
| `ILadderUser` | world | `FpsPlayerController` |
| `IWaterUser` | water | `FpsPlayerController` |

So the water doesn't know about the player; it only knows "something that can swim". Your own creatures
can implement the same interfaces.

## Where your code goes

| Your code | Put it in |
| --- | --- |
| Abilities, interactables, weapons, AI | your own folder, e.g. `res://game/` |
| Tuned settings (`.tres`) | your own folder, not inside `addons/gamekit_*` |
| HUD and menus | your own folder (game UI is not part of GameKit) |

Never edit files inside `addons/gamekit_*` for one game. Then you can update GameKit by copying new
folders over the old ones.
