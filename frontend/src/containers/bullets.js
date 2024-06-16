import { useState, useEffect, useRef, useMemo } from "react";
import { useSphere, useCylinder } from "@react-three/cannon";
import { Vector3, Quaternion, Euler, Color } from "three";
import { useFrame } from "@react-three/fiber";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLargeBulletTexture,
  getRedBulletTexture,
  getGreenBulletTexture,
  getPurpleBulletTexture,
  getYellowBulletTexture,
  getGrayBulletTexture,
  getColorfulBulletTextureArray,
  getSplitBulletTexture,
} from "../components/resource";
import { setBossBullets } from "../redux/slices/gameSlice";

const getRandomColor = (seed) => {
  const colors = ["green", "red", "purple", "yellow"];
  return colors[Math.floor(seededRandom(seed) * colors.length)];
};

function seededRandom(seed) {
  var m = 0x80000000; // 2**31
  var a = 1103515245;
  var c = 12345;

  seed = (a * seed + c) % m;
  return seed / (m - 1);
}

/* BasicBullet */

const SpinBullet = (props) => {
  const radius = 0.6;
  const radicalSpeed = props.radicalSpeed;
  const tangentSpeed = props.tangentSpeed;
  const positionRef = useRef(
    new Vector3(props.modelPos.x, props.modelPos.y, props.modelPos.z).add(
      new Vector3(0, 0, -0.1).applyEuler(props.modelEuler)
    )
  );
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    args: [radius],
    type: "Kinematic",
    collisionFilterGroup: props.group,
  }));

  useFrame((state, delta) => {
    const radicalVector = positionRef.current
      .clone()
      .sub(new Vector3(props.modelPos.x, props.modelPos.y, props.modelPos.z))
      .normalize();

    const yVector = new Vector3(0, 1, 0);

    const tagentVector = new Vector3()
      .crossVectors(radicalVector, yVector)
      .normalize();

    const radicalOffset = radicalVector
      .clone()
      .multiplyScalar(radicalSpeed * delta);
    const tagentOffset = tagentVector
      .clone()
      .multiplyScalar(tangentSpeed * delta);

    positionRef.current.add(radicalOffset).add(tagentOffset);

    api.position.set(
      positionRef.current.x,
      positionRef.current.y,
      positionRef.current.z
    );
  });

  const texture = useMemo(() => getLargeBulletTexture(), []);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const NormalBullet = (props) => {
  const radius = 0.2;
  const speed = 15;
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    velocity: [...new Vector3(0, 0, -speed).applyEuler(props.modelEuler)],
    args: [radius],
    type: "Kinematic",
    collisionFilterGroup: props.group,
  }));

  const texture = useMemo(() => {
    if (!props || !props.color) return getGrayBulletTexture();
    if (props.color == "green") return getGreenBulletTexture();
    if (props.color == "red") return getRedBulletTexture();
    if (props.color == "purple") return getPurpleBulletTexture();
  }, []);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const SmallBullet = (props) => {
  const radius = 0.2;
  const speed = 6;
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    velocity: [...new Vector3(0, 0, -speed).applyEuler(props.modelEuler)],
    args: [radius],
    type: "Kinematic",
    collisionFilterGroup: props.group,
  }));

  const texture = useMemo(() => {
    if (!props.color) return getPurpleBulletTexture();
    if (props.color == "green") return getGreenBulletTexture();
    if (props.color == "red") return getRedBulletTexture();
    if (props.color == "purple") return getPurpleBulletTexture();
    if (props.color == "yellow") return getYellowBulletTexture();
  }, []);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const LargeBullet = (props) => {
  const speed = 8;
  const radius = 0.6;
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    velocity: [...new Vector3(0, 0, -speed).applyEuler(props.modelEuler)],
    args: [radius],
    type: "Kinematic",
    collisionFilterGroup: props.group,
  }));

  const texture = useMemo(() => getLargeBulletTexture(), []);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const StopBullet = (props) => {
  const { modelPos, velocity, color, delay } = props;

  const radius = 0.2;
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [modelPos.x, modelPos.y, modelPos.z],
    velocity: [velocity.x, velocity.y, velocity.z],
    args: [radius],
    type: "Kinematic",
    collisionFilterGroup: props.group,
  }));

  useEffect(() => {
    setTimeout(() => {
      api.velocity.set(...new Vector3(0, 0, 0));
    }, delay);
  }, []);

  const texture = useMemo(() => {
    if (!color) return getPurpleBulletTexture();
    if (color == "green") return getGreenBulletTexture();
    if (color == "red") return getRedBulletTexture();
    if (color == "purple") return getPurpleBulletTexture();
    if (color == "yellow") return getYellowBulletTexture();
  }, []);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={texture} opacity={0.5} />
    </mesh>
  );
};

const Laser = (props) => {
  const [start, setStart] = useState(false);
  const [radius, setRadius] = useState(0.1);
  const inflationSpeed = 1.2;
  const num = 5;
  const halos = [];
  const [ref, api] = useCylinder(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    rotation: [0, 0, Math.PI / 2],
    type: "Kinematic",
    collisionFilterGroup: 0,
    args: [maxRadius, maxRadius, 50],
  }));
  let color;
  switch (props.color) {
    case "yellow":
      color = new Color("rgb(246, 255, 0)");
      break;
    case "blue":
      color = new Color("rgb(0, 238, 255)");
      break;
    default:
      color = new Color("rgb(255, 255, 255)");
  }

  const maxRadius = props.maxRadius ? props.maxRadius : 0.8;

  useEffect(() => {
    setTimeout(() => {
      setStart(true);
      if (props.velocity) {
        api.velocity.set(props.velocity.x, props.velocity.y, props.velocity.z);
      }
    }, 2000);
  }, []);

  useEffect(() => {
    if (radius >= maxRadius) api.collisionFilterGroup.set(props.group);
  }, [radius]);

  useFrame((state, delta) => {
    if (start && radius < maxRadius)
      setRadius((prev) => prev + inflationSpeed * delta);
    if (radius >= maxRadius) api.collisionFilterGroup.set(props.group);
  });

  for (let i = 0; i < num; i++) {
    const haloRadius = radius + i * 0.1;
    const opacity = 1 - i / num;

    halos.push(
      <mesh key={i} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[haloRadius, haloRadius, 50]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    );
  }

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 50, 32]} />
        <meshBasicMaterial color="blue" transparent opacity={0.5} />
      </mesh>
      {start ? halos : null}
    </group>
  );
};

/* HOC Bullet */
const SplitBullet = (props) => {
  const { BasicBullet } = props;
  const speed = 5;
  const radius = 0.8;
  const [split, setSplit] = useState(false);
  const pos = useRef();

  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [props.modelPos.x, props.modelPos.y, props.modelPos.z],
    velocity: [...new Vector3(0, 0, -speed).applyEuler(props.modelEuler)],
    args: [radius],
    type: "Kinematic",
    collisionFilterGroup: props.group,
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe(
      (p) => (pos.current = new Vector3(...p))
    );
    setTimeout(() => {
      api.velocity.set(0, 0, 0);
    }, 3000);

    setTimeout(() => {
      setSplit(true);
    }, 6000);

    return () => unsubscribe();
  }, []);

  const texture = useMemo(() => getSplitBulletTexture(), []);

  return split ? (
    <FibonacciSphere
      {...props}
      number={50}
      phi={1.616 * Math.PI}
      modelPos={pos.current}
      radicalSpeed={5}
      tangentSpeed={8}
      BasicBullet={BasicBullet}
    />
  ) : (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial map={texture} opacity={0.5} />
    </mesh>
  );
};

const ConeBullet = memo((props) => {
  const [list, setList] = useState([]);
  const { BasicBullet } = props;

  const zOffset = 7;
  const zLength = 16;
  const rLength = 16;
  const zInterval = 6;
  const yInterval = 6;
  const thetaInterval = Math.PI / 6;

  useEffect(() => {
    for (let i = Math.floor(zLength / zInterval) - 1; i >= 0; i--) {
      let batch = [];
      for (let j = 0; j < Math.floor(rLength / yInterval); j++) {
        for (let k = 0; k < 8; k++) {
          let z = -(i * zInterval + zOffset);
          let y = j * yInterval;
          let theta = k * thetaInterval;

          let directionVector = new Vector3(0, y, z)
            .applyEuler(new Euler(0, 0, theta))
            .applyEuler(props.modelEuler);

          batch.push({
            modelPos: props.modelPos,
            velocity: directionVector.multiplyScalar(1 / 6),
            color: getRandomColor((i + j + k) * 10000),
            delay: 6000,
            group: props.group,
          });
        }
      }

      setTimeout(
        () => {
          setList((prev) => [...prev, ...batch]);
        },
        800 * (Math.floor(zLength / zInterval) - 1 - i)
      );
    }
  }, []);

  console.log(list);

  return list.map((props, index) => <BasicBullet {...props} key={index} />);
});

const HorizontalLaser = memo((props) => {
  const zRange = [-8, 8];
  const yRange = [0, 10];
  const number = 5;

  const list = [];
  const { BasicBullet } = props;

  for (let i = 0; i < number; i++) {
    const yInterval = (yRange[1] - yRange[0]) / (number - 1);
    list.push({
      ...props,
      modelPos: new Vector3(0, yRange[0] + yInterval * i, zRange[0]),
      velocity: new Vector3(0, 0, 1),
    });
    list.push({
      ...props,
      modelPos: new Vector3(0, yRange[0] + yInterval * i, zRange[1]),
      velocity: new Vector3(0, 0, -1),
    });
  }
  return list.map((props, index) => <BasicBullet {...props} key={index} />);
});

const VerticalLaser = memo((props) => {
  const zRange = [-8, 8];
  const yRange = [1, 12];
  const number = 5;

  const list = [];
  const { BasicBullet } = props;

  for (let i = 0; i < number; i++) {
    const zInterval = (zRange[1] - zRange[0]) / (number - 1);
    list.push({
      ...props,
      modelPos: new Vector3(0, yRange[0], zRange[0] + zInterval * i),
      velocity: new Vector3(0, 0.5, 0),
    });
    list.push({
      ...props,
      modelPos: new Vector3(0, yRange[1], zRange[0] + zInterval * i),
      velocity: new Vector3(0, -0.5, 0),
    });
  }
  return list.map((props, index) => <BasicBullet {...props} key={index} />);
});

const MultiLaser = memo((props) => {
  const zRange = [-10, 10];
  const yRange = [1, 12];
  const number = 4;

  const list = [];
  const { BasicBullet } = props;

  for (let i = 0; i < number; i++) {
    for (let j = 0; j < number; j++) {
      const zInterval = (zRange[1] - zRange[0]) / (number - 1);
      const yInterval = (yRange[1] - yRange[0]) / (number - 1);
      list.push({
        ...props,
        modelPos: new Vector3(
          0,
          yRange[0] + yInterval * j,
          zRange[0] + zInterval * i
        ),
      });
    }
  }
  return list.map((props, index) => <BasicBullet {...props} key={index} />);
});

const FibonacciSphere = memo((props) => {
  const list = [];
  const { BasicBullet } = props;
  const sphereRadius = 1;
  for (let i = 0; i < props.number; i++) {
    const y = 1 - (2 * i) / (props.number - 1);
    const planeRadius = Math.sqrt(sphereRadius * sphereRadius - y * y);
    const theta = props.phi * i;
    const x = Math.cos(theta) * planeRadius;
    const z = Math.sin(theta) * planeRadius;

    const direction = new Vector3(x, y, z).normalize();
    const deflectQ = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, -1),
      direction
    );
    const bulletQ = new Quaternion().setFromEuler(props.modelEuler);
    bulletQ.multiply(deflectQ);
    const bulletEuler = new Euler().setFromQuaternion(bulletQ);

    list.push({
      ...props,
      modelEuler: bulletEuler,
    });
  }

  return list.map((props, index) => <BasicBullet {...props} key={index} />);
});

/* combined bullet */

const Bullet = memo((props) => {
  switch (props.type) {
    case "shoot0":
      return <NormalBullet {...props} />;
    case "shoot1":
      return <FibonacciSphere {...props} BasicBullet={LargeBullet} />;
    case "shoot2":
      return <FibonacciSphere {...props} BasicBullet={SpinBullet} />;
    case "shoot3":
      return <Laser color={"yellow"} {...props} />;
    case "shoot4":
      return (
        <HorizontalLaser {...props} color={"yellow"} BasicBullet={Laser} />
      );
    case "shoot5":
      return <VerticalLaser {...props} color={"blue"} BasicBullet={Laser} />;
    case "shoot6":
      return (
        <Laser color={"yellow"} {...props} modelPos={new Vector3(0, 6, 0)} />
      );
    case "shoot7":
      return <FibonacciSphere {...props} BasicBullet={SmallBullet} />;
    case "shoot8":
      return <MultiLaser {...props} color={"blue"} BasicBullet={Laser} />;
    case "shoot9":
      return <ConeBullet {...props} BasicBullet={StopBullet} />;
    case "shoot10":
      return <SplitBullet {...props} BasicBullet={SmallBullet} />;
    case "shoot11":
      return <SplitBullet {...props} BasicBullet={SpinBullet} />;
  }
});

/* display all bullets */

export const Bullets = () => {
  /* user-defined hooks*/
  const [bulletList, setBulletList] = useState([]);
  const players = useSelector((state) => state.game.players);
  const bossBullets = useSelector((state) => state.game.bossBullets);
  const profile = useSelector((state) => state.account.profile);
  const dispatch = useDispatch();
  const lifeTimeArray = {
    shoot0: 3000,
    shoot1: 6000,
    shoot2: 6000,
    shoot3: 5000,
    shoot4: 6500,
    shoot5: 6500,
    shoot6: 8500,
    shoot7: 6000,
    shoot8: 6500,
    shoot9: 15000,
    shoot10: 15000,
    shoot11: 15000,
  };

  useEffect(() => {
    setBulletList((prev) => {
      const newBulletList = prev ? [...prev] : [];

      /* user bullets */

      for (let i = 0; i < players?.length; i++) {
        const player = players[i];

        if (!player.modelPos) return;
        if (!player.modelEuler) return;
        if (!player.fireState) return;

        for (let j = 0; j < player.fireState?.length; j++) {
          const exits = newBulletList.some(
            (bullet) => bullet.key == player.fireState[j]["key"]
          );
          if (exits) continue;
          newBulletList.push({
            email: player.email,
            type: player.fireState[j]["type"],
            timestamp: player.timestamp,
            group: player.email === profile.email ? 1 : 2,
            modelPos: player.modelPos,
            modelEuler: player.modelEuler,
            key: player.fireState[j]["key"],
            lifetime: lifeTimeArray[player.fireState[j]["type"]],
          });
        }
      }

      /* boss bullets */
      for (let i = 0; i < bossBullets?.length; i++) {
        const bossBullet = bossBullets[i];
        const exits = newBulletList.some(
          (bullet) => bullet.key == bossBullet.key
        );
        if (exits) continue;
        newBulletList.push({
          ...bossBullet,
          lifetime: lifeTimeArray[bossBullet.type],
        });
      }

      if (bossBullets?.length > 0) {
        dispatch(setBossBullets([]));
      }

      return newBulletList;
    });
  }, [players, bossBullets]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBulletList((prev) =>
        prev?.filter(({ timestamp, lifetime }) => {
          return Date.now() - timestamp < lifetime;
        })
      );
    }, 80);
    return () => clearInterval(intervalId);
  }, []);

  return bulletList?.map((bulletProps) => {
    return <Bullet {...bulletProps} key={bulletProps.key} />;
  });
};
