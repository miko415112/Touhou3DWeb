import { Character } from '../components/character';
import { useNetwork } from './hooks/network';
import { Euler, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useUser } from './hooks/context';
import { useEffect, useRef } from 'react';
import { LocalPlayer } from './localPlayer';

export const Players = () => {
  const { playerList } = useNetwork();
  const prevPlayerList = useRef();
  const curPlayerList = useRef();
  const { playerID } = useUser();

  useEffect(() => {
    prevPlayerList.current = curPlayerList.current;
    curPlayerList.current = playerList;
  }, [playerList]);

  //lerp
  useFrame(() => {
    if (!prevPlayerList.current) return;
    if (!prevPlayerList.current[0].rigidState) return;
    if (typeof prevPlayerList.current[0].rigidState.modelPos !== Vector3)
      return;

    for (let i = 0; i < playerList.length; i++) {
      //convert array to Vector3
      curPlayerList.current[i].rigidState.modelPos = new Vector3().copy(
        curPlayerList.current[i].rigidState.modelPos
      );

      //convert array to Euler
      curPlayerList.current[i].rigidState.modelEuler = new Euler().copy(
        curPlayerList.current[i].rigidState.modelEuler
      );

      //lerp
      prevPlayerList.current[i].rigidState.modelPos.lerp(
        curPlayerList.current[i].rigidState.modelPos,
        0.25
      );
    }
  });

  return (
    <>
      <LocalPlayer />
      {prevPlayerList.current?.map((player, idx) => {
        return player.playerID !== playerID ? (
          <Character
            key={idx}
            modelName={player.modelName}
            position={player.rigidState?.modelPos}
            rotation={player.rigidState?.modelEuler}
            scale={0.1}
          />
        ) : null;
      })}
    </>
  );
};
