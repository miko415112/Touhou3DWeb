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
  position: relative;

  .optionPanel {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 85%;
    left: 78%;
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

  .resultPanel {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 10%;
    left: 50%;
  }
`;

const ResultWrapper = styled.div`
  width: fit-content;
  height: fit-content;
  font-family: DFPOPコン W12;
  font-size: 60pt;
  font-weight: bold;
  color: #05fae7;
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
  const {
    roomID,
    playerID,
    location,
    isLeader,
    showBox,
    setShowBox,
    setLocation,
  } = useUser();
  //switch pages
  const navigate = useNavigate();

  //optionPanel
  const [selection, setSelection] = useState(0);
  const [showOption, setShowOption] = useState(false);
  const optionNumber = 2;
  const options = ['Quit Game', showBox ? 'Hide Box' : 'Show Box'];
  const movement = useKeyboard(keymap);

  //result
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  useEffect(() => {
    if (location === 'game') navigate('/game', { replace: true });
    else if (location === 'room') navigate('/room', { replace: true });
    else if (location === 'home') navigate('/', { replace: true });
  }, [location]);

  useEffect(() => {
    if (!playerList) return;
    const leader = playerList.filter((player) => player.isLeader)[0];
    const others = playerList.filter((player) => !player.isLeader);
    if (others.length <= 0) return;
    const leaderDead = leader.healthPoints <= 0;
    let AllOthersDead = true;
    others.forEach((player) => {
      if (player.healthPoints > 0 || player.healthPoints === undefined)
        AllOthersDead = false;
    });
    if (isLeader && AllOthersDead && !win) setWin(true);
    else if (isLeader && leaderDead && !lose) setLose(true);
    else if (!isLeader && leaderDead && !win) setWin(true);
    else if (!isLeader && AllOthersDead && !lose) setLose(true);
  }, [playerList]);

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
      {win || lose ? (
        <ResultWrapper className='resultPanel'>
          {win ? 'YOU WIN' : 'YOU LOSE'}
        </ResultWrapper>
      ) : null}
      <GamePageProfile playerList={playerList} />
    </GamePageWrapper>
  );
};

export default GamePage;
