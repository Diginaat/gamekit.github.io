# Lens profiles

A `LensProfile` (`.tres`) holds every setting of the camera look, grouped in the Inspector.

## Built-in profiles

All in `res://addons/gamekit_lens/profiles/`:

| File | Look |
| --- | --- |
| `natural.tres` | Subtle: light vignette, edge fringes, halation, fine sensor noise, sun flare |
| `film.tres` | Stronger: warm grade, film grain, blurred background, slight barrel distortion |
| `clean.tres` | Everything off (accessibility, comparison, low-end hardware) |

## Make your own

1. Duplicate `natural.tres` into your own folder.
2. Assign it to the camera's `Lens` node (or to `PlayerCameraSettings.Lens`).
3. Run the game and change values in the Inspector (**Remote** tab, select the `Lens` node), or edit
   the file and call `lens.Refresh()`.

## Settings

| Group | Properties | Tip |
| --- | --- | --- |
| Vignette | `VignetteEnabled`, `VignetteIntensity`, `VignetteSize`, `VignetteSmoothness`, `VignetteRoundness` | 0.2–0.35 looks natural |
| Chromatic aberration | `ChromaticAberrationEnabled`, `ChromaticAberration` (pixels at the corners), `CaEdgeStart`, `CaBlur`, `CaRadialPower`, `CaEdgeResponse`, `CaHighlightFringe` | Only on high-contrast edges near the frame border |
| Lens distortion | `DistortionEnabled`, `Distortion` (+ barrel / − pincushion), `DistortionCubic` | Off in `natural`; see the note below |
| Depth of field | `DofEnabled`, `DofAmount`, `DofNearEnabled`, `DofNearDistance`, `DofNearTransition`, `DofFarEnabled`, `DofFarDistance`, `DofFarTransition` | Far blur hides far enemies in a shooter; use carefully |
| Halation | `HalationEnabled`, `HalationIntensity`, `HalationThreshold`, `HalationSoftness`, `HalationRadius`, `HalationColor`, `HalationDepthAware`, `HalationDepth*` | Warm film glow around bright lights |
| Highlight bloom | `BloomEnabled`, `BloomIntensity`, `BloomThreshold`, `BloomSoftness`, `BloomRadius`, `BloomTint` | Off by default; the environment's glow already blooms |
| Grain | `GrainEnabled`, `RgbSensorNoise`, `GrainStrength`, `GrainSize`, `GrainSpeed`, `GrainShadows`, `GrainMids`, `GrainHighlights` | `RgbSensorNoise` on = digital camera, off = film |
| Grading | `GradingEnabled`, `Exposure`, `Contrast`, `Saturation`, `Temperature`, `Tint`, `Lift`, `Gamma`, `Gain` | Keep `Lift` tiny (≤ 0.001), dark scenes amplify it |
| LUT | `LutEnabled`, `LutTexture`, `LutSize`, `LutStrength` | Strip LUT: width = size × size, height = size |
| Lens flare | `FlareEnabled`, `SunFlare`, `FlareIntensity`, `FlareGhosts`, `FlareHalo`, `FlareRays`, `FlareSize`, `SunFlareSize`, `SunFlareIntensity`, `FlareEnergyThreshold`, `FlareFadeInSpeed`, `FlareFadeOutSpeed`, `FlareVisibilityGating`, `FlareCenterSafeZone`, ... | `FlareCenterSafeZone` keeps ghosts off the crosshair |

!> **Distortion and transparents.** Water surfaces, rain and 3D text are drawn after the lens effect and
are not distorted. With distortion on, they shift a little against the walls near the screen edges.
Keep `Distortion` small (≤ 0.02) if you turn it on.
