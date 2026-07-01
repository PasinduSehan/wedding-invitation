import React, { useState, useEffect } from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import AudioPlayer from "./components/AudioPlayer";
import { AudioManager } from "./lib/audioManager";
import Hero from "./components/Hero";
import Countdown from "./components/Countdown";
import Story from "./components/Story";
import EventSchedule from "./components/EventSchedule";
import Gallery from "./components/Gallery";
import RsvpSection from "./components/RsvpSection";
import AdminPanel from "./components/AdminPanel";
import { Heart, Menu, X, Landmark, Compass } from "lucide-react";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Parse pathing and listen to popstate
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.href && anchor.host === window.location.host) {
        // If it's an internal route change (not a hash scroll)
        if (!anchor.hash && (anchor.pathname === "/admin" || anchor.pathname === "/")) {
          e.preventDefault();
          window.history.pushState(null, "", anchor.href);
          setCurrentPath(anchor.pathname);
        }
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    document.addEventListener("click", handleAnchorClick);

    // Initialize AudioManager on the very first user interaction event
    const initAudioOnGesture = () => {
      AudioManager.getInstance().init();
      // Clean up gesture listeners
      window.removeEventListener("click", initAudioOnGesture);
      window.removeEventListener("touchstart", initAudioOnGesture);
      window.removeEventListener("keydown", initAudioOnGesture);
    };

    window.addEventListener("click", initAudioOnGesture, { passive: true });
    window.addEventListener("touchstart", initAudioOnGesture, { passive: true });
    window.addEventListener("keydown", initAudioOnGesture, { passive: true });

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("click", initAudioOnGesture);
      window.removeEventListener("touchstart", initAudioOnGesture);
      window.removeEventListener("keydown", initAudioOnGesture);
    };
  }, []);

  // Decode invite token if on an /invite/:token route
  const getInviteToken = () => {
    if (currentPath.startsWith("/invite/")) {
      return currentPath.replace("/invite/", "").trim();
    }
    return null;
  };

  const inviteToken = getInviteToken();
  const isAdminView = currentPath === "/admin";

  const handleScrollToSection = (id: string) => {
    setIsNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Nav Links config
  const navLinks = [
    { label: "Welcome", sectionId: "hero-section" },
    { label: "Our Story", sectionId: "story-section" },
    { label: "Itinerary", sectionId: "schedule-section" },
    { label: "Gallery", sectionId: "gallery-section" },
    { label: "RSVP", sectionId: "rsvp-section" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      
      {/* 1. Interactive 3D Golden Petals background (Hidden on admin view to ensure maximum legibility) */}
      {!isAdminView && <ThreeCanvas />}

      {/* 2. Background Romantic Ambient Music (Client-only) */}
      {!isAdminView && <AudioPlayer />}

      {/* 3. Luxury Sticky Header Navigation (For Client Views) */}
      {!isAdminView && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-amber-200/20 px-6 py-4 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Monogram logo */}
            <button
              id="nav-logo-btn"
              onClick={() => handleScrollToSection("hero-section")}
              className="flex items-center gap-2 text-stone-900 group cursor-pointer"
            >
              <Heart size={16} className="text-amber-600 fill-amber-500/10 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-sm md:text-base tracking-[0.2em] uppercase font-light">
                Sandeepani <span className="text-amber-600">&amp;</span> Kawsara
              </span>
            </button>

            {/* Desktop Navigation links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.sectionId}
                  id={`nav-link-${link.sectionId}`}
                  onClick={() => handleScrollToSection(link.sectionId)}
                  className="font-mono text-[10px] uppercase tracking-widest text-stone-600 hover:text-amber-700 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}

              <div className="w-[1px] h-4 bg-stone-200"></div>

              {/* Link to Admin */}
              <a
                id="header-admin-link"
                href="/admin"
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-amber-700 transition-colors"
                title="Open Management Portal"
              >
                <Landmark size={12} />
                <span>Admin</span>
              </a>
            </nav>

            {/* Mobile Hamburger toggle */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="md:hidden text-stone-700 hover:text-amber-700 p-1"
              aria-label="Toggle navigation menu"
            >
              {isNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {isNavOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 border-b border-stone-200 p-6 flex flex-col gap-4 shadow-xl animate-[fadeIn_0.3s_ease-out]">
              {navLinks.map((link) => (
                <button
                  key={link.sectionId}
                  id={`mobile-nav-link-${link.sectionId}`}
                  onClick={() => handleScrollToSection(link.sectionId)}
                  className="text-left font-mono text-xs uppercase tracking-widest text-stone-600 hover:text-amber-700 py-1 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <div className="h-[1px] bg-stone-100 my-1"></div>
              <a
                id="mobile-header-admin-link"
                href="/admin"
                className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-stone-500 hover:text-amber-700 py-1"
              >
                <Landmark size={13} />
                <span>Registry Dashboard</span>
              </a>
            </div>
          )}
        </header>
      )}

      {/* 4. Main Page Routes Dispatcher */}
      <main className={`flex-1 ${!isAdminView ? "pt-[60px]" : ""}`}>
        {isAdminView ? (
          /* ADMIN PORTAL */
          <AdminPanel />
        ) : (
          /* LUXURY WEDDING INVITATION LANDING PAGE */
          <div className="animate-fade-in">
            {/* Hero Card Cover */}
            <Hero 
              onScrollToRsvp={() => handleScrollToSection("rsvp-section")} 
              coupleNames="Sandeepani &amp; Kawsara"
              weddingDate="August 14, 2026"
            />
            
            {/* Real-time Event Countdown */}
            <Countdown targetDate="2026-08-14T10:00:00" />

            {/* Alternating Couple Story Timeline */}
            <Story />

            {/* Official Schedule Timeline with Location Iframe */}
            <EventSchedule />

            {/* Bento Grid Photo Showcase */}
            <Gallery />

            {/* Response Card Area (Fills token details automatically if coming from /invite/:token link) */}
            <RsvpSection tokenFromUrl={inviteToken} />
          </div>
        )}
      </main>

      {/* 5. Minimalist Luxury Footer */}
      {!isAdminView && (
        <footer className="bg-stone-950 text-stone-400 text-xs py-12 px-6 border-t border-stone-900 text-center select-none">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="font-serif italic text-amber-500 text-sm">
              "We love because He first loved us."
            </p>
            <div className="w-8 h-[1px] bg-stone-800 mx-auto"></div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500">
              © 2026 Sandeepani &amp; Kawsara Wedding. All rights reserved.
            </p>
            <div className="text-[10px] font-mono text-stone-600 flex justify-center gap-3">
              <a href="/" className="hover:text-amber-500">Wedding Website</a>
              <span>·</span>
              <a href="/admin" className="hover:text-amber-500">Registry Administration</a>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
