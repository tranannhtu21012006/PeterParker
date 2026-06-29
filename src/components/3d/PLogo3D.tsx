"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Center, Float, Environment } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

const LogoMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Auto rotate the logo
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      
      // Scale up slightly on hover
      const targetScale = hovered ? 1.2 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <Center>
        <Text
          ref={meshRef}
          fontSize={6}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          anchorX="center"
          anchorY="middle"
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          P
          <meshPhysicalMaterial
            color={hovered ? "#ff8c42" : "#ffffff"}
            metalness={0.1}
            roughness={0.05}
            transmission={0.9} // Glass-like transparency
            thickness={1.5}
            ior={1.5}
            envMapIntensity={2.0}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </Text>
      </Center>
    </Float>
  );
};

export default function PLogo3D() {
  return (
    <div className="w-64 h-64 md:w-96 md:h-96"> {/* Increased container size */}
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#eb8f34" />
        <Environment preset="city" />
        <LogoMesh />
      </Canvas>
    </div>
  );
}
