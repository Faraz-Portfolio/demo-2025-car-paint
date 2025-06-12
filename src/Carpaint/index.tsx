import { useEffect, useLayoutEffect, useMemo } from "react";
import { MeshPhysicalMaterial } from "three";
import { CarPaintMaterial as CarPaintMaterialImpl } from "./CarPaintMaterial";

interface CarPaintMaterialProps {
  baseMaterial?: MeshPhysicalMaterial;
  color?: string;
  colorFlakes?: string;
  colorPerl?: string;
}

export function CarPaintMaterial({
  baseMaterial,
  color = "#ff61bd",
  colorFlakes = "#ffbde3",
  colorPerl = "#ffbde3",
}: CarPaintMaterialProps) {
  const material = useMemo(
    () => new CarPaintMaterialImpl(baseMaterial),
    [baseMaterial]
  );

  useLayoutEffect(() => {
    return () => material.dispose();
  }, [material]);

  useEffect(() => {
    material.setColors(color, colorPerl, colorFlakes);
  }, [color, colorFlakes, colorPerl]);

  return <primitive object={material} attach="material" dispose={null} />;
}
