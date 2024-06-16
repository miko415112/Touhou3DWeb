import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Euler, Vector3 } from "three";
import { useKeyboard, useMouse } from "./input";
import { v4 as uuidv4 } from "uuid";
import { lerp } from "three/src/math/MathUtils.js";
/* global settings */

const move_speed = 7;
const basic_offset = new Vector3(0, 2.3, 4.5);
const lerpFactor = 0.5;

const keyMap = {
  KeyW: "go_up",
  KeyS: "go_down",
  KeyA: "go_left",
  KeyD: "go_right",
  CapsLock: "open_fire",
  Space: "go_forward",
  ShiftLeft: "slow_down",
};

/* localPlayer control logic */

export const useControl = (spawnPos, spawnEuler, posConstrains) => {
  /* user-defined hook */
  const keyboardMovement = useKeyboard(keyMap);
  const { movement: mouseMovement, leftButton, rightButton } = useMouse();

  const [cameraPos, setCameraPos] = useState(
    spawnPos.clone().add(basic_offset.clone())
  );
  const [cameraEuler, setCameraEuler] = useState(spawnEuler.clone());
  const [modelPos, setModelPos] = useState(spawnPos.clone());
  const [modelEuler, setModelEuler] = useState(spawnEuler.clone());
  const [modelVelocity, setModelVelocity] = useState(new Vector3(0, 0, 0));
  const [fireState, setFireState] = useState([]);
  const [lastFiredTime, setLastFiredTime] = useState(0);

  useFrame((state, delta) => {
    if (!cameraEuler || !cameraPos || !modelEuler || !modelPos) return;

    /* translation control */

    const targetModelPos = modelPos
      .clone()
      .add(modelVelocity.clone().multiplyScalar(delta));

    const [corner1, corner2] = posConstrains;

    if (modelPos.x > Math.max(corner1.x, corner2.x))
      targetModelPos.x = Math.max(corner1.x, corner2.x);
    if (modelPos.x < Math.min(corner1.x, corner2.x))
      targetModelPos.x = Math.min(corner1.x, corner2.x);
    if (modelPos.y > Math.max(corner1.y, corner2.y))
      targetModelPos.y = Math.max(corner1.y, corner2.y);
    if (modelPos.y < Math.min(corner1.y, corner2.y))
      targetModelPos.y = Math.min(corner1.y, corner2.y);
    if (modelPos.z > Math.max(corner1.z, corner2.z))
      targetModelPos.z = Math.max(corner1.z, corner2.z);
    if (modelPos.z < Math.min(corner1.z, corner2.z))
      targetModelPos.z = Math.min(corner1.z, corner2.z);

    /* orbital control */

    const { movementX, movementY } = mouseMovement;
    const sensitivity = 0.02;
    const yaw = modelEuler.y - sensitivity * movementX;
    const pitch = modelEuler.x - sensitivity * movementY;
    const targetEuler = new Euler(pitch, yaw, 0, "YXZ");
    const offset = basic_offset.clone().applyEuler(targetEuler);
    const targetCameraPos = new Vector3().addVectors(targetModelPos, offset);

    setModelPos(targetModelPos);
    setCameraPos(
      new Vector3().lerpVectors(cameraPos, targetCameraPos, lerpFactor)
    );
    setCameraEuler(
      new Euler(
        lerp(cameraEuler.x, targetEuler.x, lerpFactor),
        lerp(cameraEuler.y, targetEuler.y, lerpFactor),
        0,
        "YXZ"
      )
    );

    setModelEuler(
      new Euler(
        lerp(modelEuler.x, targetEuler.x, lerpFactor),
        lerp(modelEuler.y, targetEuler.y, lerpFactor),
        0,
        "YXZ"
      )
    );
  });

  /* translation control */

  useEffect(() => {
    const { go_up, go_down, go_left, go_right, go_forward, slow_down } =
      keyboardMovement;

    const factor = slow_down ? 0.6 : 1;

    let lin_velocity = new Vector3()
      .set(go_right - go_left, go_up - go_down, -go_forward)
      .normalize()
      .multiplyScalar(move_speed * factor)
      .applyEuler(modelEuler);

    setModelVelocity(lin_velocity);
  }, [keyboardMovement, modelEuler]);

  /* fire control */

  useEffect(() => {
    const handleShoot = (shootKey) => {
      const currentTime = Date.now();
      if (currentTime - lastFiredTime > 250) {
        setFireState((prevFireState) => [
          ...prevFireState,
          {
            type: shootKey,
            key: uuidv4(),
          },
        ]);
        setLastFiredTime(currentTime);
      } else {
        setFireState([]);
      }
    };

    if (leftButton) {
      handleShoot("shoot0");
    } else {
      setFireState([]);
    }
  }, [leftButton]);

  return { cameraPos, cameraEuler, modelPos, modelEuler, fireState };
};
