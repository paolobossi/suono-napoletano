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
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundImage: 'url(/assets/images/naples-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Button Container - positioned to align with the grey area */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ marginTop: '45%' }} // Adjust this value to center in the grey area
      >
        <AudioButton 
          audioUrl={audioData?.url || null} 
          isLoading={isLoading} 
          error={error ? (error as Error).message : null} 
        />
      </div>
    </div>
  );
}
