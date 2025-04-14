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
      style={{ padding: '10px 16px 0 16px' }}
    >
      <div 
        className="bg-white rounded shadow-md" 
        style={{ 
          width: bannerWidth,
        }}
      >
        <div className="flex items-center p-2">
          {/* Square hat image - ridotta da 14 a 12 */}
          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
            <img 
              src={hatImage} 
              alt="Cappello Napoletano" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Text content */}
          <div className="ml-2">
            <h3 className="text-sm font-bold text-gray-900">Compra il cappello ›</h3>
            <p className="text-xs text-gray-600">Un simbolo d'orgoglio, passione e identità.</p>
          </div>
        </div>
      </div>
    </div>
  );
}