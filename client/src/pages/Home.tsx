import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AudioButton } from "@/components/AudioButton";

interface AudioData {
  url: string;
  title: string;
  author: string;
}

export default function Home() {
  const [isIPhoneSE, setIsIPhoneSE] = useState(false);
  
  // Detect iPhone SE specifically
  useEffect(() => {
    const checkIfIPhoneSE = () => {
      // Check for iPhone in user agent
      const isIOS = /iPhone|iPod/.test(navigator.userAgent);
      
      // iPhone SE (1st and 2nd generation) have specific dimensions
      // 1st gen: 320 × 568, 2nd gen: 375 × 667
      const isSEDimensions = (
        (window.innerWidth === 320 && window.innerHeight === 568) || // 1st gen
        (window.innerWidth === 375 && window.innerHeight === 667)    // 2nd gen
      );
      
      // Alternative detection for iPhone SE size range
      const isSmallScreen = window.innerHeight < 700 && window.innerWidth < 400;
      
      // Normal detection for iPhone SE (without test mode)
      
      // For testing on non-iPhone devices 
      // Add ?iphonese=1 to URL to simulate iPhone SE
      const isTestMode = new URLSearchParams(window.location.search).get('iphonese') === '1';
      
      // Determine final result - either real device detection or test mode
      const finalResult = isTestMode || (isIOS && (isSEDimensions || isSmallScreen));
      
      if (isTestMode) {
        console.log('iPhone SE test mode activated');
      }
      
      // Log device detection information (helps with debugging)
      console.log('Device detection:', {
        userAgent: navigator.userAgent,
        height: window.innerHeight,
        width: window.innerWidth,
        isIOS,
        isSEDimensions,
        isSmallScreen,
        isTestMode,
        isIPhoneSE: finalResult
      });
      
      setIsIPhoneSE(finalResult);
    };
    
    // Initial check
    checkIfIPhoneSE();
    
    // Re-check on resize
    window.addEventListener('resize', checkIfIPhoneSE);
    
    return () => {
      window.removeEventListener('resize', checkIfIPhoneSE);
    };
  }, []);
  
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
        style={{ 
          marginTop: '45%', // Default positioning
          // iPhone SE specific adjustment (move button 25px higher)
          ...(isIPhoneSE ? { 
            transform: 'translateY(-25px)',
            marginTop: '40%' // Additional adjustment for iPhone SE
          } : {})
        }} // Adjust this value to center in the grey area
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
