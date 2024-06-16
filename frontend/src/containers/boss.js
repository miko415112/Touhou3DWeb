import { Euler, Vector3, Quaternion } from "three";
import { Character } from "../components/character";
import { useDispatch, useSelector } from "react-redux";
import { setBossBullets } from "../redux/slices/gameSlice";
import { useState, useEffect, useRef } from "react";
import { memo } from "react";
import { useFrame } from "@react-three/fiber";

import { updateBossHealthPoints } from "../services/webSocketService";
import { stageBulletScript } from "../components/stage";

/* global settings */
const track_scalar = 4;
const intervalTime = 5000;
const modeNumber = 3;
const posConstrains = [new Vector3(-5, 3, -5), new Vector3(0, 8, 5)];
const spawnPos = new Vector3(-5, 5, 0);

function getCustomRandomValue(seed) {
  if (seededRandom(seed) < 0.5) {
    return seededRandom(seed + 1) * 0.1;
  } else {
    return seededRandom(seed + 1) * 0.1 + 0.9;
  }
}

function seededRandom(seed) {
  var m = 0x80000000; // 2**31
  var a = 1103515245;
  var c = 12345;

  seed = (a * seed + c) % m;
  return seed / (m - 1);
}

export const Boss = () => {
  const players = useSelector((state) => state.game.players);
  const roomInfo = useSelector((state) => state.game.roomInfo);
  const bossHealthPoints = useSelector((state) => state.game.bossHealthPoints);

  const immune = useRef(false);
  const [modelName, setModelName] = useState("Remilia");
  const timeoutRef = useRef([]);
  const bossHealthPointsRef = useRef(bossHealthPoints);
  const bossPosRef = useRef(spawnPos);
  const bossEulerRef = useRef(new Euler(0, -Math.PI / 2, 0));
  const dispatch = useDispatch();

  function execScript(script, scriptIndex, startStageTime, totalDelay) {
    scriptIndex = scriptIndex % script.length;
    const bullets = script[scriptIndex].bullets.map((bullet) => ({
      ...bullet,
      timestamp: Date.now(),
      modelPos: { ...bossPosRef.current },
      modelEuler: { ...bossEulerRef.current },
    }));
    dispatch(setBossBullets(bullets));

    totalDelay = totalDelay + script[scriptIndex].delay;
    const expectedTime = startStageTime + totalDelay;
    const nowTime = Date.now();
    timeoutRef.current.push(
      setTimeout(() => {
        execScript(script, scriptIndex + 1, startStageTime, totalDelay);
      }, expectedTime - nowTime)
    );
  }

  useEffect(() => {
    return () => timeoutRef.current.forEach((ele) => clearTimeout(ele));
  }, []);

  useEffect(() => {
    timeoutRef.current.forEach((ele) => clearTimeout(ele));

    const { stage, startStage, startStageTime } = roomInfo;
    if (!stage || !startStage || !startStageTime || bossHealthPoints <= 0)
      return;
    const script = stageBulletScript[stage - 1];
    execScript(script, 0, startStageTime, 0);
  }, [roomInfo.stage, roomInfo.startStage]);

  /* control move mode */

  useFrame((state, delta) => {
    if (!roomInfo || !roomInfo.startStage) return;
    const startTime = roomInfo.startStageTime;
    const nowTime = Date.now();
    const moveMode = Math.floor((nowTime - startTime) / intervalTime);
    const targetPlayerIndex = (moveMode / modeNumber) % players.length;
    if (moveMode % modeNumber == 0) {
      trackPlayer(delta, targetPlayerIndex);
    } else {
      randomMove(delta, moveMode);
    }
  });

  useEffect(() => {
    immune.current = true;
    bossHealthPointsRef.current = bossHealthPoints;
    setTimeout(() => {
      immune.current = false;
    }, 3000);
  }, [bossHealthPoints]);

  /* control healthPoints */

  const onCollision = () => {
    if (immune.current) return;
    updateBossHealthPoints(roomInfo.roomID, bossHealthPointsRef.current - 1);
  };

  function trackPlayer(delta, targetPlayerIndex) {
    /* find target_player position */
    const target_player = players[targetPlayerIndex];
    if (!target_player) return;
    if (!target_player.modelPos) return;

    /* find direction */
    const target_offset = bossPosRef.current
      .clone()
      .sub(target_player.modelPos)
      .multiplyScalar(-1);
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, -1),
      target_offset.clone().normalize()
    );
    const plane_offset = new Vector3(0, target_offset.y, target_offset.z);
    const new_euler = new Euler().setFromQuaternion(quaternion);

    /* find velocity */
    const target_velocity = plane_offset
      .clone()
      .normalize()
      .multiplyScalar(track_scalar);

    /* find position */
    const new_pos = bossPosRef.current.clone();
    if (plane_offset.length() >= 0.1) {
      new_pos.add(target_velocity.clone().multiplyScalar(delta));
    }

    bossPosRef.current = new_pos.clone();
    bossEulerRef.current = new_euler.clone();
  }

  function randomMove(delta, moveMode) {
    const max_pos = posConstrains[1];
    const min_pos = posConstrains[0];
    const max_velocity = max_pos
      .clone()
      .sub(bossPosRef.current)
      .multiplyScalar(1000 / intervalTime);
    const min_velocity = min_pos
      .clone()
      .sub(bossPosRef.current)
      .multiplyScalar(1000 / intervalTime);

    bossEulerRef.current = new Euler(0, -Math.PI / 2, 0);

    const seed = moveMode * 1000000;
    const randomVelocity = new Vector3(
      getCustomRandomValue(seed) * (max_velocity.x - min_velocity.x) +
        min_velocity.x,
      getCustomRandomValue(seed) * (max_velocity.y - min_velocity.y) +
        min_velocity.y,
      getCustomRandomValue(seed) * (max_velocity.z - min_velocity.z) +
        min_velocity.z
    );

    const new_pos = bossPosRef.current
      .clone()
      .add(randomVelocity.clone().multiplyScalar(delta));
    bossPosRef.current = new_pos.clone();
  }

  return (
    <Character
      modelName={modelName}
      position={bossPosRef.current}
      rotation={bossEulerRef.current}
      scale={0.1}
      mask={1 | 2}
      group={4}
      onCollideBegin={() => onCollision()}
      immune={immune.current}
      dead={bossHealthPoints <= 0 ? true : false}
    />
  );
};
