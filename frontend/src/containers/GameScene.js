import { useRef, useFrame, Suspense } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { Skybox, Ground } from '../components/environment';
import { Player } from '../components/player';
import { Control } from '../components/control';
import { Physics } from '@react-three/cannon';

function GameScene() {
  return (
    <Canvas>
      <Skybox />
      <Ground />
      <Physics>
        <Control />
      </Physics>
    </Canvas>
  );
}

export { GameScene };
