import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv-defaults";
import { UserModel } from "../mongo/model";
import { io, onlinePlayers } from "../instance";
import { URL } from "url";
dotenv.config();

export const authRouter = express.Router();
export const apiRouter = express.Router();

/* middleware */

const createClient = (req, res, next) => {
  try {
    let redirect_url = req.get("Referrer");
    redirect_url = new URL(redirect_url);
    redirect_url.pathname = "/login";

    console.log("redirect_url : " + redirect_url.href);
    const client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirect_url.href
    );
    req.client = client;
    next();
  } catch (error) {
    res.status(400).send(error.message + redirect_url.href);
  }
};

const verifytoken = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const payload = jwt.verify(token, process.env.SECRET);
    req.profile = payload;
    next();
  } catch (error) {
    /*JsonWebTokenError*/
    console.log(error);
    res.status(401).send("Unauthorized");
  }
};

authRouter.use(createClient);
apiRouter.use(verifytoken);

/* authRouter */

authRouter.get("/code", (req, res) => {
  const auth_url = req.client.generateAuthUrl({
    access_type: "offline",
    scope: "openid email profile",
    prompt: "consent",
  });
  res.redirect(auth_url);
});

authRouter.get("/token", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await req.client.getToken(code);
    const ticket = await req.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();
    const profile = { email, name, picture };
    const token = jwt.sign(profile, process.env.SECRET, {
      expiresIn: 60 * 60 * 3,
    });
    res.send({
      token,
      profile,
    });
    console.log(`user ${email} got token}`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

authRouter.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const payload = await jwt.verify(token, process.env.SECRET);
    const { email } = payload;

    onlinePlayers.removeByEmail(email);
    res.send("success");

    console.log(`user ${email} has logged out`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

apiRouter.get("/friends", async (req, res) => {
  const email = req.profile.email;
  let user = await UserModel.findOne({ email: email });
  if (!user) {
    res.status(400).send("User doesn't exist");
    return;
  }
  await user.populate("friends");

  const friends = user.friends.map((friend) => ({
    ...friend.toObject(),
    online: onlinePlayers.has(friend.email),
  }));

  res.send({
    friends: friends,
  });
});

apiRouter.get("/friend/requests", async (req, res) => {
  const email = req.profile.email;
  let user = await UserModel.findOne({ email: email });
  if (!user) {
    res.status(400).send("User doesn't exist");
    return;
  }
  await user.populate("requests");

  res.send({
    requests: user.requests.toObject(),
  });
});

apiRouter.post("/friend/request", async (req, res) => {
  const email_from = req.profile.email;
  const email_to = req.body.email;

  let user_from = await UserModel.findOne({ email: email_from });
  let user_to = await UserModel.findOne({ email: email_to });
  if (!user_from || !user_to) {
    res.status(400).send("User not found");
    return;
  }
  await user_to.populate("requests");

  if (
    !user_to.requests.toObject().some((request) => request.email == email_from)
  ) {
    await UserModel.updateOne(
      { email: email_to },
      { $push: { requests: user_from._id } }
    );

    onlinePlayers.sendByEmail(email_to, "requests", {
      requests: [...user_to.requests.toObject(), { ...user_from.toObject() }],
    });

    onlinePlayers.sendByEmail(email_to, "notifyMessages", {
      type: "success",
      text: `${email_from} has sent you a friend request`,
    });
  }

  res.send({ msg: "Sent request successfully" });
});

apiRouter.post("/friend/accept", async (req, res) => {
  const email_from = req.profile.email;
  const email_to = req.body.email;

  let user_from = await UserModel.findOne({ email: email_from });
  let user_to = await UserModel.findOne({ email: email_to });
  if (!user_from || !user_to) {
    res.status(400).send("User not found");
    return;
  }

  await UserModel.updateOne(
    { email: email_from },
    {
      $pull: { requests: user_to._id },
      $push: { friends: user_to._id },
    }
  );

  await UserModel.updateOne(
    { email: email_to },
    { $pull: { requests: user_from._id }, $push: { friends: user_from._id } }
  );

  await user_from.populate("friends requests");
  await user_to.populate("friends requests");

  onlinePlayers.sendByEmail(email_to, "friends", {
    friends: [...user_to.friends.toObject(), { ...user_from.toObject() }],
  });

  onlinePlayers.sendByEmail(email_from, "friends", {
    friends: [...user_from.friends.toObject(), { ...user_to.toObject() }],
  });

  onlinePlayers.sendByEmail(email_from, "requests", {
    requests: [...user_from.requests.toObject()].filter(
      ({ email }) => email != email_to
    ),
  });

  onlinePlayers.sendByEmail(email_to, "notifyMessages", {
    type: "success",
    text: `${email_from} has accepted your friend request`,
  });

  res.send({
    msg: "Accepted request successfully",
  });
});

apiRouter.post("/friend/reject", async (req, res) => {
  const email_from = req.profile.email;
  const email_to = req.body.email;

  let user_from = await UserModel.findOne({ email: email_from });
  let user_to = await UserModel.findOne({ email: email_to });
  if (!user_from || !user_to) {
    res.status(400).send("User not found");
    return;
  }

  await UserModel.updateOne(
    { email: email_from },
    { $pull: { requests: user_to._id } }
  );

  await user_from.populate("requests");

  onlinePlayers.sendByEmail(email_from, "requests", {
    requests: [...user_from.requests.toObject()].filter(
      ({ email }) => email != email_to
    ),
  });

  onlinePlayers.sendByEmail(email_to, "notifyMessages", {
    type: "success",
    text: `${email_from} has rejected your friend request`,
  });

  res.send({
    msg: "Rejected request successfully",
  });
});

apiRouter.post("/friend/remove", async (req, res) => {
  const email_from = req.profile.email;
  const email_to = req.body.email;

  let user_from = await UserModel.findOne({ email: email_from });
  let user_to = await UserModel.findOne({ email: email_to });
  if (!user_from || !user_to) {
    res.status(400).send("User not found");
    return;
  }

  await UserModel.updateOne(
    { email: email_from },
    { $pull: { friends: user_to._id } }
  );

  await UserModel.updateOne(
    { email: email_to },
    { $pull: { friends: user_from._id } }
  );

  await user_from.populate("friends");
  await user_to.populate("friends");

  onlinePlayers.sendByEmail(email_from, "friends", {
    friends: [...user_from.friends.toObject()].filter(
      ({ email }) => email != email_to
    ),
  });

  onlinePlayers.sendByEmail(email_to, "friends", {
    friends: [...user_to.friends].filter(({ email }) => email != email_from),
  });

  onlinePlayers.sendByEmail(email_to, "notifyMessages", {
    type: "success",
    text: `${email_from} has removed you from the friends list`,
  });

  res.send({
    msg: "Rejected request successfully",
  });
});
