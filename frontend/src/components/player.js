import { RemiliaModel } from '../components/resource';
const modelMap = {
  Remilia: RemiliaModel,
};
export const Player = (props) => {
  return (
    <RemiliaModel
      position={props.position}
      scale={props.scale}
      rotation={props.rotation}
    />
  );
};
