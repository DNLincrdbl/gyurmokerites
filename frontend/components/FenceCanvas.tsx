"use client";

import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import { useMemo } from "react";

function Fence() {
  const { scene } = useGLTF("/models/modern_fence_set.glb");
  const clone = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clone} />;
}

export default function FenceCanvas() {
  return (
    <Canvas camera={{ position: [4, 2.2, 6], fov: 35 }} dpr={[1, 1.5]}>
      <color attach="background" args={["#e7e2d8"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 8, 4]} intensity={1.5} />
      <Bounds fit clip observe margin={1.2}>
        <Fence />
      </Bounds>
      <OrbitControls autoRotate autoRotateSpeed={0.4} enablePan={false} />
    </Canvas>
  );
}
