import { useControl } from "../hooks/control";
import { useThree } from "@react-three/fiber";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Character } from "../components/character";
import { Euler, Vector3 } from "three";
import {
  deadAudio,
  shoot0Audio,
  shoot1Audio,
  shoot2Audio,
  shoot3Audio,
} from "../components/resource";

import { useSelector } from "react-redux";
import { updatePlayer } from "../services/webSocketService";

/* global settings */
const posConstrains = [new Vector3(0, 0.2, -8), new Vector3(12, 10, 8)];
const spawnPos = new Vector3(10, 1, 0);
const spawnEuler = new Euler(0, Math.PI / 2, 0);

export const LocalPlayer = () => {
  /* global state */
  const profile = useSelector((state) => state.account.profile);
  const players = useSelector((state) => state.game.players);
  const roomInfo = useSelector((state) => state.game.roomInfo);
  const me = players.find((player) => player.email == profile.email);

  /* user-defined hook */
  const { camera } = useThree();
  const { cameraPos, cameraEuler, modelPos, modelEuler, fireState } =
    useControl(spawnPos, spawnEuler, posConstrains);
  const [healthPoints, setHealthPoints] = useState(20);
  const preUpdateTime = useRef(0);
  const immune = useRef(false);

  /* update camera */
  useLayoutEffect(() => {
    camera.rotation.copy(cameraEuler);
    camera.position.copy(cameraPos);
  }, [cameraPos, cameraEuler, modelPos, modelEuler]);

  useEffect(() => {
    if (healthPoints == 0) deadAudio.play();
  }, [healthPoints]);

  /* update player */

  useEffect(() => {
    const curTime = Date.now();
    let validFireState = [];
    if (healthPoints > 0) validFireState = fireState;

    if (curTime - preUpdateTime.current > 60) {
      updatePlayer(roomInfo.roomID, {
        modelPos,
        modelEuler,
        fireState: validFireState,
        healthPoints,
        immune: immune.current,
        timestamp: curTime,
      });

      preUpdateTime.current = Date.now();
      handleFireAudio(fireState);
    }
  }, [modelPos, modelEuler, fireState, healthPoints]);

  /* handle Audio depending on validFireState */
  const handleFireAudio = (fireState) => {
    for (let i = 0; i < fireState.length; i++) {
      console.log(fireState[i]["type"]);
      switch (fireState[i]["type"]) {
        case "shoot0":
          shoot0Audio.play();
          break;
        case "shoot1":
          shoot1Audio.play();
          break;
        case "shoot2":
          shoot2Audio.play();
          break;
        case "shoot3":
          shoot3Audio.play();
          break;
      }
    }
  };

  const handleCollision = () => {
    if (!immune.current) {
      setHealthPoints((prev) => prev - 1);
      immune.current = true;
      setTimeout(() => {
        immune.current = false;
      }, 3000);
    }
  };

  return (
    <>
      <Character
        modelName={me?.modelName}
        position={modelPos}
        rotation={modelEuler}
        scale={0.1}
        mask={2 | 4}
        group={1}
        onCollideBegin={handleCollision}
        immune={immune.current}
        dead={healthPoints <= 0 ? true : false}
      />
    </>
  );
};
