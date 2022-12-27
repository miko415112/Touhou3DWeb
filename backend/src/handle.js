import uuid4 from 'uuid4';

const rooms = new Map();
let connections = 0;

export const registerHandler = (io) => {
  handleConnection(io);
  handleBroadcast(io);
  handleConsoleLog(io);
};

const handleConnection = (io) => {
  io.on('connection', function (socket) {
    handleDisconnection(socket);
    handleCreateRoom(socket);
    handleJoinRoom(socket);
    handleLeaveRoom(socket);

    connections++;
    console.log(`user ${socket.id} connected`);
  });
};

const handleCreateRoom = (socket) => {
  socket.on('Create_Room', ({ name }) => {
    const roomID = uuid4();
    const playerID = socket.id;
    const playerList = new Map();
    playerList.set(playerID, {
      name: name,
      modelName: 'Remilia',
    });
    rooms.set(roomID, { playerList: playerList, state: 'choosing' });

    socket.join(roomID);
    socket.emit('Message', {
      type: 'success',
      msg: 'created room successfully',
      roomID: roomID,
      playerID: playerID,
      name: name,
    });

    console.log(`user ${playerID} created room ${roomID}`);
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

    if (room.playerList.size >= 4) {
      socket.emit('Message', {
        type: 'error',
        msg: 'room is full',
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
      roomID: roomID,
      playerID: playerID,
      name: name,
    });

    console.log(`user ${playerID} joined room ${roomID}`);
  });
};

const handleDisconnection = (socket) => {
  socket.on('disconnect', () => {
    const playerID = socket.id;
    rooms.forEach((value, key) => {
      if (value.playerList.has(playerID)) value.playerList.delete(playerID);
      if (value.playerList.size === 0) rooms.delete(key);
    });
    connections--;
    console.log(`user ${playerID} disconnected`);
  });
};

const handleLeaveRoom = (socket) => {
  socket.on('Leave_Room', ({ playerID, roomID }) => {
    const room = rooms.get(roomID);
    room.playerList.delete(playerID);
    if (room.playerList.size === 0) rooms.delete(roomID);
    socket.leave(roomID);
    console.log(`user ${playerID} has left room ${roomID}`);
  });
};

const handleBroadcast = (io) => {
  setInterval(() => {
    rooms.forEach((value, key) => {
      const payload = value;
      io.to(key).emit(payload);
    });
  }, 60);
  console.log('start broadcasting');
};

const handleConsoleLog = (io) => {
  setInterval(() => {
    console.log(rooms);
    console.log('connection : ', connections);
  }, 1000);
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
