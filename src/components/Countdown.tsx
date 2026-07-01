import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate?: string; // Format: 'YYYY-MM-DDTHH:MM:SS'
}

export default function Countdown({ targetDate = "2026-09-18T16:00:00" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
        setTimeLeft(newTimeLeft);
        setIsOver(false);
      } else {
        setIsOver(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section 
      id="countdown-section"
      className="relative py-24 bg-stone-900 text-stone-100 overflow-hidden"
    >
      {/* Background floral design overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400 mb-3">
          Counting the Moments
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-white tracking-wide mb-12">
          Until We Say "I Do"
        </h2>

        {isOver ? (
          <div className="bg-amber-500/10 border border-amber-500/30 px-8 py-6 rounded-lg max-w-md mx-auto">
            <p className="font-serif text-2xl text-amber-200">The Celebration Has Begun!</p>
            <p className="font-mono text-xs uppercase tracking-wider text-stone-400 mt-2">September 18, 2026</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
            {items.map((item, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center bg-white/5 backdrop-blur-sm border border-stone-800 rounded-2xl p-6 transition-all duration-300 hover:border-amber-400/30 group"
              >
                {/* Number block */}
                <div className="relative flex items-center justify-center w-24 h-24 mb-4 rounded-full border border-stone-800 group-hover:border-amber-500/30 transition-all duration-500">
                  <span className="font-serif text-3xl md:text-4xl font-light text-amber-300">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  {/* Rotating fine golden circle segment on hover */}
                  <div className="absolute inset-0 rounded-full border-t border-amber-400 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-1000"></div>
                </div>
                
                {/* Unit label */}
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-stone-400 font-medium group-hover:text-amber-200 transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 flex items-center justify-center gap-2">
          <div className="w-12 h-[1px] bg-stone-800"></div>
          <span className="font-serif text-stone-500 italic text-sm">A Lifetime of Memories Awaits</span>
          <div className="w-12 h-[1px] bg-stone-800"></div>
        </div>
      </div>
    </section>
  );
}
