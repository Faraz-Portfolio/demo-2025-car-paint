import * as THREE from "three";
import CSM from "three-custom-shader-material/vanilla";

// @ts-ignore
import { patchShaders } from "gl-noise/build/glNoise.m";
import { animate, AnimationPlaybackControlsWithThen } from "motion";
import PSRD from "./PSRD";
import Swirls from "./Swirls";
import Voronoi from "./Voronoi";

const prevColor = new THREE.Color("red");
const prevColorPerl = new THREE.Color("red");
const prevColorFlakes = new THREE.Color("silver");

export class CarPaintMaterial extends CSM<typeof THREE.MeshPhysicalMaterial> {
  constructor(baseMaterial?: THREE.Material) {
    super({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: /* glsl */ `
        varying vec3 v_Position;
        varying vec3 v_WorldPosition;
        varying vec3 v_Normal;
        varying vec3 v_ViewDir;
        varying vec2 v_Uv;

        void main() {
          v_Uv = uv;
          v_Normal = (modelMatrix * vec4(normal, 0.0)).xyz;
          v_WorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          v_ViewDir = normalize(cameraPosition - v_WorldPosition);
          v_Position = position;
        }
      
      `,
      fragmentShader: patchShaders(/* glsl */ `
        varying vec3 v_Position;
        varying vec3 v_WorldPosition;
        varying vec3 v_Normal;
        varying vec3 v_ViewDir;
        varying vec2 v_Uv;

        uniform vec3 uColorPerl;
        uniform vec3 uColorPerlPrev;
        uniform vec3 uColorFlakes;
        uniform vec3 uColorFlakesPrev;
        uniform vec3 uColor;
        uniform vec3 uColorPrevious;
        uniform float uColorTransitionProgress;

        float fresnel(vec3 viewDir, vec3 normal, float power) {
          float dotNV = dot(viewDir, normal);
          return clamp(pow(1.0 - dotNV, power), 0.0, 1.0);
        }

        ${Voronoi}
        ${PSRD}
        ${Swirls}

        float mapLinear(float value, float min1, float max1, float min2, float max2) {
          return min2 + (max2 - min2) * (value - min1) / (max1 - min1);
        }

        vec3 overlayBlend(vec3 base, vec3 blend, float factor) {
          vec3 result = mix(base, blend, factor);
          result = mix(result, 2.0 * base * blend, factor);
          return result;
        }


        vec3 getTriPlanarBlend(vec3 _wNorm){
          // in wNorm is the world-space normal of the fragment
          vec3 blending = abs( _wNorm );
          blending = normalize(max(blending, 0.00001)); // Force weights to sum to 1.0
          float b = (blending.x + blending.y + blending.z);
          blending /= vec3(b, b, b);
          return blending;
        }

        vec3 triPlanarProjection(vec3 position, vec3 normal, sampler2D inpTex) {
          // in position is the world-space position of the fragment
          // in normal is the world-space normal of the fragment
          vec3 blending = getTriPlanarBlend(normal);
          vec2 uvX = position.yz * 0.5 + 0.5;
          vec2 uvY = position.xz * 0.5 + 0.5;
          vec2 uvZ = position.xy * 0.5 + 0.5;

          vec3 colorX = texture2D(inpTex, uvX).rgb;
          vec3 colorY = texture2D(inpTex, uvY).rgb;
          vec3 colorZ = texture2D(inpTex, uvZ).rgb;

          return colorX * blending.x + colorY * blending.y + colorZ * blending.z;
        }


        void main() {
          // Distance based LOG to prevent shimmering
          vec3 p = v_WorldPosition;
          float dist = length(p - cameraPosition);
          float opacity = 1.0 - clamp(mapLinear(dist, 0.0, 3.0, 0.0, 1.0), 0.0, 1.0);
          vec3 samplePosition = p;

          // Fresnel
          float f = fresnel(v_ViewDir, v_Normal, 2.0);
          f = smoothstep(-0.2, 0.7, f);
          
          // Flakes
          float noise = voronoi3DGrayscale(samplePosition * 600.0);
          noise = smoothstep(0.2, 1.0, noise) * (f) * opacity;

          csm_Roughness = mapLinear(noise, 0.0, 1.0, 0.3, 0.2);
          csm_Metalness = mapLinear(noise, 0.0, 1.0, 1.0, 0.0);

          // Orange peel
          vec3 gradient;
          float psrdNoise = psrdnoise(samplePosition * 100.0, vec3(0.0), 2.0, gradient) * 0.5 + 0.5;
          csm_ClearcoatNormal = normalize(gradient) * 0.005;

          // Color
          vec3 transitionColor = mix(uColorPrevious, uColor, uColorTransitionProgress);
          csm_DiffuseColor.rgb = transitionColor;

          // Color flakes
          vec3 flakeColor = overlayBlend(mix(uColorFlakesPrev, uColorFlakes, uColorTransitionProgress), csm_DiffuseColor.rgb, 0.5);
          csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, flakeColor, smoothstep(0.0, 0.3, noise));

          // Color Perl
          float perlFresnel = fresnel(v_ViewDir, v_Normal, 2.0);
          perlFresnel = smoothstep(0.1, 0.4, perlFresnel);

          vec3 perlColor = overlayBlend(mix(uColorPerlPrev, uColorPerl, uColorTransitionProgress), csm_DiffuseColor.rgb, 0.2);
          csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, perlColor, perlFresnel);

          // csm_FragColor.rgb = vec3(opacity);
        }
        
      `),

      uniforms: {
        uColor: { value: prevColor.clone() },
        uColorPrevious: { value: prevColor.clone() },
        uColorPerl: { value: prevColorPerl.clone() },
        uColorPerlPrev: { value: prevColorPerl.clone() },
        uColorFlakes: { value: prevColorFlakes.clone() },
        uColorFlakesPrev: { value: prevColorFlakes.clone() },
        uColorTransitionProgress: { value: 0.0 },
      },
      roughness: 0.2,
      metalness: 1,
      clearcoat: 1,
      clearcoatRoughness: 0,
      toneMapped: true,
      // @ts-ignore
      aoMap: baseMaterial?.aoMap || null,
      aoMapIntensity: 2,
      // @ts-ignore
      normalMap: baseMaterial?.normalMap || null,
    });
  }

  _animation: AnimationPlaybackControlsWithThen | null = null;

  setColors(
    color: THREE.ColorRepresentation,
    colorPerl: THREE.ColorRepresentation = "red",
    colorFlakes: THREE.ColorRepresentation = "silver"
  ) {
    this.uniforms.uColorPrevious.value.copy(this.uniforms.uColor.value);
    this.uniforms.uColorPerlPrev.value.copy(this.uniforms.uColorPerl.value);
    this.uniforms.uColorFlakesPrev.value.copy(this.uniforms.uColorFlakes.value);
    prevColor.copy(this.uniforms.uColor.value);
    prevColorPerl.copy(this.uniforms.uColorPerl.value);
    prevColorFlakes.copy(this.uniforms.uColorFlakes.value);
    this.uniforms.uColor.value.set(color);
    this.uniforms.uColorPerl.value.set(colorPerl);
    this.uniforms.uColorFlakes.value.set(colorFlakes);
    this.uniforms.uColorTransitionProgress.value = 0.0; // Reset transition progress

    if (this._animation) {
      this._animation.complete();
    }
    this._animation = animate(0, 1, {
      onUpdate: (v) => {
        this.uniforms.uColorTransitionProgress.value = v;
      },
      duration: 1,
    });
  }
}
