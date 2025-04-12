import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Volume2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioButtonProps {
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function AudioButton({ audioUrl, isLoading, error }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("error", () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem playing the audio.",
        });
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [audioUrl, toast]);

  const startAudio = () => {
    if (!audioRef.current || !audioUrl) return;
    
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.error("Failed to play audio:", err);
        toast({
          variant: "destructive",
          title: "Playback Error",
          description: "Could not play the audio. Please try again.",
        });
      });
      setIsPlaying(true);
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    
    try {
      audioRef.current.pause();
      setIsPlaying(false);
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

    if (isPlaying) {
      return (
        <div className="flex items-center justify-center">
          <div className="flex space-x-1">
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
        <Volume2 className="h-18 w-18 text-white drop-shadow-md" />
      </div>
    );
  };

  return (
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
        border: '3px solid rgba(255, 255, 255, 0.4)'
      }}
    >
      {getButtonContent()}
    </Button>
  );
}
