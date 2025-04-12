import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Volume2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize and preload audio
  useEffect(() => {
    if (audioUrl) {
      // Create new audio element
      const audio = new Audio();
      
      // Set up event listeners for preloading
      audio.addEventListener("canplaythrough", () => {
        setIsAudioReady(true);
        console.log("Audio is ready to play");
      });
      
      audio.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem loading the audio.",
        });
      });
      
      // Start preloading
      audio.preload = "auto";
      audio.src = audioUrl;
      audio.load();
      
      // Store reference
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        setIsAudioReady(false);
      }
    };
  }, [audioUrl, toast]);

  const startAudio = () => {
    if (!audioRef.current || !audioUrl) return;
    
    try {
      // Reset playback position
      audioRef.current.currentTime = 0;
      
      // Show the fan image immediately when starting playback
      setShowFanImage(true);
      
      // Play with better error handling
      const playPromise = audioRef.current.play();
      
      // Modern browsers return a promise from the play() method
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Failed to play audio:", err);
            
            // Hide fan image on error
            setShowFanImage(false);
            
            // Handle autoplay policy errors specifically (common first-click issue)
            if (err.name === 'NotAllowedError') {
              toast({
                title: "Autoplay blocked",
                description: "Please try clicking again to play the audio.",
                duration: 3000,
              });
            } else {
              toast({
                variant: "destructive",
                title: "Playback Error",
                description: "Could not play the audio. Please try again.",
                duration: 3000,
              });
            }
          });
      } else {
        // Older browsers or successful play with no promise
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error playing audio:", err);
      setIsPlaying(false);
      setShowFanImage(false);
    }
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    
    try {
      audioRef.current.pause();
      setIsPlaying(false);
      
      // Hide the fan image when stopping the audio
      setShowFanImage(false);
    } catch (err) {
      console.error("Error stopping audio:", err);
    }
  };

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
    if (!isAudioReady && audioUrl) {
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
    <div className="relative">
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
          src="/assets/napoli-fan.png" 
          alt="Napoli Fan"
          className={`${isIPhoneSE ? 'w-52' : 'w-64'} h-auto object-contain ${showFanImage ? 'animate-bounce-slow' : ''}`}
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
            display: 'block',
            // 20% larger on non-iPhone SE devices
            transform: isIPhoneSE ? 'none' : 'scale(1.2)',
          }}
        />
      </div>

      <Button
        variant="default"
        className={`w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full shadow-xl transform transition-all duration-150 flex items-center justify-center cursor-pointer select-none ${
          isPlaying ? "scale-95" : ""
        } ${
          error ? "bg-red-600 hover:bg-red-700" : "bg-[#04a0e0] hover:bg-[#038ecf]"
        }`}
        onMouseDown={startAudio}
        onTouchStart={startAudio}
        onMouseUp={stopAudio}
        onMouseLeave={stopAudio}
        onTouchEnd={stopAudio}
        disabled={isLoading || !!error || !audioUrl}
        aria-label="Press and hold to play audio"
        style={{
          boxShadow: isPlaying ? '0 0 20px rgba(4, 160, 224, 0.7)' : '0 0 15px rgba(4, 160, 224, 0.4)',
          border: '3px solid rgba(255, 255, 255, 0.4)',
          zIndex: 20 // Keep button above the fan image
        }}
      >
        {getButtonContent()}
      </Button>
    </div>
  );
}
