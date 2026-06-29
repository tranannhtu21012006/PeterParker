"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Pseudo-random noise function
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    
    // Animate noise
    float noise1 = snoise(uv * 1.5 + uTime * 0.1);
    float noise2 = snoise(uv * 3.0 - uTime * 0.15);
    
    float combinedNoise = (noise1 + noise2) * 0.5;
    
    // Colors from warm palette
    vec3 colorWhite = vec3(0.99, 0.98, 0.97); // #fdfbf7
    vec3 colorSandy = vec3(0.95, 0.76, 0.48); // #f4c27a
    vec3 colorOrange = vec3(0.92, 0.56, 0.20); // #eb8f34
    vec3 colorCoral = vec3(0.87, 0.34, 0.25); // #df583f
    vec3 colorDarkRed = vec3(0.48, 0.11, 0.11); // #7c1d1d
    
    // Mix colors based on noise
    vec3 color = mix(colorWhite, colorSandy, smoothstep(-1.0, 0.0, combinedNoise));
    color = mix(color, colorOrange, smoothstep(0.0, 0.5, combinedNoise));
    color = mix(color, colorCoral, smoothstep(0.3, 0.8, combinedNoise));
    // Optionally add dark red for deeper contrast at the very end
    color = mix(color, colorDarkRed, smoothstep(0.7, 1.0, combinedNoise));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const ShaderPlane = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }),
    []
  );

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

export default function ShaderBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <ShaderPlane />
    </Canvas>
  );
}
