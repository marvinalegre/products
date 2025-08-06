import { Hono } from "hono";
import { z } from "zod";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { usernameSchema, passwordSchema } from "@/../libs/validation.js";
import { reservedUsernames } from "@/../libs/reserved-usernames.js";

const auth = new Hono();
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);

auth.post("/signup", async (c) => {
  const { username, password } = await c.req.json();

  try {
    usernameSchema.parse(username);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.body(null, 400);
    }
  }

  if (reservedUsernames.includes(username)) {
    return c.json({ username: "This username is not available." }, 409);
  }
  const { results } = await c.env.DB.prepare(
    "SELECT 1 FROM users WHERE username = ?",
  )
    .bind(username.toLowerCase())
    .all();
  if (results.length) {
    return c.json({ username: "This username is not available." }, 409);
  }

  try {
    passwordSchema.parse(password);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.body(null, 400);
    }
  }

  const zxcvbnResult = zxcvbn(password);
  if (zxcvbnResult.score < 3) {
    let message = "The password is weak.";
    if (zxcvbnResult.feedback.warning) {
      message = `${message} ${zxcvbnResult.feedback.warning}.`;
    } else if (zxcvbnResult.feedback.suggestions.length > 0) {
      message = `${message} ${zxcvbnResult.feedback.suggestions[0]}`;
    }
    return c.json({ password: message }, 422);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sub = nanoid();

  // TODO: handle collisions on jwt_id
  try {
    await c.env.DB.prepare(
      "INSERT INTO users (jwt_sub, username, hashed_password) VALUES (?, ?, ?)",
    )
      .bind(sub, username.toLowerCase(), hashedPassword)
      .run();
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  const token = await sign({ sub }, c.env.JWT_SECRET);
  setCookie(c, "token", token, {
    path: "/",
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 2_592_000_000 * 3),
    sameSite: "Strict",
  });

  return c.body(null, 201);
});

export default auth;
