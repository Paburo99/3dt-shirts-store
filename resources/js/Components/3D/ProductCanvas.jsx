// resources/js/Components/3D/ProductCanvas.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei';
import HoodieModel from './HoodieModel';
import CrewneckModel from './CrewneckModel';
import CargoModel from './CargoModel';

export default function ProductCanvas({ modelType }) {

    // Determine which model to render based on the prop
    const renderModel = () => {
        // You might need to adjust these strings based on exactly what 
        // string your database saves for the product name/type
        switch(modelType?.toLowerCase()) {
            case 'classic-3d-crewneck':
                return <CrewneckModel />;
            case 'cyberpunk-cargo-pants':
                return <CargoModel />;
            case 'essential-3d-hoodie':
                return <HoodieModel />;
            default:
                console.error(`Unknown model type: ${modelType}`);
                return null;
        }
    };

    return (
        <Canvas 
            shadows 
            camera={{ position: [0, 0, 10], fov: 45 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
        >
            {/* Soft global lighting */}
            <ambientLight intensity={0.5} />
            
            {/* Directional light to cast shadows */}
            <spotLight 
                position={[10, 10, 10]} 
                angle={0.15} 
                penumbra={1} 
                intensity={1} 
                castShadow 
            />

            {/* HDR Environment lighting for realistic fabric reflections */}
            <Environment preset="city" />

            <Suspense fallback={null}>
                {/* Center automatically centers the Blender model regardless of its origin */}
                <Center>
                    {renderModel()}
                </Center>
                
                {/* A beautiful soft shadow rendered strictly on the floor beneath the model */}
                <ContactShadows 
                    position={[0, -1.5, 0]} 
                    opacity={0.5} 
                    scale={10} 
                    blur={2} 
                    far={4} 
                />
            </Suspense>

            {/* User Interaction Controls */}
            <OrbitControls 
                enablePan={false}
                enableZoom={true}
                minPolarAngle={Math.PI / 4} // Prevent looking directly from bottom
                maxPolarAngle={Math.PI / 1.5} // Prevent looking directly from top
                minDistance={5} // Zoom in limit
                maxDistance={15} // Zoom out limit
            />
        </Canvas>
    );
}