import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { registerHandler } from "./routers/webSocketRouter";
import db from "./mongo/db";
import { app, httpServer, io } from "./instance";
import { authRouter, apiRouter } from "./routers/httpRouter";

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
