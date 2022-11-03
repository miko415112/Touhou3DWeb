import { useRef, useFrame } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { BoxGeometry, Mesh, CubeTextureLoader } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { Skybox, Ground } from '../components/environment';

const FPV = () => {
  const { camera, gl } = useThree();
  return <PointerLockControls args={[camera, gl.domElement]} />;
};

function GameScene() {
  return (
    <Canvas>
      <Skybox />
      <Ground />
      <FPV />
    </Canvas>
  );
}

export { GameScene };
