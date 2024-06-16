import { Euler, Vector3 } from "three";
import { Character } from "../components/character";
import { LocalPlayer } from "./localPlayer";
import { useDispatch, useSelector } from "react-redux";

/* display all players except myself */
export const Players = () => {
  /* user-defined hook */
  const profile = useSelector((state) => state.account.profile);
  const players = useSelector((state) => state.game.players);
  const others = players?.filter(
    (player) => player.email != profile.email && player.modelPos
  );

  return (
    <>
      <LocalPlayer />
      {others?.map((player, idx) => {
        console.log(others);
        const { email, modelName, modelPos, modelEuler, immune, healthPoints } =
          player;

        return (
          <Character
            key={email}
            modelName={modelName}
            position={new Vector3().copy(modelPos)}
            rotation={new Euler().copy(modelEuler)}
            scale={0.1}
            mask={1 | 4}
            group={2}
            onCollideBegin={() => {}}
            immune={immune}
            dead={healthPoints <= 0 ? true : false}
          />
        );
      })}
    </>
  );
};
