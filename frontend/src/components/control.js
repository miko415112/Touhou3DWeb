import { useState, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';
import { Player } from './player';

import { PointerLockControls } from '@react-three/drei';

const useKeyboard = () => {
  const keys = {
    KeyW: 'move_fw',
    KeyS: 'move_bk',
    KeyA: 'move_lf',
    KeyD: 'move_rt',
  };
  const [movement, setMovement] = useState({
    move_fw: false,
    move_bk: false,
    move_lf: false,
    move_rt: false,
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

export const Control = () => {
  const movement = useKeyboard();
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 0,
    type: 'Dynamic',
    position: [0, 0, 0],
  }));

  const [modelPos, setModelPos] = useState(new Vector3(0, 0, 0));
  const [modelRot, setModelRot] = useState(new Vector3(-Math.PI / 2, 0, 0));
  const [cameraPos, setCameraPos] = useState(new Vector3(0, 0, 0));

  useFrame(() => {
    const v_z = (movement.move_bk ? 1 : 0) - (movement.move_fw ? 1 : 0);
    const v_x = (movement.move_rt ? 1 : 0) - (movement.move_lf ? 1 : 0);
    const velocity = new Vector3()
      .set(v_x, 0, v_z)
      .normalize()
      .multiplyScalar(10)
      .applyEuler(camera.rotation);

    api.velocity.set(velocity.x, velocity.y, velocity.z);
    api.position.subscribe((p) => {
      setCameraPos(new Vector3(p[0], p[1], p[2]));
      setModelPos(new Vector3(p[0], p[1], p[2] - 5));
      setModelRot(camera.rotation);
    });
    camera.position.copy(cameraPos);
    console.log(modelRot);
  });

  return (
    <>
      <mesh ref={ref}></mesh>
      <Player
        modelName={'Remilia'}
        position={modelPos ? modelPos : new Vector3(0, 0, 0)}
        rotation={modelRot ? modelRot : new Vector3(-Math.PI / 2, 0, 0)}
        scale={0.1}
      />
      <PointerLockControls args={[camera]} />
    </>
  );
};
