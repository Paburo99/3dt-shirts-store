// resources/js/Components/3D/HoodieModel.jsx
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import * as THREE from 'three';

export default function HoodieModel(props) {
    // 1. Load the model from Laravel's public directory
    const { nodes } = useGLTF('/models/crewneck.glb');
    
    // 2. Subscribe ONLY to the color state from Zustand
    const selectedColor = useConfiguratorStore((state) => state.selectedColor);

    return (
        <group {...props} dispose={null} scale={0.8}>
            {/* 3. Dynamically map through the meshes in the GLB file */}
            {Object.values(nodes).map((node) => {
                if (node.isMesh) {
                    return (
                        <mesh
                            key={node.uuid}
                            castShadow
                            receiveShadow
                            geometry={node.geometry}
                        >
                            {/* Override the material with our dynamic Zustand color */}
                            <meshStandardMaterial 
                                color={new THREE.Color(selectedColor)} 
                                roughness={0.8} // Makes it look matte/fabric-like
                                metalness={0.1}
                            />
                        </mesh>
                    );
                }
                return null;
            })}
        </group>
    );
}

// Preload the model so there is no delay when the page loads
useGLTF.preload('/models/hoodie.glb');