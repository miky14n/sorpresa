"use client";

import { useRef, useState } from "react";
import TimerEvent from "@/components/TimerEvent";

export default function Page() {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);

  const startMusic = () => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0.5;
    audioRef.current
      .play()
      .then(() => setStarted(true))
      .catch((e) => {
        console.error("Audio bloqueado:", e);
      });
  };

  return (
    <div className="w-screen h-screen relative">
      {/* Audio */}
      <audio ref={audioRef} src="/music/sparks.mp3" loop />

      {/* Overlay obligatorio */}
      {!started && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            onClick={startMusic}
            className="px-8 py-4 text-xl font-bold rounded-full
                       bg-yellow-400 hover:bg-yellow-300
                       text-black shadow-2xl animate-pulse"
          >
            🔊 Activar sonido
          </button>
        </div>
      )}

      {/* Tu contenido */}
      <TimerEvent />
    </div>
  );
}
