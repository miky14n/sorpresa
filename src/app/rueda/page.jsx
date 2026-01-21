"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import Balloons from "@/components/Balloons";

const IMAGES_COUNT = 11;
const RADIUS = 5;
const WHEEL_WIDTH = 3.5;

// --- LOADER PERSONALIZADO ---
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-gray-800 bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500 mb-4"></div>
        <p className="font-bold text-lg animate-pulse">Cargando recuerdos...</p>
      </div>
    </Html>
  );
}

// --- CABINA (CON TODOS LOS DETALLES ORIGINALES) ---
function Cabin({ angle, index }) {
  const ref = useRef();
  const x = Math.cos(angle) * RADIUS;
  const y = Math.sin(angle) * RADIUS;

  // --- CORRECCIÓN AQUÍ ---
  // Supongamos que tienes un total de 16 fotos en tu carpeta (1.jpg hasta 16.jpg)
  const TOTAL_FOTOS_DISPONIBLES = 22;

  // El '%' asegura que el número nunca exceda el total de tus fotos
  const fotoFrontal = (index % TOTAL_FOTOS_DISPONIBLES) + 1;
  const fotoTrasera = ((index + IMAGES_COUNT) % TOTAL_FOTOS_DISPONIBLES) + 1;

  const tex1 = useLoader(THREE.TextureLoader, `/images/${fotoFrontal}.jpg`);
  const tex2 = useLoader(THREE.TextureLoader, `/images/${fotoTrasera}.jpg`);
  // -----------------------

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
        <mesh position={[0, -0.95, 0.031]}>
          <planeGeometry args={[2.7, 1.8]} />
          <meshBasicMaterial map={tex1} side={THREE.FrontSide} />
        </mesh>
        <mesh position={[0, -0.95, -0.031]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.7, 1.8]} />
          <meshBasicMaterial map={tex2} side={THREE.FrontSide} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <boxGeometry args={[2.9, 1.97, 0.06]} />
          <meshStandardMaterial color="#bc6c25" />
        </mesh>
      </group>
    </group>
  );
}

// --- ESTRUCTURA DE SOPORTE (V INVERTIDA ^) ---
function SupportStructure() {
  // Calculamos la altura necesaria para que las fotos no toquen el suelo
  // El 2.2 es el margen de seguridad para las cabinas
  const eyeLevel = RADIUS + 2.2;
  const angleV = 0.3;
  const legLength = eyeLevel / Math.cos(angleV);

  return (
    <group position={[0, 0, 0]}>
      {/* Las patas ahora se separan automáticamente según WHEEL_WIDTH */}
      {[WHEEL_WIDTH / 2 + 0.5, -WHEEL_WIDTH / 2 - 0.5].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          <group rotation={[0, 0, angleV]}>
            <mesh position={[0, -legLength / 2, 0]}>
              <boxGeometry args={[0.25, legLength, 0.25]} />
              <meshStandardMaterial color="#3d1f05" />
            </mesh>
          </group>
          <group rotation={[0, 0, -angleV]}>
            <mesh position={[0, -legLength / 2, 0]}>
              <boxGeometry args={[0.25, legLength, 0.25]} />
              <meshStandardMaterial color="#3d1f05" />
            </mesh>
          </group>
        </group>
      ))}

      {/* La base se ensancha según el Radio y el Ancho de la rueda */}
      <mesh position={[0, -eyeLevel, 0]}>
        <boxGeometry args={[RADIUS * 1.5, 0.5, WHEEL_WIDTH + 3]} />
        <meshStandardMaterial color="#2b1503" />
      </mesh>
    </group>
  );
}

function FerrisWheel() {
  const wheelRef = useRef();

  useFrame(() => {
    if (wheelRef.current) wheelRef.current.rotation.z -= 0.003;
  });

  return (
    <group>
      <SupportStructure />

      {/* Orientación inicial: Para que se vea de frente, la rotación Z es clave */}
      <group ref={wheelRef} rotation={[0, 0, Math.PI / 2]}>
        {/* EJE CENTRAL DINÁMICO: Su largo depende de WHEEL_WIDTH */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, WHEEL_WIDTH + 1.5]} />
          <meshStandardMaterial color="#2b1503" />
        </mesh>

        {[WHEEL_WIDTH / 2, -WHEEL_WIDTH / 2].map((zPos, side) => (
          <group key={side} position={[0, 0, zPos]}>
            {Array.from({ length: IMAGES_COUNT }).map((_, i) => {
              const angle = (i / IMAGES_COUNT) * Math.PI * 2;
              const nextAngle = ((i + 1) / IMAGES_COUNT) * Math.PI * 2;
              const midAngle = (angle + nextAngle) / 2;

              // Longitud del conector perimetral (Cuerda del círculo)
              // L = 2 * R * sin(theta/2)
              const chordLength =
                2 * RADIUS * Math.sin(Math.PI / IMAGES_COUNT) + 0.2;

              return (
                <group key={i}>
                  {/* Rayos: Su largo es siempre RADIUS */}
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

                  {/* Conectores perimetrales: Su largo ahora es DINÁMICO */}
                  <mesh
                    position={[
                      Math.cos(midAngle) * RADIUS,
                      Math.sin(midAngle) * RADIUS,
                      0,
                    ]}
                    rotation={[0, 0, midAngle + Math.PI / 2]}
                  >
                    <boxGeometry args={[chordLength, 0.12, 0.1]} />
                    <meshStandardMaterial color="#bc6c25" />
                  </mesh>
                </group>
              );
            })}
          </group>
        ))}

        {/* Cabinas: Se posicionan en el RADIUS actual */}
        {Array.from({ length: IMAGES_COUNT }).map((_, i) => (
          <Cabin key={i} index={i} angle={(i / IMAGES_COUNT) * Math.PI * 2} />
        ))}
      </group>
    </group>
  );
}
function BirthdayMessage({ onComplete }) {
  useEffect(() => {
    // El mensaje durará 4 segundos antes de mostrar la rueda
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center whitespace-nowrap">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter animate-bounce">
          <span className="text-red-500 drop-shadow-lg">¡FE</span>
          <span className="text-blue-500 drop-shadow-lg">LIZ </span>
          <span className="text-green-500 drop-shadow-lg">CUM</span>
          <span className="text-pink-500 drop-shadow-lg">PLE!</span>
        </h1>
        <div className="mt-4 text-2xl font-bold text-white bg-black bg-opacity-30 px-6 py-2 rounded-full">
          ✨ Preparando tu sorpresa ✨
        </div>
      </div>
    </Html>
  );
}
// --- COMPONENTE PRINCIPAL ---
export default function Page() {
  const [started, setStarted] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const audioRef = useRef(null);

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) audioRef.current.play();
  };

  return (
    <div className="w-screen h-screen bg-yellow-300 relative overflow-hidden">
      <audio ref={audioRef} loop src="/music/thatgirl.mp3" />

      {/* 1. MODAL INICIAL */}
      {!started && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-md">
          <button
            onClick={handleStart}
            className="bg-white text-black font-bold py-4 px-12 rounded-full text-2xl hover:scale-110 transition-transform"
          >
            ¡ABRIR REGALO! 🎁
          </button>
        </div>
      )}

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[16, 1, 1]} fov={50} />
        <ambientLight intensity={1.5} />

        <Balloons />

        {started && (
          <Suspense fallback={<Loader />}>
            {/* 2. LOGICA DE TRANSICIÓN */}
            {!showWheel ? (
              <BirthdayMessage onComplete={() => setShowWheel(true)} />
            ) : (
              <FerrisWheel />
            )}
          </Suspense>
        )}

        <OrbitControls enablePan={false} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
