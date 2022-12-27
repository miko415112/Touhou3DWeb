import { useState, useEffect } from 'react';
import { Manager } from 'socket.io-client';

const manager = new Manager('http://localhost:4000');
const socket = manager.socket('/');

const createRoom = (name) => {
  const data = {
    name,
  };
  socket.emit('Create_Room', data);
};

const joinRoom = (name, roomID) => {
  const data = {
    name,
    roomID,
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
  socket.emit('Player_State_Change', data);
};

export const useNetwork = () => {
  const [playerList, setPlayerList] = useState();
  const [roomState, setRoomState] = useState();
  const [message, setMessage] = useState({});

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('playerStateChange', (newPlayerList) =>
      setPlayerList(newPlayerList)
    );
    socket.on('Message', (msg) => {
      setMessage(msg);
    });
    socket.on('Room_Info', (room) => {
      setPlayerList(room.playerList);
      setRoomState(room.state);
      console.log(room);
    });
  }, []);

  return {
    updatePlayer,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    message,
    playerList,
    roomState,
  };
};
