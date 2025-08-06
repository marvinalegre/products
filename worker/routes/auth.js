import { Hono } from "hono";
import { z } from "zod";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import { reservedUsernames } from "@/../libs/reserved-usernames.js";
import { validateCredentials } from "../middlewares/auth.js";

const auth = new Hono();
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);

auth.use("/signup", validateCredentials);
auth.use("/login", validateCredentials);
auth.use("/me", async (c, next) => {
  const token = getCookie(c, "token");
  if (token == undefined) {
    return c.body(null, 401);
  }

  let sub;
  try {
    const decodedPayload = await verify(token, c.env.JWT_SECRET, "HS256");
    sub = decodedPayload.sub;
  } catch (e) {
    console.error(e.message);
    return c.body(null, 401);
  }

  const {
    results: [user],
  } = await c.env.DB.prepare(
    "SELECT user_id, username FROM users WHERE jwt_sub = ?",
  )
    .bind(sub)
    .all();

  c.set("user", user);

  await next();
});

auth.get("/me", (c) => {
  return c.json({ username: c.get("user").username });
});

auth.post("/logout", (c) => {
  setCookie(c, "token", "", {
    path: "/",
    secure: true,
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Strict",
  });

  return c.body(null, 204);
});

auth.post("/login", async (c) => {
  const username = c.get("username");
  const password = c.get("password");

  const { results } = await c.env.DB.prepare(
    "SELECT hashed_password, jwt_sub FROM users WHERE username = ?",
  )
    .bind(username.toLowerCase())
    .all();

  if (!results.length) {
    return c.body(null, 401);
  }
  if (!(await bcrypt.compare(password, results[0].hashed_password))) {
    return c.body(null, 401);
  }

  const sub = results[0].jwt_sub;
  const token = await sign({ sub }, c.env.JWT_SECRET);
  setCookie(c, "token", token, {
    path: "/",
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 2_592_000_000 * 3),
    sameSite: "Strict",
  });

  return c.body(null, 200);
});

auth.post("/signup", async (c) => {
  const username = c.get("username");
  const password = c.get("password");

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
