import { Canvas } from '@react-three/fiber';
import { Skybox, Ground } from '../components/environment';
import { LocalPlayer } from './player';
import { Physics } from '@react-three/cannon';
import { Synchronizer } from './synchronizer';

function GameScene() {
  return (
    <Canvas>
      <Skybox />
      <Ground />
      <Physics>
        <LocalPlayer modelName='Remilia' />
        <Synchronizer />
      </Physics>
    </Canvas>
  );
}

export { GameScene };
