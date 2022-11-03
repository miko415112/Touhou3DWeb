import { useRef, useFrame, Suspense } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Skybox, Ground } from '../components/environment';
import { Model } from '../components/resource';

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
      <Suspense>
        <Model position={[0, -5, 0]} scale={0.1} />
      </Suspense>
    </Canvas>
  );
}

export { GameScene };
