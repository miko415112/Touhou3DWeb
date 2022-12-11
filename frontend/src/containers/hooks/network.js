import { useState, useEffect } from 'react';
import { Manager } from 'socket.io-client';

const manager = new Manager('http://localhost:4000');
const socket = manager.socket('/');

export const useNetwork = () => {
  const [playerList, setPlayerList] = useState([]);

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
  }, []);

  return { playerList, updatePlayer };
};
