import { useState, useEffect, useRef } from 'react';
// Import audio directly for reliable loading in production
import audioFileUrl from '../assets/TarantellaNapoletana.mp3';

// Still accept URL as parameter for backward compatibility but prefer direct import
export function useAudio(url: string | null = null) {
  // Use the imported audio file if no URL is provided
  const actualUrl = url || audioFileUrl;
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Clean up previous audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    // Create new audio element with URL or imported file
    const audio = new Audio(actualUrl);
    
    // Log the source being used for debugging
    console.log("Setting audio source:", actualUrl);
    
    audio.addEventListener('error', (e) => {
      setError(new Error('Failed to load audio'));
      console.error('Audio loading error:', e);
    });
    
    // Add loaded event to confirm when audio is ready
    audio.addEventListener('canplaythrough', () => {
      console.log("Audio is ready to play");
    });
    
    audioRef.current = audio;

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [actualUrl]);

  const play = () => {
    if (!audioRef.current) return;
    
    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlaying(true);
          })
          .catch(err => {
            console.error('Audio play error:', err);
            setError(new Error('Failed to play audio'));
          });
      }
    } catch (err) {
      console.error('Audio play error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error playing audio'));
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    
    try {
      audioRef.current.pause();
      setPlaying(false);
    } catch (err) {
      console.error('Audio pause error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error pausing audio'));
    }
  };

  return { playing, error, play, pause };
}
