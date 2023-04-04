import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv-defaults";
import { UserModel } from "./mongo/model";
import { onlinePlayers } from "./state";
dotenv.config();

export const authRouter = express.Router();
export const apiRouter = express.Router();

/* authRouter */

/* middleware */
const createClient = (req, res, next) => {
  try {
    let redirect_url = req.get("Referrer");
    if (redirect_url.at(-1) === "/") redirect_url = redirect_url.slice(0, -1);
    const client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirect_url
    );
    req.client = client;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("bad request");
  }
};

authRouter.use(createClient);

authRouter.get("/oauth", (req, res) => {
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
    const mikoToken = jwt.sign(profile, process.env.SECRET, {
      expiresIn: 60 * 60 * 3,
    });
    res.send({
      mikoToken,
      profile,
    });
    console.log(`user ${email} got token}`);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

/* apiRouter */

/* middleware */
const verifyMikoToken = (req, res, next) => {
  const mikoToken = req.headers.authorization;
  try {
    const payload = jwt.verify(mikoToken, process.env.SECRET);
    req.profile = payload;
    next();
  } catch (error) {
    /*JsonWebTokenError*/
    console.log(error);
    res.status(401).send("Unauthorized");
  }
};
apiRouter.use(verifyMikoToken);

apiRouter.get("/friend", async (req, res) => {
  const { email } = req.query;
  if (req.profile.email != email) {
    res.status(403).send("Wrong Person!!");
    return;
  }
  let user = await UserModel.findOne({ email: email });
  if (!user) {
    res.status(400).send("User doesn't exist");
    return;
  }
  await user.populate("requests");
  await user.populate("friends");

  const old_data = onlinePlayers.get(email);
  onlinePlayers.set(email, {
    ...old_data,
    requests: user.requests,
    friends: user.friends,
  });

  const onlineFriends = [];
  onlinePlayers.forEach((player, playerID) => {
    if (user.friends.some((friend) => friend.email === player.email))
      onlineFriends.push(player);
  });

  res.send({
    requests: user.requests,
    friends: user.friends,
    onlineFriends: onlineFriends,
  });
});

apiRouter.post("/friend", async (req, res) => {
  const { action, email_from, email_to } = req.body;
  let user_from = await UserModel.findOne({ email: email_from });
  let user_to = await UserModel.findOne({ email: email_to });
  if (!user_from || !user_to) {
    res.status(400).send("User not found");
    return;
  }

  if (action == "add") {
    await UserModel.updateOne(
      { email: email_to },
      { $push: { requests: user_from._id } }
    );
    res.send({ msg: "Sent request successfully" });
  } else if (action == "delete") {
    await UserModel.updateOne(
      { email: email_to },
      { $pull: { friends: user_from._id } }
    );
    await UserModel.updateOne(
      { email: email_from },
      { $pull: { friends: user_to._id } }
    );
    let new_user_from = await UserModel.findOne({ email: email_from });
    await new_user_from.populate("friends");
    res.send({
      msg: "Deleted friend successfully",
      friends: new_user_from.friends,
    });
  } else if (action == "accept") {
    await UserModel.updateOne(
      { email: email_to },
      {
        $pull: { requests: user_from._id },
        $push: { friends: user_from._id },
      }
    );

    await UserModel.updateOne(
      { email: email_from },
      { $pull: { requests: user_to._id }, $push: { friends: user_to._id } }
    );

    let new_user_to = await UserModel.findOne({ email: email_to });
    await new_user_to.populate("requests");
    await new_user_to.populate("friends");

    res.send({
      msg: "Accepted request successfully",
      requests: new_user_to.requests,
      friends: new_user_to.friends,
    });
  } else if (action == "reject") {
    await UserModel.updateOne(
      { email: email_from },
      { $pull: { requests: user_to._id } }
    );

    let new_user_from = await UserModel.findOne({ email: email_from });
    await new_user_from.populate("requests");

    res.send({
      msg: "Deleted request successfully",
      requests: new_user_from.requests,
    });
  }
});
