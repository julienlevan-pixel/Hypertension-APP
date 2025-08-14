import { useState, useEffect } from "react";

interface TimerProps {
  onTimeUpdate: (time: number) => void;
}

export default function Timer({ onTimeUpdate }: TimerProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime + 0.1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onTimeUpdate]);

  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-warning-orange">
        {time.toFixed(1)}
      </div>
      <div className="text-xs text-gray-500">secondes</div>
    </div>
  );
}
