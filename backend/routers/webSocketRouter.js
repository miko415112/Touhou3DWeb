import uuid4 from "uuid4";
import { UserModel } from "../mongo/model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv-defaults";
import { rooms, onlinePlayers, info } from "../instance";
dotenv.config();

export const registerHandler = (io) => {
  handleConnection(io);
  handleBroadcast(io);
  handleConsoleLog(io);
};

/* middleware */

const verifyMikoToken = (socket, next) => {
  const mikoToken = socket.handshake.auth.token;
  try {
    const payload = jwt.verify(mikoToken, process.env.SECRET);
    socket.profile = payload;
    next();
  } catch (error) {
    /*JsonWebTokenError*/
    console.log(error);
    next(error);
  }
};

const handleConnection = (io) => {
  io.use(verifyMikoToken);
  io.on("connection", async function (socket) {
    try {
      const { email, name, picture } = socket.profile;
      let user = await UserModel.findOne({ email: email });
      if (!user)
        user = await new UserModel({
          email: email,
          name: name,
          picture: picture,
        }).save();

      await user.populate("requests friends");
      onlinePlayers.set(email, {
        email: email,
        picture: picture,
        name: user.name,
        socket_id: socket.id,
      });
      info.connections++;
      console.log(`user ${email} connected`);
    } catch (error) {
      console.log(error);
    }
    handleDisconnection(socket);
    handleCreateRoom(socket);
    handleJoinRoom(socket);
    handleLeaveRoom(socket);
    handleInviteFriend(io, socket);
    handleUpdateBossHealthPoints(io, socket);
    handleStartGame(io, socket);
    handleUpdatePlayer(socket);
  });
};

const handleInviteFriend = (io, socket) => {
  socket.on("inviteFriend", async ({ email_to, roomID }) => {
    const email_from = socket.profile.email;
    if (!onlinePlayers.has(email_to)) return;

    const socket_to_id = onlinePlayers.get(email_to)?.socket_id;
    if (!socket_to_id) return;

    const socket_to = io.sockets.sockets.get(socket_to_id);
    if (!socket_to) return;

    socket.emit("notifyMessages", {
      type: "success",
      text: "invited friend successfully",
    });

    socket_to.emit("invitation", {
      profile: socket.profile,
      roomID: roomID,
    });
  });
};

const handleCreateRoom = (socket) => {
  socket.on("createRoom", () => {
    const { email, name, picture } = socket.profile;
    const roomID = uuid4();
    const playerList = new Map();

    playerList.set(email, {
      email: email,
      name: name,
      picture: picture,
      modelName: "Remilia",
      state: "choosing",
      socket_id: socket.id,
    });

    rooms.set(roomID, {
      playerList: playerList,
      roomInfo: {
        roomID: roomID,
        roomState: "choosing", // "choosing or fighting"
      },
    });
    socket.join(roomID);

    socket.emit("notifyMessage", {
      type: "success",
      text: "created room successfully",
    });

    rooms.broadcastAll(roomID);

    console.log(`user ${email} created room ${roomID}`);
  });
};

const handleJoinRoom = (socket) => {
  socket.on("joinRoom", ({ roomID }) => {
    const { email, name, picture } = socket.profile;
    const room = rooms.get(roomID);

    if (!room) {
      socket.emit("notifyMessage", {
        type: "error",
        text: "room not found",
      });
      return;
    }

    if (room.playerList.size >= 4) {
      socket.emit("notifyMessage", {
        type: "error",
        text: "room is full",
      });
      return;
    }
    room.playerList.set(email, {
      email: email,
      name: name,
      modelName: "Remilia",
      state: "choosing",
      picture: picture,
      socket_id: socket.id,
    });

    socket.join(roomID);

    socket.emit("notifyMessage", {
      type: "success",
      text: "joined room successfully",
    });

    rooms.broadcastAll(roomID);

    console.log(`user ${email} joined room ${roomID}`);
  });
};

const handleStartGame = (io, socket) => {
  socket.on("startGame", ({ roomID }) => {
    const room = rooms.get(roomID);
    let allReady = true;
    room.playerList.forEach((player, playerEmail) => {
      if (player.state !== "ready") allReady = false;
    });

    if (!allReady) {
      socket.emit("notifyMessages", {
        type: "error",
        text: "someone is not ready",
      });
      return;
    }

    rooms.set(roomID, {
      ...room,
      roomInfo: {
        ...room.roomInfo,
        roomState: "fighting", // "choosing or fighting"
        stage: 1,
        startStage: false,
        startGameTime: Date.now(),
      },
    });

    io.to(roomID).emit("updateBossHealthPoints", { bossHealthPoints: 60 });
    rooms.broadcastRoomInfo(roomID);

    setTimeout(() => {
      const room = rooms.get(roomID);
      if (!room || room.stageStart) return;

      rooms.set(roomID, {
        ...room,
        roomInfo: {
          ...room.roomInfo,
          startStage: true,
          startStageTime: Date.now(),
        },
      });

      rooms.broadcastRoomInfo(roomID);
    }, 10000);

    console.log(`room ${roomID} started`);
  });
};

const handleDisconnection = (socket) => {
  socket.on("disconnect", () => {
    const { email } = socket.profile;
    rooms.forEach((room, key) => {
      if (room.playerList.has(email)) {
        room.playerList.delete(email);
        rooms.broadcastAll(room.roomInfo.roomID);
        if (room.playerList.size === 0) rooms.delete(key);
        socket.leave(key);
      }
    });
    onlinePlayers.delete(email);
    info.connections--;

    socket.emit("roomInfo", {});

    console.log(`user ${email} disconnected`);
  });
};

const handleLeaveRoom = (socket) => {
  socket.on("leaveRoom", ({ roomID }) => {
    const { email } = socket.profile;
    const room = rooms.get(roomID);
    if (!room) return;
    room.playerList.delete(email);
    if (room.playerList.size === 0) rooms.delete(roomID);
    socket.leave(roomID);

    socket.emit("notifyMessages", {
      type: "success",
      text: "left room successfully",
    });

    socket.emit("roomInfo", {});

    rooms.broadcastAll(roomID);

    console.log(`user ${email} has left room ${roomID}`);
  });
};

const handleUpdatePlayer = (socket) => {
  socket.on("updatePlayer", ({ roomID, props }) => {
    const { email } = socket.profile;
    const room = rooms.get(roomID);
    if (!room) return;
    const prev = room.playerList.get(email);
    room.playerList.set(email, {
      ...prev,
      ...props,
    });
    console.log(`user ${email} state changed`);
  });
};

const handleUpdateBossHealthPoints = (io, socket) => {
  socket.on("updateBossHealthPoints", ({ roomID, bossHealthPoints }) => {
    const room = rooms.get(roomID);
    if (!room) return;
    io.to(roomID).emit("updateBossHealthPoints", { bossHealthPoints });
    console.log(`Boss HealthPoints : ${bossHealthPoints}`);

    if (bossHealthPoints == 40) {
      rooms.set(roomID, {
        ...room,
        roomInfo: {
          ...room.roomInfo,
          stage: 2,
          startStage: false,
        },
      });

      rooms.broadcastRoomInfo(roomID);
      setTimeout(() => {
        const room = rooms.get(roomID);
        if (!room || room.stageStart) return;

        rooms.set(roomID, {
          ...room,
          roomInfo: {
            ...room.roomInfo,
            startStage: true,
            startStageTime: Date.now(),
          },
        });

        rooms.broadcastRoomInfo(roomID);
      }, 10000);
    } else if (bossHealthPoints == 20) {
      rooms.set(roomID, {
        ...room,
        roomInfo: {
          ...room.roomInfo,
          stage: 3,
          startStage: false,
        },
      });

      rooms.broadcastRoomInfo(roomID);
      setTimeout(() => {
        const room = rooms.get(roomID);
        if (!room || room.stageStart) return;

        rooms.set(roomID, {
          ...room,
          roomInfo: {
            ...room.roomInfo,
            startStage: true,
            startStageTime: Date.now(),
          },
        });

        rooms.broadcastRoomInfo(roomID);
      }, 10000);
    } else if (bossHealthPoints == 0) {
      rooms.set(roomID, {
        ...room,
        roomInfo: {
          ...room.roomInfo,
          stage: 4,
          startStage: false,
        },
      });
      rooms.broadcastRoomInfo(roomID);
    }
  });
};

const handleBroadcast = (io) => {
  setInterval(() => {
    rooms.forEach((room, roomID) => {
      rooms.broadcastRoomPlayers(roomID);
    });
  }, 60);
  console.log("start broadcasting");
};

const handleConsoleLog = (io) => {
  // setInterval(() => {
  //   console.log("=============== rooms ===============");
  //   console.log(rooms);
  //   console.log("=============== onlinePlayers ===============");
  //   console.log(onlinePlayers);
  //   console.log("=============== connections ===============");
  //   console.log("connection : ", info.connections);
  // }, 1500);
};
