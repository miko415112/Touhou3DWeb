import { Character } from '../components/character';
import { subscribePlayerChange, unSubscribePlayerChange } from './network';
import { useEffect, useState } from 'react';
import { Euler, Vector3 } from 'three';

export const Synchronizer = () => {
  const [playerList, setPlayerList] = useState([]);

  const playerChangeListener = (playerList) => {
    setPlayerList(playerList);
  };

  useEffect(() => {
    subscribePlayerChange(playerChangeListener);
    return unSubscribePlayerChange(playerChangeListener);
  }, []);

  return (
    <>
      {playerList.length > 0
        ? playerList.map((player, idx) => {
            return (
              <Character
                key={idx}
                modelName={'Remilia'}
                position={new Vector3().copy(player.rigidState.modelPos)}
                rotation={new Euler().copy(player.rigidState.modelEuler)}
                scale={0.1}
              />
            );
          })
        : null}
    </>
  );
};
