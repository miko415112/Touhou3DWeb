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

const leaveRoom = (playerID) => {
  const data = {
    playerID: playerID,
  };
  socket.emit('Leave_Room', data);
};

export const useNetwork = () => {
  const [playerList, setPlayerList] = useState([]);
  const [message, setMessage] = useState({});

  const updatePlayer = (name, rigidState) => {
    const data = {
      name,
      rigidState,
    };
    socket.emit('playerStateChange', data);
  };

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
  }, []);

  return {
    playerList,
    updatePlayer,
    createRoom,
    joinRoom,
    message,
    leaveRoom,
  };
};
