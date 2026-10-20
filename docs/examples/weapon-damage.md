# Example: Damage from weapons

GameKit weapons push objects but don't deal damage: health and damage are your game's rules. This
example adds health to targets and listens to the weapons' `Fired` event.

## 1. Something that can be damaged

`res://game/combat/Health.cs`, a node you add as a child of anything that can be hurt:

```csharp
using System;
using Godot;

namespace MyGame.Combat;

/// <summary>Hit points. Add as a child named "Health" of any body that can be damaged.</summary>
[GlobalClass]
public partial class Health : Node
{
    [Export] public float Max { get; set; } = 100f;
    public float Current { get; private set; }

    public event Action<float>? Damaged;   // amount
    public event Action? Died;

    public override void _Ready() => Current = Max;

    public void Damage(float amount)
    {
        if (Current <= 0f)
            return;
        Current = Mathf.Max(Current - amount, 0f);
        Damaged?.Invoke(amount);
        if (Current <= 0f)
            Died?.Invoke();
    }
}
```

## 2. Apply damage when a weapon fires

`res://game/combat/WeaponDamage.cs`, a child of the player:

```csharp
using GameKit.Core;
using GameKit.FpsController;
using GameKit.Viewmodel;
using Godot;

namespace MyGame.Combat;

/// <summary>Deals damage with the player's weapons. Add as a child of an armed player.</summary>
[GlobalClass]
public partial class WeaponDamage : Node
{
    [Export] public float RifleDamage { get; set; } = 20f;
    [Export] public float PistolDamage { get; set; } = 35f;

    private FpsPlayerController _player = null!;
    private Camera3D _camera = null!;

    public override void _Ready()
    {
        _player = GetParent<FpsPlayerController>();
        _camera = _player.GetNode<PlayerCameraController>("CameraRig").Camera;
        foreach (Node node in _camera.GetNode("Viewmodel").GetChildren())
        {
            if (node is Weapon weapon)
                weapon.Fired += OnFired;
        }
    }

    private void OnFired(Weapon weapon)
    {
        // Same ray as the weapon: from the camera, straight ahead, World and Props.
        Vector3 from = _camera.GlobalPosition;
        Vector3 to = from - _camera.GlobalBasis.Z * weapon.Range;
        var query = PhysicsRayQueryParameters3D.Create(from, to, CollisionLayers.World | CollisionLayers.Props,
            new Godot.Collections.Array<Rid> { _player.GetRid() });
        var hit = _camera.GetWorld3D().DirectSpaceState.IntersectRay(query);
        if (hit.Count == 0)
            return;

        var collider = hit["collider"].AsGodotObject() as Node;
        var health = collider?.GetNodeOrNull<Health>("Health");
        health?.Damage(weapon.DisplayName == "Pistol" ? PistolDamage : RifleDamage);
    }
}
```

## 3. Set it up

1. **Build**.
2. Add a `WeaponDamage` node under the armed player (**Editable Children** not needed: add it as a
   child of the instance).
3. Add a `Health` node named `Health` under a crate (`RigidBody3D` on layer 3).
4. Connect `Died` to remove it, for example in a small script: `health.Died += crate.QueueFree;`

## How it works

- `Weapon.Fired` is raised for every shot that actually fires (not while reloading or switching).
- The damage code is yours: GameKit stays free of game rules, so you can use any health or team system.
- For NPCs made from `FpsPlayerController`, put `Health` under the NPC. Layer 2 (Player) is not in the
  ray's mask above; add `CollisionLayers.Player` to hit characters.
