import React from 'react';

// SVG of a typical Neapolitan style hat
const HatSvg: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    width="100%" 
    height="100%"
    style={{ maxWidth: '100%', maxHeight: '100%' }}
  >
    {/* Hat body - blue color to match Napoli theme */}
    <ellipse cx="50" cy="70" rx="40" ry="10" fill="#1E76A6" />
    <path d="M30 70 C30 50 70 50 70 70" fill="#1E76A6" stroke="#1E76A6" strokeWidth="1" />
    
    {/* Hat top */}
    <ellipse cx="50" cy="50" rx="20" ry="5" fill="#1E76A6" />
    
    {/* Hat band - red accent */}
    <path d="M30 70 C30 60 70 60 70 70" fill="none" stroke="#C0392B" strokeWidth="3" />
    
    {/* Small white "N" for Napoli */}
    <text x="47" y="65" fill="white" fontSize="12" fontWeight="bold">N</text>
  </svg>
);

interface HatBannerProps {
  className?: string;
}

export function HatBanner({ className }: HatBannerProps) {
  return (
    <div className={`${className || ''} fixed top-0 left-0 right-0 z-50`} style={{ padding: '16px 16px 0 16px' }}>
      <div className="bg-white w-full rounded shadow-md">
        <div className="flex items-center p-3">
          {/* Square hat image */}
          <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <HatSvg />
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