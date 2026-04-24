import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export default function CountdownTimer({ 
  targetDate, 
  digitClassName = "text-brand-cream" 
}: { 
  targetDate: string; 
  digitClassName?: string;
}) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: any[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className={cn("text-2xl md:text-3xl serif font-medium", digitClassName)}>{timeLeft[interval]}</span>
        <span className={cn("text-[8px] uppercase tracking-widest font-black", digitClassName === "text-brand-cream" ? "text-brand-cream/60" : "text-white/60")}>{interval}</span>
      </div>
    );
  });

  return (
    <div className={cn("flex gap-6 md:gap-10", digitClassName)}>
      {timerComponents.length ? timerComponents : <span>Sale has ended</span>}
    </div>
  );
}
