import React from 'react';
import hatImage from '../assets/hat-napoli.png';

interface HatBannerProps {
  className?: string;
}

export function HatBanner({ className }: HatBannerProps) {
  // Check if desktop based on window width and store the window width
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [isDesktop, setIsDesktop] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsDesktop(width > 768);
    };
    
    // Check on mount
    checkScreenSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Calculate banner width: 32px less than window width on desktop
  const bannerWidth = isDesktop ? Math.min(windowWidth - 32, 400) : '100%';
  
  return (
    <div 
      className={`${className || ''} fixed top-0 left-0 right-0 z-50 flex justify-center`} 
      style={{ padding: '16px 16px 0 16px' }}
    >
      <div 
        className="bg-white rounded shadow-md" 
        style={{ 
          width: bannerWidth,
        }}
      >
        <div className="flex items-center p-3">
          {/* Square hat image */}
          <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <img 
              src={hatImage} 
              alt="Cappello Napoletano" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Text content */}
          <div className="ml-3">
            <h3 className="text-base font-bold text-gray-900">Cappello Napoletano</h3>
            <p className="text-sm text-gray-600">Compra il cappello</p>
          </div>
        </div>
      </div>
    </div>
  );
}