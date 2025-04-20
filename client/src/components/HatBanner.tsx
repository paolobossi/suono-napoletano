import React, { useState, useEffect } from 'react';
import hatImage from '../assets/hat-napoli.png';

interface HatBannerProps {
  className?: string;
}

export function HatBanner({ className }: HatBannerProps) {
  // Check if desktop based on window width and store the window width
  const [windowWidth, setWindowWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsDesktop(width > 768);
    };
    
    // Check on mount
    checkScreenSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    // Show banner after 3 seconds
    const timer = setTimeout(() => {
      setShowBanner(true);
      console.log('Banner animation started');
    }, 3000); // 3 seconds
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(timer);
    };
  }, []);
  
  // Calculate banner width: 32px less than window width on desktop
  const bannerWidth = isDesktop ? Math.min(windowWidth - 32, 520) : '100%';
  
  return (
    <div 
      className={`${className || ''} fixed left-0 right-0 z-50 flex justify-center transition-all duration-700 ease-in-out`} 
      style={{ 
        padding: '10px 16px 0 16px',
        top: showBanner ? 0 : '-100px', // Inizia fuori dallo schermo
        opacity: showBanner ? 1 : 0,
        transform: showBanner ? 'translateY(0)' : 'translateY(-20px)',
      }}
    >
      <a 
        href="https://www.etsy.com/listing/1905697071/cappellino-ricamato-in-quale-citta"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded shadow-md block hover:shadow-lg transition-shadow duration-300" 
        style={{ 
          width: bannerWidth,
          textDecoration: 'none',
          cursor: 'pointer'
        }}
      >
        <div className="flex items-center p-2">
          {/* Hat image */}
          <div className="w-14 h-12 overflow-hidden flex-shrink-0">
            <img 
              src={hatImage} 
              alt="Cappello Napoletano" 
              className="w-full h-full object-contain"
              style={{ objectPosition: 'center' }}
            />
          </div>
          
          {/* Text content */}
          <div className="ml-2">
            <h3 className="text-sm font-bold text-gray-900">Cappello "In quale città?" 🧢</h3>
            <p className="text-xs text-gray-600">Un simbolo d'orgoglio, passione e identità.</p>
          </div>
        </div>
      </a>
    </div>
  );
}
