"use client";
import getTimeLeft from "@/app/functions/functions";
import { useRef, useEffect, useState } from "react";

export default function TimerEvent(params) {
  const targetDate = new Date("2026-01-22T00:00:00");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    const now = new Date();

    // Solo visible el 22 de enero
    if (now.getDate() === 22 && now.getMonth() === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanView(true);
      return;
    }

    const interval = setInterval(() => {
      const updated = getTimeLeft(targetDate);
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft.days]);

  // 🔒 EVENTO NO DISPONIBLE
  if (!canView) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl text-center max-w-md">
          <h1 className="text-3xl font-bold mb-3">🎡 Evento no disponible</h1>
          <p className="text-slate-300 mb-6">
            La rueda se habilitará el{" "}
            <span className="font-semibold">22 de enero</span>
          </p>

          {timeLeft ? (
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
          ) : (
            <p className="mt-6 text-lg font-semibold text-green-400">
              ¡Hoy es el día! 🎉
            </p>
          )}
        </div>
      </div>
    );
  }
}
