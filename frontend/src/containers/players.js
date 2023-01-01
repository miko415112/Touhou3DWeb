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
      {playerList?.map((player, idx) =>
        player.playerID !== playerID ? (
          <Character
            key={playerID}
            modelName={player.modelName}
            position={new Vector3().copy(
              player.rigidState?.modelPos
                ? player.rigidState.modelPos
                : [0, 0, 0]
            )}
            rotation={new Euler().copy(
              player.rigidState?.modelEuler
                ? player.rigidState.modelEuler
                : [0, 0, 0]
            )}
            scale={0.1}
          />
        ) : null
      )}
    </>
  );
};
