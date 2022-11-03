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
    <group dispose={null}>
      <group>
        <mesh
          {...props}
          geometry={nodes.Object_2.geometry}
          material={materials.Material_0}
        />
      </group>
    </group>
  );
};

useGLTF.preload('/model/Remilia/Scene.gltf');
