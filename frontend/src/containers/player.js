import { Character } from '../components/character';
import { useControl } from './hooks/control';
import { useThree } from '@react-three/fiber';
import { updatePlayer } from './network';
import { useEffect, useRef } from 'react';

export const LocalPlayer = (modelName) => {
  const { rigidState } = useControl();
  const { camera } = useThree();
  const preUpdateTime = useRef(0);
  const curTime = useRef(0);
  const name = useRef(Date.now());

  camera.position.copy(rigidState.cameraPos);
  camera.rotation.setFromVector3(rigidState.cameraEuler);

  useEffect(() => {
    curTime.current = Date.now();
    if (curTime.current - preUpdateTime.current > 30) {
      updatePlayer(name, rigidState);
      preUpdateTime.current = Date.now();
    }
  }, [rigidState]);

  return (
    <>
      <Character
        modelName={modelName}
        position={rigidState.modelPos}
        rotation={rigidState.modelEuler}
        scale={0.1}
      />
    </>
  );
};
