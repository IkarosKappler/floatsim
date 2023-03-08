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

## Todos

- [DONE] Add basic scene setup.
- [DONE] Add simple terrain generation.
- Get class inheritance running.
- Get webpack back running (somehow the main.js script is falsy overwritten when packing).
- Build collision detection with terrain.
- Add dummy ship as simple composite object.
- Build first person view.
- Build controls (forward, backward, up, down, left, right).
- Add a non-terrain object (a building or so).
- Build collision detection with non-terrain objects.

globalThis.addEventListener("load", function () {
new SceneContainer();
});
