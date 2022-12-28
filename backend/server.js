import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerHandler } from './handle';
import db from './mongo/db';

db.connect();
const port = process.env.Port || 4000;
const app = express();
if (process.env.NODE_ENV !== 'prod') app.use(cors());
const server = http.createServer(app);
server.listen(port, () => console.log(`Server is on port${port}`));
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

mongoose.connection.once('open', () => {
  registerHandler(io);
});
