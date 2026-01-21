/* eslint-disable react-hooks/purity */
"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";

function BalloonItem({ x, y, z, speed, color, size }) {
  const ref = useRef();
  const [posY, setPosY] = useState(y);

  useFrame((state) => {
    if (ref.current) {
      // 1. Movimiento de subida
      const newY = posY + speed;
      setPosY(newY > 10 ? -10 : newY);

      // 2. MAGIA: Sincronizar posición con la cámara
      // Esto hace que el globo se mueva CON la cámara pero mantenga su animación
      const vector = new THREE.Vector3(x, posY, z);
      vector.applyQuaternion(state.camera.quaternion);
      vector.add(state.camera.position);
      ref.current.position.copy(vector);

      // 3. Que siempre miren de frente (Billboard)
      ref.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
export default function Balloons() {
  const count = 30; // Más globos para cubrir bien la pantalla

  const balloonData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      // Posición relativa a la cámara (X: ancho, Y: alto, Z: profundidad fija)
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 20 - 10,
      z: -12, // Siempre a 12 unidades de la cámara
      speed: 0.02 + Math.random() * 0.05,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      size: 0.2 + Math.random() * 0.2,
    }));
  }, []);

  return (
    <group>
      {balloonData.map((b, i) => (
        <BalloonItem key={i} {...b} />
      ))}
    </group>
  );
}
