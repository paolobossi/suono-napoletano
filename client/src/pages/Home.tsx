import { useState, useEffect, useLayoutEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AudioButton } from "@/components/AudioButton";
// Import assets directly for reliable loading in production
import backgroundImage from "../assets/naples-background-new2.png";
import audioMp3 from "../assets/TarantellaNapoletana.mp3";
// iPhone SE styles will be imported dynamically when needed

interface AudioData {
  url: string;
  title: string;
  author: string;
}

export default function Home() {
  const [isIPhoneSE, setIsIPhoneSE] = useState(false);
  
  // Detect iPhone SE specifically - using useLayoutEffect for faster execution
  useLayoutEffect(() => {
    const checkIfIPhoneSE = () => {
      // TESTING ONLY: Uncomment to force iPhone SE mode on any device
      // return setIsIPhoneSE(true);
      
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
      
      // Explicit test mode from URL parameter
      const isTestMode = new URLSearchParams(window.location.search).get('iphonese') === '1';
      
      // Always treat actual iPhone SE dimensions as iPhone SE, regardless of userAgent
      const hasExactSEDimensions = 
        (window.innerWidth === 320 && window.innerHeight === 568) || // 1st gen exact match
        (window.innerWidth === 375 && window.innerHeight === 667);   // 2nd gen exact match
        
      // Determine final result - test mode, exact dimensions, or regular detection
      const finalResult = isTestMode || hasExactSEDimensions || (isIOS && (isSEDimensions || isSmallScreen));
      
      if (isTestMode) {
        console.log('iPhone SE test mode activated via URL parameter');
      }
      
      // Log device detection information (helps with debugging)
      console.log('Device detection:', {
        userAgent: navigator.userAgent,
        height: window.innerHeight,
        width: window.innerWidth,
        isIOS,
        isSEDimensions,
        hasExactSEDimensions,
        isSmallScreen,
        isTestMode,
        isIPhoneSE: finalResult
      });
      
      // Add a visible indicator in the console when iPhone SE mode is active
      if (finalResult) {
        console.log('%c 📱 iPhone SE mode active - button positioned higher', 'background: #04a0e0; color: white; padding: 4px; border-radius: 4px;');
        
        // Dynamically import iPhone SE specific CSS
        import('@/iphoneSE.css').catch(err => {
          console.error('Failed to load iPhone SE styles:', err);
        });
      }
      
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
  
  // We'll still make the API query for backward compatibility,
  // but we'll also directly use the imported audio file for deployment reliability
  const {
    data: audioData,
    isLoading: apiLoading,
    error: apiError,
  } = useQuery<AudioData>({
    queryKey: ["/api/audio"],
  });

  // Use local audio file for reliability in deployment
  const [localAudioReady, setLocalAudioReady] = useState(true);
  
  // Determine the audio URL to use - prefer imported file for reliability
  const audioUrlToUse = audioMp3;
  const isLoading = false; // We're using local import, so no loading state needed
  const error = null; // Using local import to avoid errors
  
  // Create dynamic classes based on device detection
  const buttonContainerClasses = `
    absolute inset-0 flex items-center justify-center
    ${isIPhoneSE ? 'iphone-se-position' : ''}
  `;

  return (
    <div className="full-viewport w-full overflow-hidden relative">
      {/* iPhone SE detection status indicator (for debugging) */}
      {process.env.NODE_ENV === 'development' && isIPhoneSE && (
        <div className="fixed top-0 left-0 bg-blue-500 text-white text-xs p-1 z-50">
          iPhone SE mode active
        </div>
      )}
      
      {/* Background Image - Using an img tag for better control */}
      <img 
        src={backgroundImage}
        alt="Naples Background"
        className="absolute inset-0"
        style={{ 
          objectFit: 'contain', // Maintain aspect ratio without stretching
          objectPosition: 'center',
          height: '100vh', // Use viewport height
          width: '100vw', // Use viewport width
          maxWidth: '100%',
          maxHeight: '100vh',
          margin: '0 auto', // Center horizontally
          display: 'block',
          backgroundColor: '#1E76A6' // Match the image background color
        }}
      />
      
      {/* Button Container - positioned to align with the grey area */}
      <div 
        className={buttonContainerClasses}
        style={{ 
          position: 'absolute',
          top: isIPhoneSE ? '65%' : '75%', // Lower for iPhone SE, 75% for other devices
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto'
        }}
      >
        <AudioButton 
          audioUrl={audioUrlToUse} 
          isLoading={isLoading} 
          error={error}
          isIPhoneSE={isIPhoneSE}
        />
      </div>
    </div>
  );
}
