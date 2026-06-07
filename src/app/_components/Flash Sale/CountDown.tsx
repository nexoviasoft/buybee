"use client";
import { useEffect, useState } from "react";

interface CountDownProps {
  initialSecondsLeft: number;
  variant?: "light" | "dark";
}

const CountDown = ({ initialSecondsLeft, variant = "light" }: CountDownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    initialSecondsLeft > 0 ? initialSecondsLeft : 0,
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);
  const boxBase =
    "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg font-bold sm:text-lg text-base";
  const labelClass =
    variant === "dark"
      ? "text-white/60 text-[10px] uppercase font-bold tracking-wider"
      : "text-gray-500 text-[10px] uppercase font-bold tracking-wider";
  const boxClass =
    variant === "dark"
      ? `${boxBase} bg-white/10 border border-white/10 text-white shadow-sm backdrop-blur`
      : `${boxBase} bg-white shadow-sm border border-gray-200 text-gray-900`;
  const secondsClass =
    variant === "dark"
      ? `${boxBase} bg-white/10 border border-white/10 text-primary shadow-sm backdrop-blur`
      : `${boxBase} bg-white shadow-sm border border-gray-200 text-primary`;

  return (
    <div className="flex flex-nowrap gap-2 sm:gap-3">
      <div className="flex flex-col items-center gap-1">
        <div className={boxClass}>
          {hours < 10 ? `0${hours}` : hours}
        </div>
        <p className={labelClass}>Hours</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className={boxClass}>
          {minutes < 10 ? `0${minutes}` : minutes}
        </div>
        <p className={labelClass}>Mins</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className={secondsClass}>
          {seconds < 10 ? `0${seconds}` : seconds}
        </div>
        <p className={labelClass}>Secs</p>
      </div>
    </div>
  );
};

export default CountDown;
