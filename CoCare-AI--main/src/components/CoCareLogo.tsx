
import React from 'react';

interface CoCareLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CoCareLogo: React.FC<CoCareLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-24 h-8',
    md: 'w-48 h-16', 
    lg: 'w-72 h-24',
    xl: 'w-96 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <svg
        viewBox="0 0 340 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Heart shape with proper curves */}
        <path
          d="M20 32C20 20 28 12 40 12C47 12 53 16 56 22C59 16 65 12 72 12C84 12 92 20 92 32C92 44 56 78 56 78S20 44 20 32Z"
          fill="#87CEEB"
        />
        
        {/* Puzzle piece cutout with flowing curves */}
        <path
          d="M40 30C40 28 42 26 44 26L50 26C52 24 54 24 56 26C58 28 58 30 56 32C58 34 58 36 56 38C54 40 52 40 50 38L44 38C42 40 40 40 38 38C36 36 36 34 38 32C36 30 36 28 38 26C40 24 42 24 44 26L44 30L50 30C52 28 54 28 56 30C58 32 58 34 56 36L50 36L44 36C42 38 40 38 38 36C36 34 36 32 38 30C36 28 36 26 38 24C40 22 42 22 44 24L44 30L40 30Z"
          fill="white"
        />
        
        {/* Simplified puzzle piece - flowing S curve */}
        <path
          d="M42 30C42 28 44 26 46 26L50 26C52 26 54 28 54 30C54 32 52 34 50 34C52 34 54 36 54 38C54 40 52 42 50 42L46 42C44 42 42 40 42 38C42 36 44 34 46 34C44 34 42 32 42 30Z"
          fill="white"
        />
        
        {/* CoCare text with proper typography */}
        <text
          x="110"
          y="40"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="36"
          fontWeight="500"
          fill="#87CEEB"
          dominantBaseline="central"
          letterSpacing="-0.02em"
        >
          CoCare
        </text>
      </svg>
    </div>
  );
};

export default CoCareLogo;
