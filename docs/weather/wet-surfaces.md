# Wet surfaces

In rain, surfaces get a wet film, splashes and puddles with ripples. They dry slowly when the rain stops.
Only materials whose shader **includes the wetness code** get wet.

## Easiest: the wet grid

Use a `ShaderMaterial` with `res://addons/gamekit_weather/shaders/wet_prototype_grid.gdshader`.
Every floor in the showcase and the map template uses it.

## Your own shader

Include `weather_wetness.gdshaderinc` and call `weather_apply_wetness` in `fragment()`:

```glsl
shader_type spatial;

#include "res://addons/gamekit_weather/shaders/weather_wetness.gdshaderinc"

uniform vec3 albedo_color : source_color = vec3(0.5);

varying vec3 world_pos;
varying vec3 world_normal;

void vertex() {
	world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
	world_normal = normalize((MODEL_MATRIX * vec4(NORMAL, 0.0)).xyz);
}

void fragment() {
	vec3 albedo = albedo_color;
	float roughness = 0.8;
	// 0.8 = porosity: how much the surface soaks up and darkens (0 = none)
	vec3 ripple = weather_apply_wetness(world_pos, world_normal, 0.8, TIME, albedo, roughness);
	ALBEDO = albedo;
	ROUGHNESS = roughness;
	NORMAL = normalize(NORMAL + (VIEW_MATRIX * vec4(ripple, 0.0)).xyz);
}
```

`weather_apply_wetness` darkens `albedo`, lowers `roughness` (wet = shiny) and returns a ripple normal.

!> Don't name your own uniforms like local variables inside the include (for example `cell`).
Godot then fails to compile the shader on the GPU, and you only see it in a windowed run.

## What stays dry

- Surfaces under a roof (any mesh on render layers 1–16 above them).
- Materials without the include.
