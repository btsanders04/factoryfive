"use client";

import { Html } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { ThreeEvent } from "@react-three/fiber";

// Section indicator component
interface SectionIndicatorProps {
  position: [number, number, number];
  name: string;
  progress: number;
  isSelected: boolean;
  onClick: () => void;
  onPositionChange?: (newPosition: [number, number, number]) => void;
}

export function SectionIndicator({ 
  position, 
  name, 
  progress, 
  isSelected, 
  onClick, 
  onPositionChange 
}: SectionIndicatorProps) {
  // Scale the indicator based on completion percentage
  const scale = 0.2 + (progress / 100) * 0.1;
  const [hovered, setHovered] = useState(false);
  
  // Color based on progress
  const getColor = () => {
    if (progress >= 100) return "#4CAF50"; // Green
    if (progress >= 50) return "#FFC107";  // Yellow
    return "#F44336";  // Red
  };
  
  const color = getColor();
  
  // Refs for dragging
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const { camera, gl, mouse } = useThree();
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycaster = useRef(new THREE.Raycaster());
  const intersection = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3(...position));
  const initialPosition = useRef(new THREE.Vector3(...position));
  const mouseDownPosition = useRef(new THREE.Vector2());

  // Handle pointer over
  const handlePointerOver = () => {
    setHovered(true);
    gl.domElement.style.cursor = isSelected ? 'grab' : 'pointer';
  };

  // Handle pointer out
  const handlePointerOut = () => {
    setHovered(false);
    if (!isDragging.current) {
      gl.domElement.style.cursor = 'auto';
    }
  };

  // Handle click
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  // Handle drag start
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    
    if (!isSelected || !groupRef.current) return;
    
    isDragging.current = true;
    
    // Store initial positions
    initialPosition.current.copy(groupRef.current.position);
    mouseDownPosition.current.set(
      (e.nativeEvent.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.nativeEvent.clientY / gl.domElement.clientHeight) * 2 + 1
    );
    
    // Set up the plane at the object's position
    plane.current.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),
      groupRef.current.position
    );
    
    // Change cursor style
    gl.domElement.style.cursor = 'grabbing';
  };

  // Use frame to update position during drag
  useFrame(() => {
    if (isDragging.current && groupRef.current) {
      // Update raycaster with current mouse position
      raycaster.current.setFromCamera(mouse, camera);
      
      // Find intersection with the plane
      if (raycaster.current.ray.intersectPlane(plane.current, intersection.current)) {
        // Update target position, keeping Y coordinate fixed
        targetPosition.current.set(
          intersection.current.x,
          groupRef.current.position.y,
          intersection.current.z
        );
        
        // Smoothly move towards target position
        groupRef.current.position.lerp(targetPosition.current, 0.5);
      }
    }
  });

  // Handle pointer move
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    e.stopPropagation();
  };

  // Handle drag end
  const handlePointerUp = () => {
    if (isDragging.current && groupRef.current && onPositionChange) {
      // Only notify of position change if position actually changed
      if (!groupRef.current.position.equals(initialPosition.current)) {
        const newPosition: [number, number, number] = [
          groupRef.current.position.x,
          groupRef.current.position.y,
          groupRef.current.position.z
        ];
        
        onPositionChange(newPosition);
      }
    }
    
    isDragging.current = false;
    gl.domElement.style.cursor = hovered ? (isSelected ? 'grab' : 'pointer') : 'auto';
  };

  // Set up and clean up event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleGlobalPointerUp = () => {
      if (isDragging.current) {
        handlePointerUp();
      }
    };
    
    canvas.addEventListener('pointerup', handleGlobalPointerUp);
    canvas.addEventListener('pointerleave', handleGlobalPointerUp);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    
    return () => {
      canvas.removeEventListener('pointerup', handleGlobalPointerUp);
      canvas.removeEventListener('pointerleave', handleGlobalPointerUp);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [gl]);

  // Update position ref when position prop changes
  useEffect(() => {
    targetPosition.current.set(...position);
    initialPosition.current.set(...position);
  }, [position]);

  // Update cursor style based on selection and hover state
  useEffect(() => {
    if (isDragging.current) {
      gl.domElement.style.cursor = 'grabbing';
    } else if (isSelected && hovered) {
      gl.domElement.style.cursor = 'grab';
    } else if (hovered) {
      gl.domElement.style.cursor = 'pointer';
    } else {
      gl.domElement.style.cursor = 'auto';
    }
    
    return () => {
      gl.domElement.style.cursor = 'auto';
    };
  }, [isSelected, hovered, gl]);
  
  return (
    <group 
      ref={groupRef}
      position={position}
    >
      {/* Invisible sphere to increase clickable area */}
      <mesh 
        visible={false}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <Html distanceFactor={200} position={[0, scale + 0.5, 0]} center>
        <div 
          className={`${isSelected ? 'bg-blue-500/90' : hovered ? 'bg-blue-400/80' : 'bg-black/80'} 
                     backdrop-blur-sm px-3 py-2 rounded text-sm font-medium shadow-md 
                     transition-all duration-200 cursor-pointer
                     ${isSelected ? 'scale-110' : hovered ? 'scale-105' : 'scale-100'}`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
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
          {isSelected && <div className="text-xs mt-1 text-center italic">Drag to reposition</div>}
        </div>
      </Html>
    </group>
  );
}