import React from "react";
import { Clock, MapPin, Map, ExternalLink, Printer } from "lucide-react";

export default function EventSchedule() {
  const scheduleEvents = [
    {
      title: "The Holy Matrimony",
      time: "4:00 PM - 5:30 PM",
      location: "San Michele Chapel, Villa di Maiano",
      address: "Via del Salviatino, 1, 50014 Fiesole FI, Italy",
      description: "Join us as we exchange our traditional vows and pledge our eternal devotion under the historic vaulted arches of San Michele.",
      iconName: "ring",
    },
    {
      title: "Garden Cocktails",
      time: "5:30 PM - 7:00 PM",
      location: "The Rose Terrace & Olive Orchard",
      address: "Via del Salviatino, 1, 50014 Fiesole FI, Italy",
      description: "Delight in fine Italian sparkling wines, artisanal hors d'oeuvres, and classical violin arrangements overlooking the city of Florence.",
      iconName: "glass",
    },
    {
      title: "Wedding Banquet & Gala",
      time: "7:00 PM - Midnight",
      location: "Grand Ballroom & Oak Court",
      address: "Via del Salviatino, 1, 50014 Fiesole FI, Italy",
      description: "A candle-lit four-course Tuscan feast followed by toasts, cake cutting, and dancing under the stars to a live orchestral band.",
      iconName: "cake",
    },
  ];

  return (
    <section 
      id="schedule-section"
      className="py-24 bg-stone-50 overflow-hidden relative"
    >
      <div className="absolute inset-0 border-t border-b border-amber-200/20 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-20">
        
        {/* Title */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-700/80 mb-3">
            The Celebration Itinerary
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-stone-900 tracking-wide">
            Event Schedule
          </h2>
          <div className="w-16 h-[1px] bg-amber-400 mx-auto mt-4 mb-6"></div>
          
          {/* Elegant Print Keppsake Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-amber-600/30 bg-amber-50/40 text-amber-800 font-mono text-[10px] uppercase tracking-widest font-semibold rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300 hover:shadow-md hover:border-amber-600 active:scale-95 cursor-pointer"
          >
            <Printer size={13} />
            <span>Print Wedding Itinerary</span>
          </button>
        </div>

        {/* Content Split: Events list on Left, Interactive Google Map on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Events Timeline List */}
          <div className="lg:col-span-6 space-y-6">
            {scheduleEvents.map((ev, idx) => (
              <div 
                key={idx}
                className="bg-white/80 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-6 md:p-8 hover:border-amber-400/30 hover:shadow-xl transition-all duration-500 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/30">
                    Event {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs font-mono">
                    <Clock size={13} className="text-amber-600" />
                    <span>{ev.time}</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-light text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                  {ev.title}
                </h3>
                
                <div className="flex items-start gap-2 text-stone-500 text-xs md:text-sm mb-4">
                  <MapPin size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-serif italic">{ev.location}</span>
                </div>

                <p className="font-serif text-stone-600 text-sm leading-relaxed mb-4">
                  {ev.description}
                </p>

                <div className="border-t border-stone-100 pt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-stone-400 max-w-[70%] truncate">
                    {ev.address}
                  </span>
                  <a
                    href="https://maps.app.goo.gl/T4Y6v3xR9H3XG8zE9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-mono tracking-wider font-semibold transition-colors uppercase text-[10px]"
                  >
                    <span>Get GPS</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Luxury Google Maps Location Showcase */}
          <div className="lg:col-span-6 h-full flex flex-col">
            <div className="bg-white border border-amber-200/40 p-3 rounded-2xl shadow-xl h-[400px] md:h-[480px] flex flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Official Wedding Venue</span>
                </div>
                <span className="font-serif text-xs italic text-amber-700">Villa di Maiano, Fiesole</span>
              </div>

              {/* Map Iframe */}
              <div className="relative flex-1 w-full h-full rounded-xl overflow-hidden border border-stone-100">
                <iframe 
                  title="Wedding Location Venue Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.3175850937745!2d11.293466577317789!3d43.7870425710963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a543f49f50e85%3A0xe1db6e759fc1b5b3!2sVilla%20di%20Maiano!5e0!3m2!1sen!2sit!4v1719229841235!5m2!1sen!2sit" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>

              {/* Card Footer Direction Action */}
              <div className="mt-3 flex items-center justify-between px-2 text-stone-600 text-xs">
                <span className="font-serif">Florence, Tuscany, Italy</span>
                <a
                  href="https://maps.app.goo.gl/T4Y6v3xR9H3XG8zE9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-stone-950 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <Map size={12} />
                  <span>Open in Maps</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Hidden printable wedding invitation style container */}
      <div 
        id="print-itinerary-area" 
        className="hidden print:block bg-white text-stone-900 p-12 border-[6px] border-double border-stone-800 max-w-2xl mx-auto my-4 text-center font-serif relative"
      >
        {/* Fine border inside */}
        <div className="absolute inset-2 border border-stone-300 pointer-events-none"></div>

        {/* Elegant top ornament */}
        <div className="mb-6 mt-4">
          <div className="w-14 h-14 rounded-full border border-stone-800 flex items-center justify-center mx-auto mb-2 bg-stone-50">
            <span className="font-serif text-lg tracking-widest font-light text-stone-800">S&amp;K</span>
          </div>
          <div className="text-[9px] font-mono tracking-[0.3em] text-stone-500 uppercase">Wedding Celebration</div>
        </div>

        {/* Couple names */}
        <h1 className="text-3xl font-light tracking-wide text-stone-900 mb-1">
          Sandeepani &amp; Kawsara
        </h1>
        <p className="italic text-stone-600 text-xs mb-6">
          request the honour of your presence to celebrate their wedding itinerary
        </p>

        {/* Ornament Divider */}
        <div className="flex items-center justify-center gap-3 text-stone-400 my-4">
          <div className="w-12 h-[1px] bg-stone-300"></div>
          <span className="text-[10px]">♦ ❖ ♦</span>
          <div className="w-12 h-[1px] bg-stone-300"></div>
        </div>

        {/* Date & Location */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-stone-900 font-semibold mb-1">
            Friday, August 14, 2026
          </p>
          <p className="text-stone-600 text-xs italic">
            Villa di Maiano — Fiesole, Italy
          </p>
        </div>

        {/* Printed Schedule Items */}
        <div className="space-y-8 my-8 text-left max-w-md mx-auto">
          {scheduleEvents.map((ev, idx) => (
            <div key={idx} className="border-b border-stone-100 pb-6 last:border-b-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  {ev.title}
                </h3>
                <span className="font-mono text-[11px] text-stone-500 tracking-wider font-semibold whitespace-nowrap ml-4">
                  {ev.time}
                </span>
              </div>
              
              <p className="text-amber-800 text-[11px] font-serif italic mb-2">
                {ev.location}
              </p>
              
              <p className="text-stone-700 text-xs leading-relaxed font-serif">
                {ev.description}
              </p>
            </div>
          ))}
        </div>

        {/* Small Bottom Divider */}
        <div className="flex items-center justify-center gap-2 text-stone-400 my-6">
          <div className="w-8 h-[1px] bg-stone-200"></div>
          <span className="text-xs">❦</span>
          <div className="w-8 h-[1px] bg-stone-200"></div>
        </div>

        {/* Welcoming Footer Note */}
        <div className="mt-4 text-center">
          <p className="font-serif text-xs italic text-stone-700 leading-relaxed max-w-xs mx-auto">
            "Thank you for sharing in our joy and journey. We look forward to celebrating this beautiful union with you."
          </p>
          <p className="font-mono text-[8px] text-stone-400 uppercase tracking-widest mt-6">
            Please print and keep this itinerary for your travels
          </p>
        </div>
      </div>

      {/* CSS print style injection block */}
      <style>{`
        @media print {
          html, body {
            background-color: #ffffff !important;
            background-image: none !important;
            color: #1c1917 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-itinerary-area, #print-itinerary-area * {
            visibility: visible !important;
          }
          #print-itinerary-area {
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            padding: 2.5rem !important;
            border: 6px double #1c1917 !important;
            background-color: #ffffff !important;
          }
          @page {
            size: portrait;
            margin: 1.5cm;
          }
        }
      `}</style>
    </section>
  );
}
