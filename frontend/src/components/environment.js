import {
  getColumnTexture,
  getSkyboxTextureArray,
  getDirtTexture,
  getGrassTexture,
} from "./resource";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
export const Column = () => {
  const height = 12;
  const radius = 0.8;
  const width = 8;

  return (
    <>
      <mesh position={[0, height / 2 - 1, -width]}>
        <cylinderGeometry
          attach="geometry"
          args={[radius, radius, height, 32]}
        />
        <meshBasicMaterial attach="material" map={getColumnTexture()} />
      </mesh>
      <mesh position={[0, height / 2 - 1, width]}>
        <cylinderGeometry
          attach="geometry"
          args={[radius, radius, height, 32]}
        />
        <meshBasicMaterial attach="material" map={getColumnTexture()} />
      </mesh>
    </>
  );
};

export const Skybox = () => {
  const { scene } = useThree();
  scene.background = getSkyboxTextureArray();
  return null;
};

export const Ground = () => {
  const [dirtTexture, setTexture] = useState(getDirtTexture());
  const [grassTexture, setGrassTexture] = useState(getGrassTexture());
  const customShaderMaterial = useRef({
    uniforms: {
      u_grassTexture: { value: grassTexture },
      u_dirtTexture: { value: dirtTexture },
      u_boundary: { value: new Float32Array([-5, -8, 12, 8]) },
    },
    vertexShader: `
          
          precision highp float;
          varying vec3 vPosition;
          varying vec2 vUv;
          
          
          void main() {
              vUv = uv;
              vPosition = position;
              gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
        `,
    fragmentShader: `
          precision highp float;
          uniform sampler2D u_grassTexture;
          uniform sampler2D u_dirtTexture;
          uniform vec4 u_boundary;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            if(vPosition.x > u_boundary.x && vPosition.x < u_boundary.z && vPosition.y > u_boundary.y && vPosition.y < u_boundary.w)
            {
                gl_FragColor = texture2D(u_grassTexture,vUv*50.);
            }
            else 
                gl_FragColor =  texture2D(u_dirtTexture,vUv*100.);
          }
        `,
  });

  const height = -1;
  const width = 100;
  const length = 100;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height, 0]}>
      <planeGeometry attach="geometry" args={[length, width]} />
      <shaderMaterial attach="material" args={[customShaderMaterial.current]} />
    </mesh>
  );
};
