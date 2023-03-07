import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";

import { registerHandler } from "./handle";
import db from "./mongo/db";

const port = process.env.PORT || 4000;
const app = express();

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}
app.use(cors());
const httpServer = createServer(app);
httpServer.listen(port, () => console.log(`Server is on port${port}`));
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const onSuccess = () => {
  registerHandler(io);
};
db.connect(onSuccess);
