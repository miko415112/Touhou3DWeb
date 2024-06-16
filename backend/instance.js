import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  path: "/socket",
});

export const rooms = new Map();
export const onlinePlayers = new Map();
export const info = {
  connections: 0,
};

rooms.broadcastRoomInfo = (roomID) => {
  const room = rooms.get(roomID);
  if (!room) return;

  io.to(roomID).emit("roomInfo", room.roomInfo);
};

rooms.broadcastRoomPlayers = (roomID) => {
  const room = rooms.get(roomID);
  if (!room) return;
  const players = Array.from(room.playerList.values());
  io.to(roomID).emit("roomPlayers", players);
};

rooms.broadcastAll = (roomID) => {
  const room = rooms.get(roomID);
  if (!room) return;
  const players = Array.from(room.playerList.values());
  io.to(roomID).emit("roomInfo", room.roomInfo);
  io.to(roomID).emit("roomPlayers", players);
};

onlinePlayers.sendByEmail = (email, type, payload) => {
  if (!onlinePlayers.has(email)) return;

  let socket_id = onlinePlayers.get(email).socket_id;
  let socket = io.sockets.sockets.get(socket_id);
  socket.emit(type, payload);
};

onlinePlayers.removeByEmail = (email) => {
  if (!onlinePlayers.has(email)) return;

  let socket_id = onlinePlayers.get(email).socket_id;
  let socket = io.sockets.sockets.get(socket_id);
  socket.disconnect();
};
