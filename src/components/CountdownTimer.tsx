import { useEffect, useState } from "react";

const EVENT = new Date("2026-07-17T00:00:00").getTime();

function calc() {
  const now = Date.now();
  const diff = Math.max(0, EVENT - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer() {
  const [t, setT] = useState(calc);

  useEffect(() => {
    const interval = setInterval(() => setT(calc), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span className="tabular-nums">
      {pad(t.days)}d {pad(t.hours)}h {pad(t.minutes)}m {pad(t.seconds)}s
    </span>
  );
}
