import {
  CubeTextureLoader,
  TextureLoader,
  sRGBEncoding,
  RepeatWrapping,
} from "three";

import { useGLTF } from "@react-three/drei";

const cubeTextureLoader = new CubeTextureLoader();
const textureLoader = new TextureLoader();

export const getShieldTexture = () => {
  const texture = textureLoader.load(require("./resource/shield.jpg"));
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

export const getColumnTexture = () => {
  const texture = textureLoader.load(require("./resource/kekkai.png"));
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(2, 1);
  return texture;
};

export const getSkyboxTextureArray = () => {
  const textureArray = cubeTextureLoader.load([
    require("./resource/skybox/corona_ft.png"),
    require("./resource/skybox/corona_bk.png"),
    require("./resource/skybox/corona_up.png"),
    require("./resource/skybox/corona_dn.png"),
    require("./resource/skybox/corona_rt.png"),
    require("./resource/skybox/corona_lf.png"),
  ]);

  textureArray.encoding = sRGBEncoding;

  return textureArray;
};

export const getDirtTexture = () => {
  const texture = textureLoader.load(require("./resource/dirt.jpg"));
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

export const getGrassTexture = () => {
  const texture = textureLoader.load(require("./resource/grass.jpg"));
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

export const getLargeBulletTexture = () => {
  const texture = textureLoader.load(
    require("./resource/bullet/largeBullet.png")
  );
  return texture;
};

export const getNormalBulletTexture = () => {
  const texture = textureLoader.load(
    require("./resource/bullet/normalBullet.png")
  );
  return texture;
};

export const getSplitBulletTexture = () => {
  const texture = textureLoader.load(
    require("./resource/bullet/splitBullet.png")
  );
  return texture;
};

export const getColorfulBulletTextureArray = () => {
  const red = textureLoader.load(require("./resource/bullet/redBullet.png"));
  const purple = textureLoader.load(
    require("./resource/bullet/purpleBullet.png")
  );
  const green = textureLoader.load(
    require("./resource/bullet/greenBullet.png")
  );
  const yellow = textureLoader.load(
    require("./resource/bullet/yellowBullet.png")
  );
  return [red, purple, green, yellow];
};

export const getPowerTexture = () => {
  const powerTexture = textureLoader.load(require("./resource/powerItem.png"));
  return powerTexture;
};

export const RemiliaModel = (props) => {
  const { nodes, materials } = useGLTF("model/Remilia/scene.gltf");
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
  const { nodes, materials } = useGLTF("model/Koishi/scene.gltf");
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
  const { nodes, materials } = useGLTF("model/Suwako/scene.gltf");
  return (
    <group {...props} dispose={null}>
      <group position={[0, -10, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials["Material.001"]}
        />
      </group>
    </group>
  );
};

export const MeilingModel = (props) => {
  const { nodes, materials } = useGLTF("model/Meiling/scene.gltf");
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
  const { nodes, materials } = useGLTF("model/Sakuya/scene.gltf");
  return (
    <group {...props} dispose={null}>
      <group scale={1}>
        <mesh
          geometry={nodes.Object_Material001_0.geometry}
          material={materials["Material.001"]}
          position={[0, -13, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={180}
        />
      </group>
    </group>
  );
};

export const SanaeModel = (props) => {
  const { nodes, materials } = useGLTF("model/Sanae/scene.gltf");
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

export const roomBackgroundImage = require("./resource/roomBackground.jpg");
export const homeBackgroundImage = require("./resource/background.png");
export const nameBorderImage = require("./resource/nameBorder.png");
export const charaBorderImage = require("./resource/charaBorder.png");
export const loadingGif = require("./resource/loading.gif");
export const googleLoginImage = require("./resource/btn_google_signin_dark_focus_web@2x.png");
export const introImage = require("./resource/De_Remilia.webp");
export const changeAudio = new Audio(
  require("./resource/sound/se_select00.wav")
);
export const deadAudio = new Audio(require("./resource/sound/se_pldead00.wav"));
export const selectAudio = new Audio(require("./resource/sound/ok00.wav"));
export const shoot0Audio = new Audio(require("./resource/sound/se_tan01.wav"));
export const shoot1Audio = new Audio(require("./resource/sound/se_option.wav"));
export const shoot2Audio = new Audio(require("./resource/sound/kira00.wav"));
export const shoot3Audio = new Audio(require("./resource/sound/se_tan02.wav"));

useGLTF.preload("model/Remilia/scene.gltf");
useGLTF.preload("model/Koishi/scene.gltf");
useGLTF.preload("model/Suwako/scene.gltf");
useGLTF.preload("model/Meiling/scene.gltf");
useGLTF.preload("model/Sakuya/scene.gltf");
useGLTF.preload("model/Sanae/scene.gltf");
