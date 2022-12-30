import {
  CubeTextureLoader,
  TextureLoader,
  sRGBEncoding,
  RepeatWrapping,
} from 'three';

import { useGLTF } from '@react-three/drei';

const cubeTextureLoader = new CubeTextureLoader();
const textureLoader = new TextureLoader();

export const getSkyboxTextureArray = () => {
  const textureArray = cubeTextureLoader.load([
    require('../resource/skybox/corona_ft.png'),
    require('../resource/skybox/corona_bk.png'),
    require('../resource/skybox/corona_up.png'),
    require('../resource/skybox/corona_dn.png'),
    require('../resource/skybox/corona_rt.png'),
    require('../resource/skybox/corona_lf.png'),
  ]);

  textureArray.encoding = sRGBEncoding;

  return textureArray;
};

export const getGroundTexture = () => {
  const texture = textureLoader.load(require('../resource/dirt.jpg'));
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(100, 100);
  return texture;
};

export const RemiliaModel = (props) => {
  const { nodes, materials } = useGLTF('/model/Remilia/Scene.gltf');
  return (
    <group {...props} dispose={null}>
      <group position={[0, 2, 0]}>
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials.Material_0}
        />
      </group>
    </group>
  );
};

export const KoishiModel = (props) => {
  const { nodes, materials } = useGLTF('/model/Koishi/Scene.gltf');
  return (
    <group {...props} dispose={null}>
      <group position={[0, -135, 0]} rotation={[0, Math.PI / 2, 0]} scale={0.8}>
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials.Material_u1_v1}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials.Material_u1_v1}
        />
      </group>
    </group>
  );
};

export const SuwakoModel = (props) => {
  const { nodes, materials } = useGLTF('/model/Suwako/Scene.gltf');
  return (
    <group {...props} dispose={null}>
      <group position={[0, -10, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials['Material.001']}
        />
      </group>
    </group>
  );
};

export const MeilingModel = (props) => {
  const { nodes, materials } = useGLTF('/model/Meiling/Scene.gltf');
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Object_4.geometry}
        material={materials.Material_u1_v1}
        rotation={[0, 0, 0]}
        position={[0, -9, 0]}
      />
    </group>
  );
};

export const SakuyaModel = (props) => {
  const { nodes, materials } = useGLTF('/model/Sakuya/Scene.gltf');
  return (
    <group {...props} dispose={null}>
      <group scale={1}>
        <mesh
          geometry={nodes.Object_Material001_0.geometry}
          material={materials['Material.001']}
          position={[0, -13, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={180}
        />
      </group>
    </group>
  );
};

export const SanaeModel = (props) => {
  const { nodes, materials } = useGLTF('/model/Sanae/Scene.gltf');
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Object_4.geometry}
        material={materials.Material_u1_v1}
        rotation={[-0, 0, 0]}
        position={[0, -9, 0]}
        scale={0.7}
      />
    </group>
  );
};

export const roomBackgroundImage = require('../resource/roomBackground.jpg');
export const homeBackgroundImage = require('../resource/background.png');
export const nameBorderImage = require('../resource/nameBorder.png');
export const charaBorderImage = require('../resource/charaBorder.png');

useGLTF.preload('/model/Remilia/Scene.gltf');
useGLTF.preload('/model/Koishi/Scene.gltf');
useGLTF.preload('/model/Suwako/Scene.gltf');
useGLTF.preload('/model/Meiling/Scene.gltf');
useGLTF.preload('/model/Sakuya/Scene.gltf');
useGLTF.preload('/model/Sanae/Scene.gltf');
