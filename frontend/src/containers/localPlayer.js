import { Character } from '../components/character';
import { useControl } from './hooks/control';
import { useThree } from '@react-three/fiber';
import { useNetwork } from './hooks/network';
import { useState, useEffect, useRef } from 'react';
import { useUser } from './hooks/context';
import { Vector3 } from 'three';

const fireTimeGap = [80, 400, 300, 400];
const leaderPosConstrains = [new Vector3(-13, -3, -8), new Vector3(-3, 6, 8)];
const leaderSpawnPos = new Vector3(-5, 0, 0);
const othersPosConstrains = [new Vector3(3, -3, -8), new Vector3(13, 10, 8)];
const othersSpawnPos = new Vector3(5, 0, 0);

const validateFireTime = (fireTimeArray, isLeader, fireState) => {
  const validFireState = [];
  const curTime = Date.now();
  for (let i = 0; i < fireState.length; i++) {
    const shootIndex = parseInt(fireState[i].replace('shoot', ''));
    if (
      (isLeader || shootIndex === 0) &&
      curTime - fireTimeArray[shootIndex] > fireTimeGap[shootIndex]
    ) {
      validFireState.push(fireState[i]);
      fireTimeArray[shootIndex] = curTime;
    }
  }
  return validFireState;
};

export const LocalPlayer = () => {
  const { modelName, roomID, playerID, isLeader } = useUser();
  const spawnPos = isLeader ? leaderSpawnPos : othersSpawnPos;
  const posConstrains = isLeader ? leaderPosConstrains : othersPosConstrains;
  const { rigidState, fireState } = useControl(spawnPos, posConstrains);
  const { updatePlayer } = useNetwork();
  const { camera } = useThree();
  const [healthPoints, setHealthPoints] = useState(4);
  const preUpdateTime = useRef(0);
  const preFireTime = useRef([0, 0, 0, 0]);
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
    const curTime = Date.now();
    if (curTime - preUpdateTime.current > 80) {
      updatePlayer(roomID, playerID, {
        rigidState,
        fireState:
          healthPoints > 0
            ? validateFireTime(preFireTime.current, isLeader, fireState)
            : [],
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
        dead={healthPoints <= 0}
      />
    </>
  );
};
