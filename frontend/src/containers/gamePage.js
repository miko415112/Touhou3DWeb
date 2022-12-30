import { Canvas } from '@react-three/fiber';
import { Skybox, Ground } from '../components/environment';
import { Physics } from '@react-three/cannon';
import { Players } from './players';
import styled from 'styled-components';

const GamePageWrapper = styled.div`
  width: 1200px;
  height: 675px;
`;

const GamePage = () => {
  return (
    <GamePageWrapper>
      <Canvas>
        <Skybox />
        <Ground />
        <Physics>
          <Players />
        </Physics>
      </Canvas>
    </GamePageWrapper>
  );
};

export default GamePage;
