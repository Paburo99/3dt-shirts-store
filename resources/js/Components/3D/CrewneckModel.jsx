import React from 'react';
import { useGLTF } from '@react-three/drei';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import * as THREE from 'three';

export default function CrewneckModel(props) {
    const { nodes } = useGLTF('/models/crewneck.glb');
    const selectedColor = useConfiguratorStore((state) => state.selectedColor);

    return (
        <group {...props} dispose={null} scale={0.8}>
            {Object.values(nodes).map((node) => {
                if (node.isMesh) {
                    return (
                        <mesh
                            key={node.uuid}
                            castShadow
                            receiveShadow
                            geometry={node.geometry}
                        >
                            <meshStandardMaterial 
                                color={new THREE.Color(selectedColor)} 
                                roughness={0.8}
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

useGLTF.preload('/models/crewneck.glb');