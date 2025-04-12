import { useState, useEffect, useRef } from 'react';

export function useAudio(url: string | null) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Clean up previous audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    // Create new audio element if we have a URL
    if (url) {
      const audio = new Audio(url);
      audio.addEventListener('error', (e) => {
        setError(new Error('Failed to load audio'));
        console.error('Audio loading error:', e);
      });
      audioRef.current = audio;
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [url]);

  const play = () => {
    if (!audioRef.current || !url) return;
    
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
