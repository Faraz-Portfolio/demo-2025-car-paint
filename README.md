# Car paint shader

View Live: [GitHub Pages](https://faraz-portfolio.github.io/demo-2025-car-paint/)

https://github.com/user-attachments/assets/1d5f9dd3-3dbf-447b-83e7-2f68a5e3d69d

An extension to ThreeJS's MeshPhysicalMaterial that adds flakes, fresnel and "Orange Peel" effects. Scratches were planed but proved too expensive to implement in a performant way. Perhaps in the future with WebGPU.

## How it works

Flakes are modeled as 3D voronoi noise, which effect the material's roughness and metallic properties. The fresnel effect is achieved by modulating the flakes' color based on the viewing angle, creating a more realistic appearance. The "Orange Peel" effect is simulated by using PSRD noise to perturb the clearcoat normals, giving the appearance of a slightly uneven surface.

## 3D Model credits

- ["FREE 1975 Porsche 911 (930) Turbo"](https://skfb.ly/6WZyV) by Lionsharp Studios is licensed under [Creative Commons Attribution](http://creativecommons.org/licenses/by/4.0/).
