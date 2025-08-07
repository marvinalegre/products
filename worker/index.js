import { Hono } from "hono";
import auth from "./routes/auth.js";

const app = new Hono();

app.route("/api/auth", auth);
app.post("/api/products", async (c) => {
  const sleep = (ms) =>
    new Promise((resolve, reject) => setTimeout(resolve, ms));
  await sleep(2000);
  return c.body(null, 204);
});
app.get("/api/dashboard", async (c) => {
  const { results } = await c.env.DB.prepare(
    `
WITH RECURSIVE date_range(day) AS (
  SELECT DATE((SELECT MIN(created_at) FROM users))
  UNION ALL
  SELECT DATE(day, '+1 day')
  FROM date_range
  WHERE day < DATE('now')
),
user_counts AS (
  SELECT DATE(created_at) AS signup_date, COUNT(*) AS new_users
  FROM users
  GROUP BY DATE(created_at)
),
daily_data AS (
  SELECT
    date_range.day AS signup_date,
    COALESCE(user_counts.new_users, 0) AS new_users
  FROM
    date_range
  LEFT JOIN
    user_counts ON date_range.day = user_counts.signup_date
)
SELECT
  signup_date,
  new_users,
  SUM(new_users) OVER (ORDER BY signup_date) AS total_users
FROM
  daily_data
ORDER BY
  signup_date
`,
  ).run();

  return c.json(results);
});

export default app;
