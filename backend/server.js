import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { registerHandler } from "./socket";
import db from "./mongo/db";
import { authRouter, apiRouter } from "./router";

/* express + socket.io + httpserver(support both) */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  path: "/api/socket",
});

/* mongo logic */
db.connect();

/* express logic */
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res, next) {
    if (!req.path.startsWith("/api") && !req.path.startsWith("/auth")) {
      return res.sendFile(
        path.join(__dirname, "../frontend", "build", "index.html")
      );
    }
    next();
  });
}
app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRouter);
app.use("/api", apiRouter);

/* socket.io logic */
registerHandler(io);

/* start listening */
httpServer.listen(process.env.PORT, () =>
  console.log(`Server is on port${process.env.PORT}`)
);
