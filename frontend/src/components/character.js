import { RemiliaModel } from './resource';
export const Character = (props) => {
  switch (props.name) {
    case 'Remilia':
      return <RemiliaModel {...props} />;
  }
  return <RemiliaModel {...props} />;
};
