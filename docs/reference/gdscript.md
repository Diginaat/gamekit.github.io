# GDScript version

GameKit is written in C#. A full **GDScript port** comes with the
[GameKitDemoGDScript](https://github.com/Diginaat/GameKitDemoGDScript) project. It has the same nodes,
scenes and settings, so these docs apply to both. Only the names in code look a little different.

?> New to Godot? GDScript is the easiest start: no .NET install and no **Build** button. See
[Demo projects](getting-started/demo-projects.md) for a step-by-step guide.

## Get the GDScript modules

1. Download [GameKitDemoGDScript](https://github.com/Diginaat/GameKitDemoGDScript) (green **Code** button >
   **Download ZIP**).
2. Copy its `addons/gamekit_*` folders into your project, as described in
   [Install GameKit](getting-started/installation.md). Skip the **Build** step.

!> Don't mix the C# and GDScript folders in one project. Each scene points to the scripts of its own
version.

## How names change

The docs show C# code. In GDScript, translate it with these rules:

| C# | GDScript | Example |
| --- | --- | --- |
| Class names | Same | `WaterVolume`, `WeatherSystem`, `FpsPlayerController` |
| Properties and methods: `PascalCase` | `snake_case` | `JumpHeight` → `jump_height`, `SetWeather()` → `set_weather()` |
| Constants | `UPPER_CASE` | `RenderLayers.Viewmodel` → `RenderLayers.VIEWMODEL` |
| Enum values | `UPPER_CASE` inside the class | `MovementState.Swimming` → `PlayerMotor.MovementState.SWIMMING` |
| Events (`+=`) | Signals (`.connect()`) | `Motor.Landed += f` → `motor.landed.connect(f)` |
| Interfaces (`IInteractable`) | Plain methods on your script | Add `get_prompt`, `can_interact`, `interact` |
| `GetAbility<SwimMovement>()` | `get_ability(SwimMovement)` | |
| `GD.Load<T>("res://...")` | `load("res://...")` | |

In the Inspector the names look the same in both versions ("Jump Height"), because Godot shows
`jump_height` as "Jump Height".

### Interfaces become methods

| C# interface | Methods your GDScript node needs |
| --- | --- |
| `IInteractable` | `get_prompt(interactor) -> String`, `can_interact(interactor) -> bool`, `interact(interactor)` |
| `IHighlightable` | `set_highlighted(on: bool)` |
| `IWaterUser` | `on_water_entered(water)`, `on_water_exited(water)`, optional `get_water_extent() -> [center, half_height, radius]` |
| `ILadderUser` | `on_ladder_entered(ladder)`, `on_ladder_exited(ladder)` |
| `IInteractionViewer` | `get_view_origin()`, `get_view_basis()`, `get_viewer_velocity()` |

GameKit checks for these methods with `has_method()`, so any node that has them works.

## Examples in GDScript

### A lever (your own interactable)

The [lever example](examples/lever.md) in GDScript. Save it as `res://game/world/lever.gd` and attach it
to a `StaticBody3D`:

```gdscript
class_name Lever
extends StaticBody3D
## A lever: E flips it and uses its target (for example a SlidingDoor).

## What the lever operates, for example a SlidingDoor.
@export var target: NodePath
## The handle mesh that rotates.
@export var handle: Node3D
## Only works once (a one-way gate).
@export var one_shot := false

var _on := false


func get_prompt(_interactor: Node) -> String:
	return "Push lever" if _on else "Pull lever"


func can_interact(_interactor: Node) -> bool:
	return not (one_shot and _on)


func interact(interactor: Node) -> void:
	_on = not _on
	if handle:
		handle.rotation_degrees = Vector3(-40.0 if _on else 40.0, 0.0, 0.0)
	# Works with any interactable target: a SlidingDoor, a light, another lever.
	var node := get_node_or_null(target)
	if node and node.has_method("interact"):
		node.interact(interactor)
```

### Fall damage (connect to a signal)

```gdscript
player.motor.landed.connect(func(speed: float) -> void:
	if speed > 12.0:
		health.damage((speed - 12.0) * 5.0))
```

### Weather from code

```gdscript
weather.set_weather(load("res://addons/gamekit_weather/presets/storm.tres"), 20.0) # 20 s blend
weather.next_weather()
weather.wetness = 1.0 # start the level wet
weather.weather_changed.connect(func(preset: WeatherPreset) -> void: print(preset.display_name))
```

### Drive the player from code (AI, cutscenes)

```gdscript
player.use_external_command = true
player.command.move = Vector2(0, 1) # forward
player.command.jump_pressed = true   # lasts one physics tick
player.set_look(deg_to_rad(90.0), 0.0)
```

## Learn GDScript

- [GDScript basics](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html)
  (official Godot docs)
- [Your first 3D game](https://docs.godotengine.org/en/stable/getting_started/first_3d_game/index.html)
  (official step-by-step tutorial)
- [Signals](https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html)
