"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";

const IMAGES_COUNT = 8;
const RADIUS = 4;
const WHEEL_WIDTH = 3;

function Cabin({ angle, index }) {
  const ref = useRef();
  const x = Math.cos(angle) * RADIUS;
  const y = Math.sin(angle) * RADIUS;

  useFrame((state) => {
    if (ref.current) {
      ref.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group position={[x, y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, WHEEL_WIDTH]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>
      <group ref={ref}>
        <mesh position={[0, -0.8, 0.031]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshBasicMaterial
            map={new THREE.TextureLoader().load(`/images/${index + 1}.jpg`)}
            side={THREE.FrontSide}
          />
        </mesh>
        <mesh position={[0, -0.8, -0.031]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshBasicMaterial
            map={new THREE.TextureLoader().load(`/images/${index + 9}.jpg`)}
            side={THREE.FrontSide}
          />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <boxGeometry args={[1.7, 1.3, 0.06]} />
          <meshStandardMaterial color="#bc6c25" />
        </mesh>
      </group>
    </group>
  );
}

function SupportStructure() {
  const legLength = 6; // Largo de las patas
  const angleV = 0.3; // Apertura del ^
  const groundLevel = -RADIUS - 1.6;

  return (
    <group position={[0, 0, 0]}>
      {/* Soportes laterales cafe oscuro */}
      {[WHEEL_WIDTH / 2 + 0.6, -WHEEL_WIDTH / 2 - 0.6].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {/* LADO IZQUIERDO DEL ^ */}
          <group rotation={[0, 0, angleV]}>
            {/* El Pivot está en 0,0,0. Bajamos la pata la mitad de su largo */}
            <mesh position={[0, -legLength / 2, 0]}>
              <boxGeometry args={[0.25, legLength, 0.25]} />
              <meshStandardMaterial color="#3d1f05" />
            </mesh>
          </group>

          {/* LADO DERECHO DEL ^ */}
          <group rotation={[0, 0, -angleV]}>
            <mesh position={[0, -legLength / 2, 0]}>
              <boxGeometry args={[0.25, legLength, 0.25]} />
              <meshStandardMaterial color="#3d1f05" />
            </mesh>
          </group>
        </group>
      ))}

      {/* Base sólida en el suelo */}
      <mesh position={[0, groundLevel - 0.2, 0]}>
        <boxGeometry args={[8, 0.4, WHEEL_WIDTH + 3]} />
        <meshStandardMaterial color="#2b1503" />
      </mesh>
    </group>
  );
}

function FerrisWheel() {
  const wheelRef = useRef();

  useFrame(() => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z += -0.003;
    }
  });

  return (
    <group>
      <SupportStructure />

      <group ref={wheelRef}>
        {/* EJE CENTRAL: Las patas ahora muerden este cilindro */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, WHEEL_WIDTH + 1.8]} />
          <meshStandardMaterial color="#2b1503" />
        </mesh>

        {[WHEEL_WIDTH / 2, -WHEEL_WIDTH / 2].map((zPos, side) => (
          <group key={side} position={[0, 0, zPos]}>
            {Array.from({ length: IMAGES_COUNT }).map((_, i) => {
              const angle = (i / IMAGES_COUNT) * Math.PI * 2;
              const nextAngle = ((i + 1) / IMAGES_COUNT) * Math.PI * 2;
              const midAngle = (angle + nextAngle) / 2;
              return (
                <group key={i}>
                  <mesh
                    rotation={[0, 0, angle]}
                    position={[
                      (Math.cos(angle) * RADIUS) / 2,
                      (Math.sin(angle) * RADIUS) / 2,
                      0,
                    ]}
                  >
                    <boxGeometry args={[RADIUS, 0.08, 0.08]} />
                    <meshStandardMaterial color="#d4a373" />
                  </mesh>
                  <mesh
                    position={[
                      Math.cos(midAngle) * RADIUS,
                      Math.sin(midAngle) * RADIUS,
                      0,
                    ]}
                    rotation={[0, 0, midAngle + Math.PI / 2]}
                  >
                    <boxGeometry args={[3.2, 0.12, 0.1]} />
                    <meshStandardMaterial color="#bc6c25" />
                  </mesh>
                </group>
              );
            })}
          </group>
        ))}

        {Array.from({ length: IMAGES_COUNT }).map((_, i) => (
          <Cabin key={i} index={i} angle={(i / IMAGES_COUNT) * Math.PI * 2} />
        ))}
      </group>
    </group>
  );
}

export default function Page() {
  // 🎢 EVENTO ACTIVO
  return (
    <div className="w-screen h-screen bg-white">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={50} />
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <directionalLight position={[-5, 5, 5]} intensity={1} />

        <FerrisWheel />

        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={15}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
