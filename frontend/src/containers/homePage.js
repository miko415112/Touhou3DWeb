import { useState, useEffect } from 'react';
import styled from 'styled-components';
import backgroundImage from '../resource/background.png';
import { useKeyboard } from './hooks/input';
import { JoinRoomModal, CreateRoomModal } from '../components/modal';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const keymap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyZ: 'select',
};

const HomePageWrapper = styled.div`
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  width: 1200px;
  height: 675px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`;

const OptionPanelWrapper = styled.div`
  width: 50%;
  height: 50%;
  position: relative;
  [id='1'] {
    position: absolute;
    top: 0%;
    left: 40%;
  }
  [id='2'] {
    position: absolute;
    top: 20%;
    left: 32%;
  }
  [id='3'] {
    position: absolute;
    top: 40%;
    left: 24%;
  }
  [id='4'] {
    position: absolute;
    top: 60%;
    left: 16%;
  }
`;

const TouhouFont = styled.div`
  * {
    font-family: DFPOPコン W12;
    font-size: ${(props) => (props.hilight ? '3.4vw' : '3vw')};
    font-weight: bold;
    -webkit-text-stroke: 1px Black;
    background-image: ${(props) =>
      props.hilight
        ? 'linear-gradient(to bottom,white 30% ,red)'
        : 'linear-gradient(to bottom,white 30%,white)'};
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    opacity: ${(props) => (props.hilight ? 1 : 0.5)};
  }
`;

const OptionBlock = (props) => {
  return (
    <>
      <TouhouFont hilight={props.selection == props.id}>
        <div id={props.id}>{props.content}</div>
      </TouhouFont>
    </>
  );
};

export const HomePage = () => {
  const [selection, setSelection] = useState(1);
  const [joinRoomModalOpen, SetJoinRoomModalOpen] = useState(false);
  const [createRoomModalOpen, SetCreateRoomModalOpen] = useState(false);
  const navigate = useNavigate();
  const movement = useKeyboard(keymap);
  const optionNumber = 4;

  useEffect(() => {
    let newSelection = selection;
    if (movement.up) newSelection = selection - 1;
    if (movement.down) newSelection = selection + 1;
    if (newSelection > optionNumber) newSelection = newSelection % optionNumber;
    if (newSelection <= 0) newSelection = newSelection + optionNumber;
    setSelection(newSelection);
    if (movement.select) {
      switch (selection) {
        case 1:
          SetCreateRoomModalOpen(true);
          break;
        case 2:
          SetJoinRoomModalOpen(true);
          break;
      }
    }
  }, [movement]);

  const OnCreateRoom = (values) => {
    const roomID = uuidv4();
    const id = uuidv4();
    const name = values.name;
    navigate(`/room/${roomID}/${id}/${name}`);
  };

  const OnJoinRoom = (values) => {
    const id = uuidv4();
    const name = values.name;
    const roomID = values.roomID;
    navigate(`/room/${roomID}/${id}/${name}`);
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
        <OptionPanelWrapper>
          <OptionBlock content='Create Game' id={'1'} selection={selection} />
          <OptionBlock content='Join Game' id={'2'} selection={selection} />
          <OptionBlock content='Create Game' id={'3'} selection={selection} />
          <OptionBlock content='Join Game' id={'4'} selection={selection} />
        </OptionPanelWrapper>
      </HomePageWrapper>
    </>
  );
};
