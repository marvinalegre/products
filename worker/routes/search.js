import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const q = c.req.query("q");

  if (q === "null" || q === "") {
    return c.json([]);
  }

  const { results } = await c.env.DB.prepare(
    `
SELECT p.public_id, pv.product_name, pv.price
FROM products p
LEFT JOIN product_versions pv
ON p.current_version_id = pv.version_id
WHERE LOWER(pv.product_name) LIKE '%' || LOWER(?) || '%';
`,
  )
    .bind(q)
    .all();

  return c.json(results);
});

export default app;
