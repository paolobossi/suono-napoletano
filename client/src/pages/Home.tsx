import { useQuery } from "@tanstack/react-query";
import { AudioButton } from "@/components/AudioButton";
import { Card } from "@/components/ui/card";

export default function Home() {
  const {
    data: audioUrl,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/youtube/audio"],
  });

  return (
    <div className="bg-[#F5F5F5] min-h-screen font-sans text-[#333333] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-medium mb-2">YouTube Audio Player</h1>

        <AudioButton 
          audioUrl={audioUrl?.url} 
          isLoading={isLoading} 
          error={error ? (error as Error).message : null} 
        />

        <div className="h-8 text-center text-base opacity-75">
          {isLoading 
            ? "Loading audio..." 
            : error 
              ? "Error loading audio. Please try again later." 
              : "Click and hold the button to play audio"}
        </div>

        <Card className="p-4 mt-4 text-center text-sm opacity-60 w-full">
          <p>Audio source: "Dreams" by Joakim Karud</p>
          <p>From YouTube: https://youtu.be/gtMxyavOm_Q</p>
        </Card>
      </div>
    </div>
  );
}
