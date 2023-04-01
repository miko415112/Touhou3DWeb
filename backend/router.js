import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv-defaults";

export const router = express.Router();

dotenv.config();

const redirect_url = "http://localhost:3000/login";
const client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  redirect_url
);

router.get("/oauth", (req, res) => {
  const auth_url = client.generateAuthUrl({
    access_type: "offline",
    scope: "openid email profile",
    prompt: "consent",
  });
  res.redirect(auth_url);
});

router.get("/token", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const miko_token = jwt.sign(
      {
        name: payload.name,
        picture: payload.picture,
        email: payload.email,
      },
      process.env.SECRET,
      { expiresIn: 60 * 60 * 3 }
    );
    res.send(miko_token);
  } catch (error) {
    console.log(code);
    res.send(error);
  }
});
