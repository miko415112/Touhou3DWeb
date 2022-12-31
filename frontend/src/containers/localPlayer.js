import { Character } from '../components/character';
import { useControl } from './hooks/control';
import { useThree } from '@react-three/fiber';
import { useNetwork } from './hooks/network';
import { useEffect, useRef } from 'react';
import { useUser } from './hooks/context';

export const LocalPlayer = () => {
  const { rigidState } = useControl();
  const { updatePlayer } = useNetwork();
  const { camera } = useThree();
  const { modelName, roomID, playerID } = useUser();
  const preUpdateTime = useRef(0);
  const curTime = useRef(0);

  camera.position.copy(rigidState.cameraPos);
  camera.rotation.setFromVector3(rigidState.cameraEuler);

  useEffect(() => {
    curTime.current = Date.now();
    if (curTime.current - preUpdateTime.current > 80) {
      updatePlayer(roomID, playerID, { rigidState });
      preUpdateTime.current = Date.now();
    }
  }, [rigidState]);

  return (
    <>
      <Character
        modelName={modelName}
        position={rigidState?.modelPos}
        rotation={rigidState?.modelEuler}
        scale={0.1}
      />
    </>
  );
};
