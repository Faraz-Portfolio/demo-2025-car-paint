import * as THREE from "three";

export class CloudMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vWorldPosition = (modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        uniform sampler2D uMap;

        void main() {
            vec4 mapColor = texture2D(uMap, vUv);
            gl_FragColor = mapColor;

            float mask = vWorldPosition.y;
            mask = clamp(mask / 3.0, 0.0, 1.0); // Ensure mask is between 0 and 1
            mask = smoothstep(0.1, 1.0, mask); // Smooth transition

            float cameraFacingZ = dot(normalize(cameraPosition), vec3(0.0, 0.0, 1.0));
            cameraFacingZ = clamp(cameraFacingZ, 0.0, 1.0); // Ensure value is between 0 and 1

            gl_FragColor.a *= mask * 0.05 * cameraFacingZ; // Apply mask to alpha
        }
      `,
      uniforms: {
        uMap: { value: null },
      },
    });
  }

  set map(texture: THREE.Texture) {
    this.uniforms.uMap.value = texture;
    this.needsUpdate = true;
  }
}
