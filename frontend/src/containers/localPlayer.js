import { Character } from '../components/character';
import { useControl } from './hooks/control';
import { useThree } from '@react-three/fiber';
import { useNetwork } from './hooks/network';
import { useState, useEffect, useRef } from 'react';
import { useUser } from './hooks/context';
import { Vector3 } from 'three';
import {
  deadAudio,
  shoot0Audio,
  shoot1Audio,
  shoot2Audio,
  shoot3Audio,
} from '../components/resource';

const fireTimeGap = [120, 1800, 2200, 1800];
const leaderPosConstrains = [new Vector3(-13, 0, -6), new Vector3(-3, 4.5, 6)];
const leaderSpawnPos = new Vector3(-5, 1, 0);
const othersPosConstrains = [new Vector3(3, 0, -6), new Vector3(13, 4.5, 6)];
const othersSpawnPos = new Vector3(5, 1, 0);

const validateFireState = (
  fireTimeArray,
  isLeader,
  healthPoints,
  fireState
) => {
  const validFireState = [];
  if (healthPoints > 0) {
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
    if (healthPoints == 0) deadAudio.play();
  }, [healthPoints]);

  const handleAudio = (validFireState) => {
    for (let i = 0; i < validFireState.length; i++) {
      switch (validFireState[i]) {
        case 'shoot0':
          shoot0Audio.play();
          break;
        case 'shoot1':
          shoot1Audio.play();
          break;
        case 'shoot2':
          shoot2Audio.play();
          break;
        case 'shoot3':
          shoot3Audio.play();
          break;
      }
    }
  };

  useEffect(() => {
    const curTime = Date.now();
    if (curTime - preUpdateTime.current > 80) {
      const validFireState = validateFireState(
        preFireTime.current,
        isLeader,
        healthPoints,
        fireState
      );
      updatePlayer(roomID, playerID, {
        rigidState,
        fireState: validFireState,
        healthPoints,
        immune: immune.current,
      });
      preUpdateTime.current = Date.now();
      handleAudio(validFireState);
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
