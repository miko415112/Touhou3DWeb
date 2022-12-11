import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import { registerHandler } from './handle';

const port = process.env.Port || 4000;

const app = express();
const server = http.createServer(app);
server.listen(port, () => console.log(`Server is on port${port}`));
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

registerHandler(io);
