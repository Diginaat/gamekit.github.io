# Doors, buttons and pickups

The player's `Interaction` node (`InteractionRay`) looks at what is under the crosshair. **E** uses it,
picks it up or drops it. **Left mouse** throws a held object.

## Sliding door

1. Add an `AnimatableBody3D` with the `SlidingDoor` script, a `CollisionShape3D` and a mesh.
2. Layer 1 (World).
3. Set `OpenOffset` (how far it slides, default `0, 2.4, 0` = up) and `Speed` (m/s).

The door can be used directly with **E**. Its prompt says "Open door" / "Close door".

## Button

1. Add a `StaticBody3D` with the `InteractableButton` script, a `CollisionShape3D` and a mesh.
2. Set `Target` to the node it should use, for example the door.
3. Set `Prompt`, for example "Open the gate".

A button calls `Interact` on its target. The target can be anything that implements `IInteractable`:
a door, a light switch, your own script.

```
Door   (AnimatableBody3D + SlidingDoor)
Button (StaticBody3D + InteractableButton)   Target = ../Door
```

## Pickups

Any `RigidBody3D` can be picked up when:

- it is on a layer in the ray's `Mask` (World and Props). Use layer 3 (Props) for props, and
  mask 1 + 2 + 3 so it lands on floors and bumps the player;
- its `mass` is at most `MaxPickupMass` (40 kg).

Heavier bodies can still be pushed by walking into them (up to `MaxPushMass` in the movement settings),
and shot (weapons push Props).

## InteractionRay settings

| Property | Default | Meaning |
| --- | --- | --- |
| `Distance` | 2.5 | Reach in metres |
| `MaxPickupMass` | 40 | Heaviest body you can lift |
| `HoldDistance` | 1.6 | Where the held body floats |
| `HoldStiffness`, `MaxHoldSpeed` | 18, 12 | How firmly it follows the view |
| `BreakDistance` | 1.2 | Drops the body when it is pulled this far away (stuck behind a wall) |
| `ThrowSpeed` | 9 | Throw speed in m/s |
| `Mask` | World + Props | What the ray can hit |

## Your own interactable

Implement `IInteractable` on the body (or on one of its two parents):

```csharp
using GameKit.Interaction;
using Godot;

public partial class Lamp : StaticBody3D, IInteractable
{
    [Export] public OmniLight3D? Light { get; set; }

    public string GetPrompt(Node interactor) => Light is { Visible: true } ? "Turn off" : "Turn on";
    public bool CanInteract(Node interactor) => Light != null;
    public void Interact(Node interactor) => Light!.Visible = !Light.Visible;
}
```

`interactor` is the node that pressed E (the player). Cast it to your own type when you need more,
for example to check an inventory. A longer example: [Lever that opens a door](examples/lever.md).

Optional: implement `IHighlightable` (`SetHighlighted(bool)`) to show that the object is in focus.

## Events for your HUD and game code

```csharp
player.Interaction!.PromptChanged += prompt => label.Text = prompt ?? "";
player.Interaction.PickedUp += body => GD.Print("picked up ", body.Name);
player.Interaction.Dropped += body => GD.Print("dropped ", body.Name);
```
