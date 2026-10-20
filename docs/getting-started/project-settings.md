# Project settings

Copy these settings into a new project's `project.godot`, or set them in **Project > Project Settings**.

## Physics

| Setting | Value | Why |
| --- | --- | --- |
| `physics/3d/physics_engine` | `PhysX` | Needed for water; other modules work with any engine |
| `physics/common/physics_interpolation` | On | The camera is smoothed between physics ticks |
| `physics/common/physics_jitter_fix` | `0` | Interpolation replaces it |

## Layer names

**Project Settings > Layer Names > 3D Physics**

| Layer | Name | Used for |
| --- | --- | --- |
| 1 | World | Floors, walls, static geometry, doors, platforms |
| 2 | Player | Players and NPCs that use the controller |
| 3 | Props | Rigid bodies that can be pushed, picked up and shot |
| 4 | Triggers | Ladder and water volumes, your own trigger areas |

**Project Settings > Layer Names > 3D Render**

| Layer | Name | Keep level meshes off it |
| --- | --- | --- |
| 17 | WeatherCapture | Rain cover map capture |
| 18 | Weather | Rain particles |
| 19 | Viewmodel | First-person only: weapons and the lens pass |
| 20 | Water | Water surfaces |

The values matter, the names are only for the editor. The code uses the constants in
`CollisionLayers` and `RenderLayers` (`gamekit_core`).

## Shader globals (weather)

The weather module needs four shader globals. Copy this section into `project.godot`:

```ini
[shader_globals]

weather_wetness={
"type": "float",
"value": 0.0
}
weather_rain={
"type": "float",
"value": 0.0
}
weather_rain_occlusion={
"type": "sampler2D",
"value": ""
}
weather_occlusion_area={
"type": "vec4",
"value": Vector4(0, 0, 0, 0)
}
```

?> If one is missing, `WeatherSystem` prints which one, and shaders that use wetness don't compile.
Check the exact section in `GameClient/project.godot` if Godot reformats it.

## Input

You don't need to set up input. The player adds its actions (`move_forward`, `jump`, `crouch`,
`sprint`, `interact`, `fire`, ...) when they are missing. To rebind a key, add the action with the same
name in **Project Settings > Input Map**. See [Input and controls](player/input.md).
