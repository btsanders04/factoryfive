"use client";

import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { GLTF } from 'three-stdlib';
import { TaskSectionWithRelations } from "@/lib/types/tasks";
import { SectionIndicator } from "./SectionIndicator";

// Define a more flexible type for the GLTF result
type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Object3D };
  materials: { [key: string]: THREE.Material };
};


// Model component
interface ModelProps {
  taskSections: TaskSectionWithRelations[];
  selectedSection: number | null;
  setSelectedSection: (id: number | null) => void;
}


// Model component
export function Model({
  taskSections,
  selectedSection,
  setSelectedSection,
}: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes } = useGLTF(
    "3d_model_classic_cobra_1965_vr_ready_gltf/scene.gltf"
  ) as GLTFResult;

  
  // Calculate section progress
  const calculateSectionProgress = (section: TaskSectionWithRelations) => {
    if (!section.tasks || section.tasks.length === 0) return 0;
    const completedTasks = section.tasks.filter(task => task.isCompleted).length;
    return Math.round((completedTasks / section.tasks.length) * 100);
  };



  return (
    <group ref={group} dispose={null} position={[0, 0, 0]} scale={1.5}>
      {/* Render the model */}
      {nodes &&
        Object.keys(nodes).map((key) => {
          const node = nodes[key];
          // Check if the node is a mesh with geometry
          if (node.type === "Mesh" && (node as THREE.Mesh).geometry) {
            const mesh = node as THREE.Mesh;
            return (
              <mesh
                key={key}
                geometry={mesh.geometry}
                material={mesh.material}
                position={mesh.position}
                rotation={mesh.rotation}
                scale={mesh.scale}
              />
            );
          }
          return null;
        })}
          {/* Render section indicators */}
      {taskSections.map((section) => {
        // Skip sections with no tasks
        if (!section.tasks || section.tasks.length === 0) return null;
        
        
        const progress = calculateSectionProgress(section);
        
        return (
          <SectionIndicator
            key={section.id}
            position={section.position as [number, number, number]}
            name={section.name}
            progress={progress}
            isSelected={selectedSection === section.id}
            onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
          />
        );
      })}
    </group>
  );
}
