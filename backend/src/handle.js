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
    handleStartGame(socket);
    handleLeaveRoom(socket);
    handlePlayerStateChange(socket);
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
      state: 'choosing',
      isLeader: true,
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
      modelName: 'Remilia',
      state: 'choosing',
      isLeader: false,
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

const handleStartGame = (socket) => {
  socket.on('Start_Game', ({ roomID }) => {
    const room = rooms.get(roomID);
    let allReady = true;
    room.playerList.forEach((player, playerID) => {
      if (player.state !== 'ready') allReady = false;
    });

    if (allReady) {
      room.state = 'playing';
      socket.emit('Message', {
        type: 'success',
        msg: 'started room successfully',
      });
    } else {
      socket.emit('Message', {
        type: 'error',
        msg: 'someone is not ready',
      });
    }
    console.log(`room ${roomID} started`);
  });
};

const handleDisconnection = (socket) => {
  socket.on('disconnect', () => {
    const playerID = socket.id;
    rooms.forEach((value, key) => {
      if (value.playerList.has(playerID)) {
        const isLeader = value.playerList.get(playerID).isLeader;
        value.playerList.delete(playerID);
        if (value.playerList.size !== 0 && isLeader) {
          const [firstKey] = value.playerList.keys();
          value.playerList.set(firstKey, {
            ...value.playerList.get(firstKey),
            isLeader: true,
          });
        } else if (value.playerList.size === 0) rooms.delete(key);
      }
    });
    connections--;
    console.log(`user ${playerID} disconnected`);
  });
};

const handleLeaveRoom = (socket) => {
  socket.on('Leave_Room', ({ playerID, roomID }) => {
    const room = rooms.get(roomID);
    if (!room) return;
    const isLeader = room.playerList.get(playerID).isLeader;
    room.playerList.delete(playerID);
    if (room.playerList.size !== 0 && isLeader) {
      const [firstKey] = room.playerList.keys();
      room.playerList.set(firstKey, {
        ...room.playerList.get(firstKey),
        isLeader: true,
      });
    } else if (room.playerList.size === 0) rooms.delete(roomID);
    socket.leave(roomID);
    console.log(`user ${playerID} has left room ${roomID}`);
  });
};

const handlePlayerStateChange = (socket) => {
  socket.on('Player_State_Change', ({ roomID, playerID, props }) => {
    const room = rooms.get(roomID);
    if (!room) return;
    const prev = room.playerList.get(playerID);
    room.playerList.set(playerID, {
      ...prev,
      ...props,
    });
    console.log(`user ${playerID} state changed`);
  });
};

const handleBroadcast = (io) => {
  setInterval(() => {
    rooms.forEach((room, roomID) => {
      const playerList = Array.from(room.playerList, ([name, value]) => ({
        playerID: name,
        ...value,
      }));
      const payload = {
        ...room,
        playerList,
      };
      io.to(roomID).emit('Room_Info', payload);
    });
  }, 80);
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
