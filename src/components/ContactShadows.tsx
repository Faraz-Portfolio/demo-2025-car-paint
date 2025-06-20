// The author of the original code is @mrdoob https://twitter.com/mrdoob
// https://threejs.org/examples/?q=con#webgl_shadow_contact

import { useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { HorizontalBlurShader, VerticalBlurShader } from "three-stdlib";

function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh;
}

export type ContactShadowsProps = {
  opacity?: number;
  width?: number;
  height?: number;
  blur?: number;
  near?: number;
  far?: number;
  smooth?: boolean;
  resolution?: number;
  frames?: number;
  scale?: number | [x: number, y: number];
  color?: THREE.ColorRepresentation;
  depthWrite?: boolean;
};

export const ContactShadows = React.forwardRef(
  (
    {
      scale = 10,
      frames = Infinity,
      opacity = 1,
      width = 1,
      height = 1,
      blur = 1,
      near = 0,
      far = 10,
      resolution = 512,
      smooth = true,
      color = "#000000",
      depthWrite = false,
      renderOrder,
      ...props
    }: Omit<React.JSX.IntrinsicElements["group"], "scale"> &
      ContactShadowsProps,
    fref
  ) => {
    const ref = React.useRef<THREE.Group>(null!);
    const scene = useThree((state) => state.scene);
    const gl = useThree((state) => state.gl);
    const shadowCamera = React.useRef<THREE.OrthographicCamera>(null!);

    width = width * (Array.isArray(scale) ? scale[0] : scale || 1);
    height = height * (Array.isArray(scale) ? scale[1] : scale || 1);

    const [
      renderTarget,
      planeGeometry,
      depthMaterial,
      blurPlane,
      horizontalBlurMaterial,
      verticalBlurMaterial,
      renderTargetBlur,
    ] = React.useMemo(() => {
      const renderTarget = new THREE.WebGLRenderTarget(resolution, resolution);
      const renderTargetBlur = new THREE.WebGLRenderTarget(
        resolution,
        resolution
      );
      renderTargetBlur.texture.generateMipmaps =
        renderTarget.texture.generateMipmaps = false;
      const planeGeometry = new THREE.PlaneGeometry(width, height).rotateX(
        Math.PI / 2
      );
      const blurPlane = new THREE.Mesh(planeGeometry);
      const depthMaterial = new THREE.MeshDepthMaterial();
      depthMaterial.depthTest = depthMaterial.depthWrite = false;
      depthMaterial.onBeforeCompile = (shader) => {
        shader.uniforms = {
          ...shader.uniforms,
          ucolor: { value: new THREE.Color(color) },
        };
        shader.fragmentShader = shader.fragmentShader.replace(
          `void main() {`,
          `uniform vec3 ucolor;
           void main() {
          `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          "vec4( vec3( 1.0 - fragCoordZ ), opacity );",
          // Colorize the shadow, multiply by the falloff so that the center can remain darker
          "vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );"
        );
      };

      const horizontalBlurMaterial = new THREE.ShaderMaterial(
        HorizontalBlurShader
      );
      const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
      verticalBlurMaterial.depthTest = horizontalBlurMaterial.depthTest = false;
      return [
        renderTarget,
        planeGeometry,
        depthMaterial,
        blurPlane,
        horizontalBlurMaterial,
        verticalBlurMaterial,
        renderTargetBlur,
      ];
    }, [resolution, width, height, scale, color]);

    const blurShadows = (blur: number) => {
      blurPlane.visible = true;

      blurPlane.material = horizontalBlurMaterial;
      horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
      horizontalBlurMaterial.uniforms.h.value = (blur * 1) / 256;

      gl.setRenderTarget(renderTargetBlur);
      gl.render(blurPlane, shadowCamera.current);

      blurPlane.material = verticalBlurMaterial;
      verticalBlurMaterial.uniforms.tDiffuse.value = renderTargetBlur.texture;
      verticalBlurMaterial.uniforms.v.value = (blur * 1) / 256;

      gl.setRenderTarget(renderTarget);
      gl.render(blurPlane, shadowCamera.current);

      blurPlane.visible = false;
    };

    let count = 0;
    useFrame(() => {
      if (shadowCamera.current && (frames === Infinity || count < frames)) {
        gl.autoClear = false;

        count++;

        gl.setRenderTarget(renderTarget);
        gl.clear();

        scene.traverse((obj) => {
          if (isMesh(obj)) {
            if (obj.castShadow) {
              const originalMaterial = obj.material;
              obj.material = obj.customDepthMaterial || depthMaterial;
              gl.render(obj, shadowCamera.current);
              obj.material = originalMaterial;
            }
          }
        });

        blurShadows(blur);
        if (smooth) blurShadows(blur * 0.4);

        gl.setRenderTarget(null);
        gl.autoClear = true;
      }
    });

    React.useImperativeHandle(fref, () => ref.current, []);

    React.useEffect(
      () => () => {
        renderTarget.dispose();
        renderTargetBlur.dispose();
        planeGeometry.dispose();
        depthMaterial.dispose();
        blurPlane.geometry.dispose();
        horizontalBlurMaterial.dispose();
        verticalBlurMaterial.dispose();
      },
      []
    );

    return (
      <group rotation-x={Math.PI / 2} {...props} ref={ref}>
        <mesh
          renderOrder={renderOrder}
          geometry={planeGeometry}
          scale={[1, -1, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            transparent
            map={renderTarget.texture}
            opacity={opacity}
            depthWrite={depthWrite}
          />
        </mesh>
        <orthographicCamera
          ref={shadowCamera}
          args={[-width / 2, width / 2, height / 2, -height / 2, near, far]}
        />
      </group>
    );
  }
);
