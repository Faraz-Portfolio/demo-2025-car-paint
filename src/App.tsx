import { Billboard, Cloud, Clouds, Image } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";

import { Perf } from "r3f-perf";
import { Suspense, useEffect } from "react";
import { Car } from "./Car";
import { Camera } from "./components/Camera";
import { CloudMaterial } from "./components/CloudMaterial";
import { ContactShadows } from "./components/ContactShadows";
import { Lights } from "./components/Lights";
import { PP } from "./components/PP";
import { UI } from "./components/ui";
import { useApp } from "./state";

function AdaptivePixelRatio() {
  const current = useThree((state) => state.performance.current);
  const setPixelRatio = useThree((state) => state.setDpr);
  useEffect(() => {
    setPixelRatio(window.devicePixelRatio * current);
  }, [current]);
  return null;
}

export default function App() {
  const currentCamera = useApp((state) => state.currentCamera);

  return (
    <>
      <Canvas
        shadows={false}
        style={{
          filter: "contrast(1.1) brightness(1.1) saturate(1.0)",
        }}
        gl={{
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#262626"]} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#262626" />
        </mesh>

        <Suspense>
          <Camera />
          <Car />
          <ContactShadows opacity={1.2} frames={2} blur={1} />
        </Suspense>

        {currentCamera === 0 && (
          <>
            <Clouds material={CloudMaterial}>
              <Cloud
                position={[0, 0, -5]}
                speed={0.1}
                segments={20}
                volume={6}
                bounds={[20, 0.5, 1]}
              />
            </Clouds>
          </>
        )}

        {currentCamera !== 3 ? (
          <Billboard>
            <Image
              position={[0, 1.7, -2]}
              url="/demo-2025-car-paint/911.png"
              transparent
              renderOrder={1}
              scale={[3, 1].map((v) => v * 1.5) as any}
            />
          </Billboard>
        ) : (
          <Image
            position={[0.3, 0, -1.7]}
            rotation={[-Math.PI / 2, 0, 0]}
            url="/demo-2025-car-paint/911.png"
            transparent
            renderOrder={1}
            scale={[3, 1].map((v) => v * 1) as any}
          />
        )}

        <Lights />
        <AdaptivePixelRatio />

        <PP />

        {/* <Perf /> */}
      </Canvas>

      {/* Grading gradients  */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background: `linear-gradient(to bottom, rgba(0, 22, 59, 0.189) 0%, rgba(255, 255, 255, 0) 50%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background: `linear-gradient(to top, rgba(47, 21, 0, 0.58) 0%, rgba(255, 255, 255, 0) 50%)`,
        }}
      />
    </>
  );
}
