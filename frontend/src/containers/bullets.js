import { useState, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useNetwork } from './hooks/network';
import { Vector3 } from 'three';
import { memo } from 'react';
import { useFrame } from '@react-three/fiber';

const NormalBullet = memo((props) => {
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [
      props.origin.modelPos?.x,
      props.origin.modelPos?.y,
      props.origin.modelPos?.z,
    ],
    args: [0.2],
    type: 'Kinematic',
    collisionFilterGroup: 1,
  }));

  useEffect(() => {
    api.velocity.set(
      ...new Vector3(0, 0, -10).applyEuler(props.origin?.modelEuler)
    );
  }, []);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2]} />
      <meshBasicMaterial color='white' />
    </mesh>
  );
});

const Bullet = memo((props) => {
  switch (props.type) {
    case 'shoot1':
      return <NormalBullet {...props} />;
      break;
    case 'shoot2':
      break;
    case 'shoot3':
      break;
  }
});

export const Bullets = () => {
  const [bulletList, setBulletList] = useState([]);
  const { playerList } = useNetwork();

  useEffect(() => {
    const newBulletList = [...bulletList];
    for (let i = 0; i < playerList?.length; i++) {
      const player = playerList[i];
      for (let j = 0; j < player.fireState?.length; j++) {
        newBulletList.push({
          playerID: player.playerID,
          modelName: player.modelName,
          type: player.fireState[j],
          key: Date.now(),
          origin: player.rigidState,
        });
      }
    }

    setBulletList(newBulletList);
  }, [playerList]);

  useFrame(() => {
    const newBulletList = bulletList.filter(({ key }) => {
      return Date.now() - key < 3000;
    });
    setBulletList(newBulletList);
  });

  return bulletList.map((bulletProps) => {
    return <Bullet {...bulletProps}></Bullet>;
  });
};