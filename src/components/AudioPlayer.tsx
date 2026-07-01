import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Play, Pause, Music, ChevronDown } from "lucide-react";
import { AudioManager, WeddingTrack } from "../lib/audioManager";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [hasBegun, setHasBegun] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<WeddingTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const manager = AudioManager.getInstance();
    // Pre-initialize and pre-load the audio buffer in the background
    manager.init();
    
    // Wire up reactive audio state callback to local React state
    manager.registerStateListener((playing) => {
      setIsPlaying(playing);
    });

    manager.registerTrackListener((track) => {
      setCurrentTrack(track);
    });

    manager.registerLoadingListener((loading) => {
      setIsLoading(loading);
    });

    // Read initial settings from singleton
    setVolume(manager.getVolume());
    setIsMuted(manager.getIsMuted());
  }, []);

  const togglePlay = () => {
    const manager = AudioManager.getInstance();
    manager.toggle();
    setShowNotification(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const manager = AudioManager.getInstance();
    manager.setVolume(val);
    if (val === 0) {
      setIsMuted(true);
      manager.setMuted(true);
    } else {
      setIsMuted(false);
      manager.setMuted(false);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const manager = AudioManager.getInstance();
    manager.setMuted(nextMuted);
  };

  const handleBeginMusic = () => {
    setHasBegun(true);
    const manager = AudioManager.getInstance();
    manager.play().catch((err) => {
      console.warn("Audio playback gesture trigger deferred:", err);
    });
    setShowNotification(false);
  };

  const handleEnterSilent = () => {
    setHasBegun(true);
    const manager = AudioManager.getInstance();
    manager.pause();
    setShowNotification(true);
  };

  const handleTrackSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    const manager = AudioManager.getInstance();
    await manager.setTrack(index);
    setShowNotification(false);
  };

  const manager = AudioManager.getInstance();
  const tracks = manager.tracks;
  const currentTrackIndex = manager.getCurrentTrackIndex();

  return (
    <>
      {/* Prominent Golden Welcome & Begin Music Modal */}
      {!hasBegun && (
        <div className="fixed inset-0 z-100 bg-stone-950/98 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 select-none transition-all duration-1000">
          <div className="max-w-md w-full border border-amber-500/30 bg-stone-900/60 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            {/* Subtle decorative corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-amber-500/40"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-amber-500/40"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-amber-500/40"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-amber-500/40"></div>

            <div className="mb-6 inline-flex p-4 bg-amber-500/10 rounded-full text-amber-500 border border-amber-500/20 animate-pulse">
              <Music size={32} />
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-stone-100 tracking-wide font-light mb-2">
              Sandeepani <span className="text-amber-500 font-serif italic">&amp;</span> Kawsara
            </h2>
            <p className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.2em] mb-8">
              August 14, 2026 · Wedding Invitation
            </p>

            <p className="font-serif text-xs md:text-sm text-stone-300 italic mb-8 max-w-xs mx-auto leading-relaxed">
              "We invite you to experience our wedding registry and celebration details with romantic background piano music."
            </p>

            <button
              id="btn-begin-music-modal"
              onClick={handleBeginMusic}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-950 px-8 py-3.5 rounded-full font-mono text-[11px] uppercase tracking-widest font-bold shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Play size={14} className="fill-stone-950" />
              <span>Begin Music</span>
            </button>

            <button
              id="btn-enter-silent-modal"
              onClick={handleEnterSilent}
              className="mt-4 text-stone-500 hover:text-stone-300 font-mono text-[10px] uppercase tracking-widest block mx-auto hover:underline cursor-pointer"
            >
              Enter Silently
            </button>
          </div>
        </div>
      )}

      {/* Floating Music Control */}
      <div 
        id="luxury-music-player"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-md pl-4 pr-3 py-2.5 rounded-full border border-amber-200/60 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-amber-400 group"
      >
        {/* Equalizer or loading spinner */}
        {isLoading ? (
          <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mr-1"></div>
        ) : isPlaying ? (
          <div className="flex items-end gap-0.5 h-4 w-4 mr-1">
            <span className="w-0.5 bg-amber-500 rounded-full animate-[pulse_0.8s_infinite] audio-pulse-delay-100 h-full"></span>
            <span className="w-0.5 bg-amber-600 rounded-full animate-[pulse_0.6s_infinite] audio-pulse-delay-300 h-3"></span>
            <span className="w-0.5 bg-amber-500 rounded-full animate-[pulse_0.9s_infinite] audio-pulse-delay-500 h-full"></span>
            <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.7s_infinite] audio-pulse-delay-200 h-2"></span>
          </div>
        ) : null}

        {/* Track Selection and Information */}
        <div className="flex flex-col text-left max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 pr-1 select-none">
          {currentTrack && (
            <>
              <span className="text-[9px] text-stone-400 uppercase tracking-widest font-mono">Wedding Theme Music</span>
              <div className="relative flex items-center gap-1 mt-0.5">
                <select
                  id="music-track-select"
                  value={currentTrackIndex}
                  onChange={handleTrackSelect}
                  aria-label="Select music track"
                  className="appearance-none bg-transparent border-none pr-6 pl-0 py-0 text-xs font-serif text-stone-800 focus:outline-none focus:ring-0 font-medium cursor-pointer max-w-37.5 truncate"
                >
                  {tracks.map((track, idx) => (
                    <option key={track.id} value={idx} className="bg-stone-900 text-stone-100 text-xs py-1">
                      {track.title}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-0 text-stone-500 pointer-events-none" />
              </div>
            </>
          )}
        </div>

        {/* Play/Pause round button */}
        <button
          id="music-toggle-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause wedding music" : "Play wedding music"}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
            isPlaying 
              ? "bg-amber-100 text-amber-700 animate-[spin_12s_linear_infinite]" 
              : "bg-amber-600 text-white hover:bg-amber-700 shadow-md"
          }`}
        >
          {isPlaying ? (
            <Pause size={16} className="text-amber-800" />
          ) : (
            <Play size={16} className="translate-x-px" />
          )}
        </button>

        {/* Volume section */}
        <div className="flex items-center gap-2 max-w-0 overflow-hidden group-hover:max-w-40 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 pr-1">
          <button
            id="music-mute-btn"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute music" : "Mute music"}
            className="text-stone-600 hover:text-amber-600 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            id="music-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Adjust wedding music volume"
            className="w-16 accent-amber-600 h-1 rounded-lg bg-stone-200 cursor-pointer"
          />
        </div>
      </div>

      {/* Gentle interaction notification top bar or toast */}
      {showNotification && (
        <div
          id="music-notification"
          className="fixed bottom-20 right-6 z-50 max-w-xs bg-stone-900/90 text-white text-xs px-4 py-3 rounded-lg border border-amber-500/20 shadow-2xl backdrop-blur-sm animate-[bounce_2s_infinite] flex items-center gap-3"
        >
          <div className="p-1 bg-amber-500/20 rounded-full text-amber-400">
            <Music size={14} className="animate-pulse" />
          </div>
          <div>
            <p className="font-semibold text-amber-200">
              {isLoading ? "Loading Track..." : currentTrack ? currentTrack.title : "Wedding Piano Music"}
            </p>
            <p className="text-stone-300 text-[10px]">
              {isLoading ? "Please wait a moment..." : "Tap floating play button to listen"}
            </p>
          </div>
          <button
            id="close-music-notification"
            onClick={() => setShowNotification(false)}
            className="text-stone-400 hover:text-white ml-auto text-sm font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
