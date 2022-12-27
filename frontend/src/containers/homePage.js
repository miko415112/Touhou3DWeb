import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { homeBackgroundImage } from '../components/resource';
import { useKeyboard } from './hooks/input';
import { JoinRoomModal, CreateRoomModal } from '../components/modal';
import { OptionPanel } from '../components/optionPanel';
import { useNetwork } from './hooks/network';
import { useUser } from './hooks/context';
import { displayStatus } from '../components/info';

const keymap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyZ: 'select',
};

const HomePageWrapper = styled.div`
  background-image: url(${homeBackgroundImage});
  background-repeat: no-repeat;
  width: 1200px;
  height: 675px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;

  .optionPanel {
    width: 50%;
    height: 50%;
  }
`;

const HomePage = () => {
  const { createRoom, joinRoom, message } = useNetwork();
  const { state, setState, setPlayerID, setRoomID, setName } = useUser();
  const movement = useKeyboard(keymap);
  const [selection, setSelection] = useState(0);
  const [joinRoomModalOpen, SetJoinRoomModalOpen] = useState(false);
  const [createRoomModalOpen, SetCreateRoomModalOpen] = useState(false);
  const navigate = useNavigate();
  const optionNumber = 4;
  const options = ['Create Game', 'Join Game', 'Create Game', 'Join Game'];

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
          SetCreateRoomModalOpen(true);
          break;
        case 1:
          SetJoinRoomModalOpen(true);
          break;
      }
    }
  }, [movement]);

  useEffect(() => {
    displayStatus(message);
    if (message.type === 'success') {
      setPlayerID(message.playerID);
      setRoomID(message.roomID);
      setName(message.name);
      setState('room');
    }
  }, [message]);

  const OnCreateRoom = (values) => {
    const name = values.name;
    createRoom(name);
    SetCreateRoomModalOpen(false);
  };

  const OnJoinRoom = (values) => {
    const name = values.name;
    const roomID = values.roomID;
    joinRoom(name, roomID);
    SetJoinRoomModalOpen(false);
  };

  return (
    <>
      <JoinRoomModal
        open={joinRoomModalOpen}
        onCancel={() => SetJoinRoomModalOpen(false)}
        onJoin={OnJoinRoom}
      />
      <CreateRoomModal
        open={createRoomModalOpen}
        onCancel={() => SetCreateRoomModalOpen(false)}
        onCreate={OnCreateRoom}
      />
      <HomePageWrapper>
        <OptionPanel options={options} selection={selection} />
      </HomePageWrapper>
    </>
  );
};

export default HomePage;
