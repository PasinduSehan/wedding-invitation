import { Sparkles } from "lucide-react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export interface WeddingTrack {
  id: string;
  title: string;
  composer: string;
  url: string;
}

export class AudioManager {
  private static instance: AudioManager | null = null;

  public readonly tracks: WeddingTrack[] = [
    {
      id: "johny-grimes-i-cant-make-you-love-me",
      title: "Johny Grimes - I Cant Make You Love Me (freetouse.com).mp3",
      composer: "Johny Grimes",
      url: "/assets/johny-grimes-i-cant-make-you-love-me.mp3",
    }
  ];

  private currentTrackIndex = 0;
  private audioElement: HTMLAudioElement | null = null;
  private isMuted = false;
  private volume = 0.4;
  private isPlaying = false;
  private isInitialized = false;
  private isLoading = false;

  // Listeners
  private onStateChange: ((isPlaying: boolean) => void) | null = null;
  private onTrackChange: ((track: WeddingTrack) => void) | null = null;
  private onLoadingChange: ((isLoading: boolean) => void) | null = null;

  private constructor() {
    // Private constructor for Singleton pattern
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public registerStateListener(cb: (isPlaying: boolean) => void) {
    this.onStateChange = cb;
    cb(this.isPlaying);
  }

  public registerTrackListener(cb: (track: WeddingTrack) => void) {
    this.onTrackChange = cb;
    cb(this.getCurrentTrack());
  }

  public registerLoadingListener(cb: (isLoading: boolean) => void) {
    this.onLoadingChange = cb;
    cb(this.isLoading);
  }

  public getCurrentTrack(): WeddingTrack {
    return this.tracks[this.currentTrackIndex];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public init() {
    if (this.isInitialized) return;

    this.setupAudioElement();
    this.isInitialized = true;

    // Start preloading the audio element immediately
    this.loadAudioBuffer();
  }

  private async loadAudioBuffer() {
    const currentTrack = this.getCurrentTrack();

    if (this.audioElement && this.audioElement.src) return;

    this.isLoading = true;
    if (this.onLoadingChange) {
      this.onLoadingChange(true);
    }

    console.log(`Loading wedding track: ${currentTrack.title}`);

    const targetUrls: string[] = [
      currentTrack.url,
      "/johny-grimes-i-cant-make-you-love-me.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    ];

    try {
      const fileRef = ref(storage, "audio/johny-grimes-i-cant-make-you-love-me.mp3");
      const storageUrl = await getDownloadURL(fileRef);
      if (storageUrl) {
        targetUrls.push(storageUrl);
      }
    } catch (e) {
      console.log("Firebase Storage lookup skipped or failed, using local audio assets.");
    }

    let loaded = false;
    for (const url of targetUrls) {
      try {
        await this.loadAudioElement(url);
        loaded = true;
        break;
      } catch (err) {
        console.warn(`Failed to load audio from ${url}:`, err);
      }
    }

    this.isLoading = false;
    if (this.onLoadingChange) {
      this.onLoadingChange(false);
    }

    if (loaded && this.isPlaying) {
      try {
        await this.audioElement?.play();
      } catch (err) {
        console.warn("Audio element play() failed after load:", err);
      }
    }
  }

  private setupAudioElement() {
    if (this.audioElement) return;
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.muted = this.isMuted;
    audio.volume = this.volume;
    audio.crossOrigin = "anonymous";
    this.audioElement = audio;
  }

  private loadAudioElement(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.loop = true;
      audio.muted = this.isMuted;
      audio.volume = this.volume;
      audio.crossOrigin = "anonymous";
      audio.src = url;

      const cleanup = () => {
        audio.removeEventListener("canplaythrough", onReady);
        audio.removeEventListener("loadeddata", onReady);
        audio.removeEventListener("error", onError);
      };

      const onReady = () => {
        cleanup();
        this.audioElement = audio;
        resolve();
      };

      const onError = () => {
        cleanup();
        reject(new Error(`Audio element failed to load ${url}`));
      };

      audio.addEventListener("canplaythrough", onReady, { once: true });
      audio.addEventListener("loadeddata", onReady, { once: true });
      audio.addEventListener("error", onError, { once: true });
      audio.load();
    });
  }

  public async setTrack(index: number): Promise<void> {
    if (index < 0 || index >= this.tracks.length) return;
    if (this.currentTrackIndex === index && this.audioElement) return;

    this.currentTrackIndex = index;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch (e) {}
      this.audioElement = null;
    }

    if (this.onTrackChange) {
      this.onTrackChange(this.getCurrentTrack());
    }

    if (!this.isInitialized) {
      this.init();
    } else {
      const wasPlaying = this.isPlaying;
      if (wasPlaying) {
        this.pause();
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange(true);
      }
      await this.loadAudioBuffer();
    }
  }

  public async play(): Promise<void> {
    if (!this.isInitialized) {
      this.init();
    }

    if (!this.audioElement) {
      this.setupAudioElement();
    }

    if (!this.audioElement.src) {
      await this.loadAudioBuffer();
    }

    try {
      await this.audioElement.play();
      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange(true);
    } catch (err) {
      console.warn("Audio element play() failed:", err);
    }
  }

  public pause() {
    this.isPlaying = false;

    if (this.audioElement) {
      try { this.audioElement.pause(); } catch (e) {}
    }

    if (this.onStateChange) {
      this.onStateChange(false);
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number) {
    this.volume = val;
    if (this.audioElement) {
      this.audioElement.volume = val;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}
