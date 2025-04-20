import { useState, useEffect, useLayoutEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AudioButton } from "@/components/AudioButton";
import { HatBanner } from "@/components/HatBanner";
// Import assets directly for reliable loading in production
import backgroundImage from "../assets/naples-background-light.jpg";
import audioMp3 from "../assets/TarantellaNapoletana.mp3";
// iPhone SE styles will be imported dynamically when needed

interface AudioData {
  url: string;
  title: string;
  author: string;
}

export default function Home() {
  const [isIPhoneSE, setIsIPhoneSE] = useState(false);
  const [isSurfaceDuo, setIsSurfaceDuo] = useState(false);

  // Detect device types - using useLayoutEffect for faster execution
  useLayoutEffect(() => {
    const checkDeviceTypes = () => {
      // TESTING ONLY: Uncomment to force modes for testing
      // return setIsIPhoneSE(true);
      // return setIsSurfaceDuo(true);
      
      // Check for iPhone in user agent
      const isIOS = /iPhone|iPod/.test(navigator.userAgent);
      
      // iPhone SE (1st and 2nd generation) have specific dimensions
      // 1st gen: 320 × 568, 2nd gen: 375 × 667
      const isSEDimensions = (
        (window.innerWidth === 320 && window.innerHeight === 568) || // 1st gen
        (window.innerWidth === 375 && window.innerHeight === 667)    // 2nd gen
      );
      
      // Surface Duo has dimensions of 540 x 720 in single screen mode
      const isSurfaceDuoDimensions = 
        (window.innerWidth === 540 && window.innerHeight === 720) ||
        (window.innerHeight === 540 && window.innerWidth === 720);
      
      // Alternative detection for iPhone SE size range
      const isSmallScreen = window.innerHeight < 700 && window.innerWidth < 400;
      
      // Explicit test mode from URL parameters
      const isIPhoneSETestMode = new URLSearchParams(window.location.search).get('iphonese') === '1';
      const isSurfaceDuoTestMode = new URLSearchParams(window.location.search).get('surfaceduo') === '1';
      
      // Always treat actual iPhone SE dimensions as iPhone SE, regardless of userAgent
      const hasExactSEDimensions = 
        (window.innerWidth === 320 && window.innerHeight === 568) || // 1st gen exact match
        (window.innerWidth === 375 && window.innerHeight === 667);   // 2nd gen exact match
        
      // Determine final results
      const isPhoneSEResult = isIPhoneSETestMode || hasExactSEDimensions || (isIOS && (isSEDimensions || isSmallScreen));
      const isSurfaceDuoResult = isSurfaceDuoTestMode || isSurfaceDuoDimensions;
      
      if (isIPhoneSETestMode) {
        console.log('iPhone SE test mode activated via URL parameter');
      }
      
      if (isSurfaceDuoTestMode) {
        console.log('Surface Duo test mode activated via URL parameter');
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
        isSurfaceDuoDimensions,
        isIPhoneSETestMode,
        isSurfaceDuoTestMode,
        isIPhoneSE: isPhoneSEResult,
        isSurfaceDuo: isSurfaceDuoResult
      });
      
      // Add a visible indicator in the console for special device modes
      if (isPhoneSEResult) {
        console.log('%c 📱 iPhone SE mode active', 'background: #04a0e0; color: white; padding: 4px; border-radius: 4px;');
        
        // Dynamically import iPhone SE specific CSS
        import('@/iphoneSE.css').catch(err => {
          console.error('Failed to load iPhone SE styles:', err);
        });
      }
      
      if (isSurfaceDuoResult) {
        console.log('%c 📱 Surface Duo mode active', 'background: #7742f5; color: white; padding: 4px; border-radius: 4px;');
      }
      
      setIsIPhoneSE(isPhoneSEResult);
      setIsSurfaceDuo(isSurfaceDuoResult);
    };
    
    // Initial check
    checkDeviceTypes();
    
    // Re-check on resize
    window.addEventListener('resize', checkDeviceTypes);
    
    return () => {
      window.removeEventListener('resize', checkDeviceTypes);
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
  
  // Ensure the audio URL is correctly using the imported audio file
  console.log("Home component: Using audio file path:", audioMp3);
  const audioUrlToUse = audioMp3;
  const isLoading = false; // We're using local import, so no loading state needed
  const error = null; // Using local import to avoid errors
  
  // Create dynamic classes based on device detection
  const buttonContainerClasses = `
    flex items-center justify-center pointer-events-none w-full h-full mx-auto
  `;
  
  // Define button positioning with improved centering and vertical offset
  // Move button lower based on device type (special adjustments for Surface Duo)
  const buttonStyle = {
    position: 'absolute' as const, // Type assertion to fix TypeScript error
    left: '50%', // Position from the middle of the screen
    transform: 'translateX(-50%)', // Center the element itself
    top: 0,
    bottom: 0,
    // Center the button in the middle of the screen with vertical offset
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    width: '100%',
    height: '100%',
    // Different vertical offset based on device type
    // Increased vertical position for Surface Duo as requested (even lower)
    paddingTop: isSurfaceDuo ? '29.4vh' : '19.6vh', // Surface Duo gets an additional 9.8vh offset
  };

  return (
    <div className="full-viewport w-full overflow-hidden relative">
      {/* Hat Banner - positioned at the top */}
      <HatBanner />
      
      {/* Question mark button - positioned in bottom left corner */}
      <Link 
        href="/about" 
        className="fixed bottom-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-50 transition-all hover:scale-110"
        aria-label="About this app"
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          backgroundColor: '#04a0e0',
          color: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.4)'
        }}
      >
        ?
      </Link>
      
      {/* Device detection indicators (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {isIPhoneSE && (
            <div className="fixed top-0 left-0 bg-blue-500 text-white text-xs p-1 z-50">
              iPhone SE mode active
            </div>
          )}
          {isSurfaceDuo && (
            <div className="fixed top-0 left-0 bg-purple-500 text-white text-xs p-1 z-50">
              Surface Duo mode active
            </div>
          )}
        </>
      )}
      
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden background-container" style={{ background: 'linear-gradient(to bottom, #1f77a5, #9ac3b7)' }}>
        {/* Background Image with desktop width constraint */}
        <div 
          className="background-image w-full"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            maxWidth: '100%',
            margin: '0 auto',
          }}
        ></div>
      </div>
      
      {/* Button Container - positioned to align with the grey area */}
      <div 
        className={`${buttonContainerClasses} z-10 button-container`}
        style={buttonStyle}
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