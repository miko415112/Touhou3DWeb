import { io } from "socket.io-client";

const ROOT =
  process.env.NODE_ENV == "production"
    ? window.location.origin
    : process.env.REACT_APP_LOCAL_BACKEND_URL;

let socket = null;

export const initWebSocket = (token) => {
  socket = io(ROOT, {
    autoConnect: false,
    path: "/socket",
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("connect_error", (error) => {
    console.error("Failed to connect to server:", error.message);
  });

  socket.connect();
  return socket;
};

export const inviteFriend = (email_to, roomID) => {
  const data = {
    email_to,
    roomID,
  };
  socket.emit("inviteFriend", data);
};

export const createRoom = () => {
  socket.emit("createRoom");
};

export const joinRoom = (roomID) => {
  const data = {
    roomID,
  };
  socket.emit("joinRoom", data);
};

export const leaveRoom = (roomID) => {
  const data = {
    roomID,
  };
  socket.emit("leaveRoom", data);
};

export const startGame = (roomID) => {
  const data = {
    roomID: roomID,
  };
  socket.emit("startGame", data);
};

export const updatePlayer = (roomID, props) => {
  const data = {
    roomID,
    props,
  };
  socket.emit("updatePlayer", data);
};

export const updateBossHealthPoints = (roomID, bossHealthPoints) => {
  const data = {
    roomID,
    bossHealthPoints,
  };
  socket.emit("updateBossHealthPoints", data);
};
