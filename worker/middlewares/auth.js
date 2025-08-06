import { usernameSchema, passwordSchema } from "@/../libs/validation.js";

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
