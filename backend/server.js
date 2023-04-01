import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { registerHandler } from "./handle";
import db from "./mongo/db";
import { router } from "./router";

const app = express();
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}
app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);
const httpServer = createServer(app);
httpServer.listen(process.env.PORT, () =>
  console.log(`Server is on port${process.env.PORT}`)
);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const onSuccess = () => {
  registerHandler(io);
};
db.connect(onSuccess);
