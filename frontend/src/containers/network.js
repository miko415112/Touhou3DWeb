import { Manager } from 'socket.io-client';
const manager = new Manager('http://localhost:4001');
const socket = manager.socket('/');

socket.on('connect', () => {
  console.log('connected');
});

export const subscribePlayerChange = (callback) => {
  socket.on('playerChange', (playerList) => callback(playerList));
};

export const unSubscribePlayerChange = (callback) => {
  socket.off('playerChange', callback);
};

export const updatePlayer = (name, rigidState) => {
  const data = {
    name,
    rigidState,
  };
  socket.emit('updatePlayer', data);
};
