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
        <Volume2 className="h-16 w-16 text-white" />
      </div>
    );
  };

  return (
    <Button
      variant="default"
      className={`w-52 h-52 md:w-60 md:h-60 rounded-full shadow-lg transform transition-all duration-150 flex items-center justify-center cursor-pointer select-none ${
        isPlaying ? "scale-95" : ""
      } ${
        error ? "bg-red-600 hover:bg-red-700" : "bg-[#1E88E5] hover:bg-[#1976D2]"
      }`}
      onMouseDown={startAudio}
      onTouchStart={startAudio}
      onMouseUp={stopAudio}
      onMouseLeave={stopAudio}
      onTouchEnd={stopAudio}
      disabled={isLoading || !!error || !audioUrl}
      aria-label="Press and hold to play audio"
    >
      {getButtonContent()}
    </Button>
  );
}
