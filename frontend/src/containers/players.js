import { Character } from '../components/character';
import { useNetwork } from './hooks/network';
import { Euler, Vector3 } from 'three';
import { useUser } from './hooks/context';
import { LocalPlayer } from './localPlayer';

export const Players = () => {
  const { playerList } = useNetwork();
  const { playerID } = useUser();

  return (
    <>
      <LocalPlayer />
      {playerList?.map((player, idx) => {
        if (!player.rigidState) return null;
        if (!player.rigidState.modelPos) return null;
        if (!player.rigidState.modelEuler) return null;
        if (player.playerID === playerID) return null;
        return (
          <Character
            key={playerID}
            modelName={player.modelName}
            position={new Vector3().copy(player.rigidState.modelPos)}
            rotation={new Euler().copy(player.rigidState.modelEuler)}
            scale={0.1}
            mask={0}
            group={0}
            onCollideBegin={() => {}}
          />
        );
      })}
    </>
  );
};
