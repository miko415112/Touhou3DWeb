import uuid4 from 'uuid4';

const rooms = new Map();
let connections = 0;

export const registerHandler = (io) => {
  handleConnection(io);
  handlePlayerStateChange(io);
};

const handleConnection = (io) => {
  io.on('connection', function (socket) {
    connections++;
    console.log(`user ${socket.id} connected`);
    handleDisconnection(socket);
    handleCreateRoom(socket);
    handleJoinRoom(socket);
  });
};

const handleCreateRoom = (socket) => {
  socket.on('Create_Room', ({ name }) => {
    const roomID = uuid4();
    const playerID = socket.id;
    const playerList = new Map();
    playerList.set(playerID, {
      name: name,
    });
    rooms.set(roomID, { playerList: playerList });

    socket.join(roomID);
    socket.emit('Message', {
      type: 'success',
      msg: 'created room successfully',
      roomID: roomID,
      playerID: playerID,
    });
  });
};

const handleJoinRoom = (socket) => {
  socket.on('Join_Room', ({ name, roomID }) => {
    const playerID = socket.id;
    const room = rooms.get(roomID);
    if (!room) {
      socket.emit('Message', {
        type: 'error',
        msg: 'room not found',
      });
      return;
    }
    room.playerList.set(playerID, {
      name: name,
    });
    socket.join(roomID);
    socket.emit('Message', {
      type: 'success',
      msg: 'joined room successfully',
    });
  });
};

const handleDisconnection = (socket) => {
  socket.on('disconnect', () => {
    connections--;
    console.log(`user ${socket.id} disconnected`);
    rooms.forEach((value, key) => {
      if (value.playerList.has(socket.id)) value.playerList.delete(socket.id);
      if (value.playerList.size === 0) rooms.delete(key);
    });
  });
};

const handlePlayerStateChange = (io) => {
  setInterval(() => {
    console.log(rooms);
    console.log('connection : ', connections);
    //io.emit('playerStateChange', playerList);
  }, 500);
};

const initailize = (socket) => {
  socket.on('playerStateChange', OnPlayerStateChange);
};

const OnPlayerStateChange = (data) => {
  const index = playerList.findIndex((e) => e.name === data.name);
  if (index !== -1) {
    playerList[index] = data;
  } else {
    playerList.push(data);
  }
  console.log(data);
};
