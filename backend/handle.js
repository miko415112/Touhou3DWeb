import uuid4 from 'uuid4';
import { UserModel } from './mongo/model';
const rooms = new Map();
const onlinePlayers = new Map();
let connections = 0;

export const registerHandler = (io) => {
  handleConnection(io);
  handleBroadcast(io);
  handleConsoleLog(io);
};

const handleConnection = (io) => {
  io.on('connection', function (socket) {
    handleDisconnection(socket);
    handleSignIn(socket);
    handleLogOut(socket);
    handleChangeName(socket);
    handleCreateRoom(socket);
    handleJoinRoom(socket);
    handleOpenFriendSystem(socket);
    handleInviteFriend(io, socket);
    handleAddFriend(socket);
    handleAcceptFriend(socket);
    handleDeleteFriend(socket);
    handleDeleteRequest(socket);
    handleStartGame(socket);
    handleLeaveRoom(socket);
    handleUpdatePlayer(socket);
    connections++;
    console.log(`user ${socket.id} connected`);
  });
};

const handleSignIn = (socket) => {
  socket.on('SignIn', async ({ email, name, picture }) => {
    let user = await UserModel.findOne({ email: email });

    if (!user)
      user = await new UserModel({
        email: email,
        name: name,
        picture: picture,
      }).save();

    await user.populate('requests friends');

    socket.emit('Message', {
      event: 'SignIn',
      type: 'success',
      msg: 'signed in successfully',
      name: user.name,
      requests: user.requests,
      friends: user.friends,
    });

    onlinePlayers.set(socket.id, {
      email: email,
      picture: picture,
      name: user.name,
      requests: user.requests,
      friends: user.friends,
    });

    console.log(`user ${email} signIn`);
  });
};

const handleChangeName = (socket) => {
  socket.on('Change_Name', async ({ email, name, picture }) => {
    let user = await UserModel.findOne({ email: email });
    if (!user)
      await new UserModel({
        email: email,
        name: name,
        picture: picture,
      }).save();
    else await UserModel.updateOne({ email: email }, { $set: { name: name } });

    socket.emit('Message', {
      event: 'Change_Name',
      type: 'success',
      msg: 'changed name successfully',
      name: name,
    });

    console.log(`user update name :${name}`);
  });
};

const handleOpenFriendSystem = (socket) => {
  socket.on('Open_FriendSystem', async ({ email }) => {
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      socket.emit('Message', {
        type: 'error',
        msg: 'data not found',
      });
      return;
    }

    await user.populate('requests');
    await user.populate('friends');

    const old_data = onlinePlayers.get(socket.id);
    onlinePlayers.set(socket.id, {
      ...old_data,
      requests: user.requests,
      friends: user.friends,
    });

    const onlineFriends = [];
    onlinePlayers.forEach((player, playerID) => {
      if (user.friends.some((friend) => friend.email === player.email))
        onlineFriends.push(player);
    });

    socket.emit('Message', {
      event: 'Open_FriendSystem',
      type: 'success',
      msg: 'fetched data successfully',
      requests: user.requests,
      friends: user.friends,
      onlineFriends: onlineFriends,
    });

    console.log(`user ${email} fetched data `);
  });
};

const handleAddFriend = (socket) => {
  socket.on('Add_Friend', async ({ email_from, email_to }) => {
    let user_from = await UserModel.findOne({ email: email_from });
    let user_to = await UserModel.findOne({ email: email_to });
    if (!user_from || !user_to) {
      socket.emit('Message', {
        type: 'error',
        msg: 'user not found',
      });
      return;
    }

    await UserModel.updateOne(
      { email: email_to },
      { $push: { requests: user_from._id } }
    );

    socket.emit('Message', {
      event: 'Add_Friend',
      type: 'success',
      msg: 'sent request successfully',
    });

    console.log(`user ${email_from} sent friend request to ${email_to}`);
  });
};

const handleAcceptFriend = (socket) => {
  socket.on('Accept_Friend', async ({ email_from, email_to }) => {
    let user_from = await UserModel.findOne({ email: email_from });
    let user_to = await UserModel.findOne({ email: email_to });
    if (!user_from || !user_to) {
      socket.emit('Message', {
        type: 'error',
        msg: 'user not found',
      });
      return;
    }

    await UserModel.updateOne(
      { email: email_to },
      { $pull: { requests: user_from._id }, $push: { friends: user_from._id } }
    );

    await UserModel.updateOne(
      { email: email_from },
      { $pull: { requests: user_to._id }, $push: { friends: user_to._id } }
    );

    let new_user_to = await UserModel.findOne({ email: email_to });
    await new_user_to.populate('requests');
    await new_user_to.populate('friends');

    socket.emit('Message', {
      event: 'Accept_Friend',
      type: 'success',
      msg: 'Accepted request successfully',
      requests: new_user_to.requests,
      friends: new_user_to.friends,
    });

    console.log(`user ${email_to} accepted friend request from ${email_from}`);
  });
};

const handleDeleteFriend = (socket) => {
  socket.on('Delete_Friend', async ({ email_from, email_to }) => {
    let user_from = await UserModel.findOne({ email: email_from });
    let user_to = await UserModel.findOne({ email: email_to });
    if (!user_from || !user_to) {
      socket.emit('Message', {
        type: 'error',
        msg: 'user not found',
      });
      return;
    }

    await UserModel.updateOne(
      { email: email_to },
      { $pull: { friends: user_from._id } }
    );

    await UserModel.updateOne(
      { email: email_from },
      { $pull: { friends: user_to._id } }
    );

    let new_user_from = await UserModel.findOne({ email: email_from });
    await new_user_from.populate('friends');

    socket.emit('Message', {
      event: 'Delete_Friend',
      type: 'success',
      msg: 'Deleted friend successfully',
      friends: new_user_from.friends,
    });

    console.log(`user ${email_from} deleted friend from ${email_to}`);
  });
};

const handleInviteFriend = (io, socket) => {
  socket.on('Invite_Friend', async ({ playerID, email_to, roomID }) => {
    let target_id = '';
    onlinePlayers.forEach((player, playerID) => {
      if (player.email === email_to) target_id = playerID;
    });
    if (target_id === '') return;
    let target_socket;
    const sockets = await io.fetchSockets();
    const index = sockets.findIndex((s) => s.id === target_id);
    if (index === -1) return;

    target_socket = sockets[index];

    socket.emit('Message', {
      event: 'Invite_Friend',
      type: 'success',
      msg: 'invited friend successfully',
    });

    target_socket.emit('Message', {
      event: 'Invite_Friend',
      type: 'success',
      msg: 'received invitation successfully',
      user: onlinePlayers.get(playerID),
      roomID: roomID,
    });
  });
};

const handleDeleteRequest = (socket) => {
  socket.on('Delete_Request', async ({ email_from, email_to }) => {
    let user_from = await UserModel.findOne({ email: email_from });
    let user_to = await UserModel.findOne({ email: email_to });
    if (!user_from || !user_to) {
      socket.emit('Message', {
        type: 'error',
        msg: 'user not found',
      });
      return;
    }

    await UserModel.updateOne(
      { email: email_from },
      { $pull: { requests: user_to._id } }
    );

    let new_user_from = await UserModel.findOne({ email: email_from });
    await new_user_from.populate('requests');

    socket.emit('Message', {
      event: 'Delete_Request',
      type: 'success',
      msg: 'Deleted request successfully',
      requests: new_user_from.requests,
    });

    console.log(`user ${email_from} deleted request from ${email_to}`);
  });
};

const handleCreateRoom = (socket) => {
  socket.on('Create_Room', ({ email, name, picture }) => {
    const roomID = uuid4();
    const playerID = socket.id;
    const playerList = new Map();

    playerList.set(playerID, {
      email: email,
      name: name,
      modelName: 'Remilia',
      state: 'choosing',
      isLeader: true,
      picture: picture,
    });

    rooms.set(roomID, { playerList: playerList, state: 'choosing' });

    socket.join(roomID);
    socket.emit('Message', {
      event: 'Create_Room',
      type: 'success',
      msg: 'created room successfully',
      roomID: roomID,
      playerID: playerID,
    });

    console.log(`user ${email} created room ${roomID}`);
  });
};

const handleJoinRoom = (socket) => {
  socket.on('Join_Room', ({ email, name, roomID, picture }) => {
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
      email: email,
      name: name,
      modelName: 'Remilia',
      state: 'choosing',
      isLeader: false,
      picture: picture,
    });

    socket.join(roomID);
    socket.emit('Message', {
      event: 'Join_Room',
      type: 'success',
      msg: 'joined room successfully',
      roomID: roomID,
      playerID: playerID,
    });

    console.log(`user ${email} joined room ${roomID}`);
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
        event: 'Start_Game',
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

const handleLogOut = (socket) => {
  socket.on('LogOut', (email) => {
    const playerID = socket.id;
    onlinePlayers.delete(playerID);

    socket.emit('Message', {
      event: 'LogOut',
      type: 'success',
      msg: 'LogOut successfully',
    });

    console.log(`user ${email} LogOut`);
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
        socket.leave(key);
      }
    });

    onlinePlayers.delete(socket.id);
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

const handleUpdatePlayer = (socket) => {
  socket.on('Update_Player', ({ roomID, playerID, props }) => {
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
  }, 60);
  console.log('start broadcasting');
};

const handleConsoleLog = (io) => {
  setInterval(() => {
    console.log('rooms');
    console.log(rooms);
    console.log('onlinePlayers');
    console.log(onlinePlayers);
    console.log('connection : ', connections);
  }, 1500);
};
