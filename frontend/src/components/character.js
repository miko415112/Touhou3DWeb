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

export const characterList = [
  'Remilia',
  'Koishi',
  'Suwako',
  'Sakuya',
  'Sanae',
  'Meiling',
];

export const Character = (props) => {
  switch (props.modelName) {
    case 'Remilia':
      return <RemiliaModel {...props} />;
    case 'Koishi':
      return <KoishiModel {...props} />;
    case 'Suwako':
      return <SuwakoModel {...props} />;
    case 'Sakuya':
      return <SakuyaModel {...props} />;
    case 'Sanae':
      return <SanaeModel {...props} />;
    case 'Meiling':
      return <MeilingModel {...props} />;
  }
  return <RemiliaModel {...props} />;
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
