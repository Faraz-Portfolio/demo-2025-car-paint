import { Environment, Lightformer } from "@react-three/drei";

export function Lights() {
  return (
    <>
      <Environment resolution={1024} frames={1}>
        <group>
          {/* Top */}
          <Lightformer
            form="rect"
            color="white"
            intensity={5}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
            position={[0, 10, 0]}
            scale={[20, 5, 1]}
          />
          {/* Back */}
          <Lightformer
            form="rect"
            color="white"
            intensity={10}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
            position={[0, 0, -2]}
            scale={[4, 2, 1]}
          />
          {/* Bottom */}
          <Lightformer
            form="rect"
            color="white"
            intensity={5}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
            position={[0, -10, 0]}
            scale={[20, 7, 1]}
          />
          {/* // front left */}
          <Lightformer
            form="ring"
            color="white"
            intensity={5}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
            position={[-10, 2, 5]}
            scale={[10, 10, 1]}
          />
          {/* // front right */}
          <Lightformer
            form="ring"
            color="white"
            intensity={5}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
            position={[10, 2, 5]}
            scale={[-5, 5, 1]}
          />
        </group>
      </Environment>

      <ambientLight intensity={1} />

      {/* <Environment preset="sunset" /> */}
    </>
  );
}
