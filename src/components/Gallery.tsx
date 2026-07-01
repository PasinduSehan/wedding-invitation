import React, { useState, useEffect, useRef } from "react";
import { Camera, X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GalleryItem {
  id: number;
  url: string;
  title: string;
  category: string;
}

export default function Gallery() {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const photos: GalleryItem[] = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=600&auto=format&fit=crop",
      title: "Shared Smiles by the Lake",
      category: "Engagement",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=600&auto=format&fit=crop",
      title: "Elegance of White & Gold Tablescapes",
      category: "Preparation",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1520854221256-17451cc35dcd?q=80&w=600&auto=format&fit=crop",
      title: "Laughter in the Fiesole Gardens",
      category: "Moments",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1507504038482-76210062ecee?q=80&w=600&auto=format&fit=crop",
      title: "The Altar Under Candlelight",
      category: "Ceremony",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop",
      title: "Hand-in-Hand Under Tuscan Arches",
      category: "Engagement",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
      title: "Our Quiet Dance at Midnight",
      category: "Gala",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal Gallery Header
      gsap.from(".gallery-header", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".gallery-header",
          start: "top 90%",
          once: true,
        }
      });

      // Reveal Gallery Grid items with stagger
      gsap.from(".gallery-item", {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        stagger: {
          each: 0.15,
          ease: "power2.out"
        },
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: ".gallery-grid",
          start: "top 85%",
          once: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((activePhotoIdx - 1 + photos.length) % photos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((activePhotoIdx + 1) % photos.length);
  };

  return (
    <section 
      id="gallery-section"
      ref={containerRef}
      className="py-24 bg-white relative"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-20">
        
        {/* Header */}
        <div className="text-center mb-16 gallery-header">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-700/80 mb-3">
            Capturing the Chapters
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-stone-900 tracking-wide mb-4">
            Pre-Wedding Gallery
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-amber-300/60"></span>
            <Camera size={14} className="text-amber-500" />
            <span className="w-8 h-[1px] bg-amber-300/60"></span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gallery-grid">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIdx(idx)}
              className={`group relative overflow-hidden rounded-2xl border border-stone-100 cursor-zoom-in shadow-md hover:shadow-2xl hover:border-amber-400/30 transition-all duration-500 gallery-item ${
                idx === 1 ? "md:col-span-2 lg:col-span-1" : ""
              } ${idx === 4 ? "lg:col-span-2" : ""}`}
            >
              {/* Image Container */}
              <div className="aspect-[4/3] md:aspect-video lg:aspect-square overflow-hidden bg-stone-100">
                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Gold Glass Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300 mb-1">
                  {photo.category}
                </span>
                <h3 className="font-serif text-lg text-white font-light tracking-wide flex items-center gap-2">
                  <span>{photo.title}</span>
                  <Heart size={12} className="text-amber-500 fill-amber-500" />
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div
          id="gallery-lightbox"
          onClick={() => setActivePhotoIdx(null)}
          className="fixed inset-0 bg-stone-950/95 z-50 flex items-center justify-center p-4 md:p-8"
        >
          {/* Close button */}
          <button
            id="lightbox-close-btn"
            onClick={() => setActivePhotoIdx(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Close photo view"
          >
            <X size={24} />
          </button>

          {/* Nav: Prev */}
          <button
            id="lightbox-prev-btn"
            onClick={handlePrev}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Active Image Box */}
          <div className="relative max-w-5xl max-h-[80vh] flex flex-col items-center">
            <img
              src={photos[activePhotoIdx].url}
              alt={photos[activePhotoIdx].title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Meta Text */}
            <div className="text-center mt-4 text-white">
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                {photos[activePhotoIdx].category}
              </span>
              <p className="font-serif text-lg font-light tracking-wide mt-1">
                {photos[activePhotoIdx].title}
              </p>
            </div>
          </div>

          {/* Nav: Next */}
          <button
            id="lightbox-next-btn"
            onClick={handleNext}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
}
