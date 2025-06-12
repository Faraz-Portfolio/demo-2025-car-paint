import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";

export function PP() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={1} mipmapBlur luminanceThreshold={4} />
      <ToneMapping />
    </EffectComposer>
  );
}
