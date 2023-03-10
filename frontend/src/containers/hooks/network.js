import { useState, useEffect } from 'react';
import { Manager } from 'socket.io-client';

const API_ROOT =
  process.env.NODE_ENV === 'production'
    ? window.location.origin.replace(/^http/, 'ws')
    : 'ws://localhost:4000';
const manager = new Manager(API_ROOT);
const socket = manager.socket('/');

const signInGame = (email, name, picture) => {
  const data = {
    email,
    name,
    picture,
  };
  socket.emit('SignIn', data);
};

const logOutGame = (email) => {
  const data = {
    email,
  };
  socket.emit('LogOut', data);
};

const openFriendSystem = (email) => {
  const data = {
    email,
  };
  socket.emit('Open_FriendSystem', data);
};

const changeName = (email, name, picture) => {
  const data = {
    email,
    name,
    picture,
  };
  socket.emit('Change_Name', data);
};

const addFriend = (email_from, email_to) => {
  const data = {
    email_from,
    email_to,
  };
  socket.emit('Add_Friend', data);
};

const acceptFriend = (email_from, email_to) => {
  const data = {
    email_from,
    email_to,
  };
  socket.emit('Accept_Friend', data);
};

const deleteFriend = (email_from, email_to) => {
  const data = {
    email_from,
    email_to,
  };
  socket.emit('Delete_Friend', data);
};

const deleteRequest = (email_from, email_to) => {
  const data = {
    email_from,
    email_to,
  };
  socket.emit('Delete_Request', data);
};

const inviteFriend = (playerID, email_to, roomID) => {
  const data = {
    playerID,
    email_to,
    roomID,
  };
  socket.emit('Invite_Friend', data);
};

const createRoom = (email, name, picture) => {
  const data = {
    email,
    name,
    picture,
  };
  socket.emit('Create_Room', data);
};

const joinRoom = (email, name, roomID, picture) => {
  const data = {
    email,
    name,
    roomID,
    picture,
  };
  socket.emit('Join_Room', data);
};

const leaveRoom = (roomID, playerID) => {
  const data = {
    roomID: roomID,
    playerID: playerID,
  };
  socket.emit('Leave_Room', data);
};

const startGame = (roomID) => {
  const data = {
    roomID: roomID,
  };
  socket.emit('Start_Game', data);
};

const updatePlayer = (roomID, playerID, props) => {
  const data = {
    roomID: roomID,
    playerID: playerID,
    props,
  };
  socket.emit('Update_Player', data);
};

export const useNetwork = () => {
  const [playerList, setPlayerList] = useState();
  const [roomState, setRoomState] = useState();
  const [message, setMessage] = useState({});

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('Message', (msg) => {
      setMessage(msg);
    });
    socket.on('Room_Info', (room) => {
      setPlayerList(room.playerList);
      setRoomState(room.state);
    });
  }, []);

  return {
    updatePlayer,
    signInGame,
    logOutGame,
    changeName,
    openFriendSystem,
    addFriend,
    acceptFriend,
    deleteFriend,
    deleteRequest,
    inviteFriend,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    message,
    playerList,
    roomState,
  };
};
