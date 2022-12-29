import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';

import { homeBackgroundImage } from '../components/resource';
import { useKeyboard } from './hooks/input';
import {
  JoinRoomModal,
  ChangeNameModal,
  SignInModal,
} from '../components/modal';
import { OptionPanel } from '../components/optionPanel';
import { useNetwork } from './hooks/network';
import { useUser } from './hooks/context';
import { displayStatus } from '../components/info';
import { Profile } from '../components/profile';
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
  position: relative;

  .optionPanel {
    width: 50%;
    height: 50%;
  }

  .profile {
    position: absolute;
    top: 20px;
    left: 20px;
  }
`;

const HomePage = () => {
  const { signInGame, changeName, createRoom, joinRoom, message } =
    useNetwork();
  const {
    location,
    signIn,
    name,
    google,
    setSignIn,
    setGoogle,
    setLocation,
    setPlayerID,
    setRoomID,
    setName,
  } = useUser();
  const movement = useKeyboard(keymap);
  const [selection, setSelection] = useState(0);
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
  const [changeNameModalOpen, setChangeNameModalOpen] = useState(false);
  const navigate = useNavigate();
  const optionNumber = 4;
  const options = ['Create Game', 'Join Game', 'Change Name', 'Log Out'];
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
    if (movement.select) {
      switch (selection) {
        case 0:
          OnCreateRoom();
          break;
        case 1:
          setJoinRoomModalOpen(true);
          break;
        case 2:
          setChangeNameModalOpen(true);
          break;
        case 3:
          OnLogOut();
          break;
      }
    }
  }, [movement]);

  useEffect(() => {
    displayStatus(message);
    if (message.type === 'success') {
      switch (message.event) {
        case 'SignIn':
          setName(message.name);
          break;
        case 'Change_Name':
          setName(message.name);
          break;
        case 'Create_Room':
          setPlayerID(message.playerID);
          setRoomID(message.roomID);
          setLocation('room');
          break;
        case 'Join_Room':
          setPlayerID(message.playerID);
          setRoomID(message.roomID);
          setLocation('room');
          break;
      }
    }
  }, [message]);

  const OnCreateRoom = () => {
    createRoom(google.email, name);
  };

  const OnJoinRoom = (values) => {
    const roomID = values.roomID;
    joinRoom(google.email, name, roomID);
    setJoinRoomModalOpen(false);
  };

  const OnSignIn = (response) => {
    const user = jwt_decode(response.credential);
    setGoogle(user);
    signInGame(user.email, user.name);
    setSignIn(true);
  };

  const OnSaveName = (values) => {
    changeName(google.email, values.name);
    setChangeNameModalOpen(false);
  };

  const OnLogOut = () => {
    setSignIn(false);
    setGoogle(null);
    setName('');
  };

  return (
    <>
      <ChangeNameModal
        open={changeNameModalOpen}
        onCancel={() => setChangeNameModalOpen(false)}
        onSave={OnSaveName}
      />
      <JoinRoomModal
        open={joinRoomModalOpen}
        onCancel={() => setJoinRoomModalOpen(false)}
        onJoin={OnJoinRoom}
      />
      <SignInModal open={signIn !== true} callback={OnSignIn} />
      <HomePageWrapper>
        {signIn ? <Profile src={google?.picture} name={name} /> : null}
        <OptionPanel options={options} selection={selection} />
      </HomePageWrapper>
    </>
  );
};

export default HomePage;
