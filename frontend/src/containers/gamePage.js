import { Canvas } from '@react-three/fiber';
import { Skybox, Ground } from '../components/environment';
import { Physics } from '@react-three/cannon';
import { Players } from './players';
import styled from 'styled-components';
import { OptionPanel } from '../components/optionPanel';
import { useState, useRef, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboard } from './hooks/input';
import { useNetwork } from './hooks/network';
import { useUser } from './hooks/context';
import { Bullets } from './bullets';
import { GamePageProfile } from '../components/profile';

const GamePageWrapper = styled.div`
  width: 1200px;
  height: 675px;

  .optionPanel {
    position: absolute;
    top: 50%;
    left: 40%;
    width: 50%;
    height: 50%;
  }

  .profile {
    position: absolute;
    top: 0%;
    left: 0%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const keymap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowRight: 'right',
  ArrowLeft: 'left',
  KeyZ: 'select',
  KeyQ: 'switch',
};

const Scene = memo(() => {
  return (
    <Canvas>
      <Skybox />
      <Physics>
        <Ground />
        <Players />
        <Bullets />
      </Physics>
    </Canvas>
  );
});

const GamePage = () => {
  const { playerList, leaveRoom } = useNetwork();
  const { roomID, playerID, location, showBox, setShowBox, setLocation } =
    useUser();
  //switch pages
  const navigate = useNavigate();

  //optionPanel
  const [selection, setSelection] = useState(0);
  const [showOption, setShowOption] = useState(false);
  const optionNumber = 2;
  const options = ['Quit Game', showBox ? 'Hide Box' : 'Show Box'];
  const movement = useKeyboard(keymap);

  useEffect(() => {
    if (location === 'game') navigate('/game', { replace: true });
    else if (location === 'room') navigate('/room', { replace: true });
    else if (location === 'home') navigate('/', { replace: true });
  }, [location]);

  useEffect(() => {
    if (movement.switch) {
      setShowOption((prev) => !prev);
    }

    if (!showOption) return;

    let newSelection = selection;
    if (movement.up) newSelection = selection - 1;
    if (movement.down) newSelection = selection + 1;
    if (newSelection >= optionNumber) newSelection = 0;
    if (newSelection <= -1) newSelection = newSelection + optionNumber;
    setSelection(newSelection);

    if (movement.select) {
      switch (selection) {
        case 0:
          leaveRoom(roomID, playerID);
          setLocation('home');
          break;
        case 1:
          setShowBox((prev) => !prev);
          break;
      }
    }
  }, [movement]);

  return (
    <GamePageWrapper>
      <Scene />
      {showOption ? (
        <OptionPanel options={options} selection={selection} />
      ) : null}
      <GamePageProfile playerList={playerList} />
    </GamePageWrapper>
  );
};

export default GamePage;
