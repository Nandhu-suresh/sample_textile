import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture } from '@react-three/drei';
import * as THREE from 'three';

const SilkMesh = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Gentle floating movement
        meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
        meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
        meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} scale={1.5}>
            <planeGeometry args={[10, 10, 64, 64]} />
            <MeshDistortMaterial
                color="#d4af37" // Gold/Accent color
                envMapIntensity={0.8}
                clearcoat={0.9}
                clearcoatRoughness={0.1}
                metalness={0.6}
                roughness={0.2}
                distort={0.3} // Strength of the distortion
                speed={1.5} // Speed of the animation
            >
                <GradientTexture
                    stops={[0, 0.5, 1]}
                    colors={['#d4af37', '#fadd7f', '#b8860b']}
                    size={1024}
                />
            </MeshDistortMaterial>
        </mesh>
    );
};

const SilkWave = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d4af37" />
                <SilkMesh />
            </Canvas>
        </div>
    );
};

export default SilkWave;
