import { Hono } from "hono";
import auth from "./routes/auth.js";

const app = new Hono();

app.route("/api/auth", auth);

export default app;
