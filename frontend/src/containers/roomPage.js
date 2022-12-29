import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { View } from '@react-three/drei';
import styled from 'styled-components';

import { roomBackgroundImage } from '../components/resource';
import { RotationCharacter, characterList } from '../components/character';
import { PlayerCard } from '../components/playerCard';
import { useKeyboard } from './hooks/input';
import { OptionPanel } from '../components/optionPanel';
import { useUser } from './hooks/context';
import { displayRoomID, displayStatus } from '../components/info';
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
  const [selection, setSelection] = useState(3);
  const [modelIndex, setModelIndex] = useState(0);
  const [state, setState] = useState('choosing');
  const { location, setLocation, roomID, playerID, modelName, setModelName } =
    useUser();
  const { message, playerList, roomState, leaveRoom, startGame, updatePlayer } =
    useNetwork();
  const [me, setMe] = useState();
  const [others, setOthers] = useState();
  const navigate = useNavigate();
  const optionNumber = 4;
  const textOptions = ['Start', 'Quit', 'RoomID'];
  const movement = useKeyboard(keymap);

  const canvasRef = useRef();
  const player0Ref = useRef();
  const player1Ref = useRef();
  const player2Ref = useRef();
  const player3Ref = useRef();
  const playerRefArray = useRef([player1Ref, player2Ref, player3Ref]);

  useEffect(() => {
    const newMe = playerList?.filter(
      (player) => player.playerID === playerID
    )[0];

    const newOthers = playerList?.filter(
      (player) => player.playerID !== playerID
    );

    if (newOthers?.length < 3) {
      const emptyNum = 3 - newOthers.length;
      for (let i = 1; i <= emptyNum; i++) {
        newOthers.push({ state: 'waiting' });
      }
    }

    setMe(newMe);
    setOthers(newOthers);
    console.log(playerID);
  }, [playerList]);

  useEffect(() => {
    if (roomState === 'playing') {
      setModelName(me.modelName);
      setLocation('game');
    }
  }, [roomState]);

  useEffect(() => {
    if (location === 'game') navigate('/game', { replace: true });
    else if (location === 'room') navigate('/room', { replace: true });
    else if (location === 'home') navigate('/', { replace: true });
  }, [location]);

  useEffect(() => {
    let newSelection = selection;
    if (movement.up) newSelection = selection - 1;
    if (movement.down) newSelection = selection + 1;
    if (newSelection >= optionNumber) newSelection = 0;
    if (newSelection <= -1) newSelection = newSelection + optionNumber;
    setSelection(newSelection);

    if (newSelection === 3) {
      let newModelIndex = modelIndex;
      if (movement.right) newModelIndex++;
      if (movement.left) newModelIndex--;
      if (newModelIndex >= characterList.length) newModelIndex = 0;
      if (newModelIndex <= -1) newModelIndex = characterList.length - 1;
      setModelIndex(newModelIndex);
      setState('choosing');
    }

    if (movement.select) {
      switch (selection) {
        case 0:
          startGame(roomID);
          break;
        case 1:
          leaveRoom(roomID, playerID);
          setLocation('home');
          break;
        case 2:
          displayRoomID(roomID);
          break;
        case 3:
          setState('ready');
          setSelection(0);
          break;
      }
    }
  }, [movement]);

  useEffect(() => {
    updatePlayer(roomID, playerID, {
      modelName: characterList[modelIndex],
      state: state,
    });
  }, [modelIndex, state]);

  useEffect(() => {
    displayStatus(message);
    if (message.type === 'success') {
      setLocation('game');
    }
  }, [message]);

  return (
    <>
      <RoomPageWrapper ref={canvasRef}>
        <PlayerSectionWrapper>
          <SectionWrapper>
            <PlayerCard
              ref={player0Ref}
              name={me?.name}
              state={me?.state}
              isLeader={me?.isLeader}
              showArrow={selection === 3}
            />
          </SectionWrapper>
          <SectionWrapper>
            {others?.map((other, index) => (
              <PlayerCard
                key={index}
                ref={playerRefArray.current[index]}
                name={other.name}
                state={other.state}
                modelName={other.modelName}
                isLeader={other.isLeader}
              />
            ))}
          </SectionWrapper>
        </PlayerSectionWrapper>
        <Canvas eventSource={canvasRef} className='canvas'>
          {
            <View track={player0Ref}>
              <RotationCharacter
                spin={me?.state === 'choosing'}
                modelName={me?.modelName}
                scale={0.23}
              />
            </View>
          }
          {others?.map((other, index) =>
            other.state !== 'waiting' ? (
              <View track={playerRefArray.current[index]} key={index}>
                <RotationCharacter
                  spin={other.state === 'choosing'}
                  modelName={other.modelName}
                  scale={0.23}
                />
              </View>
            ) : null
          )}
        </Canvas>
        <OptionSectionWrapper>
          <OptionPanel options={textOptions} selection={selection} />
        </OptionSectionWrapper>
      </RoomPageWrapper>
    </>
  );
};

export default RoomPage;
