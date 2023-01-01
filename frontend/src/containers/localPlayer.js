import { Character } from '../components/character';
import { useControl } from './hooks/control';
import { useThree } from '@react-three/fiber';
import { useNetwork } from './hooks/network';
import { useState, useEffect, useRef } from 'react';
import { useUser } from './hooks/context';

export const LocalPlayer = () => {
  const { rigidState, fireState } = useControl();
  const { updatePlayer } = useNetwork();
  const { camera } = useThree();
  const { modelName, roomID, playerID } = useUser();
  const [healthPoints, setHealthPoints] = useState(3);
  const preUpdateTime = useRef(0);
  const curTime = useRef(0);
  const immune = useRef(false);

  camera.position.copy(rigidState.cameraPos);
  camera.rotation.setFromVector3(rigidState.cameraEuler);

  const handleCollision = () => {
    if (!immune.current) {
      setHealthPoints((prev) => prev - 1);
      immune.current = true;
      setTimeout(() => {
        immune.current = false;
      }, 3000);
    }
  };

  useEffect(() => {
    curTime.current = Date.now();
    if (curTime.current - preUpdateTime.current > 80) {
      updatePlayer(roomID, playerID, {
        rigidState,
        fireState,
        healthPoints,
        immune: immune.current,
      });
      preUpdateTime.current = Date.now();
    }
  }, [rigidState, fireState, healthPoints]);

  return (
    <>
      <Character
        modelName={modelName}
        position={rigidState?.modelPos}
        rotation={rigidState?.modelEuler}
        scale={0.1}
        mask={1}
        group={1}
        onCollideBegin={handleCollision}
        immune={immune.current}
      />
    </>
  );
};
