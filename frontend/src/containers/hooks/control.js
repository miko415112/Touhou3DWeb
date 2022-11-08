import { useState, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { Euler, Quaternion, Vector3 } from 'three';
import { useKeyboard, useMouse } from './input';

const move_speed = 8;
const yaw_speed = 1;
const yaw_deflection = Math.PI / 6;
const pitch_deflection = Math.PI / 6;

const keyMap = {
  KeyW: 'pitch_up',
  KeyS: 'pitch_down',
  KeyA: 'yaw_left',
  KeyD: 'yaw_right',
  Space: 'move_forward',
  ShiftLeft: 'speed_up',
};

const mouseMap = {
  0: 'move_forward',
};

const calcVelocity = (keyboardMovement, MouseMovement, rigidState) => {
  const { yaw_left, yaw_right, move_forward, speed_up } = keyboardMovement;
  const factor = speed_up ? 1.5 : 1;

  const lin_velocity = new Vector3()
    .set(0, 0, move_forward ? -1 : 0)
    .normalize()
    .multiplyScalar(move_speed * factor)
    .applyEuler(rigidState.modelEuler);

  const ang_velocity = new Vector3()
    .set(0, (yaw_left ? 1 : 0) - (yaw_right ? 1 : 0), 0)
    .normalize()
    .multiplyScalar(yaw_speed * factor);

  const velocity = {
    lin_velocity: lin_velocity,
    ang_velocity: ang_velocity,
  };

  return velocity;
};

const subscribeApi = (api, setPos, setRot) => {
  const unsubscibePos = api.position.subscribe((p) => setPos(p));
  const unsubscibeRot = api.rotation.subscribe((r) => setRot(r));

  return () => {
    unsubscibePos();
    unsubscibeRot();
  };
};

const trackSphere = (p, r, keyboardMovement, setRigidState) => {
  const { yaw_right, yaw_left, pitch_up, pitch_down } = keyboardMovement;

  const sphereEuler = new Euler(r[0], r[1], r[2]);
  const sphereQ = new Quaternion().setFromEuler(sphereEuler);
  const yawQ = new Quaternion().setFromAxisAngle(
    new Vector3(0, 1, 0),
    yaw_deflection * (yaw_right ? -1 : yaw_left ? 1 : 0)
  );
  const pitchQ = new Quaternion().setFromAxisAngle(
    new Vector3(1, 0, 0),
    pitch_deflection * (pitch_up ? 1 : pitch_down ? -1 : 0)
  );

  const modelQ = sphereQ.multiply(yawQ).multiply(pitchQ);
  const modelEuler = new Euler().setFromQuaternion(modelQ);

  const spherePos = new Vector3(p[0], p[1], p[2]);
  const offset = new Vector3(0, 0, 5).applyEuler(sphereEuler);
  const cameraPos = new Vector3().addVectors(spherePos, offset);
  setRigidState({
    modelEuler: modelEuler,
    cameraEuler: sphereEuler,
    modelPos: spherePos,
    cameraPos: cameraPos,
  });
};

export const useControl = () => {
  const keyboardMovement = useKeyboard(keyMap);
  const MouseMovement = useMouse(mouseMap);
  const [pos, setPos] = useState([0, 0, 0]);
  const [rot, setRot] = useState([0, 0, 0]);
  const [rigidState, setRigidState] = useState({
    modelPos: new Vector3(0, 0, 0),
    modelEuler: new Euler(0, 0, 0),
    cameraPos: new Vector3(0, 0, 3),
    cameraEuler: new Euler(0, 0, 0),
  });

  const [ref, api] = useSphere(() => ({
    mass: 0,
    type: 'Dynamic',
    position: [0, 0, 0],
  }));

  useEffect(() => {
    const unsubscibe = subscribeApi(api, setPos, setRot);
    return unsubscibe;
  }, []);

  useEffect(() => {
    trackSphere(pos, rot, keyboardMovement, setRigidState);
  }, [pos, rot]);

  const velocity = calcVelocity(keyboardMovement, MouseMovement, rigidState);
  api.velocity.set(...velocity.lin_velocity);
  api.angularVelocity.set(...velocity.ang_velocity);

  return { rigidState };
};
