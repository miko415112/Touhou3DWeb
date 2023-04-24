import { useState, useEffect, useRef } from "react";
import { Euler, Quaternion, Vector3 } from "three";
import {
  RemiliaModel,
  KoishiModel,
  SuwakoModel,
  SakuyaModel,
  SanaeModel,
  MeilingModel,
} from "./resource";
import { useBox } from "@react-three/cannon";
import { getPowerTexture, getShieldTexture } from "../components/resource";

export const characterList = [
  "Remilia",
  "Koishi",
  "Suwako",
  "Sakuya",
  "Sanae",
  "Meiling",
];

export const Shield = (props) => {
  const [texture, setTexture] = useState(getShieldTexture());
  const customShaderMaterial = useRef({
    transparent: true,
    uniforms: {
      u_texture: { value: texture },
      u_time: { value: 0 },
    },
    vertexShader: `
        
        precision highp float;
        varying vec2 vUv;
        varying vec4 mvPosition;
        varying vec4 mvNormal;
  
        void main() {
            vUv = uv;
            mvPosition = modelViewMatrix *vec4(position, 1.);
            mvNormal = modelViewMatrix * vec4(normal, 0.);
            gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }
      `,
    fragmentShader: `
        precision highp float;
        uniform sampler2D u_texture;
        uniform float u_time;
        varying vec2 vUv;
        varying vec4 mvPosition;
        varying vec4 mvNormal;
        
        void main() {
          vec4 baseColor = vec4(0.1,0.8,0.4,0.);
          vec2 offset = vec2(0.,u_time/1000.*0.2);
          vec4 texel = texture2D(u_texture,vUv+offset);
          baseColor.a = texel.r;
           
          float value = abs(dot(normalize(mvNormal), normalize(-mvPosition)));
          float rim = pow(1.1 - value,2.5)*5.;
          gl_FragColor =  baseColor*rim ;
        }
      `,
  });

  useEffect(() => {
    const myIntervel = setInterval(() => {
      customShaderMaterial.current.uniforms.u_time.value += 100;
    }, 100);
    return () => {
      clearInterval(myIntervel);
    };
  }, []);

  return (
    <mesh {...props}>
      <sphereGeometry attach="geometry" args={[1.6, 32, 16]} />
      <shaderMaterial attach="material" args={[customShaderMaterial.current]} />
    </mesh>
  );
};

export const SpellCard = (props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[2.3, 2.3, 2.3]} />
      <meshBasicMaterial map={getPowerTexture()} />
    </mesh>
  );
};

const Model = (props) => {
  switch (props.modelName) {
    case "Remilia":
      return <RemiliaModel {...props} />;
    case "Koishi":
      return <KoishiModel {...props} />;
    case "Suwako":
      return <SuwakoModel {...props} />;
    case "Sakuya":
      return <SakuyaModel {...props} />;
    case "Sanae":
      return <SanaeModel {...props} />;
    case "Meiling":
      return <MeilingModel {...props} />;
  }
  return <RemiliaModel {...props} />;
};

export const Character = (props) => {
  const [ref, api] = useBox(() => ({
    mass: 0,
    type: "Kinematic",
    args: [1.3, 1.3, 1.3],
    collisionFilterMask: props.mask,
    collisionFilterGroup: props.group,
    onCollideBegin: props.onCollideBegin,
  }));

  if (props.position !== undefined)
    api.position.set(props.position.x, props.position.y, props.position.z);

  return (
    <>
      <Shield visible={!props.dead && props.immune} position={props.position} />
      <SpellCard visible={props.dead} position={props.position} />
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

  return <Model modelName={modelName} rotation={rotation} scale={scale} />;
};
