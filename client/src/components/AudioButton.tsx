import { useState, useRef, useEffect } from "react";
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
  const touchTimerRef = useRef<number | null>(null);
  
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

  // Initialize and preload audio with multiple fallback mechanisms
  useEffect(() => {
    // Create new audio element
    const audio = new Audio();
    
    // Set up event listeners for preloading
    audio.addEventListener("canplaythrough", () => {
      setIsAudioReady(true);
      console.log("Audio is ready to play");
    });
    
    // Special error handler with fallbacks
    audio.addEventListener("error", (e) => {
      console.error("Audio loading error:", e);
      const errorCode = (e.target as HTMLAudioElement).error?.code;
      const errorMsg = (e.target as HTMLAudioElement).error?.message;
      console.error("Audio error code:", errorCode);
      console.error("Audio error message:", errorMsg);
      
      // Try fallback approach for deployment
      console.log("Trying fallback audio source");
      
      // First fallback: try using /TarantellaNapoletana.mp3 from public folder
      const fallbackUrl = "/TarantellaNapoletana.mp3";
      
      // Create a new audio element for fallback
      const fallbackAudio = new Audio(fallbackUrl);
      
      fallbackAudio.addEventListener("canplaythrough", () => {
        console.log("Fallback audio loaded successfully");
        setIsAudioReady(true);
        // Replace the main audio reference
        audioRef.current = fallbackAudio;
      });
      
      fallbackAudio.addEventListener("error", (fallbackErr) => {
        console.error("Fallback audio also failed:", fallbackErr);
        // No toast notification, just log the error
      });
      
      // Attempt to load the fallback
      fallbackAudio.load();
    });
    
    // Log the primary source being used
    console.log("Using audio source from import:", audioFile);
    
    // Start preloading - Use imported audio file directly as primary source
    audio.preload = "auto";
    
    // Check if audioUrl is provided (from props) and use it if available
    if (audioUrl) {
      audio.src = audioUrl;
    } else {
      // Fallback to the imported audio file
      audio.src = audioFile;
    }
    
    audio.load();
    
    // Store reference
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        setIsAudioReady(false);
      }
    };
  }, [audioUrl]);

  // Function to handle starting audio playback
  const startAudio = () => {
    if (!audioRef.current) return;
    
    try {
      // Clear any existing touch timer
      if (touchTimerRef.current !== null) {
        window.clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
      
      // Prima aggiorna l'interfaccia per feedback immediato all'utente
      setIsPlaying(true);
      setShowFanImage(true);
      
      // Reset playback position
      audioRef.current.currentTime = 0;
      
      console.log("Attempting to play audio from import source:", audioFile);
      
      // Play with better error handling
      const playPromise = audioRef.current.play();
      
      // Modern browsers return a promise from the play() method
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            console.log("Audio playback started successfully");
            // Stato visivo già aggiornato per reattività dell'interfaccia
          })
          .catch(err => {
            console.error("Failed to play audio:", err);
            
            // Reset UI on error
            setIsPlaying(false);
            setShowFanImage(false);
            
            // Just log the error, no toast notification
            if (err.name === 'NotAllowedError') {
              console.warn("Autoplay blocked - please try clicking again");
            } else {
              console.error("Could not play the audio. Please try again.");
            }
          });
      } else {
        // Older browsers or successful play with no promise
        console.log("Audio playback initiated (older browser)");
        // Stato visivo già aggiornato per reattività dell'interfaccia
      }
    } catch (err) {
      console.error("Error playing audio:", err);
      // Reset UI on error
      setIsPlaying(false);
      setShowFanImage(false);
    }
  };

  // Function to handle stopping audio playback
  const stopAudio = () => {
    if (!audioRef.current) return;
    
    try {
      // Ensure any touch timer is cleared
      if (touchTimerRef.current !== null) {
        window.clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
      
      // Prima aggiorna l'interfaccia così è più reattiva
      setIsPlaying(false);
      setShowFanImage(false);
      
      // Poi ferma l'audio vero e proprio
      audioRef.current.pause();
      
      console.log("Audio playback stopped");
    } catch (err) {
      console.error("Error stopping audio:", err);
      // Assicurati che l'interfaccia sia aggiornata anche in caso di errore
      setIsPlaying(false);
      setShowFanImage(false);
    }
  };
  
  // Improved touch handling for mobile devices - massima reattività
  const handleTouchStart = (e: React.TouchEvent) => {
    // Previene qualsiasi propagazione che possa rallentare l'evento
    e.stopPropagation();
    
    // Aggiorna l'interfaccia IMMEDIATAMENTE per massima reattività
    setIsPlaying(true);
    setShowFanImage(true);
    
    // Ensure any lingering touch events are cleared
    if (touchTimerRef.current !== null) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    
    // Ottimizzazione: imposta subito il currentTime a 0 se l'audio element esiste
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    
    // Log per debug
    console.log('Touch start - IMMEDIATO aggiornamento UI');
    
    // Avvia l'audio con un timeout leggerissimo per dare priorità all'aggiornamento UI
    requestAnimationFrame(() => {
      startAudio();
    });
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Forza lo stato a false immediatamente in modo visivo
    setIsPlaying(false);
    setShowFanImage(false);
    
    // Aggiunge un log per debug
    console.log('Touch end - forcefully updating UI before stopping audio');
    
    // Use a small delay before stopping the actual audio to ensure it's properly registered
    // This helps overcome issues where touch events don't properly register release
    touchTimerRef.current = window.setTimeout(() => {
      // Ferma l'audio con un po' di ritardo ma l'UI è già aggiornata
      stopAudio();
      // Forza nuovamente lo stato a false per sicurezza
      setIsPlaying(false);
      touchTimerRef.current = null;
      console.log('Touch end - audio fully stopped after delay');
    }, 50); // Slightly longer delay to ensure it registers
  };
  
  // Handle touch cancel events (e.g., when notifications appear or scroll happens)
  const handleTouchCancel = (e: React.TouchEvent) => {
    // Forza lo stato a false immediatamente
    setIsPlaying(false);
    setShowFanImage(false);
    
    console.log('Touch cancel - forcefully updating UI');
    
    // Ensure audio stops if the touch interaction is interrupted
    if (touchTimerRef.current !== null) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    
    stopAudio();
    
    // Forza nuovamente lo stato a false per sicurezza
    setIsPlaying(false);
  };
  
  // Clean up any timers when component unmounts
  useEffect(() => {
    return () => {
      if (touchTimerRef.current !== null) {
        window.clearTimeout(touchTimerRef.current);
      }
    };
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
        onMouseDown={(e) => {
          // Previeni qualsiasi propagazione per massima reattività
          e.stopPropagation();
          
          // Aggiorna l'interfaccia IMMEDIATAMENTE
          setIsPlaying(true);
          setShowFanImage(true);
          
          // Ottimizzazione: imposta subito il currentTime a 0 se l'audio element esiste
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
          
          // Avvia l'audio con un frame delay per dare priorità all'aggiornamento UI
          requestAnimationFrame(() => {
            startAudio();
          });
        }}
        onMouseUp={stopAudio}
        onMouseLeave={stopAudio}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        disabled={isLoading || !!error}
        aria-label="Press and hold to play audio"
        style={{
          boxShadow: isPlaying ? '0 0 20px rgba(4, 160, 224, 0.7)' : '0 0 15px rgba(4, 160, 224, 0.4)',
          border: '3px solid rgba(255, 255, 255, 0.4)',
          zIndex: 20, // Keep button above the fan image
          WebkitTapHighlightColor: 'transparent', // Remove tap highlight on iOS
          WebkitTouchCallout: 'none', // Disable callout on long press
          WebkitUserSelect: 'none', // Disable text selection
          touchAction: 'manipulation' // Optimize for touch
        }}
      >
        {getButtonContent()}
      </Button>
    </div>
  );
}