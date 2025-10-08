import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Cube3DProps {
  cubeState: {
    faces: {
      front: string[];
      back: string[];
      left: string[];
      right: string[];
      up: string[];
      down: string[];
    };
  };
  onCubeUpdate: (newState: any) => void;
}

interface CubieProps {
  position: [number, number, number];
  colors: {
    front: string;
    back: string;
    left: string;
    right: string;
    top: string;
    bottom: string;
  };
}

const Cubie: React.FC<CubieProps> = ({ position, colors }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial color={colors.front} />
    </mesh>
  );
};

const Cube3D: React.FC<Cube3DProps> = ({ cubeState, onCubeUpdate }) => {
  const [isRotating, setIsRotating] = useState(false);

  const getCubieColors = (x: number, y: number, z: number) => {
    const { faces } = cubeState;
    
    return {
      front: faces.front[4] || '#ff0000',
      back: faces.back[4] || '#ff8800',
      left: faces.left[4] || '#00ff00',
      right: faces.right[4] || '#0000ff',
      top: faces.up[4] || '#ffffff',
      bottom: faces.down[4] || '#ffff00'
    };
  };

  const generateCubies = () => {
    const cubies = [];
    const positions = [
      [-1, -1, -1], [0, -1, -1], [1, -1, -1],
      [-1, 0, -1], [0, 0, -1], [1, 0, -1],
      [-1, 1, -1], [0, 1, -1], [1, 1, -1],
      [-1, -1, 0], [0, -1, 0], [1, -1, 0],
      [-1, 0, 0], [0, 0, 0], [1, 0, 0],
      [-1, 1, 0], [0, 1, 0], [1, 1, 0],
      [-1, -1, 1], [0, -1, 1], [1, -1, 1],
      [-1, 0, 1], [0, 0, 1], [1, 0, 1],
      [-1, 1, 1], [0, 1, 1], [1, 1, 1]
    ];

    positions.forEach((pos, index) => {
      const [x, y, z] = pos;
      cubies.push(
        <Cubie
          key={index}
          position={[x, y, z] as [number, number, number]}
          colors={getCubieColors(x, y, z)}
        />
      );
    });

    return cubies;
  };

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} />
        
        {generateCubies()}
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default Cube3D;
