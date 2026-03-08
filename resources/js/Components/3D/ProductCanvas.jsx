// resources/js/Components/3D/ProductCanvas.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import HoodieModel from './HoodieModel';
import CrewneckModel from './CrewneckModel';
import CargoModel from './CargoModel';

export default function ProductCanvas({ modelType }) {

    const renderModel = () => {
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
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
            {/* Improved 3-point lighting */}
            <ambientLight intensity={0.4} />
            
            {/* Key light */}
            <spotLight 
                position={[10, 10, 10]} 
                angle={0.15} 
                penumbra={1} 
                intensity={1.2} 
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            {/* Fill light */}
            <spotLight
                position={[-8, 5, -5]}
                angle={0.3}
                penumbra={1}
                intensity={0.4}
                color="#f0f0ff"
            />

            {/* Rim light */}
            <pointLight
                position={[0, 5, -10]}
                intensity={0.3}
                color="#e0e0ff"
            />

            {/* HDR Environment lighting for realistic fabric reflections */}
            <Environment preset="city" />

            <Suspense fallback={null}>
                <Center>
                    {renderModel()}
                </Center>
                
                {/* Soft floor shadow */}
                <ContactShadows 
                    position={[0, -1.5, 0]} 
                    opacity={0.6} 
                    scale={10} 
                    blur={2.5} 
                    far={4} 
                />
            </Suspense>

            {/* Post-processing effects (v2 compatible with fiber v8) */}
            <EffectComposer>
                <Bloom
                    intensity={0.15}
                    luminanceThreshold={0.9}
                    luminanceSmoothing={0.4}
                    mipmapBlur
                />
                <Vignette
                    offset={0.3}
                    darkness={0.4}
                    eskil={false}
                />
            </EffectComposer>

            {/* User Interaction Controls */}
            <OrbitControls 
                enablePan={false}
                enableZoom={true}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
                minDistance={5}
                maxDistance={15}
            />
        </Canvas>
    );
}