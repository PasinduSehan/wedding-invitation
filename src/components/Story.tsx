import React, { useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { LoveStoryMilestone } from "../types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);

  const milestones: LoveStoryMilestone[] = [
    {
      year: "2020",
      title: "When Two Paths Crossed",
      description: "It began as a chance encounter on a crisp autumn evening in Paris. A shared umbrella, a sudden downpour, and a simple conversation that turned into a coffee that lasted for hours. By midnight, we knew this was the start of something beautiful.",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    },
    {
      year: "2023",
      title: "The Proposal in Florence",
      description: "On a quiet terrace overlooking the Renaissance rooftops of Florence, as the sunset dipped the Tuscan hills in liquid gold, Julian got down on one knee. Among tears of absolute joy, Sophia whispered the most heartfelt 'Yes' of her life.",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
    },
    {
      year: "2026",
      title: "The Beginning of Forever",
      description: "Today, we invite you to stand beside us as we seal our promise, share our vows, and write the first chapter of our lifetime together. Your presence is the greatest gift we could ever receive as we embark on this sacred path.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header with smooth reveal
      gsap.from(".story-header", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".story-header",
          start: "top 90%",
          once: true,
        }
      });

      // Animate milestones one-by-one as they enter the screen
      const elements = gsap.utils.toArray(".milestone-row");
      elements.forEach((el: any) => {
        // Find elements inside the milestone row
        const textCol = el.querySelector(".milestone-text");
        const imgCol = el.querySelector(".milestone-img");

        gsap.from(textCol, {
          x: el.classList.contains("md:flex-row-reverse") ? 50 : -50,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          }
        });

        gsap.from(imgCol, {
          x: el.classList.contains("md:flex-row-reverse") ? -50 : 50,
          opacity: 0,
          scale: 0.95,
          duration: 1.4,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          }
        });

        // Also animate the node divider
        const node = el.querySelector(".milestone-node");
        gsap.from(node, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          clearProps: "all",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="story-section"
      ref={containerRef}
      className="py-24 bg-white overflow-hidden relative"
    >
      <div className="max-w-5xl mx-auto px-6 relative z-20">
        
        {/* Section Title */}
        <div className="text-center mb-16 story-header">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-700/80 mb-3">
            Our Journey of Love
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-stone-900 tracking-wide mb-4">
            Our Love Story
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-amber-300/60"></span>
            <Heart size={14} className="text-amber-500 fill-amber-500/10" />
            <span className="w-8 h-[1px] bg-amber-300/60"></span>
          </div>
        </div>

        {/* Timelines Cards */}
        <div className="relative border-l border-amber-200/50 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-[1px] md:before:bg-amber-200/50">
          {milestones.map((milestone, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={idx}
                className={`relative mb-16 md:mb-24 flex flex-col md:flex-row items-center justify-between milestone-row ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Timeline Node */}
                <div className="absolute left-[-6px] md:left-1/2 md:translate-x-[-50%] w-3 h-3 rounded-full bg-amber-500 border-4 border-stone-50 z-30 milestone-node"></div>

                {/* Left/Right Text Content Card */}
                <div className="w-full md:w-[45%] pl-8 md:pl-0 flex flex-col justify-center milestone-text">
                  <span className="font-serif text-3xl font-light text-amber-600 mb-2">
                    {milestone.year}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-normal text-stone-900 tracking-wide mb-3">
                    {milestone.title}
                  </h3>
                  <p className="font-serif text-stone-600 text-sm leading-relaxed text-justify mb-4">
                    {milestone.description}
                  </p>
                </div>

                {/* Empty space filler for desktop alignment */}
                <div className="hidden md:block w-[45%] milestone-img">
                  <div className="overflow-hidden rounded-lg shadow-md border border-stone-100 hover:border-amber-200/50 transition-all duration-500 hover:shadow-xl group">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Mobile Image View */}
                <div className="w-full md:hidden pl-8 mt-4 milestone-img">
                  <div className="overflow-hidden rounded-lg shadow-sm border border-stone-100">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
