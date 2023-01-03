import { getSkyboxTextureArray, getGroundTexture } from './resource';
import { useThree } from '@react-three/fiber';
export const Skybox = () => {
  const { scene } = useThree();
  scene.background = getSkyboxTextureArray();
  return null;
};

export const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry attach='geometry' args={[26, 16]} />
      <meshBasicMaterial attach='material' map={getGroundTexture()} />
    </mesh>
  );
};
