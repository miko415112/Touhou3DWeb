import { useState, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Euler, Quaternion, Vector3 } from 'three';
import { Player } from './player';

import { PointerLockControls } from '@react-three/drei';
import { setQuaternionFromProperEuler } from 'three/src/math/MathUtils';

const useKeyboard = () => {
  const keys = {
    KeyW: 'pitch_up',
    KeyS: 'pitch_down',
    KeyA: 'yaw_left',
    KeyD: 'yaw_right',
  };
  const [movement, setMovement] = useState({
    pitch_up: false,
    pitch_down: false,
    yaw_left: false,
    yaw_right: false,
  });

  const handleKeyDown = (e) => {
    setMovement((movement) => ({ ...movement, [keys[e.code]]: true }));
  };

  const handleKeyUp = (e) => {
    setMovement((movement) => ({ ...movement, [keys[e.code]]: false }));
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return movement;
};

const useMouse = () => {
  const [movement, setMovement] = useState({
    move_forward: false,
  });

  const handleMouseDown = (e) => {
    setMovement({ move_forward: true });
  };

  const handleMouseUp = (e) => {
    setMovement({ move_forward: false });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseUp]);

  return movement;
};

const calcVelocity = (keyboardMovement, MouseMovement, rigidState, camera) => {
  const { pitch_up, pitch_down, yaw_left, yaw_right } = keyboardMovement;
  const { move_forward } = MouseMovement;

  const lin_velocity = new Vector3()
    .set(0, (pitch_up ? 1 : 0) - (pitch_down ? 1 : 0), move_forward ? -1 : 0)
    .normalize()
    .multiplyScalar(10)
    .applyEuler(camera.rotation);

  const ang_velocity = new Vector3()
    .set(0, (yaw_left ? 1 : 0) - (yaw_right ? 1 : 0), 0)
    .normalize()
    .multiplyScalar(1);

  const velocity = {
    lin_velocity: lin_velocity,
    ang_velocity: ang_velocity,
  };

  return velocity;
};

const subscribeApi = (api, setRigidState) => {
  api.position.subscribe((p) => {
    setRigidState((prev) => {
      return {
        ...prev,
        ['modelPos']: new Vector3(p[0], p[1], p[2]),
        ['cameraPos']: new Vector3(p[0], p[1], p[2] - 5),
      };
    });
  });

  api.rotation.subscribe((r) => {
    setRigidState((prev) => {
      return {
        ...prev,
        ['modelRot']: new Vector3(r[0], r[1], r[2]),
        ['cameraRot']: new Vector3(r[0], r[1], r[2]),
      };
    });
  });
};

const LocalPlayer = (modelName, rigidState) => {
  const modelPos = rigidState.modelPos
    ? rigidState.modelPos
    : new Vector3(0, 0, 0);
  const modelRot = rigidState.modelRot
    ? rigidState.modelRot
    : new Vector3(-Math.PI / 2, 0, 0);
  return (
    <>
      <mesh>
        <Player
          modelName={modelName}
          position={modelPos}
          rotation={modelRot}
          scale={0.1}
        />
      </mesh>
    </>
  );
};

export const Control = () => {
  const keyboardMovement = useKeyboard();
  const MouseMovement = useMouse();
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 0,
    type: 'Dynamic',
    position: [0, 0, 0],
  }));

  const [rigidState, setRigidState] = useState({
    modelPos: new Vector3(0, 0, 0),
    modelRot: new Vector3(-Math.PI / 2, 0, 0),
    cameraPos: new Vector3(0, 0, 0),
    cameraRot: new Vector3(0, 0, 0),
  });

  useFrame(() => {
    const velocity = calcVelocity(
      keyboardMovement,
      MouseMovement,
      rigidState,
      camera
    );
    api.velocity.set(...velocity.lin_velocity);
    api.angularVelocity.set(...velocity.ang_velocity);
    subscribeApi(api, setRigidState);
    camera.position.copy(rigidState.cameraPos);
    camera.rotation.setFromVector3(rigidState.cameraRot);

    console.log(velocity.lin_velocity);
  });

  return LocalPlayer('Remilia', rigidState);
};
