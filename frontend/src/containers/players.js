import { Euler, Vector3 } from "three";

import { Character } from "../components/character";
import { network } from "./hooks/network";
import { useUser } from "./hooks/context";
import { LocalPlayer } from "./localPlayer";

/* display all players except myself */
export const Players = () => {
  /* user-defined hook */
  const { playerList } = network.useNetwork();
  const { profile } = useUser();

  return (
    <>
      <LocalPlayer />
      {playerList?.map((player, idx) => {
        if (!player.rigidState) return null;
        if (!player.rigidState.modelPos) return null;
        if (!player.rigidState.modelEuler) return null;
        if (player.email === profile.email) return null;
        return (
          <Character
            key={profile}
            modelName={player.modelName}
            position={new Vector3().copy(player.rigidState.modelPos)}
            rotation={new Euler().copy(player.rigidState.modelEuler)}
            scale={0.1}
            mask={0}
            group={0}
            onCollideBegin={() => {}}
            immune={player.immune}
            dead={player.healthPoints <= 0}
          />
        );
      })}
    </>
  );
};
