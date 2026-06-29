"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text, MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

const InteractiveP = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        hovered ? state.mouse.x * 2 : Math.sin(state.clock.elapsedTime * 0.5) * 0.2,
        0.1
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        hovered ? -state.mouse.y * 2 : 0,
        0.1
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Text
        ref={meshRef}
        fontSize={3}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        P
        <MeshDistortMaterial
          color={hovered ? "#df583f" : "#ffffff"}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={hovered ? 0.4 : 0.1}
          speed={hovered ? 5 : 2}
        />
      </Text>
    </Float>
  );
};

export default function PLogo3D() {
  return (
    <div className="w-[150px] h-[150px] cursor-pointer">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        <InteractiveP />
      </Canvas>
    </div>
  );
}
