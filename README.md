# floatsim

Approach to make a walkable/floatable simulation.

First approach to build a terrain with Perlin noise.
![First approach](screenshots/screenshot-20230308-1.png)

## Build THREE examples

```bash
npm run rollup-browser-umd
```

## Build for Testing

```bash
npm run compile-typescript
```

## Build for dist

CURRENTLY NOT WORKING, NEEDS TO BE FIXED

## Todos & ideas

- [DONE] Add basic scene setup.
- [DONE] Add simple terrain generation.
- Get class inheritance running.
- Get webpack back running (somehow the main.js script is falsy overwritten when packing).
- Build collision detection with terrain.
- Add dummy ship as simple composite object.
- Build first person view.
- Build controls (forward, backward, up, down, left, right).
- Add damping to the controls.
- Add a non-terrain object (a building or so).
- Build collision detection with non-terrain objects.
- [DONE] Add FPS stats.
- Build a caustics animation/shader for the ocean floor.
- Add water reflection to the ground texture.
- Change water color depending of depth.
- Add cockpit (image).
- Add cockpit (mesh?).
- Make fancy scene blending effect (like in Archimedean Dynasty cutscenes).
- Add floating particles (sprites?).
- Add ambient sound (liiek water bubbling/streaming).
- Add collision sounds. Each "material" should have its own sound (sand, metal, stone, organic?).
- Add a depth measure (to the ground and to the surface). Add a "pressure" HUD.
- Add a system alarm to warn for "radiation" and "high pressure".
- Add add compass HUD.
- Add water plants.
- Add a sonar HUD.

globalThis.addEventListener("load", function () {
new SceneContainer();
});
