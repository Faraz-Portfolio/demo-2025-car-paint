export default /* glsl */ `
// Convert a scalar hash to a unit vector direction
vec3 hashToDirection(float h) {
    vec3 v = vec3(
        fract(h * 17.0),
        fract(h * 47.0),
        fract(h * 101.0)
    ) * 2.0 - 1.0;
    return normalize(v);
}

// Main function: one layer of randomly oriented scratches
float singleLayerScratches(vec3 worldPos, out vec3 gradient) {
    // 1. Scatter scratches using world-space cells
    vec3 cell = floor(worldPos * 4.0); // controls density
    vec3 local = fract(worldPos * 4.0);

    // 2. Unique hash per cell using Voronoi value
    float id = voronoi3DGrayscale(cell);

    // 3. Randomly orient the scratch
    vec3 dir = hashToDirection(id);

    // 4. Offset the scratch line inside the cell
    vec3 offset = hashToDirection(id + 0.37) * 0.5;

    // 5. Compute distance to nearest point on the scratch line
    vec3 rel = local - offset;
    float t = dot(rel, dir);
    vec3 proj = dir * t;
    float dist = length(rel - proj);

    // 6. Thin-line intensity
    float thickness = 0.01; // adjust width
    float scratch = smoothstep(thickness, 0.0, dist);

    // 7. Use psrdnoise to get micro-details and gradient
    vec3 nGrad;
    float micro = psrdnoise(
        worldPos * vec3(80.0, 80.0, 2.0),
        vec3(0.0),
        0.0,
        nGrad
    );

    // Output normal gradient for bump mapping
    gradient = nGrad;

    // Final value: combine big scratch and micro-noise
    return scratch * micro;
}
`;
