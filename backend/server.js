import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { registerHandler } from './handle';
import db from './mongo/db';
import path from 'path';

db.connect();
const port = process.env.PORT || 4000;

const app = express();

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '../frontend', 'build')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'));
  });
}
app.use(cors());
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
