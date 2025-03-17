"use client";

import { Html } from "@react-three/drei";

// Section indicator component
interface SectionIndicatorProps {
  position: [number, number, number];
  name: string;
  progress: number;
  isSelected: boolean;
  onClick: () => void;
}

export function SectionIndicator({ position, name, progress, isSelected, onClick }: SectionIndicatorProps) {
  // Scale the indicator based on completion percentage
  const scale = 0.2 + (progress / 100) * 0.1;
  
  // Color based on progress
  const getColor = () => {
    if (progress >= 100) return "#4CAF50"; // Green
    if (progress >= 50) return "#FFC107";  // Yellow
    return "#F44336";  // Red
  };
  
  const color = getColor();
  
  return (
    <group position={position} onClick={onClick}>
      <Html distanceFactor={200} position={[0, scale + 0.5, 0]} center>
        <div className={`${isSelected ? 'bg-blue-500/90' : 'bg-black/80'} backdrop-blur-sm px-3 py-2 rounded text-sm font-medium shadow-md transition-all duration-200 ${isSelected ? 'scale-110' : 'scale-100'}`}>
          {name}
          <div className="mt-4 w-0 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${progress}%`,
                backgroundColor: color
              }}
            />
          </div>
          <div className="text-xs mt-1 text-center">{progress}%</div>
        </div>
      </Html>
    </group>
  );
}