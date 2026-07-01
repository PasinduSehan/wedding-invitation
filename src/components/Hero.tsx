import React from "react";
import { ChevronDown, Calendar, MapPin } from "lucide-react";

interface HeroProps {
  onScrollToRsvp: () => void;
  coupleNames?: string;
  weddingDate?: string;
}

export default function Hero({ onScrollToRsvp, coupleNames = "Julian & Sophia", weddingDate = "September 18, 2026" }: HeroProps) {
  return (
    <section 
      id="hero-section"
      className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 py-12 overflow-hidden bg-stone-50 select-none"
    >
      {/* Elegantly styled absolute borders mimicking luxury card print */}
      <div className="absolute inset-4 md:inset-8 border border-amber-200/40 pointer-events-none rounded-sm"></div>
      <div className="absolute inset-6 md:inset-12 border border-amber-300/20 pointer-events-none rounded-sm"></div>
      
      {/* Top Header Label */}
      <div className="z-20 mt-8 animate-[fadeIn_1.5s_ease-out]">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-700/80 mb-2">
          The Honour of Your Presence is Requested
        </p>
        <div className="w-12 h-[1px] bg-amber-400/50 mx-auto"></div>
      </div>

      {/* Main Luxury Couple Identity */}
      <div className="z-20 my-auto flex flex-col items-center">
        {/* Intricate crest outline */}
        <div className="w-20 h-20 border border-amber-300/40 rounded-full flex items-center justify-center mb-6 relative animate-[pulse_3s_infinite]">
          <span className="font-serif text-2xl text-amber-700 font-light tracking-widest">
            {coupleNames.split(" & ").map(n => n[0]).join("·")}
          </span>
          <div className="absolute -inset-1 border border-amber-200/20 rounded-full"></div>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-stone-900 tracking-wide mb-4 animate-[fadeIn_2s_ease-out]">
          {coupleNames}
        </h1>
        
        <p className="font-serif italic text-xl md:text-2xl text-stone-600 mb-2 animate-[fadeIn_2.5s_ease-out]">
          Are getting married
        </p>
      </div>

      {/* Bottom CTA & Scroll Indicator */}
      <div className="z-20 flex flex-col items-center gap-4 mb-4">
        {/* Wedding Metadata Pill nestled right above the RSVP button with small spacing */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-amber-500/20 shadow-sm text-stone-800 text-xs tracking-wider font-mono animate-[fadeIn_3s_ease-out] mb-2">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-amber-700" />
            <span className="font-semibold">{weddingDate}</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-amber-400"></div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-amber-700" />
            <span className="font-semibold">Villa de L'Amour, Florence</span>
          </div>
        </div>

        <button
          id="hero-rsvp-cta"
          onClick={onScrollToRsvp}
          className="px-10 py-4 bg-stone-100/30 hover:bg-amber-500/10 active:bg-amber-500/15 backdrop-blur-md text-amber-800 hover:text-amber-900 font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-full border border-amber-500/60 hover:border-amber-600 transition-all duration-500 ease-out cursor-pointer flex items-center gap-2.5 group animate-luxury-pulse"
        >
          <span>RSVP Your Attendance</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-amber-700">→</span>
        </button>

        <button
          id="scroll-down-btn"
          onClick={() => {
            const el = document.getElementById("countdown-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-amber-700/60 hover:text-amber-700 transition-colors animate-bounce p-2 mt-2"
          aria-label="Scroll down to details"
        >
          <ChevronDown size={28} />
        </button>
      </div>

      {/* Soft luxurious background radial lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-50/40 rounded-full blur-[120px] pointer-events-none"></div>
    </section>
  );
}
