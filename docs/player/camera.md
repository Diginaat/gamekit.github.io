# Camera settings

Mouse look, field of view and the camera's motion effects are in a `PlayerCameraSettings` resource.
The player's `CameraSettings` property points at one. These settings only change how the view
looks. Movement stays the same.

## Built-in presets

| File | Feel | Lens look |
| --- | --- | --- |
| `camera_modern.tres` | FOV 72, head bob, landing kick, strafe roll, sprint FOV, breathing | `natural` |
| `camera_classic.tres` | FOV 65, small bob, no other motion effects | `clean` |
| `camera_accessible.tres` | **Reduced motion**: every motion effect off | `clean` |

All three are in `res://addons/gamekit_fps_controller/resources/`.

## The values

| Group | Properties |
| --- | --- |
| Look | `MouseSensitivity`, `InvertY`, `MaxPitchDegrees`, `VerticalFov` |
| Smoothing | `StepSmoothingRate`, `CrouchSmoothingRate` (smooth the eye on stairs and crouch; these reduce motion) |
| Motion effects | `MotionEffects` (master switch), `HeadBob`, `BobAmplitude`, `BobStrideLength`, `SprintBobScale`, `LandingKick`, `LandingKickPerSpeed`, `MaxLandingKick`, `JumpKick`, `KickStiffness`, `KickDamping`, `StrafeRoll`, `MaxRollDegrees`, `RollRate`, `AccelerationTilt`, `TiltPerAcceleration`, `MaxTiltDegrees`, `TiltRate`, `SprintFov`, `SprintFovIncrease`, `FovRate`, `Breathing`, `BreathingAmplitude`, `BreathingRate`, `Recoil`, `RecoilStiffness`, `RecoilDamping` |
| Lens | `Lens`: the `LensProfile` for the camera look. Empty = keep the Lens node's own profile |

## Switching at runtime

Assign a different resource. The camera and the lens look update on the next physics tick:

```csharp
player.CameraSettings = GD.Load<PlayerCameraSettings>(
    "res://addons/gamekit_fps_controller/resources/camera_accessible.tres");
```

In the test level, **F1** cycles the movement profile and **F2** switches reduced motion on and off.

## Accessibility

Offer `camera_accessible.tres` (or your own copy) in your options menu. It keeps step and crouch smoothing
because they reduce motion, and it uses the `clean` lens (no animated grain or flares).

See [Camera lens](lens/camera-lens.md) for the photographic look.
