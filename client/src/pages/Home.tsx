import { useQuery } from "@tanstack/react-query";
import { AudioButton } from "@/components/AudioButton";

interface AudioData {
  url: string;
  title: string;
  author: string;
}

export default function Home() {
  const {
    data: audioData,
    isLoading,
    error,
  } = useQuery<AudioData>({
    queryKey: ["/api/audio"],
  });

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center" 
      style={{ 
        backgroundImage: 'url(/assets/images/naples-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex items-center justify-center">
        <AudioButton 
          audioUrl={audioData?.url || null} 
          isLoading={isLoading} 
          error={error ? (error as Error).message : null} 
        />
      </div>
    </div>
  );
}
