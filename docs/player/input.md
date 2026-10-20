# Input and controls

## Default controls

| Key | Action | Input Map name |
| --- | --- | --- |
| W A S D | Move | `move_forward`, `move_back`, `move_left`, `move_right` |
| Mouse | Look | — |
| Space | Jump (swim up) | `jump` |
| Ctrl or C | Crouch (swim down) | `crouch` |
| Shift | Sprint | `sprint` |
| Alt | Walk | `walk` |
| Shift + Ctrl | Slide | — |
| Space + W at a ledge | Mantle | — |
| E | Use, pick up, drop | `interact` |
| Left mouse | Fire, throw held object | `fire` |
| Right mouse | Alternative fire | `alt_fire` |
| R | Reload | `reload` |
| 1 / 2 / 3 | Rifle / pistol / holster | `weapon_1`, `weapon_2`, `holster` |
| Esc | Release the mouse (click to capture again) | `release_mouse` |
| F3 / F4 | Debug text / debug drawing | `debug_overlay`, `debug_draw` |
| F7 | Next weather | `cycle_weather` |

The test level adds a few test keys: **F1** movement profile, **F2** reduced motion,
**F5** physics tick rate, **F6** FPS cap, **F9** respawn.

## Rebinding

GameKit adds each action with its default key **only when the action is missing**. To change a key:

1. Open **Project > Project Settings > Input Map**.
2. Add the action with exactly the same name, for example `jump`.
3. Bind any key or gamepad button to it.

Now your binding is used and the default is not added.

?> Check the action names in `InputActions.cs` (`gamekit_fps_controller/scripts`) before you rebind.
F7 belongs to the weather module: `WeatherSystem.CycleAction`. Set `CycleAction` empty to turn F7 off.
