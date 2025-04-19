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

  // Initialize audio without autoplay
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata"; // Only preload metadata, not full audio
    
    // Set up event listeners for preloading
    audio.addEventListener("loadeddata", () => {
      setIsAudioReady(true);
      console.log("Audio data loaded");
      // Don't pre-buffer, just prepare the audio
      audio.volume = 1;
      audio.currentTime = 0;
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

  // Function to handle stopping audio playback - versione migliorata
  const stopAudio = () => {
    try {
      console.log("Stopping audio - gentle desktop / hard mobile method");
      
      // Ensure any touch timer is cleared
      if (touchTimerRef.current !== null) {
        window.clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
      
      // 1. Prima aggiorna l'interfaccia così è più reattiva
      setIsPlaying(false);
      setShowFanImage(false);
      
      // 2. Poi ferma effettivamente l'audio se esiste
      if (audioRef.current) {
        // Ferma l'audio sempre
        audioRef.current.pause();
        
        // Desktop vs Mobile handling: su mobile riportiamo a zero, su desktop no
        // Questo permette di riavviare l'audio su desktop senza problemi
        if (!isDesktop) {
          // Solo su mobile: reset completo per evitare problemi di stato
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 0;
          
          // Ripristina il volume dopo un breve delay
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.volume = 1;
            }
          }, 100);
        }
        
        console.log("Audio playback stopped - " + (isDesktop ? "desktop gentle stop" : "mobile complete reset"));
      }
    } catch (err) {
      console.error("Error stopping audio:", err);
      
      // Assicurati che l'interfaccia sia aggiornata anche in caso di errore
      setIsPlaying(false);
      setShowFanImage(false);
      
      // Tentativo di arresto più drastico in caso di errore
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          // Resetta solo su mobile
          if (!isDesktop) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0;
            setTimeout(() => {
              if (audioRef.current) audioRef.current.volume = 1;
            }, 100);
          }
        }
      } catch (e) {
        console.error("Critical error stopping audio:", e);
      }
    }
  };
  
  // Improved touch handling for mobile devices - massima reattività
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent default touch behavior
    
    // Update UI state synchronously
    setIsPlaying(true);
    setShowFanImage(true);
    
    // Clear existing timers
    if (touchTimerRef.current !== null) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    
    // Start audio playback synchronously with touch
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Prevenzione immediata della propagazione
    e.stopPropagation();
    e.preventDefault();
    
    // Aggiorna immediatamente l'UI per feedback istantaneo
    setIsPlaying(false);
    setShowFanImage(false);
    
    console.log('Touch end - RESET IMMEDIATO UI');
    
    // 1. Prima chiamata immediata per fermare l'audio
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.volume = 0; // Azzera il volume immediatamente
      } catch (err) {
        console.error("Immediate pause failed:", err);
      }
    }
    
    // 2. Poi chiamata a stopAudio che fa un reset completo
    stopAudio();
    
    // 3. Terzo tentativo di fermata con un delay, come ulteriore sicurezza
    touchTimerRef.current = window.setTimeout(() => {
      try {
        // Un ulteriore tentativo di fermare l'audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 1; // Ripristina il volume per la prossima riproduzione
        }
        
        // Forza nuovamente lo stato a false per sicurezza
        setIsPlaying(false);
        console.log('Touch end - FINAL BACKUP STOP executed');
      } catch (err) {
        console.error("Delayed stop also failed:", err);
      } finally {
        touchTimerRef.current = null;
      }
    }, 100);
  };
  
  // Handle touch cancel events (e.g., when notifications appear or scroll happens)
  const handleTouchCancel = (e: React.TouchEvent) => {
    // Prevenzione immediata della propagazione
    e.stopPropagation();
    
    // Aggiorna l'UI immediatamente
    setIsPlaying(false);
    setShowFanImage(false);
    
    console.log('Touch cancel - EMERGENCY STOP triggered');
    
    // Cancella qualsiasi timer pendente
    if (touchTimerRef.current !== null) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    
    // 1. Primo tentativo immediato di arresto
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.volume = 0;
      } catch (err) {
        console.error("Immediate pause on cancel failed:", err);
      }
    }
    
    // 2. Arresto completo tramite stopAudio
    stopAudio();
    
    // 3. Backup finale con piccolo delay
    touchTimerRef.current = window.setTimeout(() => {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 1;
        }
        setIsPlaying(false);
        console.log('Touch cancel - FINAL BACKUP STOP executed');
      } catch (e) {
        console.error("Final backup stop failed:", e);
      } finally {
        touchTimerRef.current = null;
      }
    }, 200);
    
    // Forza nuovamente lo stato a false per sicurezza assoluta
    setIsPlaying(false);
  };
  
  // Metodo di emergenza per fermare immediatamente la riproduzione audio
  const emergencyStop = useCallback(() => {
    console.log("🚨 EMERGENCY AUDIO STOP TRIGGERED 🚨" + (isDesktop ? " (gentle desktop mode)" : " (hard mobile mode)"));
    
    try {
      // 1. Prima aggiorna l'interfaccia
      setIsPlaying(false);
      setShowFanImage(false);
      
      // 2. Cancella eventuali timer
      if (touchTimerRef.current) {
        window.clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
      
      // 3. Ferma l'audio in tutti i modi possibili
      if (audioRef.current) {
        // Pausa sempre
        audioRef.current.pause();
        
        // Su desktop, reset più leggero per permettere riproduzioni multiple
        if (isDesktop) {
          // Versione desktop - solo pausa senza reset della posizione
          // Non abbassa il volume e non resetta il currentTime
        } else {
          // Versione mobile - reset completo per evitare problemi
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 0;
          
          // Ripristina il volume dopo un breve delay
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.volume = 1;
            }
          }, 500);
        }
      }
    } catch (err) {
      console.error("Even emergency stop failed:", err);
      
      // Ultima risorsa
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } catch (e) {
        console.error("Final emergency attempt failed:", e);
      }
    }
  }, [isDesktop]);
  
  // Cleanup, safety net e monitoraggio dello stato della pagina
  useEffect(() => {
    // Verifica all'avvio che l'audio sia effettivamente fermato
    emergencyStop();
    
    // Ascolta per eventi di visibilitychange del documento (quando l'utente cambia tab o minimizza)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Se l'utente cambia tab o minimizza, ferma la riproduzione
        emergencyStop();
      }
    };
    
    // Aggiungi event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Ascolta per gli eventi di beforeunload (quando l'utente chiude la pagina)
    const handleBeforeUnload = () => {
      emergencyStop();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      // Rimuovi gli event listener
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Cancella eventuali timer pendenti
      if (touchTimerRef.current !== null) {
        window.clearTimeout(touchTimerRef.current);
      }
      
      // Cleanup e ferma qualsiasi riproduzione audio quando il componente viene smontato
      emergencyStop();
      console.log("Cleaned up audio and event listeners on unmount");
    };
  }, [emergencyStop]);

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