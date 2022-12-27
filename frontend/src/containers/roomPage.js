import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { View } from '@react-three/drei';
import styled from 'styled-components';

import { roomBackgroundImage } from '../components/resource';
import { RotationCharacter } from '../components/character';
import { PlayerCard } from '../components/playerCard';
import { useKeyboard } from './hooks/input';
import { OptionPanel } from '../components/optionPanel';
import { useUser } from './hooks/context';
import { displayRoomID } from '../components/info';
import { useNetwork } from './hooks/network';

const keymap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowRight: 'right',
  ArrowLeft: 'left',
  KeyZ: 'select',
};

const RoomPageWrapper = styled.div`
  background-image: url(${roomBackgroundImage});
  background-repeat: no-repeat;
  width: 1200px;
  height: 675px;
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .canvas {
    position: fixed !important;
    top: -30px;
    left: 0px;
  }
`;

const OptionSectionWrapper = styled.div`
  width: 25%;
  height: 60%;
  display: flex;
`;

const PlayerSectionWrapper = styled.div`
  width: 75%;
  height: 100%;
`;

const SectionWrapper = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
`;

const RoomPage = () => {
  const [selection, setSelection] = useState(0);
  const { state, setState, roomID, playerID } = useUser();
  const { leaveRoom } = useNetwork();
  const navigate = useNavigate();
  const optionNumber = 4;
  const textOptions = ['Start', 'Quit', 'RoomID'];
  const movement = useKeyboard(keymap);

  const canvasRef = useRef();
  const localPlayerRef = useRef();
  const player1Ref = useRef();
  const player2Ref = useRef();
  const player3Ref = useRef();

  useEffect(() => {
    if (state === 'game') navigate('/game', { replace: true });
    else if (state === 'room') navigate('/room', { replace: true });
    else if (state === 'home') navigate('/', { replace: true });
  }, [state]);

  useEffect(() => {
    let newSelection = selection;
    if (movement.up) newSelection = selection - 1;
    if (movement.down) newSelection = selection + 1;
    if (newSelection >= optionNumber) newSelection = 0;
    if (newSelection <= -1) newSelection = newSelection + optionNumber;
    setSelection(newSelection);
    if (movement.select) {
      switch (selection) {
        case 0:
          break;
        case 1:
          leaveRoom(playerID);
          setState('home');
          break;
        case 2:
          displayRoomID(roomID);
          break;
      }
    }
  }, [movement]);

  return (
    <>
      <RoomPageWrapper ref={canvasRef}>
        <PlayerSectionWrapper>
          <SectionWrapper>
            <PlayerCard ref={localPlayerRef} name={'miko'} state={'ready'} />
          </SectionWrapper>
          <SectionWrapper>
            <PlayerCard ref={player1Ref} name={'miko'} state={'waiting'} />
            <PlayerCard ref={player2Ref} name={'miko'} state={'choosing'} />
            <PlayerCard ref={player3Ref} name={'miko'} state={'choosing'} />
          </SectionWrapper>
        </PlayerSectionWrapper>
        <Canvas eventSource={canvasRef} className='canvas'>
          <View track={localPlayerRef}>
            <RotationCharacter spin={true} modelName={'Remilia'} scale={0.23} />
          </View>
          <View track={player1Ref}>
            <RotationCharacter spin={true} modelName={'Remilia'} scale={0.23} />
          </View>
          <View track={player2Ref}>
            <RotationCharacter spin={true} modelName={'Remilia'} scale={0.23} />
          </View>
          <View track={player3Ref}>
            <RotationCharacter spin={true} modelName={'Remilia'} scale={0.23} />
          </View>
        </Canvas>
        <OptionSectionWrapper>
          <OptionPanel options={textOptions} selection={selection} />
        </OptionSectionWrapper>
      </RoomPageWrapper>
    </>
  );
};

export default RoomPage;
