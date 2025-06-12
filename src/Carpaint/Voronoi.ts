export default /* glsl */ `
// 3D hash function
vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

// Generate a stable grayscale value from a 3D position
float hashColorGrayscale(vec3 p) {
    // Use a consistent hashing trick to get a pseudo-random grayscale
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
}

// 3D Voronoi with grayscale color output
float voronoi3DGrayscale(vec3 p) {
    vec3 i_p = floor(p);
    vec3 f_p = fract(p);

    float minDist = 999.0;
    vec3 closestCell;

    for (int z = -1; z <= 1; ++z) {
        for (int y = -1; y <= 1; ++y) {
            for (int x = -1; x <= 1; ++x) {
                vec3 offset = vec3(x, y, z);
                vec3 point = hash3(i_p + offset);
                vec3 diff = offset + point - f_p;
                float dist = length(diff);

                if (dist < minDist) {
                    minDist = dist;
                    closestCell = i_p + offset + point;
                }
            }
        }
    }

    return hashColorGrayscale(closestCell);
}

float voronoi3DGrayscaleAA(vec3 p) {
    // Estimate derivatives
    float delta = max(length(fwidth(p)), 0.001); // avoid divide by zero
    float total = 0.0;
    const int samples = 4;

    // Jittered 2D samples within pixel footprint
    vec2 offsets[4] = vec2[](
        vec2(-0.3, -0.3),
        vec2( 0.3, -0.3),
        vec2(-0.3,  0.3),
        vec2( 0.3,  0.3)
    );

    for (int i = 0; i < samples; ++i) {
        vec2 offset = offsets[i] * delta;
        total += voronoi3DGrayscale(p + vec3(offset, 0.0));
    }

    return total / float(samples);
}
`;
