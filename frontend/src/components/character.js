import {
  RemiliaModel,
  KoishiModel,
  SuwakoModel,
  SakuyaModel,
  SanaeModel,
  MeilingModel,
} from './resource';
import { useState, useEffect } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import { useBox } from '@react-three/cannon';
import { useUser } from '../containers/hooks/context';

export const characterList = [
  'Remilia',
  'Koishi',
  'Suwako',
  'Sakuya',
  'Sanae',
  'Meiling',
];

const Model = (props) => {
  switch (props.modelName) {
    case 'Remilia':
      return <RemiliaModel {...props} />;
      break;
    case 'Koishi':
      return <KoishiModel {...props} />;
      break;
    case 'Suwako':
      return <SuwakoModel {...props} />;
      break;
    case 'Sakuya':
      return <SakuyaModel {...props} />;
      break;
    case 'Sanae':
      return <SanaeModel {...props} />;
      break;
    case 'Meiling':
      return <MeilingModel {...props} />;
      break;
  }
  return <RemiliaModel {...props} />;
};

export const Character = (props) => {
  const [ref, api] = useBox(() => ({
    mass: 0,
    type: 'Kinematic',
    args: [1.3, 1.3, 1.3],
    collisionFilterMask: props.mask,
    collisionFilterGroup: props.group,
    onCollideBegin: props.onCollideBegin,
  }));

  const { showBox } = useUser();

  if (props.position !== undefined)
    api.position.set(props.position.x, props.position.y, props.position.z);

  return (
    <>
      <group ref={ref}>
        <mesh visible={showBox}>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial color={'White'} />
        </mesh>
        <mesh visible={props.immune ? true : false}>
          <sphereGeometry args={[1.5]} />
          <meshBasicMaterial color={'#D87D68'} />
        </mesh>
      </group>
      <Model {...props} />
    </>
  );
};

export const RotationCharacter = ({ modelName, spin, scale }) => {
  const [rotation, setRotation] = useState(new Euler(0, 0, 0));

  useEffect(() => {
    if (!spin) return;
    const id = setInterval(() => {
      setRotation((prev) => {
        const pre_q = new Quaternion().setFromEuler(prev);
        const delta_q = new Quaternion().setFromAxisAngle(
          new Vector3(0, 1, 0),
          0.1
        );
        const new_q = pre_q.multiply(delta_q);
        return new Euler().setFromQuaternion(new_q);
      });
    }, 60);
    return () => {
      clearInterval(id);
    };
  }, [spin]);

  return <Character modelName={modelName} rotation={rotation} scale={scale} />;
};
