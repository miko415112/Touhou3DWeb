import { getSkyboxTextureArray, getGroundTexture } from './resource';
import { useThree } from '@react-three/fiber';
import { useCylinder } from '@react-three/cannon';
export const Skybox = () => {
  const { scene } = useThree();
  scene.background = getSkyboxTextureArray();
  return null;
};

export const Ground = () => {
  const [ref, api] = useCylinder(() => ({
    type: 'Static',
    collisionFilterGroup: 2,
    args: [20, 20, 20, 20],
    position: [0, 0, 0],
  }));
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <circleGeometry attach='geometry' args={[200]} />
      <meshBasicMaterial attach='material' map={getGroundTexture()} />
    </mesh>
  );
};
