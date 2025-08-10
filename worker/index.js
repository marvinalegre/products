import { Hono } from "hono";
import auth from "./routes/auth.js";
import products from "./routes/products.js";
import dashboard from "./routes/dashboard.js";
import search from "./routes/search.js";

const app = new Hono();

app.route("/api/auth", auth);
app.route("/api/products", products);
app.route("/api/dashboard", dashboard);
app.route("/api/search", search);

export default app;
