import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';

import { displayInvitation } from '../components/info';
import { homeBackgroundImage } from '../components/resource';
import { useKeyboard } from './hooks/input';
import {
  JoinRoomModal,
  ChangeNameModal,
  SignInModal,
  FriendsModal,
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
    height: 60%;
  }

  .profile {
    position: absolute;
    top: 20px;
    left: 20px;
  }
`;

const HomePage = () => {
  //use option panel
  const movement = useKeyboard(keymap);
  const [selection, setSelection] = useState(0);
  const optionNumber = 5;
  const options = [
    'Create Game',
    'Join Game',
    'Change Name',
    'Friends',
    'Log Out',
  ];
  //manage modals
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
  const [changeNameModalOpen, setChangeNameModalOpen] = useState(false);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);
  //switch pages
  const navigate = useNavigate();
  //useNetwork
  const {
    signInGame,
    logOutGame,
    changeName,
    openFriendSystem,
    addFriend,
    acceptFriend,
    deleteFriend,
    deleteRequest,
    createRoom,
    joinRoom,
    message,
  } = useNetwork();

  //save data
  const {
    location,
    signIn,
    name,
    google,
    requests,
    friends,
    roomID,
    setSignIn,
    setGoogle,
    setRequests,
    setFriends,
    setLocation,
    setPlayerID,
    setRoomID,
    setName,
  } = useUser();

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
          openFriendSystem(google.email);
          setFriendsModalOpen(true);
          break;
        case 4:
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
          setSignIn(true);
          setName(message.name);
          setRequests(message.requests);
          setFriends(message.friends);
          break;
        case 'Change_Name':
          setName(message.name);
          break;
        case 'Open_FriendSystem':
          setRequests(message.requests);
          setFriends(message.friends);
          break;
        case 'Add_Friend':
          break;
        case 'Accept_Friend':
          setRequests(message.requests);
          setFriends(message.friends);
          break;
        case 'Delete_Friend':
          setFriends(message.friends);
          break;
        case 'Delete_Request':
          setRequests(message.requests);
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
        case 'Invite_Friend':
          if (message.roomID !== undefined) {
            displayInvitation(message.user, () => {
              OnJoinRoom({ roomID: message.roomID });
            });
          }
          break;
        case 'LogOut':
          setSignIn(false);
          setGoogle(null);
          setName('');
          break;
      }
    }
  }, [message]);

  const OnSignIn = (response) => {
    const user = jwt_decode(response.credential);
    setGoogle(user);
    signInGame(user.email, user.name, user.picture);
  };

  const OnAddFriend = (values) => {
    const email_to = values.email;
    const email_from = google.email;
    addFriend(email_from, email_to);
  };

  const OnAcceptFriend = (email_from) => {
    const email_to = google.email;
    acceptFriend(email_from, email_to);
  };

  const OnDeleteFriend = (email_to) => {
    const email_from = google.email;
    deleteFriend(email_from, email_to);
  };

  const OnDeleteRequest = (email_to) => {
    const email_from = google.email;
    deleteRequest(email_from, email_to);
  };

  const OnCreateRoom = () => {
    createRoom(google.email, name);
  };

  const OnJoinRoom = (values) => {
    const roomID = values.roomID;
    joinRoom(google.email, name, roomID);
    setJoinRoomModalOpen(false);
  };

  const OnSaveName = (values) => {
    changeName(google.email, values.name, google.picture);
    setChangeNameModalOpen(false);
  };

  const OnLogOut = () => {
    logOutGame(google.email);
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
      <FriendsModal
        open={friendsModalOpen}
        onCancel={() => setFriendsModalOpen(false)}
        onAddFriend={OnAddFriend}
        onAcceptFriend={OnAcceptFriend}
        onDeleteFriend={OnDeleteFriend}
        onDeleteRequest={OnDeleteRequest}
        requests={requests}
        friends={friends}
      ></FriendsModal>
      <HomePageWrapper>
        {signIn ? <Profile src={google?.picture} name={name} /> : null}
        <OptionPanel options={options} selection={selection} />
      </HomePageWrapper>
    </>
  );
};

export default HomePage;
