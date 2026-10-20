# Example: Lever that opens a door

A lever the player pulls with **E**. It flips its handle and uses any `IInteractable` target, for
example a `SlidingDoor`. It shows how to write your own interactable.

## 1. The script

Create `res://game/world/Lever.cs`:

```csharp
using GameKit.Interaction;
using Godot;

namespace MyGame.World;

/// <summary>A lever: E flips it and uses its target (a door, a light, anything IInteractable).</summary>
[GlobalClass]
public partial class Lever : StaticBody3D, IInteractable, IHighlightable
{
    /// <summary>What the lever operates, for example a SlidingDoor.</summary>
    [Export] public NodePath Target { get; set; } = new();
    /// <summary>The handle mesh that rotates.</summary>
    [Export] public Node3D? Handle { get; set; }
    /// <summary>Only works once (a one-way gate).</summary>
    [Export] public bool OneShot { get; set; }

    private bool _on;

    public string GetPrompt(Node interactor) => _on ? "Push lever" : "Pull lever";

    public bool CanInteract(Node interactor) => !(OneShot && _on);

    public void Interact(Node interactor)
    {
        _on = !_on;
        if (Handle != null)
            Handle.RotationDegrees = new Vector3(_on ? -40f : 40f, 0f, 0f);
        if (GetNodeOrNull(Target) is IInteractable target)
            target.Interact(interactor);
    }

    public void SetHighlighted(bool highlighted)
    {
        if (Handle is GeometryInstance3D mesh)
            mesh.Transparency = highlighted ? 0.2f : 0f;
    }
}
```

## 2. The scene

Press **Build**, then build this under `Level`:

```
Gate      (AnimatableBody3D + SlidingDoor)   OpenOffset = 0, 3, 0
Lever     (StaticBody3D + Lever)             Target = ../Gate, Handle = Handle
├── CollisionShape3D   BoxShape3D 0.4 x 1 x 0.4
├── Base               MeshInstance3D
└── Handle             MeshInstance3D (BoxMesh 0.1 x 0.8 x 0.1), position y = 0.5
```

Keep the lever on collision layer 1 (World): the interaction ray hits World and Props.

## 3. Try it

Play, look at the lever: the HUD shows "Pull lever". Press **E**: the handle flips and the gate opens.

## How it works

- `InteractionRay` finds `IInteractable` on the collider or one of its two parents, and shows
  `GetPrompt` in the HUD.
- `CanInteract` false hides the prompt and blocks E.
- The lever doesn't know what a door is. It calls `Interact` on whatever `Target` is. Swap the door for a
  light switch or your own script without changing the lever.
