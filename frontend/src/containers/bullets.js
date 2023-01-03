import { useState, useEffect, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { useNetwork } from './hooks/network';
import { Vector3, Quaternion, Euler } from 'three';
import { memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useUser } from './hooks/context';
import {
  getLargeBulletTexture,
  getNormalBulletTexture,
  getColorfulBulletTextureArray,
  getSplitBulletTexture,
} from '../components/resource';

const getRandomInt = (max, min) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

//BasicBullet
const NormalBullet = memo((props) => {
  const radius = 0.2;
  const speed = 14;
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    velocity: [...new Vector3(0, 0, -speed).applyEuler(props.modelEuler)],
    args: [radius],
    type: 'Kinematic',
    collisionFilterGroup: props.group,
  }));

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={getNormalBulletTexture()} />
    </mesh>
  );
});

//BasicBullet
const LargeBullet = memo((props) => {
  const speed = 8;
  const radius = 0.6;
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    velocity: [...new Vector3(0, 0, -speed).applyEuler(props.modelEuler)],
    args: [radius],
    type: 'Kinematic',
    collisionFilterGroup: props.group,
  }));

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={getLargeBulletTexture()} />
    </mesh>
  );
});

//BasicBullet
const StopBullet = memo((props) => {
  const textureArray = getColorfulBulletTextureArray();
  const speed = getRandomInt(15, 5);
  const radius = 0.2;
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    velocity: [
      ...new Vector3(0, getRandomInt(5, -5), -speed).applyEuler(
        props.modelEuler
      ),
    ],
    args: [radius],
    type: 'Kinematic',
    collisionFilterGroup: props.group,
  }));

  useEffect(() => {
    setTimeout(() => {
      api.velocity.set(...new Vector3(0, 0, 0));
    }, 2000);
  }, []);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial
        map={textureArray[getRandomInt(textureArray.length, 0)]}
        opacity={0.5}
      />
    </mesh>
  );
});

//HOC Bullet
const SplitBullet = memo((props) => {
  const speed = 10;
  const radius = 0.6;
  const [split, setSplit] = useState(false);
  const pos = useRef();

  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    velocity: [...new Vector3(0, 0, -speed).applyEuler(props.modelEuler)],
    args: [radius],
    type: 'Kinematic',
    collisionFilterGroup: props.group,
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe(
      (p) => (pos.current = new Vector3(...p))
    );
    setTimeout(() => {
      api.velocity.set([0, 0, 0]);
      setSplit(true);
    }, 2000);

    return () => unsubscribe();
  }, []);

  return split ? (
    <CircleBullet
      {...props}
      modelPos={pos.current}
      BasicBullet={NormalBullet}
    />
  ) : (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={getSplitBulletTexture()} opacity={0.5} />
    </mesh>
  );
});

//HOC Bullet
const RandomBullet = memo((props) => {
  const sectorNum = 5;
  const sectorAngle = Math.PI / 2;
  const list = [];

  for (let i = 0; i < sectorNum; i++) {
    const deflectQ = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      sectorAngle / 2 - Math.random() * sectorAngle
    );
    const bulletQ = new Quaternion().setFromEuler(props.modelEuler);
    bulletQ.multiply(deflectQ);
    const bulletEuler = new Euler().setFromQuaternion(bulletQ);
    list.push({
      ...props,
      key: i,
      modelEuler: bulletEuler,
    });
  }
  return list.map((props) => <StopBullet {...props} />);
});

//HOC Bullet
const CircleBullet = memo((props) => {
  const circleNum = 12;
  const list = [];
  const { BasicBullet } = props;

  for (let i = 0; i < circleNum; i++) {
    const deflectQ = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      ((Math.PI * 2) / circleNum) * i
    );
    const bulletQ = new Quaternion().setFromEuler(props.modelEuler);
    bulletQ.multiply(deflectQ);
    const bulletEuler = new Euler().setFromQuaternion(bulletQ);
    list.push({
      ...props,
      key: i,
      modelEuler: bulletEuler,
    });
  }
  return list.map((props) => <BasicBullet {...props} />);
});

const Bullet = memo((props) => {
  switch (props.type) {
    case 'shoot0':
      return <NormalBullet {...props} />;
    case 'shoot1':
      return <CircleBullet {...props} BasicBullet={LargeBullet} />;
    case 'shoot2':
      return <RandomBullet {...props} />;
    case 'shoot3':
      return <SplitBullet {...props} />;
  }
});

export const Bullets = () => {
  const [bulletList, setBulletList] = useState([]);
  const { playerList } = useNetwork();
  const { playerID } = useUser();
  const lifeTimeArray = [5000, 5000, 12000, 5000];

  useEffect(() => {
    setBulletList((prev) => {
      const newBulletList = prev ? [...prev] : [];
      for (let i = 0; i < playerList?.length; i++) {
        const player = playerList[i];
        if (!player.rigidState) return;
        if (!player.fireState) return;
        if (!player.rigidState.modelPos) return;
        if (!player.rigidState.modelEuler) return;

        for (let j = 0; j < player.fireState?.length; j++) {
          newBulletList.push({
            type: player.fireState[j],
            key: Date.now(),
            group: player.playerID === playerID ? 0 : 1,
            modelPos: player.rigidState.modelPos,
            modelEuler: player.rigidState.modelEuler,
          });
        }
      }
      return newBulletList;
    });
  }, [playerList]);

  useFrame(() => {
    if (!bulletList) return;
    const newBulletList = bulletList.filter(({ type, key }) => {
      const shootIndex = parseInt(type.replace('shoot', ''));
      return Date.now() - key < lifeTimeArray[shootIndex];
    });
    setBulletList(newBulletList ? newBulletList : []);
  });

  return bulletList?.map((bulletProps) => <Bullet {...bulletProps} />);
};
