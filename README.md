# WebGL Texture Examples

This project contains a small set of browser-based Three.js demos that explore how different material types react to lighting and environment conditions in WebGL.

## Included demos

- `materials.html` — compares several standard material types side by side (Basic, Lambert, Phong, Standard, Physical, rubber, and gold).
- `materials-special.html` — demonstrates specialty materials such as Toon, Normal, Matcap, and transparent surface shading.
- `materials.js` and `materials-special.js` — the rendering logic and scene setup for each demo.
- `studio.hdr` — included environment asset for HDR-based material work.

## How to run

Because these examples load modules in the browser, run a local static server from the project folder:

```bash
cd /workspaces/WebGLTextureExamples
python3 -m http.server 8000
```

Then open these URLs in your browser:

- http://localhost:8000/materials.html
- http://localhost:8000/materials-special.html

## Controls

### Materials demo

- 1 = White light
- 2 = Red light
- 3 = Blue light
- Left/Right arrows = move light horizontally
- Up/Down arrows = move light vertically
- R = toggle rotation

### Specialty materials demo

- 1 = toggle white light
- 2 = toggle red light
- 3 = toggle blue light
- R = rotate objects
- Arrow keys = move point light

## Notes

- The project uses Three.js from a CDN, so an internet connection is required to load the library.
- A simple local web server is recommended because some browsers block module loading from local file URLs.
