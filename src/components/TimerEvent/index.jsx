"use client";
import getTimeLeft from "@/app/functions/functions";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TimerEvent() {
  const targetDate = new Date("2026-01-22T00:00:00");

  // 1. Inicializamos con una función para evitar discrepancias en el servidor
  const [timeLeft, setTimeLeft] = useState(null);
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    // Calculamos el tiempo inicial solo en el cliente
    setTimeLeft(getTimeLeft(targetDate));

    const now = new Date();
    // Solo visible el 22 de enero
    if (now.getDate() === 22 && now.getMonth() === 0) {
      setCanView(true);
      return;
    }

    const interval = setInterval(() => {
      const updated = getTimeLeft(targetDate);
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(interval);
    // 2. Usamos timeLeft?.days para que si es null, no intente leer la propiedad
  }, [timeLeft?.days]);

  // 3. Si canView es true, aquí deberías retornar el acceso a la rueda o redirigir
  if (canView) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-blue-900 text-white">
        <h1 className="text-4xl font-bold mb-4">¡Llegó el momento! 🌷</h1>
        <Link
          href="/rueda"
          className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Ver mi sorpresa 🎁
        </Link>
      </div>
    );
  }

  // 🔒 EVENTO NO DISPONIBLE
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-linear-to-br from-blue-600 via-blue-900 to-cyan-600 text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl text-center max-w-md">
        <h1 className="text-3xl font-bold mb-3">
          🌷Espero que te guste amor🌷
        </h1>
        <p className="text-slate-300 mb-6">
          Tu sorpresa estará disponible el{" "}
          <span className="font-semibold">22 de enero</span>
        </p>

        {timeLeft ? (
          <>
            <h1 className="text-3xl font-bold mb-3">Faltan</h1>
            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { label: "DÍAS", value: timeLeft.days },
                { label: "HORAS", value: timeLeft.hours },
                { label: "MIN", value: timeLeft.minutes },
                { label: "SEG", value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-black/40 rounded-xl py-3 px-2"
                >
                  <div className="text-3xl font-bold">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs tracking-widest text-slate-400 mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <p className="mt-6 text-lg font-semibold text-green-400">
              ¡Hoy es el día! 🎉
            </p>
            <Link
              href="/rueda"
              className="inline-block mt-4 text-white underline"
            >
              Ir a tu sorpresa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
