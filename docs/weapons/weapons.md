# Viewmodel and weapons

`gamekit_viewmodel` adds first-person weapons: a rifle and a pistol with switching, sway, bob,
landing dip, recoil and reload.

## Use it

Instance `res://addons/gamekit_viewmodel/scenes/fps_player_armed.tscn` instead of the plain player.

```
FpsPlayer (fps_player.tscn)
└── ... Camera3D
    └── Viewmodel (PlayerViewmodel)
        ├── Rifle   (Weapon)
        └── Pistol  (Weapon)
```

| Key | Action |
| --- | --- |
| Left mouse | Fire (hold for automatic weapons) |
| R | Reload |
| 1 / 2 | Rifle / pistol |
| 3 | Holster |

## Weapon settings

| Property | Rifle default | Meaning |
| --- | --- | --- |
| `DisplayName` | Rifle | Shown in the HUD |
| `Automatic` | on | Hold to keep firing |
| `FireInterval` | 0.1 | Seconds between shots |
| `MagazineSize` | 30 | Rounds per magazine |
| `Range` | 100 | Hitscan range in metres |
| `HitImpulse` | 6 | Push on hit rigid bodies |
| `PlaceholderColor` | | Colour of the placeholder model |

Shots are hitscan rays on layers World and Props. They push rigid bodies; they don't deal damage, because
damage is game rules. See [Damage from weapons](examples/weapon-damage.md).

## Your own weapon model

1. Add a `Node3D` with the `Weapon` script under `Viewmodel`. The order of children is the slot order.
2. Add your weapon mesh as a child. Put its meshes on **render layer 19** (Viewmodel) only, so
   reflections and the rain don't see it.
3. Add an `AnimationPlayer` child with four clips: `equip`, `holster`, `fire`, `reload`.
   Without an `AnimationPlayer`, the weapon makes a placeholder model and clips.

## Events

```csharp
weapon.Fired += w => GD.Print(w.DisplayName, " fired, ammo left ", w.Ammo);
```

`Weapon.Ammo`, `IsReloading`, `IsSwitching` and `PlayerViewmodel.CurrentWeapon` are readable for your HUD.
