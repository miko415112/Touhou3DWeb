import uuid4 from "uuid4";
import { UserModel } from "./mongo/model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv-defaults";
import { rooms, onlinePlayers, info } from "./state";
dotenv.config();

export const registerHandler = (io) => {
  handleConnection(io);
  handleBroadcast(io);
  handleConsoleLog(io);
};

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
        requests: user.requests,
        friends: user.friends,
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
    handleStartGame(socket);
    handleUpdatePlayer(socket);
  });
};

const handleInviteFriend = (io, socket) => {
  socket.on("Invite_Friend", async ({ email_from, email_to, roomID }) => {
    if (socket.profile.email != email_from) return;
    if (!onlinePlayers.has(email_to)) return;
    const socket_to_id = onlinePlayers.get(email_to).socket_id;
    const sockets = await io.fetchSockets();
    const index = sockets.findIndex((s) => s.id === socket_to_id);
    if (index === -1) return;
    const socket_to = sockets[index];

    socket.emit("Message", {
      event: "Invite_Friend",
      type: "success",
      msg: "invited friend successfully",
    });

    socket_to.emit("Invitation", {
      user: onlinePlayers.get(email_from),
      roomID: roomID,
    });
  });
};

const handleCreateRoom = (socket) => {
  socket.on("Create_Room", ({ email, name, picture }) => {
    if (socket.profile.email != email) return;
    const roomID = uuid4();
    const playerList = new Map();

    playerList.set(email, {
      email: email,
      name: name,
      modelName: "Remilia",
      state: "choosing",
      isLeader: true,
      picture: picture,
      socket_id: socket.id,
    });

    rooms.set(roomID, {
      playerList: playerList,
      roomID: roomID,
    });
    socket.join(roomID);

    socket.emit("Message", {
      type: "success",
      msg: "created room successfully",
    });

    socket.emit("Redirect", "room");

    console.log(`user ${email} created room ${roomID}`);
  });
};

const handleJoinRoom = (socket) => {
  socket.on("Join_Room", ({ email, name, roomID, picture }) => {
    if (socket.profile.email != email) return;
    const room = rooms.get(roomID);

    if (!room) {
      socket.emit("Message", {
        type: "error",
        msg: "room not found",
      });
      return;
    }

    if (room.playerList.size >= 4) {
      socket.emit("Message", {
        type: "error",
        msg: "room is full",
      });
      return;
    }
    room.playerList.set(email, {
      email: email,
      name: name,
      modelName: "Remilia",
      state: "choosing",
      isLeader: false,
      picture: picture,
      socket_id: socket.id,
    });

    socket.join(roomID);

    socket.emit("Message", {
      type: "success",
      msg: "joined room successfully",
    });

    socket.emit("Redirect", "room");

    console.log(`user ${email} joined room ${roomID}`);
  });
};

const handleStartGame = (socket) => {
  socket.on("Start_Game", ({ roomID }) => {
    const room = rooms.get(roomID);
    let allReady = true;
    room.playerList.forEach((player, playerEmail) => {
      if (player.state !== "ready") allReady = false;
    });

    if (!allReady) {
      socket.emit("Message", {
        type: "error",
        msg: "someone is not ready",
      });
      return;
    }

    socket.emit("Message", {
      type: "success",
      msg: "started room successfully",
    });

    socket.emit("Redirect", "game");

    console.log(`room ${roomID} started`);
  });
};

const handleDisconnection = (socket) => {
  socket.on("disconnect", () => {
    const { email } = socket.profile;
    rooms.forEach((value, key) => {
      if (value.playerList.has(email)) {
        const isLeader = value.playerList.get(email).isLeader;
        value.playerList.delete(email);
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
    onlinePlayers.delete(email);
    info.connections--;

    console.log(`user ${email} disconnected`);
  });
};

const handleLeaveRoom = (socket) => {
  socket.on("Leave_Room", ({ email, roomID }) => {
    if (socket.profile.email != email) return;
    const room = rooms.get(roomID);
    if (!room) return;
    const isLeader = room.playerList.get(email).isLeader;
    room.playerList.delete(email);
    if (room.playerList.size !== 0 && isLeader) {
      const [firstKey] = room.playerList.keys();
      room.playerList.set(firstKey, {
        ...room.playerList.get(firstKey),
        isLeader: true,
      });
    } else if (room.playerList.size === 0) rooms.delete(roomID);
    socket.leave(roomID);

    socket.emit("Message", {
      type: "success",
      msg: "left room successfully",
    });

    socket.emit("Redirect", "home");

    console.log(`user ${email} has left room ${roomID}`);
  });
};

const handleUpdatePlayer = (socket) => {
  socket.on("Update_Player", ({ roomID, email, props }) => {
    if (socket.profile.email != email) return;
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

const handleBroadcast = (io) => {
  setInterval(() => {
    rooms.forEach((room, roomID) => {
      const playerList = Array.from(room.playerList, ([key, value]) => value);
      const payload = {
        ...room,
        playerList: playerList,
      };
      io.to(roomID).emit("RoomInfo", payload);
    });
  }, 80);
  console.log("start broadcasting");
};

const handleConsoleLog = (io) => {
  setInterval(() => {
    console.log("=============== rooms ===============");
    console.log(rooms);
    console.log("=============== onlinePlayers ===============");
    console.log(onlinePlayers);
    console.log("=============== connections ===============");
    console.log("connection : ", info.connections);
  }, 1500);
};
