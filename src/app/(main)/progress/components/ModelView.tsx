"use client";

import { useRef, Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import React from "react";
import { Model } from "./Model";
import { TaskSectionWithRelations } from "@/lib/types/tasks";

interface ModelViewProps {
  taskSections: TaskSectionWithRelations[];
  onTaskSectionsUpdate?: (updatedSections: TaskSectionWithRelations[]) => void;
}

export function ModelView({ taskSections, onTaskSectionsUpdate }: ModelViewProps) {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [localTaskSections, setLocalTaskSections] = useState<TaskSectionWithRelations[]>(taskSections);

  const cameraRef = useRef<THREE.Camera | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  // Update local state when props change
  React.useEffect(() => {
    setLocalTaskSections(taskSections);
  }, [taskSections]);

  // Function to log camera position
  const logCameraPosition = () => {
    if (cameraRef.current) {
      console.log("Camera position:", {
        x: cameraRef.current.position.x,
        y: cameraRef.current.position.y,
        z: cameraRef.current.position.z,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetView = () => {
    if (
      controlsRef.current &&
      typeof controlsRef.current.reset === "function"
    ) {
      controlsRef.current.reset();
    }
  };

  // Handle section position change
  const handleSectionPositionChange = async (sectionId: number, newPosition: [number, number, number]) => {
    // Update local state first for immediate UI feedback
    const updatedSections = localTaskSections.map(section => 
      section.id === sectionId 
        ? { ...section, position: newPosition } 
        : section
    );
    
    setLocalTaskSections(updatedSections);
    
    // Notify parent component if callback exists
    if (onTaskSectionsUpdate) {
      onTaskSectionsUpdate(updatedSections);
    }
    
    // Note: We need to implement a proper updateTaskSection function in the data/task.ts file
    // For now, we'll just update the local state and log the change
    console.log(`Position updated for section ${sectionId}:`, newPosition);
    console.log("Note: Database update not implemented yet - need to add updateTaskSection function");
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute bottom-4 left-4 z-10">
        <button
          onClick={logCameraPosition}
          className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium hover:bg-white transition-colors"
        >
          Log Camera Position
        </button>
      </div>

      <Canvas
        shadows
        camera={{ position: [338, 205, 12], fov: 60 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
          camera.lookAt(0, 0, 0);
          console.log("Camera created at position:", {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
          });
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Model
            taskSections={localTaskSections}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            onSectionPositionChange={handleSectionPositionChange}
          />
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={400}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
            onChange={logCameraPosition}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
