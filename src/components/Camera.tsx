import {
  CameraControls,
  CameraControlsImpl,
  PerspectiveCamera,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, Mesh, Object3D } from "three";
import { useApp } from "../state";

export function Camera() {
  const currentCamera = useApp((state) => state.currentCamera);

  const controls = useThree((state) => state.controls) as CameraControlsImpl;
  const scene = useThree((state) => state.scene);

  const carRef = useRef<Object3D | null>(null);
  const targetRef = useRef<Mesh>(null!);

  const regress = useThree((state) => state.performance.regress);

  useEffect(() => {
    if (!carRef.current) {
      carRef.current = scene.getObjectByName("car") as Object3D;
    }

    if (controls && carRef.current) {
      controls.reset(true);

      switch (currentCamera) {
        case 0: {
          controls.fitToSphere(carRef.current, true);
          controls.rotatePolarTo(Math.PI / 2, true);
          break;
        }

        case 1: {
          controls.fitToSphere(targetRef.current, true);
          controls.rotatePolarTo(MathUtils.degToRad(70), true);
          controls.rotateAzimuthTo(MathUtils.degToRad(60), true);

          break;
        }

        case 2: {
          controls.fitToSphere(carRef.current, true);
          controls.rotateAzimuthTo(MathUtils.degToRad(-60), true);
          controls.rotatePolarTo(MathUtils.degToRad(75), true);
          setTimeout(() => {
            controls.dolly(1.5, true);
            controls.truck(-0.25, 0, true);
          }, 1000);
          break;
        }

        case 3: {
          controls.fitToSphere(carRef.current, true);
          controls.rotateAzimuthTo(MathUtils.degToRad(-90), true);
          controls.rotatePolarTo(MathUtils.degToRad(30), true);
          setTimeout(() => {
            controls.dolly(1, true);
            controls.truck(0, 0.25, true);
          }, 1000);
          break;
        }

        case 4: {
          controls.fitToSphere(carRef.current, true);
          controls.rotateAzimuthTo(MathUtils.degToRad(50), true);
          controls.rotatePolarTo(MathUtils.degToRad(75), true);
          setTimeout(() => {
            controls.dolly(1.5, true);
            controls.truck(0.25, 0, true);
          }, 1000);
          break;
        }
      }
    }
  }, [controls, currentCamera]);

  return (
    <>
      <CameraControls
        makeDefault
        minPolarAngle={MathUtils.degToRad(0)}
        maxPolarAngle={MathUtils.degToRad(90)}
        // minAzimuthAngle={MathUtils.degToRad(-90)}
        // maxAzimuthAngle={MathUtils.degToRad(90)}
        truckSpeed={0}
        maxDistance={15}
        minDistance={0.5}
        onChange={() => {
          regress();
        }}
      />
      <PerspectiveCamera makeDefault fov={40} />

      <mesh ref={targetRef} position={[1, 0.8, 0.9]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshBasicMaterial color="red" wireframe visible={false} />
      </mesh>
    </>
  );
}
