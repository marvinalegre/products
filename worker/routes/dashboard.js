import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const { results: users } = await c.env.DB.prepare(
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

  const { results: products } = await c.env.DB.prepare(
    `
WITH first_versions AS (
    SELECT 
        product_id,
        DATE(MIN(created_at)) AS creation_date
    FROM product_versions
    GROUP BY product_id
),
daily_counts AS (
    SELECT 
        creation_date,
        COUNT(*) AS new_products
    FROM first_versions
    GROUP BY creation_date
    ORDER BY creation_date
)
SELECT 
    creation_date,
    SUM(new_products) OVER (ORDER BY creation_date) AS total_products
FROM daily_counts;
  `,
  ).run();

  return c.json({ users, products });
});

export default app;
