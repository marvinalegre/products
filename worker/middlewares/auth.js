import { usernameSchema, passwordSchema } from "@/../libs/validation.js";

export const authentiateToken = async (c, next) => {
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
};

export const validateCredentials = async (c, next) => {
  const { username, password } = await c.req.json();

  try {
    usernameSchema.parse(username);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.body(null, 400);
    }
  }

  try {
    passwordSchema.parse(password);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.body(null, 400);
    }
  }

  c.set("username", username);
  c.set("password", password);

  await next();
};
