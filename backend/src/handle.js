const playerList = [];
const rooms = new Set();

export const registerHandler = (io) => {
  handleConnection(io);
  //handleDisconnection(io);
  handlePlayerStateChange(io);
};

const handleConnection = (io) => {
  io.on('connection', function (socket) {
    console.log('a user connected');
    initailize(socket);
  });
};

const handleDisconnection = (io) => {
  io.on('disconnect', function (socket) {
    console.log('a user disconnected');
    const index = playerList.findIndex((e) => e.name === data.name);
    if (index !== -1) {
      playerList[index] = data;
    } else {
      playerList.push(data);
    }
  });
};

const handlePlayerStateChange = (io) => {
  setInterval(() => {
    io.emit('playerStateChange', playerList);
  }, 30);
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
