import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Volume2, AlertCircle } from "lucide-react";
// Import assets directly for reliable loading in production
import fanImage from "../assets/napoli-fan.png";
import audioFile from "../assets/TarantellaNapoletana.mp3";

// Helper function to detect desktop devices
const isDesktopDevice = () => {
  // Check if viewport width is above typical tablet breakpoint (>= 1024px)
  return window.innerWidth >= 1024;
};

interface AudioButtonProps {
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isIPhoneSE?: boolean;
}

export function AudioButton({ audioUrl, isLoading, error, isIPhoneSE = false }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showFanImage, setShowFanImage] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Check for desktop device on mount and on resize
  useEffect(() => {
    // Set initial desktop state
    const initialDesktopState = isDesktopDevice();
    setIsDesktop(initialDesktopState);
    
    // Log desktop detection for debugging
    if (initialDesktopState) {
      console.log('%c 💻 Desktop mode active - fan image 280px width', 'background: #22c55e; color: white; padding: 4px; border-radius: 4px;');
    }
    
    // Update on window resize
    const handleResize = () => {
      const newDesktopState = isDesktopDevice();
      
      // Only log if there was a change in state
      if (newDesktopState !== isDesktop) {
        if (newDesktopState) {
          console.log('%c 💻 Desktop mode activated - fan image 280px width', 'background: #22c55e; color: white; padding: 4px; border-radius: 4px;');
        } else {
          console.log('%c 📱 Mobile mode activated - fan image ' + (isIPhoneSE ? '208px' : '256px') + ' width', 'background: #0ea5e9; color: white; padding: 4px; border-radius: 4px;');
        }
      }
      
      setIsDesktop(newDesktopState);
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDesktop, isIPhoneSE]); // Add isDesktop to dependencies for proper comparison in handleResize

  // ---------------------------------------------------------------------
  // Instant playback engine (Web Audio API)
  // The MP3 is fetched and decoded ONCE into memory. Each press creates a
  // lightweight buffer source that starts immediately, so there is no
  // network/decoding delay between pressing and hearing the music.
  // An <audio> element is kept only as a fallback while decoding finishes
  // or on browsers without Web Audio.
  // ---------------------------------------------------------------------
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const pressedRef = useRef(false);

  const getContext = useCallback((): AudioContext | null => {
    if (ctxRef.current) return ctxRef.current;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    try {
      ctxRef.current = new Ctx({ latencyHint: "interactive" });
    } catch {
      ctxRef.current = new Ctx();
    }
    return ctxRef.current;
  }, []);

  // Load + decode once, and prepare the fallback <audio> element
  useEffect(() => {
    let cancelled = false;
    const src = audioUrl || audioFile;

    // iOS 17+: play through the silent switch, like an <audio> element would
    try {
      const session = (navigator as any).audioSession;
      if (session) session.type = "playback";
    } catch {}

    const fallback = new Audio(src);
    fallback.preload = "auto";
    fallback.addEventListener("canplaythrough", () => setIsAudioReady(true), { once: true });
    audioRef.current = fallback;

    const ctx = getContext();
    if (ctx) {
      fetch(src)
        .then((r) => r.arrayBuffer())
        .then(
          (data) =>
            new Promise<AudioBuffer>((resolve, reject) =>
              // callback form for older Safari
              ctx.decodeAudioData(data, resolve, reject)
            )
        )
        .then((buffer) => {
          if (cancelled) return;
          bufferRef.current = buffer;
          setIsAudioReady(true);
        })
        .catch((err) => console.error("Web Audio decode failed, using <audio> fallback:", err));
    }

    // Unlock the audio context on the first interaction anywhere on the page
    // (iOS only unlocks audio inside a user gesture).
    const unlock = () => {
      const c = getContext();
      if (!c) return;
      if (c.state !== "running") c.resume().catch(() => {});
      // Play one silent sample: required by some iOS versions to fully unlock
      try {
        const silent = c.createBuffer(1, 1, 22050);
        const s = c.createBufferSource();
        s.buffer = silent;
        s.connect(c.destination);
        s.start(0);
      } catch {}
    };
    const unlockEvents = ["touchstart", "touchend", "pointerdown", "mousedown", "keydown"];
    unlockEvents.forEach((e) => document.addEventListener(e, unlock, { passive: true }));

    return () => {
      cancelled = true;
      unlockEvents.forEach((e) => document.removeEventListener(e, unlock));
      fallback.pause();
      audioRef.current = null;
    };
  }, [audioUrl, getContext]);

  const stopSound = useCallback(() => {
    const ctx = ctxRef.current;
    const source = sourceRef.current;
    const gain = gainRef.current;
    if (ctx && source && gain) {
      // 20ms fade-out avoids an audible click
      const now = ctx.currentTime;
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.02);
        source.stop(now + 0.025);
      } catch {
        try { source.stop(); } catch {}
      }
    }
    sourceRef.current = null;
    gainRef.current = null;
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const startSound = useCallback(() => {
    stopSound();
    const ctx = getContext();
    const buffer = bufferRef.current;

    if (ctx && buffer) {
      if (ctx.state !== "running") ctx.resume().catch(() => {});
      const gain = ctx.createGain();
      gain.gain.value = 1;
      gain.connect(ctx.destination);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(gain);
      source.onended = () => {
        if (sourceRef.current === source) {
          sourceRef.current = null;
          gainRef.current = null;
        }
      };
      source.start(0);
      sourceRef.current = source;
      gainRef.current = gain;
      return;
    }

    // Fallback while the buffer is still decoding
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.warn("Audio play blocked:", err));
    }
  }, [getContext, stopSound]);

  // Press / release handlers (Pointer Events cover mouse, touch and pen)
  const handlePress = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== undefined && e.button > 0) return; // ignore right/middle click
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    pressedRef.current = true;
    startSound(); // sound first, UI second
    setIsPlaying(true);
    setShowFanImage(true);
  };

  const handleRelease = () => {
    if (!pressedRef.current) return;
    pressedRef.current = false;
    stopSound();
    setIsPlaying(false);
    setShowFanImage(false);
  };

  // Stop when the page is hidden or closed; release the context on unmount
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") handleRelease();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", handleRelease);
    window.addEventListener("blur", handleRelease);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", handleRelease);
      window.removeEventListener("blur", handleRelease);
      stopSound();
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-white" />
        </div>
      );
    }
    
    // Show different loading state when audio is not yet ready
    if (!isAudioReady) {
      return (
        <div className="flex items-center justify-center">
          <div className="relative">
            <Volume2 className="h-16 w-16 text-white opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-transparent border-t-white animate-spin"></div>
            </div>
          </div>
        </div>
      );
    }

    if (isPlaying) {
      return (
        <div className="flex items-center justify-center">
          <div className="flex space-x-1 transform scale-60"> {/* Reduced by 40% */}
            <div className="w-3 h-12 bg-white animate-pulse rounded-full"></div>
            <div className="w-3 h-16 bg-white animate-pulse rounded-full" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-10 bg-white animate-pulse rounded-full" style={{ animationDelay: "0.4s" }}></div>
            <div className="w-3 h-14 bg-white animate-pulse rounded-full" style={{ animationDelay: "0.6s" }}></div>
            <div className="w-3 h-8 bg-white animate-pulse rounded-full" style={{ animationDelay: "0.8s" }}></div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center">
        <Volume2 className="h-18 w-18 text-white drop-shadow-md transform scale-140 transition-transform" />
      </div>
    );
  };

  return (
    <div className="relative flex justify-center items-center w-full">
      {/* Development mode indicators */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {isDesktop && (
            <div className="fixed top-0 right-0 bg-green-500 text-white text-xs p-1 z-50">
              Desktop mode active (fan 280px width)
            </div>
          )}
        </>
      )}
      
      {/* Fan image that slides in from bottom when button is pressed */}
      <div 
        className={`fixed w-full flex justify-center transition-all duration-500 ease-out pointer-events-none`}
        style={{ 
          zIndex: 10,
          bottom: showFanImage ? '-60px' : '-100%',  // Position 60px lower from bottom (110px - 50px)
          opacity: 1,
          width: '100vw',
          left: '50%',
          marginLeft: '-50vw',  // Center the element
          transition: 'bottom 0.5s cubic-bezier(0.17, 0.84, 0.44, 1)'
        }}
      >
        <img 
          src={fanImage} 
          alt="Napoli Fan"
          className={`h-auto object-contain ${showFanImage ? 'animate-bounce-slow' : ''}`}
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
            display: 'block',
            // Desktop: fixed 280px width
            // iPhone SE: smaller size (w-52 = 13rem = 208px)
            // Regular mobile: medium size (w-64 = 16rem = 256px)
            width: isDesktop 
              ? '280px' 
              : isIPhoneSE 
                ? '208px' // 13rem (w-52)
                : '256px', // 16rem (w-64)
          }}
        />
      </div>

      <Button
        ref={buttonRef}
        variant="default"
        className={`w-28 h-28 sm:w-28 sm:h-28 md:w-28 md:h-28 rounded-full shadow-xl transform transition-all duration-150 flex items-center justify-center cursor-pointer select-none pointer-events-auto ${
          isPlaying ? "scale-95" : ""
        } ${
          error ? "bg-red-600 hover:bg-red-700" : "bg-[#04a0e0] hover:bg-[#038ecf]"
        }`}
        onPointerDown={handlePress}
        onPointerUp={handleRelease}
        onPointerCancel={handleRelease}
        onLostPointerCapture={handleRelease}
        onContextMenu={(e) => e.preventDefault()}
        disabled={isLoading || !!error}
        aria-label="Press and hold to play audio"
        style={{
          boxShadow: isPlaying ? '0 0 20px rgba(4, 160, 224, 0.7)' : '0 0 15px rgba(4, 160, 224, 0.4)',
          border: '3px solid rgba(255, 255, 255, 0.4)',
          zIndex: 20, // Keep button above the fan image
          WebkitTapHighlightColor: 'transparent', // Remove tap highlight on iOS
          WebkitTouchCallout: 'none', // Disable callout on long press
          WebkitUserSelect: 'none', // Disable text selection
          touchAction: 'none' // No browser gestures/delay on the button
        }}
      >
        {getButtonContent()}
      </Button>
    </div>
  );
}