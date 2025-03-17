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
}

export function ModelView({ taskSections }: ModelViewProps) {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  const cameraRef = useRef<THREE.Camera | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

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
        camera={{ position: [-386, 99, 1], fov: 60 }}
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
            taskSections={taskSections}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
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
