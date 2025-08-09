import { Hono } from "hono";
import { authenticateToken } from "../middlewares/auth.js";

const app = new Hono();

app.use("*", authenticateToken);

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `
      SELECT products.product_id, product_name, barcode, price FROM products
      LEFT JOIN product_versions
      ON products.current_version_id = product_versions.version_id
    `,
  ).all();

  return c.json(results);
});

app.post("/", async (c) => {
  const { user_id, username } = c.get("user");
  const { name, barcode, price } = await c.req.json();

  let productInsertResult;
  try {
    productInsertResult = await c.env.DB.prepare(
      "INSERT INTO products (current_version_id) VALUES (NULL)",
    ).run();
    if (!productInsertResult.success) return c.body(null, 500);
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  const {
    meta: { last_row_id: productId },
  } = productInsertResult;
  let versionInsertResult;
  try {
    versionInsertResult = await c.env.DB.prepare(
      "INSERT INTO product_versions (user_id, product_id, product_name, barcode, price) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(
        user_id,
        productId,
        name,
        !barcode ? null : barcode,
        !price ? null : price,
      )
      .run();
    if (!versionInsertResult.success) return c.body(null, 500);
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  const {
    meta: { last_row_id: versionId },
  } = versionInsertResult;
  try {
    await c.env.DB.prepare(
      "UPDATE products SET current_version_id = ? WHERE product_id = ?",
    )
      .bind(versionId, productId)
      .run();
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  return c.body(null, 201);
});

export default app;
