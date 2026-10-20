# Adding the player

The player is a Half-Life 2 / Source-style first-person controller built on `CharacterBody3D`.

## Add it to a scene

Instance one of these scenes (drag it into the Scene dock, or **Ctrl+Shift+A**):

| Scene | Contents |
| --- | --- |
| `res://addons/gamekit_viewmodel/scenes/fps_player_armed.tscn` | Player with rifle and pistol |
| `res://addons/gamekit_fps_controller/scenes/fps_player.tscn` | Player without weapons |

Place it so its origin (the feet) is just above a floor.

## What is inside

```
FpsPlayer (FpsPlayerController)   layer Player (2), mask World | Props
├── CollisionShape3D   capsule, origin at the feet
├── GroundCheck        RayCast3D (footstep surface)
├── Abilities          movement abilities; child order = priority
│   ├── Mantle  ├── Swim  ├── Ladder  └── Slide
├── Input              PlayerInput (mouse and keyboard)
├── Interaction        InteractionRay (use, pick up, throw)
├── Footsteps          PlayerFootsteps
└── CameraRig          PlayerCameraController
    └── Pitch > Effects (PlayerCameraEffects) > Camera3D
                                                └── Lens (CameraLens)
```

Every part except `CollisionShape3D` is optional. To remove a feature, select the instance, enable
**Editable Children**, and remove or disable the node. Or remove an ability, for example `Slide`.

## Inspector settings

| Property | What it does |
| --- | --- |
| `Movement` | A `PlayerMovementSettings` resource: speeds, jump, crouch, slide, swim. See [Movement settings](player/movement-settings.md) |
| `CameraSettings` | A `PlayerCameraSettings` resource: mouse, FOV, head bob, lens look. See [Camera settings](player/camera.md) |

## HUD

The HUD is game code, not part of GameKit. `GameClient/scripts/game/ui/PlayerHud.cs` is an example.
It shows the interaction prompt like this:

```csharp
player.Interaction!.PromptChanged += prompt => _promptLabel.Text = prompt ?? "";
```

## Debug overlay

Add a `CanvasLayer` with a `PlayerDebugOverlay` child and set its `PlayerPath` to the player.
**F3** shows speed, state, floor and tick cost; **F4** draws debug shapes.

## Useful properties in code

```csharp
var player = GetNode<FpsPlayerController>("FpsPlayer");

player.Motor.State          // Grounded, Airborne, Sliding, Swimming, ...
player.Motor.IsOnFloor
player.Motor.Velocity       // m/s, read and write
player.ViewYaw, player.ViewPitch   // radians
player.SetLook(yaw, pitch);        // turn the player
player.ApplyMovementSettings(GD.Load<PlayerMovementSettings>("res://..."));
```
